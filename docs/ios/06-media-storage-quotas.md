# 06: Media Hub & Storage Quotas

## Overview

The Media Hub allows users to upload photos, videos, and files to trips with **storage quota enforcement**. Free users have a 500 MB limit, while Plus users have a 50 GB soft cap. The iOS app must replicate quota calculations from `src/hooks/useStorageQuota.ts` and enforce limits before upload.

---

## Storage Quota System

### Data Model

```swift
// Models/StorageQuota.swift
struct StorageQuota {
    let userId: String
    let usedBytes: Int
    let limitBytes: Int
    let tier: SubscriptionTier
    
    var usedMB: Double {
        Double(usedBytes) / 1_048_576.0 // 1 MB = 1,048,576 bytes
    }
    
    var limitMB: Double {
        Double(limitBytes) / 1_048_576.0
    }
    
    var percentUsed: Double {
        guard limitBytes > 0 else { return 0.0 }
        return Double(usedBytes) / Double(limitBytes)
    }
    
    var isNearLimit: Bool {
        percentUsed >= 0.8 // 80% threshold
    }
    
    var isAtLimit: Bool {
        usedBytes >= limitBytes
    }
    
    var color: Color {
        if percentUsed >= 0.9 {
            return .red
        } else if percentUsed >= 0.7 {
            return .orange
        } else {
            return .green
        }
    }
}

enum SubscriptionTier: String, Codable {
    case free
    case plus
    
    var storageLimit: Int {
        switch self {
        case .free: return 500 * 1_048_576 // 500 MB
        case .plus: return 50 * 1_073_741_824 // 50 GB
        }
    }
}

struct MediaFile: Identifiable, Codable {
    let id: String
    let tripId: String
    let mediaType: String // "photo", "video", "file"
    let mediaUrl: String
    let filename: String?
    let mimeType: String?
    let fileSize: Int
    let metadata: [String: AnyCodable]?
    let messageId: String?
    let createdAt: Date
    
    enum CodingKeys: String, CodingKey {
        case id
        case tripId = "trip_id"
        case mediaType = "media_type"
        case mediaUrl = "media_url"
        case filename
        case mimeType = "mime_type"
        case fileSize = "file_size"
        case metadata
        case messageId = "message_id"
        case createdAt = "created_at"
    }
}
```

---

## Storage Quota Service

```swift
// Services/StorageQuotaService.swift
class StorageQuotaService {
    private let supabase: SupabaseClient
    
    init(supabase: SupabaseClient) {
        self.supabase = supabase
    }
    
    func calculateQuota() async throws -> StorageQuota {
        let userId = supabase.auth.currentUser?.id ?? ""
        
        // Get user's subscription tier
        let tier = try await getUserTier(userId: userId)
        
        // Calculate total file size from trip_media_index
        let result: [[String: Any]] = try await supabase
            .from("trip_media_index")
            .select("file_size")
            .in("trip_id", values: try await getUserTripIds(userId: userId))
            .execute()
            .value
        
        let totalBytes = result.compactMap { $0["file_size"] as? Int }.reduce(0, +)
        
        return StorageQuota(
            userId: userId,
            usedBytes: totalBytes,
            limitBytes: tier.storageLimit,
            tier: tier
        )
    }
    
    func canUpload(fileSize: Int) async throws -> Bool {
        let quota = try await calculateQuota()
        return quota.usedBytes + fileSize <= quota.limitBytes
    }
    
    private func getUserTier(userId: String) async throws -> SubscriptionTier {
        // Check subscription status from user_roles or subscription table
        let roles: [[String: Any]] = try await supabase
            .from("user_roles")
            .select("role")
            .eq("user_id", value: userId)
            .execute()
            .value
        
        let hasPro = roles.contains { ($0["role"] as? String) == "pro" }
        return hasPro ? .plus : .free
    }
    
    private func getUserTripIds(userId: String) async throws -> [String] {
        let members: [[String: String]] = try await supabase
            .from("trip_members")
            .select("trip_id")
            .eq("user_id", value: userId)
            .execute()
            .value
        
        return members.compactMap { $0["trip_id"] }
    }
}
```

---

## Media Upload Service

