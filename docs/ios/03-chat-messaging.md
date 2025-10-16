# 03: Chat & Messaging

## Overview

Chat is powered by **Supabase Realtime** for instant message delivery. The iOS app must subscribe to the `trip_chat_messages` table and handle INSERT events in real-time, matching the behavior in `src/hooks/useUnifiedMessages.ts` and `src/services/unifiedMessagingService.ts`.

---

## Data Model

```swift
// Models/ChatMessage.swift
struct ChatMessage: Identifiable, Codable {
    let id: String
    let tripId: String
    let senderId: String
    let text: String
    let isBroadcast: Bool
    let isPayment: Bool
    let replyToId: String?
    let isEdited: Bool
    let isDeleted: Bool
    let createdAt: Date
    let updatedAt: Date
    
    // Sender info (joined from profiles)
    var senderName: String?
    var senderAvatar: String?
    
    // Reply preview (joined from messages)
    var replyTo: ChatMessage?
    
    // Reactions (from separate table)
    var reactions: [MessageReaction]?
    
    enum CodingKeys: String, CodingKey {
        case id
        case tripId = "trip_id"
        case senderId = "sender_id"
        case text
        case isBroadcast = "is_broadcast"
        case isPayment = "is_payment"
        case replyToId = "reply_to_id"
        case isEdited = "is_edited"
        case isDeleted = "is_deleted"
        case createdAt = "created_at"
        case updatedAt = "updated_at"
    }
}

struct MessageReaction: Identifiable, Codable {
    let id: String
    let messageId: String
    let userId: String
    let reactionType: String // "👍", "❤️", "🎉", "❓"
    let createdAt: Date
    
    enum CodingKeys: String, CodingKey {
        case id
        case messageId = "message_id"
        case userId = "user_id"
        case reactionType = "reaction_type"
        case createdAt = "created_at"
    }
}
```

---

## Real-Time Subscription

### View Model

