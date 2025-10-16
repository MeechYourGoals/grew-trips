# 05: Tasks & Polls

## Overview

Tasks and polls enable collaborative decision-making within trips. Both features use **optimistic locking** (version fields) to prevent concurrent edit conflicts, matching the behavior in `src/types/tasks.ts` and database functions `toggle_task_status` and `vote_on_poll`.

---

## Tasks Data Model

```swift
// Models/TripTask.swift
struct TripTask: Identifiable, Codable {
    let id: String
    let tripId: String
    let creatorId: String
    let title: String
    let description: String?
    let dueAt: Date?
    let isPoll: Bool
    let createdAt: Date
    let updatedAt: Date
    let version: Int
    
    // Creator info (joined from profiles)
    var creatorName: String?
    var creatorAvatar: String?
    
    // Task status per user (from task_status table)
    var statuses: [TaskStatus]?
    
    var isOverdue: Bool {
        guard let due = dueAt else { return false }
        return Date() > due && !(statuses?.allSatisfy { $0.completed } ?? false)
    }
    
    var completionRate: Double {
        guard let statuses = statuses, !statuses.isEmpty else { return 0.0 }
        let completed = statuses.filter { $0.completed }.count
        return Double(completed) / Double(statuses.count)
    }
    
    enum CodingKeys: String, CodingKey {
        case id
        case tripId = "trip_id"
        case creatorId = "creator_id"
        case title, description
        case dueAt = "due_at"
        case isPoll = "is_poll"
        case createdAt = "created_at"
        case updatedAt = "updated_at"
        case version
    }
}

struct TaskStatus: Identifiable, Codable {
    let id: String
    let taskId: String
    let userId: String
    let completed: Bool
    let completedAt: Date?
    
    // User info (joined from profiles)
    var userName: String?
    var userAvatar: String?
    
    enum CodingKeys: String, CodingKey {
        case id
        case taskId = "task_id"
        case userId = "user_id"
        case completed
        case completedAt = "completed_at"
    }
}

struct CreateTaskRequest: Codable {
    let title: String
    let description: String?
    let dueAt: Date?
    let isPoll: Bool
    let assignedTo: [String]? // User IDs
}
```

---

## Tasks Service

```swift
// Services/TasksService.swift
class TasksService {
    private let supabase: SupabaseClient
    
    init(supabase: SupabaseClient) {
        self.supabase = supabase
    }
    
    func loadTasks(tripId: String) async throws -> [TripTask] {
        let tasks: [TripTask] = try await supabase
            .from("trip_tasks")
            .select("""
                *,
                profiles!trip_tasks_creator_id_fkey (
                    display_name,
                    avatar_url
                ),
                task_status (
                    *,
                    profiles!task_status_user_id_fkey (
                        display_name,
                        avatar_url
                    )
                )
            """)
            .eq("trip_id", value: tripId)
            .eq("is_poll", value: false)
            .order("created_at", ascending: false)
            .execute()
            .value
        
        return tasks
    }
    
    func createTask(tripId: String, request: CreateTaskRequest) async throws -> TripTask {
        let userId = supabase.auth.currentUser?.id ?? ""
        
        let newTask = TripTask(
            id: UUID().uuidString,
            tripId: tripId,
            creatorId: userId,
            title: request.title,
            description: request.description,
            dueAt: request.dueAt,
            isPoll: false,
            createdAt: Date(),
            updatedAt: Date(),
            version: 1
        )
        
        try await supabase
            .from("trip_tasks")
            .insert(newTask)
            .execute()
        
        // Create task assignments if provided
        if let assignedTo = request.assignedTo {
            for assigneeId in assignedTo {
                try await supabase
                    .from("task_assignments")
                    .insert([
                        "task_id": newTask.id,
                        "user_id": assigneeId,
                        "assigned_by": userId
                    ])
                    .execute()
            }
        }
        
        return newTask
    }
    
    func toggleTaskStatus(taskId: String, completed: Bool, currentVersion: Int) async throws {
        let userId = supabase.auth.currentUser?.id ?? ""
        
        // Call RPC function with optimistic locking
        try await supabase
            .rpc("toggle_task_status", params: [
                "p_task_id": taskId,
                "p_user_id": userId,
                "p_completed": completed,
                "p_current_version": currentVersion
            ])
            .execute()
    }
    
    func deleteTask(taskId: String) async throws {
        try await supabase
            .from("trip_tasks")
            .delete()
            .eq("id", value: taskId)
            .execute()
    }
}
```

---

## Polls Data Model