```swift
// Services/MediaUploadService.swift
import UIKit

class MediaUploadService {
    private let supabase: SupabaseClient
    private let quotaService: StorageQuotaService
    
    init(supabase: SupabaseClient) {
        self.supabase = supabase
        self.quotaService = StorageQuotaService(supabase: supabase)
    }
    
    func uploadPhoto(tripId: String, image: UIImage, compressionQuality: CGFloat = 0.7) async throws -> MediaFile {
        guard let imageData = image.jpegData(compressionQuality: compressionQuality) else {
            throw NSError(domain: "MediaError", code: -1, userInfo: [NSLocalizedDescriptionKey: "Failed to process image"])
        }
        
        // Check quota before upload
        guard try await quotaService.canUpload(fileSize: imageData.count) else {
            throw NSError(domain: "QuotaError", code: 403, userInfo: [NSLocalizedDescriptionKey: "Storage quota exceeded. Upgrade to Plus for unlimited storage."])
        }
        
        let fileName = "\(tripId)/\(UUID().uuidString).jpg"
        
        // Upload to Supabase Storage
        try await supabase.storage
            .from("trip-media")
            .upload(path: fileName, file: imageData, options: FileOptions(contentType: "image/jpeg"))
        
        let url = try supabase.storage
            .from("trip-media")
            .getPublicURL(path: fileName)
        
        // Create media index entry
        let mediaFile = MediaFile(
            id: UUID().uuidString,
            tripId: tripId,
            mediaType: "photo",
            mediaUrl: url.absoluteString,
            filename: fileName,
            mimeType: "image/jpeg",
            fileSize: imageData.count,
            metadata: nil,
            messageId: nil,
            createdAt: Date()
        )
        
        try await supabase
            .from("trip_media_index")
            .insert(mediaFile)
            .execute()
        
        return mediaFile
    }
    
    func uploadVideo(tripId: String, videoURL: URL) async throws -> MediaFile {
        guard let videoData = try? Data(contentsOf: videoURL) else {
            throw NSError(domain: "MediaError", code: -1, userInfo: [NSLocalizedDescriptionKey: "Failed to read video file"])
        }
        
        // Check quota
        guard try await quotaService.canUpload(fileSize: videoData.count) else {
            throw NSError(domain: "QuotaError", code: 403, userInfo: [NSLocalizedDescriptionKey: "Storage quota exceeded. Upgrade to Plus for unlimited storage."])
        }
        
        let fileName = "\(tripId)/\(UUID().uuidString).mp4"
        
        try await supabase.storage
            .from("trip-media")
            .upload(path: fileName, file: videoData, options: FileOptions(contentType: "video/mp4"))
        
        let url = try supabase.storage
            .from("trip-media")
            .getPublicURL(path: fileName)
        
        let mediaFile = MediaFile(
            id: UUID().uuidString,
            tripId: tripId,
            mediaType: "video",
            mediaUrl: url.absoluteString,
            filename: fileName,
            mimeType: "video/mp4",
            fileSize: videoData.count,
            metadata: nil,
            messageId: nil,
            createdAt: Date()
        )
        
        try await supabase
            .from("trip_media_index")
            .insert(mediaFile)
            .execute()
        
        return mediaFile
    }
    
    func uploadFile(tripId: String, fileURL: URL) async throws -> MediaFile {
        guard let fileData = try? Data(contentsOf: fileURL) else {
            throw NSError(domain: "MediaError", code: -1, userInfo: [NSLocalizedDescriptionKey: "Failed to read file"])
        }
        
        guard try await quotaService.canUpload(fileSize: fileData.count) else {
            throw NSError(domain: "QuotaError", code: 403, userInfo: [NSLocalizedDescriptionKey: "Storage quota exceeded"])
        }
        
        let fileName = "\(tripId)/\(fileURL.lastPathComponent)"
        let mimeType = mimeTypeForPath(path: fileURL.path)
        
        try await supabase.storage
            .from("trip-media")
            .upload(path: fileName, file: fileData, options: FileOptions(contentType: mimeType))
        
        let url = try supabase.storage
            .from("trip-media")
            .getPublicURL(path: fileName)
        
        let mediaFile = MediaFile(
            id: UUID().uuidString,
            tripId: tripId,
            mediaType: "file",
            mediaUrl: url.absoluteString,
            filename: fileName,
            mimeType: mimeType,
            fileSize: fileData.count,
            metadata: nil,
            messageId: nil,
            createdAt: Date()
        )
        
        try await supabase
            .from("trip_media_index")
            .insert(mediaFile)
            .execute()
        
        return mediaFile
    }
    
    private func mimeTypeForPath(path: String) -> String {
        let ext = (path as NSString).pathExtension.lowercased()
        
        switch ext {
        case "jpg", "jpeg": return "image/jpeg"
        case "png": return "image/png"
        case "pdf": return "application/pdf"
        case "mp4": return "video/mp4"
        case "mov": return "video/quicktime"
        default: return "application/octet-stream"
        }
    }
}
```

---

## SwiftUI Views

### Storage Quota Bar

