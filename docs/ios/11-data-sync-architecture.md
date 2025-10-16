# Data Sync Architecture

**Feature Owner**: Core Infrastructure  
**Dependencies**: Supabase (PostgreSQL + Realtime)

---

## Overview

Chravel iOS uses **Supabase as the single source of truth** for all data. The architecture emphasizes:

1. **Real-time sync** via Supabase Realtime channels
2. **Optimistic UI updates** with server reconciliation
3. **Authentication** with JWT tokens stored securely in Keychain
4. **Offline-first strategy** (Phase 2)

---

## 1. Supabase Client Setup

### Configuration

```swift
import Supabase

struct SupabaseConfig {
    static let url = URL(string: "https://jmjiyekmxwsxkfnqwyaa.supabase.co")!
    static let anonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imptaml5ZWtteHdzeGtmbnF3eWFhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM5MjEwMDgsImV4cCI6MjA2OTQ5NzAwOH0.SAas0HWvteb9TbYNJFDf8Itt8mIsDtKOK6QwBcwINhI"
}

class SupabaseManager {
    static let shared = SupabaseManager()
    
    let client: SupabaseClient
    
    private init() {
        client = SupabaseClient(
            supabaseURL: SupabaseConfig.url,
            supabaseKey: SupabaseConfig.anonKey,
            options: SupabaseClientOptions(
                auth: AuthOptions(
                    storage: KeychainStorage(),
                    autoRefreshToken: true,
                    persistSession: true
                )
            )
        )
    }
}

// Global accessor
let supabase = SupabaseManager.shared.client
```

### Keychain Storage for Auth

```swift
import Security

class KeychainStorage: AuthStorage {
    private let service = "dev.chravel.auth"
    
    func store(key: String, value: Data) throws {
        let query: [String: Any] = [
            kSecClass as String: kSecClassGenericPassword,
            kSecAttrService as String: service,
            kSecAttrAccount as String: key,
            kSecValueData as String: value
        ]
        
        SecItemDelete(query as CFDictionary)
        
        let status = SecItemAdd(query as CFDictionary, nil)
        guard status == errSecSuccess else {
            throw KeychainError.unableToStore
        }
    }
    
    func retrieve(key: String) throws -> Data? {
        let query: [String: Any] = [
            kSecClass as String: kSecClassGenericPassword,
            kSecAttrService as String: service,
            kSecAttrAccount as String: key,
            kSecReturnData as String: true
        ]
        
        var result: AnyObject?
        let status = SecItemCopyMatching(query as CFDictionary, &result)
        
        if status == errSecItemNotFound {
            return nil
        }
        
        guard status == errSecSuccess else {
            throw KeychainError.unableToRetrieve
        }
        
        return result as? Data
    }
    
    func delete(key: String) throws {
        let query: [String: Any] = [
            kSecClass as String: kSecClassGenericPassword,
            kSecAttrService as String: service,
            kSecAttrAccount as String: key
        ]
        
        let status = SecItemDelete(query as CFDictionary)
        guard status == errSecSuccess || status == errSecItemNotFound else {
            throw KeychainError.unableToDelete
        }
    }
}

enum KeychainError: Error {
    case unableToStore
    case unableToRetrieve
    case unableToDelete
}
```

---

## 2. Authentication Flow

### Sign In

```swift
class AuthManager: ObservableObject {
    @Published var session: Session?
    @Published var user: User?
    
    init() {
        Task {
            await checkSession()
            await listenToAuthChanges()
        }
    }
    
    func checkSession() async {
        do {
            let session = try await supabase.auth.session
            await MainActor.run {
                self.session = session
                self.user = session.user
            }
        } catch {
            print("No active session")
        }
    }
    
    func listenToAuthChanges() async {
        for await state in supabase.auth.authStateChanges {
            await MainActor.run {
                self.session = state.session
                self.user = state.session?.user
            }
        }
    }
    
    func signIn(email: String, password: String) async throws {
        let session = try await supabase.auth.signIn(
            email: email,
            password: password
        )
        
        await MainActor.run {
            self.session = session
            self.user = session.user
        }
    }
    
    func signUp(email: String, password: String) async throws {
        let session = try await supabase.auth.signUp(
            email: email,
            password: password,
            options: AuthOptions(
                emailRedirectTo: URL(string: "chravel://auth/callback")
            )
        )
        
        await MainActor.run {
            self.session = session
            self.user = session.user
        }
    }
    
    func signOut() async throws {
        try await supabase.auth.signOut()
        
        await MainActor.run {
            self.session = nil
            self.user = nil
        }
    }
}
```

### Token Refresh

Automatic via Supabase SDK with `autoRefreshToken: true`. Manual refresh:

```swift
func refreshSession() async throws -> Session {
    return try await supabase.auth.refreshSession()
}
```

---

## 3. Real-Time Subscriptions

### Message Sync

```swift
class MessageSyncManager: ObservableObject {
    @Published var messages: [ChatMessage] = []
    
    private var channel: RealtimeChannel?
    
    func subscribeToMessages(tripId: String) {
        channel = supabase.channel("trip-messages:\(tripId)")
        
        // Listen for INSERT
        let insertTask = channel?.on(.postgresChanges(
            event: .insert,
            schema: "public",
            table: "trip_chat_messages",
            filter: "trip_id=eq.\(tripId)"
        )) { [weak self] payload in
            if let message = try? JSONDecoder().decode(ChatMessage.self, from: payload.new) {
                DispatchQueue.main.async {
                    self?.messages.append(message)
                }
            }
        }
        
        // Listen for UPDATE
        let updateTask = channel?.on(.postgresChanges(
            event: .update,
            schema: "public",
            table: "trip_chat_messages",
            filter: "trip_id=eq.\(tripId)"
        )) { [weak self] payload in
            if let updatedMessage = try? JSONDecoder().decode(ChatMessage.self, from: payload.new) {
                DispatchQueue.main.async {
                    if let index = self?.messages.firstIndex(where: { $0.id == updatedMessage.id }) {
                        self?.messages[index] = updatedMessage
                    }
                }
            }
        }
        
        // Listen for DELETE
        let deleteTask = channel?.on(.postgresChanges(
            event: .delete,
            schema: "public",
            table: "trip_chat_messages",
            filter: "trip_id=eq.\(tripId)"
        )) { [weak self] payload in
            if let deletedMessage = try? JSONDecoder().decode(ChatMessage.self, from: payload.old) {
                DispatchQueue.main.async {
                    self?.messages.removeAll { $0.id == deletedMessage.id }
                }
            }
        }
        
        channel?.subscribe()
    }
    
    func unsubscribe() {
        channel?.unsubscribe()
        channel = nil
    }
}
```

### Broadcast Sync

```swift
class BroadcastSyncManager: ObservableObject {
    @Published var broadcasts: [Broadcast] = []
    
    private var channel: RealtimeChannel?
    
    func subscribeToBroadcasts(tripId: String) {
        channel = supabase.channel("broadcasts:\(tripId)")
        
        channel?.on(.postgresChanges(
            event: .insert,
            schema: "public",
            table: "broadcasts",
            filter: "trip_id=eq.\(tripId)"
        )) { [weak self] payload in
            if let broadcast = try? JSONDecoder().decode(Broadcast.self, from: payload.new) {
                DispatchQueue.main.async {
                    self?.broadcasts.insert(broadcast, at: 0)
                }
            }
        }
        
        channel?.subscribe()
    }
    
    func unsubscribe() {
        channel?.unsubscribe()
        channel = nil
    }
}
```

---

## 4. Optimistic UI Updates

### Pattern: Update Local → Send to Server → Reconcile

```swift
class OptimisticMessageManager: ObservableObject {
    @Published var messages: [ChatMessage] = []
    
    func sendMessage(tripId: String, content: String) async {
        let tempId = UUID()
        let optimisticMessage = ChatMessage(
            id: tempId,
            tripId: tripId,
            senderId: currentUserId,
            content: content,
            createdAt: Date(),
            isOptimistic: true // Flag for UI
        )
        
        // 1. Add to local state immediately
        await MainActor.run {
            messages.append(optimisticMessage)
        }
        
        // 2. Send to server
        do {
            let response = try await supabase
                .from("trip_chat_messages")
                .insert([
                    "trip_id": tripId,
                    "sender_id": currentUserId.uuidString,
                    "content": content
                ])
                .select()
                .single()
                .execute()
            
            let serverMessage = try JSONDecoder().decode(ChatMessage.self, from: response.data)
            
            // 3. Replace optimistic with server version
            await MainActor.run {
                if let index = messages.firstIndex(where: { $0.id == tempId }) {
                    messages[index] = serverMessage
                }
            }
        } catch {
            // 4. Handle failure - remove optimistic message or show error
            await MainActor.run {
                messages.removeAll { $0.id == tempId }
            }
            print("Failed to send message: \(error)")
        }
    }
}
```

---

## 5. Offline Strategy (Phase 2)

### Local Cache with CoreData

```swift
import CoreData

class LocalCacheManager {
    static let shared = LocalCacheManager()
    
    lazy var persistentContainer: NSPersistentContainer = {
        let container = NSPersistentContainer(name: "Chravel")
        container.loadPersistentStores { description, error in
            if let error = error {
                fatalError("Unable to load persistent stores: \(error)")
            }
        }
        return container
    }()
    
    var context: NSManagedObjectContext {
        persistentContainer.viewContext
    }
    
    func saveContext() {
        if context.hasChanges {
            do {
                try context.save()
            } catch {
                print("Error saving context: \(error)")
            }
        }
    }
}
```

