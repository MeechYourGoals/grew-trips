# 02: Collaboration & Sharing

## Overview

Chravel enables seamless collaboration through invite links, approval workflows, and role-based permissions. The iOS app must replicate the invite flow from `src/hooks/useInviteLink.ts` and `src/components/InviteModal.tsx`.

---

## Invite Link System

### Data Model

```swift
// Models/InviteLink.swift
struct InviteLink: Identifiable, Codable {
    let id: String
    let tripId: String
    let code: String // 8-character unique code
    let createdBy: String
    let expiresAt: Date?
    let maxUses: Int?
    let currentUses: Int
    let isActive: Bool
    let createdAt: Date
    let updatedAt: Date
    
    var isExpired: Bool {
        guard let expires = expiresAt else { return false }
        return Date() > expires
    }
    
    var isUsable: Bool {
        guard isActive && !isExpired else { return false }
        if let max = maxUses {
            return currentUses < max
        }
        return true
    }
    
    var shareUrl: URL {
        URL(string: "https://chravel.app/invite/\(code)")!
    }
    
    enum CodingKeys: String, CodingKey {
        case id, code
        case tripId = "trip_id"
        case createdBy = "created_by"
        case expiresAt = "expires_at"
        case maxUses = "max_uses"
        case currentUses = "current_uses"
        case isActive = "is_active"
        case createdAt = "created_at"
        case updatedAt = "updated_at"
    }
}
```

### Join Request Model

```swift
struct TripJoinRequest: Identifiable, Codable {
    let id: String
    let tripId: String
    let userId: String
    let inviteCode: String
    let status: String // "pending", "approved", "rejected"
    let requestedAt: Date
    let resolvedAt: Date?
    let resolvedBy: String?
    
    // User info (joined from profiles)
    var userName: String?
    var userAvatar: String?
    var userEmail: String?
    
    enum CodingKeys: String, CodingKey {
        case id
        case tripId = "trip_id"
        case userId = "user_id"
        case inviteCode = "invite_code"
        case status
        case requestedAt = "requested_at"
        case resolvedAt = "resolved_at"
        case resolvedBy = "resolved_by"
    }
}
```

---

## Creating Invite Links

### View Model

```swift
// ViewModels/InviteLinkViewModel.swift
@MainActor
class InviteLinkViewModel: ObservableObject {
    @Published var inviteLink: InviteLink?
    @Published var isLoading = false
    @Published var error: Error?
    
    // Configuration
    @Published var expirationDays: Int = 7
    @Published var maxUses: Int? = nil
    @Published var requireApproval = false
    
    private let tripId: String
    private let supabase: SupabaseClient
    
    init(tripId: String, supabase: SupabaseClient) {
        self.tripId = tripId
        self.supabase = supabase
    }
    
    func loadOrCreateInviteLink() async {
        isLoading = true
        error = nil
        
        do {
            // Check for existing active link
            let existing: [InviteLink] = try await supabase
                .from("trip_invites")
                .select()
                .eq("trip_id", value: tripId)
                .eq("is_active", value: true)
                .order("created_at", ascending: false)
                .limit(1)
                .execute()
                .value
            
            if let link = existing.first, link.isUsable {
                self.inviteLink = link
            } else {
                // Create new link
                await createNewLink()
            }
            
        } catch {
            self.error = error
        }
        
        isLoading = false
    }
    
    func createNewLink() async {
        isLoading = true
        error = nil
        
        do {
            let userId = supabase.auth.currentUser?.id ?? ""
            let code = generateInviteCode()
            
            let expiresAt = expirationDays > 0
                ? Date().addingTimeInterval(TimeInterval(expirationDays * 86400))
                : nil
            
            let newLink = InviteLink(
                id: UUID().uuidString,
                tripId: tripId,
                code: code,
                createdBy: userId,
                expiresAt: expiresAt,
                maxUses: maxUses,
                currentUses: 0,
                isActive: true,
                createdAt: Date(),
                updatedAt: Date()
            )
            
            try await supabase
                .from("trip_invites")
                .insert(newLink)
                .execute()
            
            self.inviteLink = newLink
            
        } catch {
            self.error = error
        }
        
        isLoading = false
    }
    
    func regenerateLink() async {
        // Deactivate old link
        if let oldLink = inviteLink {
            do {
                try await supabase
                    .from("trip_invites")
                    .update(["is_active": false])
                    .eq("id", value: oldLink.id)
                    .execute()
            } catch {
                self.error = error
                return
            }
        }
        
        // Create new link
        await createNewLink()
    }
    
    func deactivateLink() async {
        guard let link = inviteLink else { return }
        
        do {
            try await supabase
                .from("trip_invites")
                .update(["is_active": false])
                .eq("id", value: link.id)
                .execute()
            
            inviteLink = nil
            
        } catch {
            self.error = error
        }
    }
    
    private func generateInviteCode() -> String {
        let characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
        return String((0..<8).map { _ in characters.randomElement()! })
    }
}
```