```swift
// Views/StorageQuotaBar.swift
@MainActor
class StorageQuotaViewModel: ObservableObject {
    @Published var quota: StorageQuota?
    @Published var isLoading = false
    @Published var error: Error?
    
    private let service: StorageQuotaService
    
    init(supabase: SupabaseClient) {
        self.service = StorageQuotaService(supabase: supabase)
    }
    
    func loadQuota() async {
        isLoading = true
        error = nil
        
        do {
            quota = try await service.calculateQuota()
        } catch {
            self.error = error
        }
        
        isLoading = false
    }
}

struct StorageQuotaBar: View {
    @StateObject private var viewModel: StorageQuotaViewModel
    @State private var showUpgradeSheet = false
    
    init(supabase: SupabaseClient) {
        _viewModel = StateObject(wrappedValue: StorageQuotaViewModel(supabase: supabase))
    }
    
    var body: some View {
        if let quota = viewModel.quota {
            VStack(alignment: .leading, spacing: 8) {
                HStack {
                    Text("Storage")
                        .font(.caption.bold())
                    
                    Spacer()
                    
                    Text(String(format: "%.1f / %.0f MB", quota.usedMB, quota.limitMB))
                        .font(.caption)
                        .foregroundColor(.secondary)
                }
                
                // Progress bar
                GeometryReader { geometry in
                    ZStack(alignment: .leading) {
                        Rectangle()
                            .fill(Color.gray.opacity(0.2))
                        
                        Rectangle()
                            .fill(quota.color)
                            .frame(width: geometry.size.width * quota.percentUsed)
                    }
                }
                .frame(height: 8)
                .cornerRadius(4)
                
                // Warning or upgrade prompt
                if quota.isAtLimit {
                    HStack {
                        Image(systemName: "exclamationmark.triangle.fill")
                            .foregroundColor(.red)
                        
                        Text("Storage full. Upgrade to continue uploading.")
                            .font(.caption)
                            .foregroundColor(.red)
                        
                        Spacer()
                        
                        Button("Upgrade") {
                            showUpgradeSheet = true
                        }
                        .font(.caption.bold())
                        .buttonStyle(.borderedProminent)
                        .controlSize(.small)
                    }
                } else if quota.isNearLimit {
                    HStack {
                        Image(systemName: "exclamationmark.circle.fill")
                            .foregroundColor(.orange)
                        
                        Text("Running low on storage")
                            .font(.caption)
                            .foregroundColor(.orange)
                        
                        Spacer()
                        
                        Button("Upgrade") {
                            showUpgradeSheet = true
                        }
                        .font(.caption.bold())
                        .buttonStyle(.bordered)
                        .controlSize(.small)
                    }
                }
            }
            .padding()
            .background(Color(.systemGray6))
            .cornerRadius(12)
            .sheet(isPresented: $showUpgradeSheet) {
                UpgradeToPlus View()
            }
            .task {
                await viewModel.loadQuota()
            }
        }
    }
}
```

### Media Hub View