### Sync Queue for Offline Actions

```swift
struct PendingAction: Codable {
    let id: UUID
    let type: ActionType
    let payload: [String: Any]
    let timestamp: Date
    
    enum ActionType: String, Codable {
        case sendMessage
        case createEvent
        case updateTask
    }
}

class SyncQueue: ObservableObject {
    @Published var pendingActions: [PendingAction] = []
    
    func enqueue(action: PendingAction) {
        pendingActions.append(action)
        saveToDisk()
    }
    
    func processPendingActions() async {
        for action in pendingActions {
            do {
                try await execute(action: action)
                pendingActions.removeAll { $0.id == action.id }
            } catch {
                print("Failed to execute action: \(error)")
            }
        }
        saveToDisk()
    }
    
    private func execute(action: PendingAction) async throws {
        switch action.type {
        case .sendMessage:
            // Execute send message logic
            break
        case .createEvent:
            // Execute create event logic
            break
        case .updateTask:
            // Execute update task logic
            break
        }
    }
    
    private func saveToDisk() {
        // Persist to UserDefaults or file system
    }
}
```

---

## 6. Network Monitoring

```swift
import Network

class NetworkMonitor: ObservableObject {
    @Published var isConnected = true
    
    private let monitor = NWPathMonitor()
    private let queue = DispatchQueue(label: "NetworkMonitor")
    
    init() {
        monitor.pathUpdateHandler = { [weak self] path in
            DispatchQueue.main.async {
                self?.isConnected = path.status == .satisfied
            }
        }
        monitor.start(queue: queue)
    }
    
    deinit {
        monitor.cancel()
    }
}
```

### Usage in App

```swift
struct ContentView: View {
    @EnvironmentObject var networkMonitor: NetworkMonitor
    @EnvironmentObject var syncQueue: SyncQueue
    
    var body: some View {
        VStack {
            if !networkMonitor.isConnected {
                OfflineBanner()
            }
            
            // Main content
        }
        .onChange(of: networkMonitor.isConnected) { isConnected in
            if isConnected {
                Task {
                    await syncQueue.processPendingActions()
                }
            }
        }
    }
}

struct OfflineBanner: View {
    var body: some View {
        HStack {
            Image(systemName: "wifi.slash")
            Text("You're offline. Changes will sync when reconnected.")
                .font(.caption)
        }
        .padding()
        .background(Color.orange)
        .foregroundColor(.white)
    }
}
```

---

## 7. Error Handling

### Retry Logic

```swift
func fetchWithRetry<T: Decodable>(
    maxRetries: Int = 3,
    delay: TimeInterval = 1.0,
    operation: @escaping () async throws -> T
) async throws -> T {
    var lastError: Error?
    
    for attempt in 0..<maxRetries {
        do {
            return try await operation()
        } catch {
            lastError = error
            if attempt < maxRetries - 1 {
                try await Task.sleep(nanoseconds: UInt64(delay * 1_000_000_000))
            }
        }
    }
    
    throw lastError ?? NetworkError.unknown
}
```

### Usage

```swift
let trips = try await fetchWithRetry {
    try await fetchTrips()
}
```

---

## 8. Data Flow Diagram

```
┌─────────────┐
│   iOS App   │
└──────┬──────┘
       │
       │ 1. Query/Mutation
       ▼
┌─────────────────┐
│ Supabase Client │
└────────┬────────┘
         │
         │ 2. Auth + RLS
         ▼
┌──────────────────┐
│   PostgreSQL     │  ◄─── Single Source of Truth
└────────┬─────────┘
         │
         │ 3. Real-time Events
         ▼
┌──────────────────┐
│ Realtime Channel │
└────────┬─────────┘
         │
         │ 4. Push Updates
         ▼
┌─────────────┐
│   iOS App   │
└─────────────┘
```

---

## Testing Checklist

- [ ] Auth session persists across app restarts
- [ ] Tokens refresh automatically before expiration
- [ ] Real-time messages appear instantly
- [ ] Optimistic updates reconcile with server
- [ ] Offline actions queue correctly
- [ ] Pending actions process when back online
- [ ] Network status banner shows/hides
- [ ] Retry logic handles transient failures
- [ ] RLS policies enforce access control
- [ ] Multiple devices stay in sync

---

## Next Steps

- Local database cache (CoreData/Realm)
- Conflict resolution for offline edits
- Binary delta sync for large files
- GraphQL subscriptions (if migrating from REST)
- Background sync with BGTaskScheduler
