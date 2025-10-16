# 04: Calendar & Itinerary

## Overview

The calendar system allows users to create events with **conflict detection**, categorize events, and view them in a grouped itinerary format. The iOS app must replicate the behavior from `src/services/calendarService.ts` and `src/components/ItineraryView.tsx`.

---

## Data Model

```swift
// Models/TripEvent.swift
enum EventCategory: String, Codable, CaseIterable {
    case accommodation = "accommodation"
    case food = "food"
    case transportation = "transportation"
    case activity = "activity"
    case entertainment = "entertainment"
    case other = "other"
    
    var icon: String {
        switch self {
        case .accommodation: return "bed.double"
        case .food: return "fork.knife"
        case .transportation: return "car"
        case .activity: return "figure.walk"
        case .entertainment: return "theatermasks"
        case .other: return "calendar"
        }
    }
    
    var color: Color {
        switch self {
        case .accommodation: return .purple
        case .food: return .orange
        case .transportation: return .blue
        case .activity: return .green
        case .entertainment: return .pink
        case .other: return .gray
        }
    }
}

struct TripEvent: Identifiable, Codable {
    let id: String
    let tripId: String
    let title: String
    let description: String?
    let location: String?
    let startTime: Date
    let endTime: Date?
    let eventCategory: EventCategory
    let includeInItinerary: Bool
    let sourceType: String // "manual", "ai_extracted", "places_tab"
    let sourceData: [String: AnyCodable]?
    let createdBy: String
    let createdAt: Date
    let updatedAt: Date
    let version: Int
    
    var duration: String {
        guard let end = endTime else { return "All day" }
        let interval = end.timeIntervalSince(startTime)
        let hours = Int(interval / 3600)
        let minutes = Int((interval.truncatingRemainder(dividingBy: 3600)) / 60)
        
        if hours > 0 {
            return "\(hours)h \(minutes)m"
        } else {
            return "\(minutes)m"
        }
    }
    
    enum CodingKeys: String, CodingKey {
        case id
        case tripId = "trip_id"
        case title, description, location
        case startTime = "start_time"
        case endTime = "end_time"
        case eventCategory = "event_category"
        case includeInItinerary = "include_in_itinerary"
        case sourceType = "source_type"
        case sourceData = "source_data"
        case createdBy = "created_by"
        case createdAt = "created_at"
        case updatedAt = "updated_at"
        case version
    }
}

// Helper for dynamic JSON
struct AnyCodable: Codable {
    let value: Any
    
    init(_ value: Any) {
        self.value = value
    }
    
    init(from decoder: Decoder) throws {
        let container = try decoder.singleValueContainer()
        if let string = try? container.decode(String.self) {
            value = string
        } else if let int = try? container.decode(Int.self) {
            value = int
        } else if let double = try? container.decode(Double.self) {
            value = double
        } else if let bool = try? container.decode(Bool.self) {
            value = bool
        } else {
            value = [:]
        }
    }
    
    func encode(to encoder: Encoder) throws {
        var container = encoder.singleValueContainer()
        try container.encode(String(describing: value))
    }
}
```

---

## Conflict Detection

The web app uses an RPC function `create_event_with_conflict_check` defined in the database. iOS should call this same function:

```swift
// Services/CalendarService.swift
class CalendarService {
    private let supabase: SupabaseClient
    
    init(supabase: SupabaseClient) {
        self.supabase = supabase
    }
    
    func createEventWithConflictCheck(
        tripId: String,
        title: String,
        description: String?,
        location: String?,
        startTime: Date,
        endTime: Date?,
        category: EventCategory
    ) async throws -> String {
        let userId = supabase.auth.currentUser?.id ?? ""
        
        // Call RPC function that checks for overlapping events
        let response: [String: String] = try await supabase
            .rpc("create_event_with_conflict_check", params: [
                "p_trip_id": tripId,
                "p_title": title,
                "p_description": description ?? "",
                "p_location": location ?? "",
                "p_start_time": ISO8601DateFormatter().string(from: startTime),
                "p_end_time": endTime != nil ? ISO8601DateFormatter().string(from: endTime!) : nil,
                "p_created_by": userId
            ])
            .execute()
            .value
        
        guard let eventId = response["id"] else {
            throw NSError(domain: "CalendarError", code: -1, userInfo: [NSLocalizedDescriptionKey: "Failed to create event"])
        }
        
        return eventId
    }
    
    func loadEvents(tripId: String) async throws -> [TripEvent] {
        let events: [TripEvent] = try await supabase
            .from("trip_events")
            .select()
            .eq("trip_id", value: tripId)
            .eq("include_in_itinerary", value: true)
            .order("start_time", ascending: true)
            .execute()
            .value
        
        return events
    }
    
    func updateEvent(eventId: String, updates: [String: Any]) async throws {
        try await supabase
            .from("trip_events")
            .update(updates)
            .eq("id", value: eventId)
            .execute()
    }
    
    func deleteEvent(eventId: String) async throws {
        try await supabase
            .from("trip_events")
            .delete()
            .eq("id", value: eventId)
            .execute()
    }
}
```