### SwiftUI View

```swift
// Views/InviteLinkView.swift
struct InviteLinkView: View {
    @StateObject private var viewModel: InviteLinkViewModel
    @State private var showShareSheet = false
    
    init(tripId: String, supabase: SupabaseClient) {
        _viewModel = StateObject(wrappedValue: InviteLinkViewModel(tripId: tripId, supabase: supabase))
    }
    
    var body: some View {
        VStack(spacing: 20) {
            if viewModel.isLoading {
                ProgressView()
            } else if let link = viewModel.inviteLink {
                // Active link display
                VStack(spacing: 16) {
                    Text("Invite Link")
                        .font(.headline)
                    
                    // Link display
                    HStack {
                        Text(link.shareUrl.absoluteString)
                            .font(.system(.body, design: .monospaced))
                            .lineLimit(1)
                            .truncationMode(.middle)
                            .foregroundColor(.blue)
                        
                        Button {
                            UIPasteboard.general.string = link.shareUrl.absoluteString
                        } label: {
                            Image(systemName: "doc.on.doc")
                        }
                    }
                    .padding()
                    .background(Color(.systemGray6))
                    .cornerRadius(8)
                    
                    // Link stats
                    HStack(spacing: 24) {
                        if let maxUses = link.maxUses {
                            VStack {
                                Text("\(link.currentUses)/\(maxUses)")
                                    .font(.title3.bold())
                                Text("Uses")
                                    .font(.caption)
                                    .foregroundColor(.secondary)
                            }
                        }
                        
                        if let expires = link.expiresAt {
                            VStack {
                                Text(expires, style: .relative)
                                    .font(.title3.bold())
                                Text("Until Expiry")
                                    .font(.caption)
                                    .foregroundColor(.secondary)
                            }
                        }
                    }
                    
                    // Actions
                    HStack(spacing: 12) {
                        Button {
                            showShareSheet = true
                        } label: {
                            Label("Share", systemImage: "square.and.arrow.up")
                                .frame(maxWidth: .infinity)
                        }
                        .buttonStyle(.borderedProminent)
                        
                        Menu {
                            Button("Regenerate Link") {
                                Task { await viewModel.regenerateLink() }
                            }
                            
                            Button("Deactivate Link", role: .destructive) {
                                Task { await viewModel.deactivateLink() }
                            }
                        } label: {
                            Image(systemName: "ellipsis.circle")
                        }
                    }
                }
            } else {
                // No active link
                VStack(spacing: 16) {
                    Image(systemName: "link.badge.plus")
                        .font(.system(size: 48))
                        .foregroundColor(.gray)
                    
                    Text("Create Invite Link")
                        .font(.headline)
                    
                    Text("Generate a shareable link to invite people to this trip")
                        .font(.caption)
                        .foregroundColor(.secondary)
                        .multilineTextAlignment(.center)
                    
                    // Configuration
                    Form {
                        Section {
                            Stepper("Expires in \(viewModel.expirationDays) days", value: $viewModel.expirationDays, in: 1...30)
                            
                            Toggle("Limit Uses", isOn: Binding(
                                get: { viewModel.maxUses != nil },
                                set: { viewModel.maxUses = $0 ? 10 : nil }
                            ))
                            
                            if viewModel.maxUses != nil {
                                Stepper("Max \(viewModel.maxUses ?? 10) uses", value: Binding(
                                    get: { viewModel.maxUses ?? 10 },
                                    set: { viewModel.maxUses = $0 }
                                ), in: 1...100)
                            }
                            
                            Toggle("Require Approval", isOn: $viewModel.requireApproval)
                        }
                    }
                    .frame(height: 200)
                    
                    Button("Create Link") {
                        Task { await viewModel.createNewLink() }
                    }
                    .buttonStyle(.borderedProminent)
                }
            }
        }
        .padding()
        .sheet(isPresented: $showShareSheet) {
            if let link = viewModel.inviteLink {
                ShareSheet(items: [link.shareUrl])
            }
        }
        .task {
            await viewModel.loadOrCreateInviteLink()
        }
    }
}

// Native iOS share sheet
struct ShareSheet: UIViewControllerRepresentable {
    let items: [Any]
    
    func makeUIViewController(context: Context) -> UIActivityViewController {
        UIActivityViewController(activityItems: items, applicationActivities: nil)
    }
    
    func updateUIViewController(_ uiViewController: UIActivityViewController, context: Context) {}
}
```