```swift
// ViewModels/ChatViewModel.swift
@MainActor
class ChatViewModel: ObservableObject {
    @Published var messages: [ChatMessage] = []
    @Published var isLoading = false
    @Published var error: Error?
    @Published var typingUsers: Set<String> = []
    
    private let tripId: String
    private let supabase: SupabaseClient
    private var realtimeChannel: RealtimeChannel?
    
    init(tripId: String, supabase: SupabaseClient) {
        self.tripId = tripId
        self.supabase = supabase
    }
    
    func startListening() async {
        // Load initial messages
        await loadMessages()
        
        // Subscribe to real-time updates
        subscribeToMessages()
    }
    
    func stopListening() {
        realtimeChannel?.unsubscribe()
        realtimeChannel = nil
    }
    
    private func loadMessages() async {
        isLoading = true
        error = nil
        
        do {
            // Fetch messages with sender info
            let response: [ChatMessage] = try await supabase
                .from("trip_chat_messages")
                .select("""
                    *,
                    profiles!trip_chat_messages_sender_id_fkey (
                        display_name,
                        avatar_url
                    )
                """)
                .eq("trip_id", value: tripId)
                .eq("is_deleted", value: false)
                .order("created_at", ascending: true)
                .execute()
                .value
            
            self.messages = response
            
        } catch {
            self.error = error
        }
        
        isLoading = false
    }
    
    private func subscribeToMessages() {
        let channel = supabase.channel("trip_chat:\(tripId)")
        
        // Subscribe to INSERT events
        channel.on(.postgresChanges(
            table: "trip_chat_messages",
            filter: "trip_id=eq.\(tripId)",
            event: .insert
        )) { [weak self] payload in
            guard let self = self,
                  let newMessage = try? payload.decodeRecord() as ChatMessage else { return }
            
            Task { @MainActor in
                // Append new message if not already present
                if !self.messages.contains(where: { $0.id == newMessage.id }) {
                    self.messages.append(newMessage)
                }
            }
        }
        
        // Subscribe to UPDATE events (for edits)
        channel.on(.postgresChanges(
            table: "trip_chat_messages",
            filter: "trip_id=eq.\(tripId)",
            event: .update
        )) { [weak self] payload in
            guard let self = self,
                  let updatedMessage = try? payload.decodeRecord() as ChatMessage else { return }
            
            Task { @MainActor in
                if let index = self.messages.firstIndex(where: { $0.id == updatedMessage.id }) {
                    self.messages[index] = updatedMessage
                }
            }
        }
        
        // Subscribe to DELETE events (soft delete via is_deleted flag)
        channel.on(.postgresChanges(
            table: "trip_chat_messages",
            filter: "trip_id=eq.\(tripId)",
            event: .update
        )) { [weak self] payload in
            guard let self = self,
                  let deletedMessage = try? payload.decodeRecord() as ChatMessage,
                  deletedMessage.isDeleted else { return }
            
            Task { @MainActor in
                self.messages.removeAll { $0.id == deletedMessage.id }
            }
        }
        
        channel.subscribe()
        self.realtimeChannel = channel
    }
    
    // Send message
    func sendMessage(_ text: String, replyTo: ChatMessage? = nil) async {
        guard !text.trimmingCharacters(in: .whitespaces).isEmpty else { return }
        guard let userId = supabase.auth.currentUser?.id else { return }
        
        do {
            let newMessage = ChatMessage(
                id: UUID().uuidString,
                tripId: tripId,
                senderId: userId,
                text: text,
                isBroadcast: false,
                isPayment: false,
                replyToId: replyTo?.id,
                isEdited: false,
                isDeleted: false,
                createdAt: Date(),
                updatedAt: Date()
            )
            
            try await supabase
                .from("trip_chat_messages")
                .insert(newMessage)
                .execute()
            
            // Realtime will handle adding to messages array
            
        } catch {
            self.error = error
        }
    }
    
    // Edit message
    func editMessage(_ message: ChatMessage, newText: String) async {
        guard !newText.trimmingCharacters(in: .whitespaces).isEmpty else { return }
        guard message.senderId == supabase.auth.currentUser?.id else { return }
        
        do {
            try await supabase
                .from("trip_chat_messages")
                .update([
                    "text": newText,
                    "is_edited": true,
                    "updated_at": ISO8601DateFormatter().string(from: Date())
                ])
                .eq("id", value: message.id)
                .execute()
            
        } catch {
            self.error = error
        }
    }
    
    // Delete message (soft delete)
    func deleteMessage(_ message: ChatMessage) async {
        guard message.senderId == supabase.auth.currentUser?.id else { return }
        
        do {
            try await supabase
                .from("trip_chat_messages")
                .update([
                    "is_deleted": true,
                    "updated_at": ISO8601DateFormatter().string(from: Date())
                ])
                .eq("id", value: message.id)
                .execute()
            
        } catch {
            self.error = error
        }
    }
    
    // Add reaction
    func addReaction(to message: ChatMessage, type: String) async {
        guard let userId = supabase.auth.currentUser?.id else { return }
        
        do {
            // Check if user already reacted with this type
            let existing: [MessageReaction] = try await supabase
                .from("message_reactions")
                .select()
                .eq("message_id", value: message.id)
                .eq("user_id", value: userId)
                .eq("reaction_type", value: type)
                .limit(1)
                .execute()
                .value
            
            if !existing.isEmpty {
                // Remove reaction
                try await supabase
                    .from("message_reactions")
                    .delete()
                    .eq("id", value: existing[0].id)
                    .execute()
            } else {
                // Add reaction
                let reaction = MessageReaction(
                    id: UUID().uuidString,
                    messageId: message.id,
                    userId: userId,
                    reactionType: type,
                    createdAt: Date()
                )
                
                try await supabase
                    .from("message_reactions")
                    .insert(reaction)
                    .execute()
            }
            
        } catch {
            self.error = error
        }
    }
    
    deinit {
        stopListening()
    }
}
```

---

## SwiftUI Chat View

```swift
// Views/ChatView.swift
struct ChatView: View {
    @StateObject private var viewModel: ChatViewModel
    @State private var messageText = ""
    @State private var replyTo: ChatMessage?
    @FocusState private var isTextFieldFocused: Bool
    
    init(tripId: String, supabase: SupabaseClient) {
        _viewModel = StateObject(wrappedValue: ChatViewModel(tripId: tripId, supabase: supabase))
    }
    
    var body: some View {
        VStack(spacing: 0) {
            // Messages list
            ScrollViewReader { proxy in
                ScrollView {
                    LazyVStack(spacing: 12) {
                        ForEach(viewModel.messages) { message in
                            MessageBubble(
                                message: message,
                                onReply: { replyTo = message },
                                onReact: { type in
                                    Task { await viewModel.addReaction(to: message, type: type) }
                                },
                                onEdit: { newText in
                                    Task { await viewModel.editMessage(message, newText: newText) }
                                },
                                onDelete: {
                                    Task { await viewModel.deleteMessage(message) }
                                }
                            )
                            .id(message.id)
                        }
                    }
                    .padding()
                }
                .onChange(of: viewModel.messages.count) { _ in
                    // Scroll to bottom on new message
                    if let lastMessage = viewModel.messages.last {
                        withAnimation {
                            proxy.scrollTo(lastMessage.id, anchor: .bottom)
                        }
                    }
                }
            }
            
            // Reply preview
            if let reply = replyTo {
                ReplyPreview(message: reply) {
                    replyTo = nil
                }
            }
            
            // Message input
            HStack(spacing: 12) {
                TextField("Message", text: $messageText, axis: .vertical)
                    .textFieldStyle(.roundedBorder)
                    .focused($isTextFieldFocused)
                
                Button {
                    Task {
                        await viewModel.sendMessage(messageText, replyTo: replyTo)
                        messageText = ""
                        replyTo = nil
                    }
                } label: {
                    Image(systemName: "arrow.up.circle.fill")
                        .font(.system(size: 32))
                        .foregroundColor(messageText.isEmpty ? .gray : .blue)
                }
                .disabled(messageText.isEmpty)
            }
            .padding()
            .background(Color(.systemGray6))
        }
        .navigationTitle("Chat")
        .task {
            await viewModel.startListening()
        }
    }
}
```

