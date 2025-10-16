# 01: Trip Management & Status Filtering

## Overview

Trip management is the core feature of Chravel. Users can create, view, edit, and archive trips. The iOS app must replicate the exact status calculation logic, view filtering, and CRUD operations from the web app.

---

## Trip Status Logic

### Status Calculation Algorithm

Trips have three statuses: **Upcoming**, **In Progress**, and **Completed**. The logic is defined in `src/utils/tripStatsCalculator.ts`:

```typescript
// Web app logic (port to Swift)
export const getStatus = (startDate: Date, endDate: Date): TripStatus => {
  const now = new Date();
  const start = new Date(startDate);
  const end = new Date(endDate);

  if (now < start) return 'upcoming';
  if (now >= start && now <= end) return 'in-progress';
  return 'completed';
};
```

### iOS Implementation

```swift
// Models/Trip.swift
enum TripStatus: String, Codable {
    case upcoming
    case inProgress = "in-progress"
    case completed
}

struct Trip: Identifiable, Codable {
    let id: String
    let name: String
    let description: String?
    let destination: String?
    let startDate: Date?
    let endDate: Date?
    let coverImageUrl: String?
    let tripType: String // "consumer", "pro", "event"
    let createdBy: String
    let isArchived: Bool
    let aiAccessEnabled: Bool
    let privacyMode: String
    
    // Computed property for status
    var status: TripStatus {
        guard let start = startDate, let end = endDate else {
            return .upcoming // Default for trips without dates
        }
        
        let now = Date()
        if now < start {
            return .upcoming
        } else if now >= start && now <= end {
            return .inProgress
        } else {
            return .completed
        }
    }
    
    // Date range string for display
    var dateRange: String {
        guard let start = startDate, let end = endDate else {
            return "No dates set"
        }
        
        let formatter = DateFormatter()
        formatter.dateStyle = .medium
        
        if Calendar.current.isDate(start, inSameDayAs: end) {
            return formatter.string(from: start)
        } else {
            return "\(formatter.string(from: start)) - \(formatter.string(from: end))"
        }
    }
    
    enum CodingKeys: String, CodingKey {
        case id, name, description, destination
        case startDate = "start_date"
        case endDate = "end_date"
        case coverImageUrl = "cover_image_url"
        case tripType = "trip_type"
        case createdBy = "created_by"
        case isArchived = "is_archived"
        case aiAccessEnabled = "ai_access_enabled"
        case privacyMode = "privacy_mode"
    }
}
```

---

## View Modes & Filters

The web app shows three views in `src/components/home/TripStatsOverview.tsx`:

1. **My Trips** (Consumer): `trip_type = 'consumer'`
2. **Trips Pro** (Professional): `trip_type = 'pro'`
3. **Events** (Large-scale): `trip_type = 'event'`

Each view displays:
- **Total count** for that type
- **Breakdown by status** (Upcoming, In Progress, Completed)

### iOS View Model

```swift
// ViewModels/TripListViewModel.swift
enum TripViewMode: String, CaseIterable {
    case myTrips = "My Trips"
    case tripsPro = "Trips Pro"
    case events = "Events"
    
    var tripType: String {
        switch self {
        case .myTrips: return "consumer"
        case .tripsPro: return "pro"
        case .events: return "event"
        }
    }
}

@MainActor
class TripListViewModel: ObservableObject {
    @Published var trips: [Trip] = []
    @Published var isLoading = false
    @Published var error: Error?
    @Published var viewMode: TripViewMode = .myTrips
    @Published var statusFilter: TripStatus?
    
    private let supabase: SupabaseClient
    
    init(supabase: SupabaseClient) {
        self.supabase = supabase
    }
    
    // Computed filtered trips
    var filteredTrips: [Trip] {
        var result = trips.filter { $0.tripType == viewMode.tripType && !$0.isArchived }
        
        if let filter = statusFilter {
            result = result.filter { $0.status == filter }
        }
        
        return result.sorted { $0.startDate ?? Date.distantFuture < $1.startDate ?? Date.distantFuture }
    }
    
    // Statistics for current view
    var stats: TripStats {
        let allTrips = trips.filter { $0.tripType == viewMode.tripType && !$0.isArchived }
        return TripStats(
            total: allTrips.count,
            upcoming: allTrips.filter { $0.status == .upcoming }.count,
            inProgress: allTrips.filter { $0.status == .inProgress }.count,
            completed: allTrips.filter { $0.status == .completed }.count
        )
    }
    
    func loadTrips() async {
        isLoading = true
        error = nil
        
        do {
            // Query trips where user is a member
            let response: [Trip] = try await supabase
                .from("trips")
                .select("""
                    id, name, description, destination,
                    start_date, end_date, cover_image_url,
                    trip_type, created_by, is_archived,
                    ai_access_enabled, privacy_mode
                """)
                .in("id", values: await fetchUserTripIds())
                .execute()
                .value
            
            self.trips = response
        } catch {
            self.error = error
        }
        
        isLoading = false
    }
    
    private func fetchUserTripIds() async throws -> [String] {
        // Get trip IDs where user is a member
        let response: [TripMember] = try await supabase
            .from("trip_members")
            .select("trip_id")
            .eq("user_id", value: supabase.auth.currentUser?.id ?? "")
            .execute()
            .value
        
        return response.map { $0.tripId }
    }
}

struct TripStats {
    let total: Int
    let upcoming: Int
    let inProgress: Int
    let completed: Int
}

struct TripMember: Codable {
    let tripId: String
    
    enum CodingKeys: String, CodingKey {
        case tripId = "trip_id"
    }
}
```