---

## Joining a Trip

### Deep Link Handling

```swift
// AppDelegate or SceneDelegate
func scene(_ scene: UIScene, openURLContexts URLContexts: Set<UIOpenURLContext>) {
    guard let url = URLContexts.first?.url else { return }
    
    // Handle invite URL: chravel://invite/{code}
    if url.host == "invite", let code = url.pathComponents.last {
        handleInviteCode(code)
    }
}

func handleInviteCode(_ code: String) {
    // Navigate to join flow
    NotificationCenter.default.post(
        name: NSNotification.Name("JoinTripWithCode"),
        object: nil,
        userInfo: ["code": code]
    )
}
```

### Join Flow View Model

```swift
@MainActor
class JoinTripViewModel: ObservableObject {
    @Published var inviteCode: String = ""
    @Published var inviteLink: InviteLink?
    @Published var trip: Trip?
    @Published var isLoading = false
    @Published var error: Error?
    @Published var joinStatus: JoinStatus = .idle
    
    enum JoinStatus {
        case idle
        case validating
        case requesting
        case approved
        case rejected
    }
    
    private let supabase: SupabaseClient
    
    init(supabase: SupabaseClient) {
        self.supabase = supabase
    }
    
    func validateInviteCode() async {
        guard !inviteCode.isEmpty else { return }
        
        isLoading = true
        joinStatus = .validating
        error = nil
        
        do {
            // Fetch invite link
            let links: [InviteLink] = try await supabase
                .from("trip_invites")
                .select()
                .eq("code", value: inviteCode.uppercased())
                .eq("is_active", value: true)
                .limit(1)
                .execute()
                .value
            
            guard let link = links.first else {
                throw NSError(domain: "JoinError", code: 404, userInfo: [NSLocalizedDescriptionKey: "Invalid or expired invite code"])
            }
            
            guard link.isUsable else {
                throw NSError(domain: "JoinError", code: 403, userInfo: [NSLocalizedDescriptionKey: "This invite link has expired or reached its maximum uses"])
            }
            
            self.inviteLink = link
            
            // Fetch trip details
            let trips: [Trip] = try await supabase
                .from("trips")
                .select()
                .eq("id", value: link.tripId)
                .limit(1)
                .execute()
                .value
            
            self.trip = trips.first
            
        } catch {
            self.error = error
        }
        
        isLoading = false
        joinStatus = .idle
    }
    
    func requestToJoin() async {
        guard let link = inviteLink, let userId = supabase.auth.currentUser?.id else { return }
        
        isLoading = true
        joinStatus = .requesting
        error = nil
        
        do {
            // Check if already a member
            let existing: [TripMember] = try await supabase
                .from("trip_members")
                .select()
                .eq("trip_id", value: link.tripId)
                .eq("user_id", value: userId)
                .limit(1)
                .execute()
                .value
            
            if !existing.isEmpty {
                // Already a member, just navigate
                joinStatus = .approved
                return
            }
            
            // Create join request
            let request = TripJoinRequest(
                id: UUID().uuidString,
                tripId: link.tripId,
                userId: userId,
                inviteCode: link.code,
                status: "pending",
                requestedAt: Date(),
                resolvedAt: nil,
                resolvedBy: nil
            )
            
            try await supabase
                .from("trip_join_requests")
                .insert(request)
                .execute()
            
            // Increment link usage
            try await supabase
                .from("trip_invites")
                .update(["current_uses": link.currentUses + 1])
                .eq("id", value: link.id)
                .execute()
            
            // TODO: Send notification to trip admin
            
            joinStatus = .approved // Or .requesting if approval needed
            
        } catch {
            self.error = error
            joinStatus = .idle
        }
        
        isLoading = false
    }
}
```