---

## View Model

```swift
// ViewModels/CalendarViewModel.swift
@MainActor
class CalendarViewModel: ObservableObject {
    @Published var events: [TripEvent] = []
    @Published var groupedEvents: [Date: [TripEvent]] = [:]
    @Published var isLoading = false
    @Published var error: Error?
    @Published var selectedDate: Date = Date()
    
    private let tripId: String
    private let service: CalendarService
    
    init(tripId: String, supabase: SupabaseClient) {
        self.tripId = tripId
        self.service = CalendarService(supabase: supabase)
    }
    
    func loadEvents() async {
        isLoading = true
        error = nil
        
        do {
            events = try await service.loadEvents(tripId: tripId)
            groupEventsByDate()
        } catch {
            self.error = error
        }
        
        isLoading = false
    }
    
    func createEvent(
        title: String,
        description: String?,
        location: String?,
        startTime: Date,
        endTime: Date?,
        category: EventCategory
    ) async {
        do {
            _ = try await service.createEventWithConflictCheck(
                tripId: tripId,
                title: title,
                description: description,
                location: location,
                startTime: startTime,
                endTime: endTime,
                category: category
            )
            
            await loadEvents()
            
        } catch {
            self.error = error
        }
    }
    
    func deleteEvent(_ event: TripEvent) async {
        do {
            try await service.deleteEvent(eventId: event.id)
            events.removeAll { $0.id == event.id }
            groupEventsByDate()
        } catch {
            self.error = error
        }
    }
    
    private func groupEventsByDate() {
        let calendar = Calendar.current
        groupedEvents = Dictionary(grouping: events) { event in
            calendar.startOfDay(for: event.startTime)
        }
    }
}
```

---

## SwiftUI Views

### Calendar View

```swift
// Views/CalendarView.swift
struct CalendarView: View {
    @StateObject private var viewModel: CalendarViewModel
    @State private var showAddEvent = false
    
    init(tripId: String, supabase: SupabaseClient) {
        _viewModel = StateObject(wrappedValue: CalendarViewModel(tripId: tripId, supabase: supabase))
    }
    
    var body: some View {
        VStack(spacing: 0) {
            // Calendar header
            DatePicker(
                "Select Date",
                selection: $viewModel.selectedDate,
                displayedComponents: .date
            )
            .datePickerStyle(.graphical)
            .padding()
            
            Divider()
            
            // Events for selected date
            if viewModel.isLoading {
                ProgressView()
                    .frame(maxHeight: .infinity)
            } else {
                ScrollView {
                    LazyVStack(spacing: 16) {
                        ForEach(eventsForSelectedDate) { event in
                            EventCard(event: event) {
                                Task { await viewModel.deleteEvent(event) }
                            }
                        }
                    }
                    .padding()
                }
            }
        }
        .navigationTitle("Calendar")
        .toolbar {
            ToolbarItem(placement: .primaryAction) {
                Button {
                    showAddEvent = true
                } label: {
                    Image(systemName: "plus")
                }
            }
        }
        .sheet(isPresented: $showAddEvent) {
            AddEventView(viewModel: viewModel)
        }
        .task {
            await viewModel.loadEvents()
        }
    }
    
    private var eventsForSelectedDate: [TripEvent] {
        let calendar = Calendar.current
        let startOfDay = calendar.startOfDay(for: viewModel.selectedDate)
        return viewModel.groupedEvents[startOfDay] ?? []
    }
}
```

### Event Card

```swift
struct EventCard: View {
    let event: TripEvent
    let onDelete: () -> Void
    
    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            HStack {
                // Category icon
                Image(systemName: event.eventCategory.icon)
                    .foregroundColor(event.eventCategory.color)
                    .font(.title3)
                
                VStack(alignment: .leading, spacing: 2) {
                    Text(event.title)
                        .font(.headline)
                    
                    Text(event.startTime, style: .time)
                        .font(.subheadline)
                        .foregroundColor(.secondary)
                }
                
                Spacer()
                
                // Duration badge
                Text(event.duration)
                    .font(.caption)
                    .padding(.horizontal, 8)
                    .padding(.vertical, 4)
                    .background(event.eventCategory.color.opacity(0.2))
                    .foregroundColor(event.eventCategory.color)
                    .cornerRadius(8)
            }
            
            if let location = event.location {
                HStack {
                    Image(systemName: "mappin.circle.fill")
                        .font(.caption)
                        .foregroundColor(.secondary)
                    Text(location)
                        .font(.caption)
                        .foregroundColor(.secondary)
                }
            }
            
            if let description = event.description {
                Text(description)
                    .font(.subheadline)
                    .foregroundColor(.secondary)
            }
        }
        .padding()
        .background(Color(.systemGray6))
        .cornerRadius(12)
        .contextMenu {
            Button("Edit", systemImage: "pencil") {
                // Show edit sheet
            }
            
            Button("Delete", systemImage: "trash", role: .destructive) {
                onDelete()
            }
        }
    }
}
```

### Add Event View