```swift
// Models/TripPoll.swift
struct TripPoll: Identifiable, Codable {
    let id: String
    let tripId: String
    let question: String
    let options: [PollOption]
    let totalVotes: Int
    let status: String // "active", "closed"
    let createdBy: String
    let createdAt: Date
    let updatedAt: Date
    let version: Int
    
    // Creator info
    var creatorName: String?
    var creatorAvatar: String?
    
    enum CodingKeys: String, CodingKey {
        case id
        case tripId = "trip_id"
        case question, options
        case totalVotes = "total_votes"
        case status
        case createdBy = "created_by"
        case createdAt = "created_at"
        case updatedAt = "updated_at"
        case version
    }
}

struct PollOption: Identifiable, Codable {
    let id: String
    let text: String
    let voteCount: Int
    let voters: [String] // User IDs
    
    var percentage: Double {
        0.0 // Calculated based on total votes
    }
    
    enum CodingKeys: String, CodingKey {
        case id, text
        case voteCount = "voteCount"
        case voters
    }
}
```

---

## Polls Service

```swift
// Services/PollsService.swift
class PollsService {
    private let supabase: SupabaseClient
    
    init(supabase: SupabaseClient) {
        self.supabase = supabase
    }
    
    func loadPolls(tripId: String) async throws -> [TripPoll] {
        let polls: [TripPoll] = try await supabase
            .from("trip_polls")
            .select("""
                *,
                profiles!trip_polls_created_by_fkey (
                    display_name,
                    avatar_url
                )
            """)
            .eq("trip_id", value: tripId)
            .order("created_at", ascending: false)
            .execute()
            .value
        
        return polls
    }
    
    func createPoll(tripId: String, question: String, options: [String]) async throws -> TripPoll {
        let userId = supabase.auth.currentUser?.id ?? ""
        
        let pollOptions = options.map { text in
            PollOption(
                id: UUID().uuidString,
                text: text,
                voteCount: 0,
                voters: []
            )
        }
        
        let newPoll = TripPoll(
            id: UUID().uuidString,
            tripId: tripId,
            question: question,
            options: pollOptions,
            totalVotes: 0,
            status: "active",
            createdBy: userId,
            createdAt: Date(),
            updatedAt: Date(),
            version: 1
        )
        
        try await supabase
            .from("trip_polls")
            .insert(newPoll)
            .execute()
        
        return newPoll
    }
    
    func vote(pollId: String, optionId: String, currentVersion: Int) async throws {
        let userId = supabase.auth.currentUser?.id ?? ""
        
        // Call RPC function with optimistic locking
        let result: [[String: Any]] = try await supabase
            .rpc("vote_on_poll", params: [
                "p_poll_id": pollId,
                "p_option_id": optionId,
                "p_user_id": userId,
                "p_current_version": currentVersion
            ])
            .execute()
            .value
        
        // Result contains updated options array
    }
    
    func closePoll(pollId: String) async throws {
        try await supabase
            .from("trip_polls")
            .update(["status": "closed"])
            .eq("id", value: pollId)
            .execute()
    }
}
```

---

## SwiftUI Views

### Tasks View