---

## Approving Join Requests

### View Model

```swift
@MainActor
class JoinRequestsViewModel: ObservableObject {
    @Published var requests: [TripJoinRequest] = []
    @Published var isLoading = false
    @Published var error: Error?
    
    private let tripId: String
    private let supabase: SupabaseClient
    
    init(tripId: String, supabase: SupabaseClient) {
        self.tripId = tripId
        self.supabase = supabase
    }
    
    func loadRequests() async {
        isLoading = true
        error = nil
        
        do {
            // Fetch pending requests with user info
            requests = try await supabase
                .from("trip_join_requests")
                .select("""
                    *,
                    profiles!trip_join_requests_user_id_fkey (
                        display_name,
                        avatar_url,
                        email
                    )
                """)
                .eq("trip_id", value: tripId)
                .eq("status", value: "pending")
                .order("requested_at", ascending: false)
                .execute()
                .value
            
        } catch {
            self.error = error
        }
        
        isLoading = false
    }
    
    func approveRequest(_ request: TripJoinRequest) async {
        do {
            let userId = supabase.auth.currentUser?.id ?? ""
            
            // Update request status
            try await supabase
                .from("trip_join_requests")
                .update([
                    "status": "approved",
                    "resolved_at": ISO8601DateFormatter().string(from: Date()),
                    "resolved_by": userId
                ])
                .eq("id", value: request.id)
                .execute()
            
            // Add user as trip member
            try await supabase
                .from("trip_members")
                .insert([
                    "trip_id": tripId,
                    "user_id": request.userId,
                    "role": "member"
                ])
                .execute()
            
            // Remove from list
            requests.removeAll { $0.id == request.id }
            
            // TODO: Send notification to user
            
        } catch {
            self.error = error
        }
    }
    
    func rejectRequest(_ request: TripJoinRequest) async {
        do {
            let userId = supabase.auth.currentUser?.id ?? ""
            
            try await supabase
                .from("trip_join_requests")
                .update([
                    "status": "rejected",
                    "resolved_at": ISO8601DateFormatter().string(from: Date()),
                    "resolved_by": userId
                ])
                .eq("id", value: request.id)
                .execute()
            
            requests.removeAll { $0.id == request.id }
            
        } catch {
            self.error = error
        }
    }
}
```

---

## Role-Based Permissions

```swift
enum TripMemberRole: String, Codable {
    case admin
    case contributor
    case viewer
    
    var canEdit: Bool {
        self == .admin || self == .contributor
    }
    
    var canDelete: Bool {
        self == .admin
    }
    
    var canInvite: Bool {
        self == .admin
    }
    
    var canManageMembers: Bool {
        self == .admin
    }
}

struct TripMember: Codable {
    let id: String
    let tripId: String
    let userId: String
    let role: TripMemberRole
    let createdAt: Date
    
    enum CodingKeys: String, CodingKey {
        case id
        case tripId = "trip_id"
        case userId = "user_id"
        case role
        case createdAt = "created_at"
    }
}
```

---

## Testing Checklist

- [ ] Invite link generation creates unique 8-character code
- [ ] Expiration date correctly calculated
- [ ] Max uses enforced (link becomes unusable when limit reached)
- [ ] Deactivating link prevents future joins
- [ ] Regenerating link creates new code and deactivates old
- [ ] Deep link handling navigates to join flow
- [ ] Join request creates pending entry
- [ ] Approval adds user to `trip_members` table
- [ ] Rejection updates request status but doesn't add member
- [ ] Share sheet shows invite URL on iOS
- [ ] Already-member check prevents duplicate requests
- [ ] Role permissions enforced in UI (edit buttons hidden for viewers)

---

**Next:** [03-chat-messaging.md](03-chat-messaging.md)