### Message Bubble Component

```swift
struct MessageBubble: View {
    let message: ChatMessage
    let onReply: () -> Void
    let onReact: (String) -> Void
    let onEdit: (String) -> Void
    let onDelete: () -> Void
    
    @State private var showActions = false
    @State private var showReactions = false
    
    private var isOwnMessage: Bool {
        // Compare with current user ID
        message.senderId == "CURRENT_USER_ID" // TODO: Get from auth context
    }
    
    var body: some View {
        HStack(alignment: .top, spacing: 8) {
            if !isOwnMessage {
                // Sender avatar
                AsyncImage(url: URL(string: message.senderAvatar ?? "")) { image in
                    image.resizable()
                } placeholder: {
                    Circle()
                        .fill(Color.gray.opacity(0.3))
                }
                .frame(width: 32, height: 32)
                .clipShape(Circle())
            }
            
            VStack(alignment: isOwnMessage ? .trailing : .leading, spacing: 4) {
                // Sender name
                if !isOwnMessage {
                    Text(message.senderName ?? "Unknown")
                        .font(.caption.bold())
                        .foregroundColor(.secondary)
                }
                
                // Reply preview
                if let replyId = message.replyToId {
                    Text("↩ Replying to...") // TODO: Load reply message
                        .font(.caption)
                        .foregroundColor(.secondary)
                        .padding(.horizontal, 8)
                        .padding(.vertical, 4)
                        .background(Color.gray.opacity(0.2))
                        .cornerRadius(8)
                }
                
                // Message bubble
                HStack {
                    Text(message.text)
                        .font(.body)
                        .foregroundColor(isOwnMessage ? .white : .primary)
                        .padding(.horizontal, 12)
                        .padding(.vertical, 8)
                }
                .background(isOwnMessage ? Color.blue : Color(.systemGray5))
                .cornerRadius(16)
                .contextMenu {
                    Button("Reply", systemImage: "arrowshape.turn.up.left") {
                        onReply()
                    }
                    
                    Button("React", systemImage: "face.smiling") {
                        showReactions.toggle()
                    }
                    
                    if isOwnMessage {
                        Button("Edit", systemImage: "pencil") {
                            // Show edit sheet
                        }
                        
                        Button("Delete", systemImage: "trash", role: .destructive) {
                            onDelete()
                        }
                    }
                }
                
                // Reactions
                if let reactions = message.reactions, !reactions.isEmpty {
                    HStack(spacing: 4) {
                        ForEach(Array(Dictionary(grouping: reactions, by: { $0.reactionType }).keys), id: \.self) { type in
                            let count = reactions.filter { $0.reactionType == type }.count
                            Button {
                                onReact(type)
                            } label: {
                                HStack(spacing: 2) {
                                    Text(type)
                                    if count > 1 {
                                        Text("\(count)")
                                            .font(.caption2)
                                    }
                                }
                                .padding(.horizontal, 6)
                                .padding(.vertical, 2)
                                .background(Color.gray.opacity(0.2))
                                .cornerRadius(8)
                            }
                        }
                    }
                }
                
                // Timestamp
                HStack(spacing: 4) {
                    Text(message.createdAt, style: .time)
                        .font(.caption2)
                        .foregroundColor(.secondary)
                    
                    if message.isEdited {
                        Text("(edited)")
                            .font(.caption2)
                            .foregroundColor(.secondary)
                    }
                }
            }
            
            if isOwnMessage {
                Spacer()
            }
        }
        .sheet(isPresented: $showReactions) {
            ReactionPicker(onSelect: { type in
                onReact(type)
                showReactions = false
            })
        }
    }
}

struct ReactionPicker: View {
    let onSelect: (String) -> Void
    
    let reactions = ["👍", "❤️", "🎉", "😂", "😮", "😢", "🙏", "❓"]
    
    var body: some View {
        NavigationView {
            ScrollView {
                LazyVGrid(columns: [GridItem(.adaptive(minimum: 60))], spacing: 16) {
                    ForEach(reactions, id: \.self) { reaction in
                        Button {
                            onSelect(reaction)
                        } label: {
                            Text(reaction)
                                .font(.system(size: 40))
                        }
                    }
                }
                .padding()
            }
            .navigationTitle("Add Reaction")
            .navigationBarTitleDisplayMode(.inline)
        }
        .presentationDetents([.medium])
    }
}

struct ReplyPreview: View {
    let message: ChatMessage
    let onCancel: () -> Void
    
    var body: some View {
        HStack {
            VStack(alignment: .leading, spacing: 2) {
                Text("Replying to \(message.senderName ?? "Unknown")")
                    .font(.caption.bold())
                
                Text(message.text)
                    .font(.caption)
                    .foregroundColor(.secondary)
                    .lineLimit(1)
            }
            
            Spacer()
            
            Button {
                onCancel()
            } label: {
                Image(systemName: "xmark.circle.fill")
                    .foregroundColor(.gray)
            }
        }
        .padding()
        .background(Color(.systemGray6))
    }
}
```