```swift
// Views/MediaHubView.swift
@MainActor
class MediaHubViewModel: ObservableObject {
    @Published var mediaFiles: [MediaFile] = []
    @Published var isLoading = false
    @Published var isUploading = false
    @Published var error: Error?
    
    private let tripId: String
    private let supabase: SupabaseClient
    private let uploadService: MediaUploadService
    
    init(tripId: String, supabase: SupabaseClient) {
        self.tripId = tripId
        self.supabase = supabase
        self.uploadService = MediaUploadService(supabase: supabase)
    }
    
    func loadMedia() async {
        isLoading = true
        error = nil
        
        do {
            mediaFiles = try await supabase
                .from("trip_media_index")
                .select()
                .eq("trip_id", value: tripId)
                .order("created_at", ascending: false)
                .execute()
                .value
        } catch {
            self.error = error
        }
        
        isLoading = false
    }
    
    func uploadPhoto(_ image: UIImage) async {
        isUploading = true
        error = nil
        
        do {
            let mediaFile = try await uploadService.uploadPhoto(tripId: tripId, image: image)
            mediaFiles.insert(mediaFile, at: 0)
        } catch let quotaError as NSError where quotaError.domain == "QuotaError" {
            // Show upgrade prompt
            self.error = quotaError
        } catch {
            self.error = error
        }
        
        isUploading = false
    }
    
    func uploadVideo(_ videoURL: URL) async {
        isUploading = true
        error = nil
        
        do {
            let mediaFile = try await uploadService.uploadVideo(tripId: tripId, videoURL: videoURL)
            mediaFiles.insert(mediaFile, at: 0)
        } catch {
            self.error = error
        }
        
        isUploading = false
    }
}

struct MediaHubView: View {
    @StateObject private var viewModel: MediaHubViewModel
    @State private var showImagePicker = false
    @State private var selectedImage: UIImage?
    
    init(tripId: String, supabase: SupabaseClient) {
        _viewModel = StateObject(wrappedValue: MediaHubViewModel(tripId: tripId, supabase: supabase))
    }
    
    var body: some View {
        VStack(spacing: 0) {
            // Storage quota bar
            StorageQuotaBar(supabase: /* pass supabase */)
                .padding()
            
            // Media grid
            if viewModel.isLoading {
                ProgressView()
                    .frame(maxHeight: .infinity)
            } else {
                ScrollView {
                    LazyVGrid(columns: [GridItem(.adaptive(minimum: 100))], spacing: 8) {
                        ForEach(viewModel.mediaFiles) { file in
                            MediaThumbnail(file: file)
                        }
                    }
                    .padding()
                }
            }
        }
        .navigationTitle("Media")
        .toolbar {
            ToolbarItem(placement: .primaryAction) {
                Menu {
                    Button("Take Photo", systemImage: "camera") {
                        // Open camera
                    }
                    
                    Button("Choose from Library", systemImage: "photo.on.rectangle") {
                        showImagePicker = true
                    }
                    
                    Button("Upload Video", systemImage: "video") {
                        // Open video picker
                    }
                } label: {
                    Image(systemName: "plus")
                }
            }
        }
        .sheet(isPresented: $showImagePicker) {
            ImagePicker(image: $selectedImage)
        }
        .onChange(of: selectedImage) { newImage in
            if let image = newImage {
                Task {
                    await viewModel.uploadPhoto(image)
                    selectedImage = nil
                }
            }
        }
        .alert("Storage Quota Exceeded", isPresented: Binding(
            get: { viewModel.error?.localizedDescription.contains("quota") ?? false },
            set: { _ in viewModel.error = nil }
        )) {
            Button("Upgrade to Plus", role: .cancel) {
                // Show upgrade sheet
            }
            Button("OK") {}
        } message: {
            Text(viewModel.error?.localizedDescription ?? "")
        }
        .task {
            await viewModel.loadMedia()
        }
    }
}

struct MediaThumbnail: View {
    let file: MediaFile
    
    var body: some View {
        AsyncImage(url: URL(string: file.mediaUrl)) { phase in
            switch phase {
            case .success(let image):
                image
                    .resizable()
                    .aspectRatio(contentMode: .fill)
            case .failure:
                Image(systemName: "photo")
                    .foregroundColor(.gray)
            case .empty:
                ProgressView()
            @unknown default:
                EmptyView()
            }
        }
        .frame(width: 100, height: 100)
        .clipShape(RoundedRectangle(cornerRadius: 8))
    }
}

// UIKit Image Picker
struct ImagePicker: UIViewControllerRepresentable {
    @Binding var image: UIImage?
    @Environment(\.dismiss) private var dismiss
    
    func makeUIViewController(context: Context) -> UIImagePickerController {
        let picker = UIImagePickerController()
        picker.delegate = context.coordinator
        return picker
    }
    
    func updateUIViewController(_ uiViewController: UIImagePickerController, context: Context) {}
    
    func makeCoordinator() -> Coordinator {
        Coordinator(self)
    }
    
    class Coordinator: NSObject, UIImagePickerControllerDelegate, UINavigationControllerDelegate {
        let parent: ImagePicker
        
        init(_ parent: ImagePicker) {
            self.parent = parent
        }
        
        func imagePickerController(_ picker: UIImagePickerController, didFinishPickingMediaWithInfo info: [UIImagePickerController.InfoKey : Any]) {
            if let image = info[.originalImage] as? UIImage {
                parent.image = image
            }
            parent.dismiss()
        }
        
        func imagePickerControllerDidCancel(_ picker: UIImagePickerController) {
            parent.dismiss()
        }
    }
}
```

---

## Testing Checklist

- [ ] Storage quota calculates correctly from `trip_media_index.file_size`
- [ ] Free tier limited to 500 MB
- [ ] Plus tier limited to 50 GB soft cap
- [ ] Quota bar color changes (green → orange → red)
- [ ] Upload blocked when quota exceeded
- [ ] Error message prompts upgrade to Plus
- [ ] Photo upload compresses to 70% JPEG quality
- [ ] Video upload preserves original quality
- [ ] Media index entry created after successful upload
- [ ] Storage quota refreshes after upload
- [ ] Thumbnail grid displays photos and videos
- [ ] Camera picker opens for new photos
- [ ] Photo library picker opens for existing photos
- [ ] File size validation before upload

---

**Batch 1 Complete!** Continue with Batch 2 (docs 07-09) covering Pro/Enterprise features, notifications, and settings.