---

## SwiftUI Views

### Trip List View

```swift
// Views/TripListView.swift
struct TripListView: View {
    @StateObject private var viewModel: TripListViewModel
    
    init(supabase: SupabaseClient) {
        _viewModel = StateObject(wrappedValue: TripListViewModel(supabase: supabase))
    }
    
    var body: some View {
        NavigationStack {
            VStack(spacing: 0) {
                // View mode picker
                Picker("View Mode", selection: $viewModel.viewMode) {
                    ForEach(TripViewMode.allCases, id: \.self) { mode in
                        Text(mode.rawValue).tag(mode)
                    }
                }
                .pickerStyle(.segmented)
                .padding()
                
                // Stats overview
                TripStatsCard(stats: viewModel.stats, statusFilter: $viewModel.statusFilter)
                    .padding(.horizontal)
                
                // Trip list
                if viewModel.isLoading {
                    ProgressView()
                        .frame(maxHeight: .infinity)
                } else if viewModel.filteredTrips.isEmpty {
                    EmptyStateView(viewMode: viewModel.viewMode)
                        .frame(maxHeight: .infinity)
                } else {
                    ScrollView {
                        LazyVStack(spacing: 16) {
                            ForEach(viewModel.filteredTrips) { trip in
                                NavigationLink(value: trip) {
                                    TripCard(trip: trip)
                                }
                                .buttonStyle(.plain)
                            }
                        }
                        .padding()
                    }
                }
            }
            .navigationTitle("Trips")
            .navigationDestination(for: Trip.self) { trip in
                TripDetailView(tripId: trip.id)
            }
            .toolbar {
                ToolbarItem(placement: .primaryAction) {
                    Button {
                        // Show create trip sheet
                    } label: {
                        Image(systemName: "plus")
                    }
                }
            }
        }
        .task {
            await viewModel.loadTrips()
        }
    }
}
```

### Trip Stats Card

```swift
struct TripStatsCard: View {
    let stats: TripStats
    @Binding var statusFilter: TripStatus?
    
    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("\(stats.total) Total Trips")
                .font(.headline)
            
            HStack(spacing: 12) {
                StatChip(
                    label: "Upcoming",
                    count: stats.upcoming,
                    color: .blue,
                    isSelected: statusFilter == .upcoming
                ) {
                    toggleFilter(.upcoming)
                }
                
                StatChip(
                    label: "In Progress",
                    count: stats.inProgress,
                    color: .green,
                    isSelected: statusFilter == .inProgress
                ) {
                    toggleFilter(.inProgress)
                }
                
                StatChip(
                    label: "Completed",
                    count: stats.completed,
                    color: .gray,
                    isSelected: statusFilter == .completed
                ) {
                    toggleFilter(.completed)
                }
            }
        }
        .padding()
        .background(Color(.systemGray6))
        .cornerRadius(12)
    }
    
    private func toggleFilter(_ status: TripStatus) {
        statusFilter = (statusFilter == status) ? nil : status
    }
}

struct StatChip: View {
    let label: String
    let count: Int
    let color: Color
    let isSelected: Bool
    let action: () -> Void
    
    var body: some View {
        Button(action: action) {
            VStack(spacing: 4) {
                Text("\(count)")
                    .font(.title2.bold())
                    .foregroundColor(isSelected ? .white : color)
                
                Text(label)
                    .font(.caption)
                    .foregroundColor(isSelected ? .white : .secondary)
            }
            .frame(maxWidth: .infinity)
            .padding(.vertical, 12)
            .background(isSelected ? color : Color(.systemBackground))
            .cornerRadius(8)
            .overlay(
                RoundedRectangle(cornerRadius: 8)
                    .stroke(color, lineWidth: isSelected ? 0 : 1)
            )
        }
    }
}
```

---

## CRUD Operations

### Create Trip