---

## @Mentions

Parse mentions in message text:

```swift
extension String {
    func parseMentions() -> [(range: Range<String.Index>, userId: String)] {
        // Find all @[userId] patterns
        let pattern = "@\\[([a-zA-Z0-9-]+)\\]"
        guard let regex = try? NSRegularExpression(pattern: pattern) else { return [] }
        
        let matches = regex.matches(in: self, range: NSRange(self.startIndex..., in: self))
        
        return matches.compactMap { match in
            guard let range = Range(match.range, in: self),
                  let userIdRange = Range(match.range(at: 1), in: self) else { return nil }
            
            let userId = String(self[userIdRange])
            return (range, userId)
        }
    }
}

// Display mentions as blue text
struct MessageText: View {
    let text: String
    
    var body: some View {
        let mentions = text.parseMentions()
        
        if mentions.isEmpty {
            Text(text)
        } else {
            // Build attributed string with blue mentions
            Text(buildAttributedString())
        }
    }
    
    private func buildAttributedString() -> AttributedString {
        var attributed = AttributedString(text)
        
        for (range, userId) in text.parseMentions() {
            if let attrRange = Range(range, in: attributed) {
                attributed[attrRange].foregroundColor = .blue
                attributed[attrRange].font = .body.bold()
            }
        }
        
        return attributed
    }
}
```

---

## Typing Indicators

Use Supabase Presence:

```swift
extension ChatViewModel {
    func startTyping() {
        guard let userId = supabase.auth.currentUser?.id else { return }
        
        Task {
            try? await realtimeChannel?.track([
                "user_id": userId,
                "typing": true
            ])
        }
    }
    
    func stopTyping() {
        guard let userId = supabase.auth.currentUser?.id else { return }
        
        Task {
            try? await realtimeChannel?.track([
                "user_id": userId,
                "typing": false
            ])
        }
    }
    
    private func subscribeToPresence() {
        realtimeChannel?.on(.presence, filter: .all) { [weak self] state in
            let typingUsers = state.joins.values.compactMap { presence -> String? in
                guard let data = presence as? [String: Any],
                      let typing = data["typing"] as? Bool,
                      typing,
                      let userId = data["user_id"] as? String else { return nil }
                return userId
            }
            
            Task { @MainActor in
                self?.typingUsers = Set(typingUsers)
            }
        }
    }
}
```

---

## Testing Checklist

- [ ] Real-time subscription receives new messages instantly
- [ ] Messages sorted by `created_at` ascending
- [ ] Send message inserts to database and appears via realtime
- [ ] Edit message updates text and sets `is_edited = true`
- [ ] Delete message sets `is_deleted = true` and removes from UI
- [ ] Reply preview shows original message
- [ ] Reactions toggle on/off correctly
- [ ] Multiple users can react with same emoji (count increments)
- [ ] @mentions parse and display in blue
- [ ] Typing indicator shows when other users are typing
- [ ] Long messages wrap correctly in bubble
- [ ] Own messages align right with blue bubble
- [ ] Others' messages align left with gray bubble
- [ ] Scroll to bottom on new message received

---

**Next:** [04-calendar-itinerary.md](04-calendar-itinerary.md)