```swift
struct AddEventView: View {
    @ObservedObject var viewModel: CalendarViewModel
    @Environment(\.dismiss) private var dismiss
    
    @State private var title = ""
    @State private var description = ""
    @State private var location = ""
    @State private var startTime = Date()
    @State private var endTime = Date().addingTimeInterval(3600)
    @State private var category: EventCategory = .activity
    @State private var hasEndTime = true
    
    var body: some View {
        NavigationView {
            Form {
                Section("Event Details") {
                    TextField("Title", text: $title)
                    TextField("Description (optional)", text: $description, axis: .vertical)
                        .lineLimit(3...6)
                }
                
                Section("Time") {
                    DatePicker("Start", selection: $startTime)
                    
                    Toggle("End Time", isOn: $hasEndTime)
                    
                    if hasEndTime {
                        DatePicker("End", selection: $endTime)
                    }
                }
                
                Section("Location") {
                    TextField("Location (optional)", text: $location)
                }
                
                Section("Category") {
                    Picker("Category", selection: $category) {
                        ForEach(EventCategory.allCases, id: \.self) { cat in
                            Label(cat.rawValue.capitalized, systemImage: cat.icon)
                                .tag(cat)
                        }
                    }
                }
            }
            .navigationTitle("Add Event")
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
                            await viewModel.createEvent(
                                title: title,
                                description: description.isEmpty ? nil : description,
                                location: location.isEmpty ? nil : location,
                                startTime: startTime,
                                endTime: hasEndTime ? endTime : nil,
                                category: category
                            )
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

## Itinerary View (Grouped by Day)

```swift
// Views/ItineraryView.swift
struct ItineraryView: View {
    @StateObject private var viewModel: CalendarViewModel
    
    init(tripId: String, supabase: SupabaseClient) {
        _viewModel = StateObject(wrappedValue: CalendarViewModel(tripId: tripId, supabase: supabase))
    }
    
    var body: some View {
        ScrollView {
            LazyVStack(spacing: 24, pinnedViews: [.sectionHeaders]) {
                ForEach(sortedDates, id: \.self) { date in
                    Section {
                        LazyVStack(spacing: 12) {
                            ForEach(viewModel.groupedEvents[date] ?? []) { event in
                                EventCard(event: event) {
                                    Task { await viewModel.deleteEvent(event) }
                                }
                            }
                        }
                    } header: {
                        DayHeader(date: date)
                    }
                }
            }
            .padding()
        }
        .navigationTitle("Itinerary")
        .task {
            await viewModel.loadEvents()
        }
    }
    
    private var sortedDates: [Date] {
        viewModel.groupedEvents.keys.sorted()
    }
}

struct DayHeader: View {
    let date: Date
    
    var body: some View {
        HStack {
            VStack(alignment: .leading, spacing: 2) {
                Text(date, format: .dateTime.weekday(.wide))
                    .font(.headline)
                Text(date, format: .dateTime.month().day())
                    .font(.subheadline)
                    .foregroundColor(.secondary)
            }
            
            Spacer()
        }
        .padding()
        .background(Color(.systemBackground))
    }
}
```

---

## Local Notifications for Reminders

```swift
// Services/NotificationService.swift
import UserNotifications

class NotificationService {
    func scheduleEventReminder(event: TripEvent, minutesBefore: Int = 30) async throws {
        let center = UNUserNotificationCenter.current()
        
        // Request authorization
        try await center.requestAuthorization(options: [.alert, .sound, .badge])
        
        // Create notification content
        let content = UNMutableNotificationContent()
        content.title = "Upcoming: \(event.title)"
        content.body = event.location ?? "No location"
        content.sound = .default
        content.userInfo = ["event_id": event.id]
        
        // Calculate trigger time
        let triggerDate = event.startTime.addingTimeInterval(-Double(minutesBefore * 60))
        let components = Calendar.current.dateComponents([.year, .month, .day, .hour, .minute], from: triggerDate)
        let trigger = UNCalendarNotificationTrigger(dateMatching: components, repeats: false)
        
        // Create request
        let request = UNNotificationRequest(
            identifier: "event-\(event.id)",
            content: content,
            trigger: trigger
        )
        
        try await center.add(request)
    }
    
    func cancelEventReminder(eventId: String) {
        UNUserNotificationCenter.current().removePendingNotificationRequests(withIdentifiers: ["event-\(eventId)"])
    }
}
```

---

## Testing Checklist

- [ ] Create event calls RPC with conflict detection
- [ ] Conflict error displays when overlapping events exist
- [ ] Events load sorted by `start_time`
- [ ] Grouped events display under correct date headers
- [ ] Event categories show correct icon and color
- [ ] Duration calculation displays hours/minutes correctly
- [ ] All-day events (no end time) show "All day"
- [ ] Edit event updates database
- [ ] Delete event removes from UI and database
- [ ] Local notifications scheduled 30 minutes before event
- [ ] Notification taps open app to event details
- [ ] Calendar picker navigates to selected date
- [ ] Empty state shows when no events for selected date

---

**Next:** [05-tasks-polls.md](05-tasks-polls.md)