```swift
// Views/TasksView.swift
@MainActor
class TasksViewModel: ObservableObject {
    @Published var tasks: [TripTask] = []
    @Published var isLoading = false
    @Published var error: Error?
    
    private let tripId: String
    private let service: TasksService
    
    init(tripId: String, supabase: SupabaseClient) {
        self.tripId = tripId
        self.service = TasksService(supabase: supabase)
    }
    
    func loadTasks() async {
        isLoading = true
        error = nil
        
        do {
            tasks = try await service.loadTasks(tripId: tripId)
        } catch {
            self.error = error
        }
        
        isLoading = false
    }
    
    func createTask(request: CreateTaskRequest) async {
        do {
            let newTask = try await service.createTask(tripId: tripId, request: request)
            tasks.insert(newTask, at: 0)
        } catch {
            self.error = error
        }
    }
    
    func toggleTask(_ task: TripTask, completed: Bool) async {
        do {
            try await service.toggleTaskStatus(
                taskId: task.id,
                completed: completed,
                currentVersion: task.version
            )
            
            await loadTasks() // Reload to get updated version
            
        } catch {
            self.error = error
        }
    }
    
    func deleteTask(_ task: TripTask) async {
        do {
            try await service.deleteTask(taskId: task.id)
            tasks.removeAll { $0.id == task.id }
        } catch {
            self.error = error
        }
    }
}

struct TasksView: View {
    @StateObject private var viewModel: TasksViewModel
    @State private var showAddTask = false
    
    init(tripId: String, supabase: SupabaseClient) {
        _viewModel = StateObject(wrappedValue: TasksViewModel(tripId: tripId, supabase: supabase))
    }
    
    var body: some View {
        List {
            ForEach(viewModel.tasks) { task in
                TaskRow(task: task) { completed in
                    Task { await viewModel.toggleTask(task, completed: completed) }
                }
                .swipeActions(edge: .trailing, allowsFullSwipe: false) {
                    Button(role: .destructive) {
                        Task { await viewModel.deleteTask(task) }
                    } label: {
                        Label("Delete", systemImage: "trash")
                    }
                }
            }
        }
        .navigationTitle("Tasks")
        .toolbar {
            ToolbarItem(placement: .primaryAction) {
                Button {
                    showAddTask = true
                } label: {
                    Image(systemName: "plus")
                }
            }
        }
        .sheet(isPresented: $showAddTask) {
            AddTaskView(viewModel: viewModel)
        }
        .task {
            await viewModel.loadTasks()
        }
    }
}

struct TaskRow: View {
    let task: TripTask
    let onToggle: (Bool) -> Void
    
    @State private var isCompleted = false
    
    var body: some View {
        HStack(alignment: .top, spacing: 12) {
            Button {
                isCompleted.toggle()
                onToggle(isCompleted)
            } label: {
                Image(systemName: isCompleted ? "checkmark.circle.fill" : "circle")
                    .foregroundColor(isCompleted ? .green : .gray)
                    .font(.title3)
            }
            
            VStack(alignment: .leading, spacing: 4) {
                Text(task.title)
                    .font(.body)
                    .strikethrough(isCompleted)
                
                if let description = task.description {
                    Text(description)
                        .font(.caption)
                        .foregroundColor(.secondary)
                }
                
                HStack {
                    if let due = task.dueAt {
                        Label(due, style: .date)
                            .font(.caption)
                            .foregroundColor(task.isOverdue ? .red : .secondary)
                    }
                    
                    if let statuses = task.statuses, !statuses.isEmpty {
                        Text("\(statuses.filter { $0.completed }.count)/\(statuses.count) completed")
                            .font(.caption)
                            .foregroundColor(.secondary)
                    }
                }
            }
        }
        .padding(.vertical, 4)
        .onAppear {
            // Set initial state from task status
            if let userId = /* current user ID */, let status = task.statuses?.first(where: { $0.userId == userId }) {
                isCompleted = status.completed
            }
        }
    }
}

struct AddTaskView: View {
    @ObservedObject var viewModel: TasksViewModel
    @Environment(\.dismiss) private var dismiss
    
    @State private var title = ""
    @State private var description = ""
    @State private var hasDueDate = false
    @State private var dueDate = Date()
    
    var body: some View {
        NavigationView {
            Form {
                Section("Task Details") {
                    TextField("Title", text: $title)
                    TextField("Description (optional)", text: $description, axis: .vertical)
                }
                
                Section("Due Date") {
                    Toggle("Set Due Date", isOn: $hasDueDate)
                    
                    if hasDueDate {
                        DatePicker("Due", selection: $dueDate, displayedComponents: [.date, .hourAndMinute])
                    }
                }
            }
            .navigationTitle("Add Task")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .cancellationAction) {
                    Button("Cancel") {
                        dismiss()
                    }
                }
                
                ToolbarItem(placement: .confirmationAction) {
                    Button("Add") {
                        Task {
                            await viewModel.createTask(request: CreateTaskRequest(
                                title: title,
                                description: description.isEmpty ? nil : description,
                                dueAt: hasDueDate ? dueDate : nil,
                                isPoll: false,
                                assignedTo: nil
                            ))
                            dismiss()
                        }
                    }
                    .disabled(title.isEmpty)
                }
            }
        }
    }
}
```

---

### Polls View