```swift
// ViewModels/CreateTripViewModel.swift
@MainActor
class CreateTripViewModel: ObservableObject {
    @Published var name = ""
    @Published var description = ""
    @Published var destination = ""
    @Published var startDate = Date()
    @Published var endDate = Date().addingTimeInterval(86400 * 7) // +7 days
    @Published var tripType: String = "consumer"
    @Published var coverImage: UIImage?
    @Published var isLoading = false
    @Published var error: Error?
    
    private let supabase: SupabaseClient
    
    init(supabase: SupabaseClient) {
        self.supabase = supabase
    }
    
    var isValid: Bool {
        !name.trimmingCharacters(in: .whitespaces).isEmpty
    }
    
    func createTrip() async -> Trip? {
        guard isValid else { return nil }
        
        isLoading = true
        error = nil
        
        do {
            let userId = supabase.auth.currentUser?.id ?? ""
            
            // Generate unique ID
            let tripId = UUID().uuidString
            
            // Upload cover image if provided
            var coverImageUrl: String? = nil
            if let image = coverImage, let imageData = image.jpegData(compressionQuality: 0.7) {
                coverImageUrl = try await uploadCoverImage(tripId: tripId, imageData: imageData)
            }
            
            // Insert trip
            let newTrip = Trip(
                id: tripId,
                name: name,
                description: description.isEmpty ? nil : description,
                destination: destination.isEmpty ? nil : destination,
                startDate: startDate,
                endDate: endDate,
                coverImageUrl: coverImageUrl,
                tripType: tripType,
                createdBy: userId,
                isArchived: false,
                aiAccessEnabled: true,
                privacyMode: "standard"
            )
            
            try await supabase
                .from("trips")
                .insert(newTrip)
                .execute()
            
            // Add creator as admin member
            try await supabase
                .from("trip_members")
                .insert([
                    "trip_id": tripId,
                    "user_id": userId,
                    "role": "admin"
                ])
                .execute()
            
            isLoading = false
            return newTrip
            
        } catch {
            self.error = error
            isLoading = false
            return nil
        }
    }
    
    private func uploadCoverImage(tripId: String, imageData: Data) async throws -> String {
        let fileName = "\(tripId)/cover.jpg"
        
        try await supabase.storage
            .from("trip-covers")
            .upload(path: fileName, file: imageData, options: FileOptions(contentType: "image/jpeg"))
        
        let url = try supabase.storage
            .from("trip-covers")
            .getPublicURL(path: fileName)
        
        return url.absoluteString
    }
}
```

### Update Trip Description

```swift
extension TripDetailViewModel {
    func updateDescription(_ newDescription: String) async {
        do {
            try await supabase
                .from("trips")
                .update(["description": newDescription])
                .eq("id", value: tripId)
                .execute()
            
            await loadTrip() // Reload
        } catch {
            self.error = error
        }
    }
}
```

### Update Cover Photo

Map from `src/components/TripCoverPhotoUpload.tsx`:

```swift
extension TripDetailViewModel {
    func updateCoverPhoto(_ image: UIImage) async {
        isLoading = true
        
        do {
            guard let imageData = image.jpegData(compressionQuality: 0.7) else {
                throw NSError(domain: "ImageError", code: -1, userInfo: [NSLocalizedDescriptionKey: "Failed to process image"])
            }
            
            let fileName = "\(tripId)/cover-\(UUID().uuidString).jpg"
            
            try await supabase.storage
                .from("trip-covers")
                .upload(path: fileName, file: imageData, options: FileOptions(contentType: "image/jpeg"))
            
            let url = try supabase.storage
                .from("trip-covers")
                .getPublicURL(path: fileName)
            
            try await supabase
                .from("trips")
                .update(["cover_image_url": url.absoluteString])
                .eq("id", value: tripId)
                .execute()
            
            await loadTrip()
            
        } catch {
            self.error = error
        }
        
        isLoading = false
    }
}
```

### Archive Trip

```swift
extension TripDetailViewModel {
    func archiveTrip() async {
        do {
            try await supabase
                .from("trips")
                .update(["is_archived": true])
                .eq("id", value: tripId)
                .execute()
            
            // Navigate back
        } catch {
            self.error = error
        }
    }
}
```

---

## Share Trip

Use iOS native share sheet (maps from `src/components/InviteModal.tsx`):

```swift
extension TripDetailView {
    func shareTrip() {
        let inviteUrl = "https://chravel.app/invite/\(trip.id)"
        let message = "Join my trip: \(trip.name)"
        
        let activityVC = UIActivityViewController(
            activityItems: [message, URL(string: inviteUrl)!],
            applicationActivities: nil
        )
        
        if let windowScene = UIApplication.shared.connectedScenes.first as? UIWindowScene,
           let rootVC = windowScene.windows.first?.rootViewController {
            rootVC.present(activityVC, animated: true)
        }
    }
}
```

---

## Testing Checklist

- [ ] Trip status correctly calculates for:
  - [ ] Past trips (Completed)
  - [ ] Current trips (In Progress)
  - [ ] Future trips (Upcoming)
  - [ ] Trips without dates (default Upcoming)
- [ ] View mode filters work (My Trips, Trips Pro, Events)
- [ ] Status filter chips toggle correctly
- [ ] Create trip inserts to `trips` and `trip_members` tables
- [ ] Cover photo upload works with compression
- [ ] Description editing updates database
- [ ] Archive trip sets `is_archived = true`
- [ ] Share sheet shows correct invite URL
- [ ] Real-time updates when another user edits trip (Phase 2)

---

**Next:** [02-collaboration-sharing.md](02-collaboration-sharing.md)