```swift
// Views/PollsView.swift
@MainActor
class PollsViewModel: ObservableObject {
    @Published var polls: [TripPoll] = []
    @Published var isLoading = false
    @Published var error: Error?
    
    private let tripId: String
    private let service: PollsService
    
    init(tripId: String, supabase: SupabaseClient) {
        self.tripId = tripId
        self.service = PollsService(supabase: supabase)
    }
    
    func loadPolls() async {
        isLoading = true
        error = nil
        
        do {
            polls = try await service.loadPolls(tripId: tripId)
        } catch {
            self.error = error
        }
        
        isLoading = false
    }
    
    func createPoll(question: String, options: [String]) async {
        do {
            let newPoll = try await service.createPoll(tripId: tripId, question: question, options: options)
            polls.insert(newPoll, at: 0)
        } catch {
            self.error = error
        }
    }
    
    func vote(poll: TripPoll, optionId: String) async {
        do {
            try await service.vote(pollId: poll.id, optionId: optionId, currentVersion: poll.version)
            await loadPolls()
        } catch {
            self.error = error
        }
    }
    
    func closePoll(_ poll: TripPoll) async {
        do {
            try await service.closePoll(pollId: poll.id)
            await loadPolls()
        } catch {
            self.error = error
        }
    }
}

struct PollsView: View {
    @StateObject private var viewModel: PollsViewModel
    @State private var showAddPoll = false
    
    init(tripId: String, supabase: SupabaseClient) {
        _viewModel = StateObject(wrappedValue: PollsViewModel(tripId: tripId, supabase: supabase))
    }
    
    var body: some View {
        List {
            ForEach(viewModel.polls) { poll in
                PollCard(poll: poll) { optionId in
                    Task { await viewModel.vote(poll: poll, optionId: optionId) }
                }
            }
        }
        .navigationTitle("Polls")
        .toolbar {
            ToolbarItem(placement: .primaryAction) {
                Button {
                    showAddPoll = true
                } label: {
                    Image(systemName: "plus")
                }
            }
        }
        .sheet(isPresented: $showAddPoll) {
            AddPollView(viewModel: viewModel)
        }
        .task {
            await viewModel.loadPolls()
        }
    }
}

struct PollCard: View {
    let poll: TripPoll
    let onVote: (String) -> Void
    
    @State private var selectedOptionId: String?
    
    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text(poll.question)
                .font(.headline)
            
            ForEach(poll.options) { option in
                Button {
                    selectedOptionId = option.id
                    onVote(option.id)
                } label: {
                    PollOptionRow(
                        option: option,
                        totalVotes: poll.totalVotes,
                        isSelected: selectedOptionId == option.id,
                        userVoted: poll.options.first(where: { $0.id == option.id })?.voters.contains(/* current user ID */) ?? false
                    )
                }
                .buttonStyle(.plain)
                .disabled(poll.status != "active")
            }
            
            HStack {
                Text("\(poll.totalVotes) votes")
                    .font(.caption)
                    .foregroundColor(.secondary)
                
                Spacer()
                
                if poll.status == "closed" {
                    Text("Closed")
                        .font(.caption)
                        .padding(.horizontal, 8)
                        .padding(.vertical, 4)
                        .background(Color.gray.opacity(0.2))
                        .cornerRadius(4)
                }
            }
        }
        .padding()
        .background(Color(.systemGray6))
        .cornerRadius(12)
    }
}

struct PollOptionRow: View {
    let option: PollOption
    let totalVotes: Int
    let isSelected: Bool
    let userVoted: Bool
    
    private var percentage: Double {
        guard totalVotes > 0 else { return 0.0 }
        return Double(option.voteCount) / Double(totalVotes)
    }
    
    var body: some View {
        ZStack(alignment: .leading) {
            // Background bar
            GeometryReader { geometry in
                Rectangle()
                    .fill(Color.blue.opacity(0.2))
                    .frame(width: geometry.size.width * percentage)
            }
            
            HStack {
                Text(option.text)
                    .font(.body)
                
                Spacer()
                
                Text("\(Int(percentage * 100))%")
                    .font(.caption)
                    .foregroundColor(.secondary)
                
                if userVoted {
                    Image(systemName: "checkmark.circle.fill")
                        .foregroundColor(.blue)
                }
            }
            .padding()
        }
        .frame(height: 44)
        .background(Color(.systemBackground))
        .cornerRadius(8)
        .overlay(
            RoundedRectangle(cornerRadius: 8)
                .stroke(isSelected ? Color.blue : Color.clear, lineWidth: 2)
        )
    }
}
```

---

## Testing Checklist

### Tasks
- [ ] Create task inserts to `trip_tasks` table
- [ ] Toggle task status calls RPC with version
- [ ] Optimistic lock prevents concurrent edits (version mismatch error)
- [ ] Task status persists per user
- [ ] Overdue tasks show red due date
- [ ] Completion rate calculates correctly
- [ ] Delete task removes from database
- [ ] Assigned tasks show assignee avatars

### Polls
- [ ] Create poll inserts with options array
- [ ] Vote calls RPC with version
- [ ] Double voting prevented (voter ID already in voters array)
- [ ] Percentage bars update in real-time
- [ ] Closed polls disable voting
- [ ] Total votes increment correctly
- [ ] User's vote marked with checkmark
- [ ] Version conflicts display error

---

**Next:** [06-media-storage-quotas.md](06-media-storage-quotas.md)
