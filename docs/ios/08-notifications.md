# Notifications

**Feature Owner**: Notifications Module  
**Dependencies**: APNs, UNUserNotificationCenter, Supabase

---

## Overview

Chravel sends notifications for broadcasts, new messages, upcoming events, overdue tasks, and payment requests. Notifications use:

1. **Push Notifications (APNs)** for remote alerts
2. **Local Notifications (UNUserNotificationCenter)** for event reminders
3. **In-App Banners** for real-time updates while app is open

---

## 1. Notification Types

### Type Definitions

```swift
enum NotificationType: String, Codable {
    case broadcast
    case message
    case mention
    case eventReminder
    case taskDue
    case taskOverdue
    case paymentRequest
    case tripInvite
    case tripUpdate
}

struct NotificationPayload: Codable {
    let id: UUID
    let type: NotificationType
    let title: String
    let body: String
    let tripId: String?
    let deepLink: String?
    let metadata: [String: String]?
    let priority: NotificationPriority
}

enum NotificationPriority: String, Codable {
    case low
    case normal
    case high
    case critical
}
```

---

## 2. Push Notifications (APNs)

### Setup: Request Authorization

```swift
import UserNotifications

class NotificationManager: NSObject, ObservableObject {
    static let shared = NotificationManager()
    
    @Published var authorizationStatus: UNAuthorizationStatus = .notDetermined
    
    func requestAuthorization() async {
        let center = UNUserNotificationCenter.current()
        
        do {
            let granted = try await center.requestAuthorization(options: [.alert, .sound, .badge])
            
            await MainActor.run {
                authorizationStatus = granted ? .authorized : .denied
            }
            
            if granted {
                await registerForRemoteNotifications()
            }
        } catch {
            print("Error requesting notification authorization: \(error)")
        }
    }
    
    private func registerForRemoteNotifications() async {
        await UIApplication.shared.registerForRemoteNotifications()
    }
}
```

### AppDelegate: Register Device Token

```swift
import UIKit

class AppDelegate: NSObject, UIApplicationDelegate {
    func application(
        _ application: UIApplication,
        didRegisterForRemoteNotificationsWithDeviceToken deviceToken: Data
    ) {
        let token = deviceToken.map { String(format: "%02.2hhx", $0) }.joined()
        print("Device token: \(token)")
        
        // Send token to backend
        Task {
            try? await registerDeviceToken(token: token)
        }
    }
    
    func application(
        _ application: UIApplication,
        didFailToRegisterForRemoteNotificationsWithError error: Error
    ) {
        print("Failed to register for remote notifications: \(error)")
    }
    
    func application(
        _ application: UIApplication,
        didReceiveRemoteNotification userInfo: [AnyHashable: Any],
        fetchCompletionHandler completionHandler: @escaping (UIBackgroundFetchResult) -> Void
    ) {
        // Handle notification payload
        if let payload = parseNotificationPayload(userInfo: userInfo) {
            NotificationManager.shared.handleNotification(payload: payload)
        }
        
        completionHandler(.newData)
    }
}

// Register device token with backend
func registerDeviceToken(token: String) async throws {
    guard let userId = supabase.auth.currentUser?.id else { return }
    
    try await supabase
        .from("device_tokens")
        .upsert([
            "user_id": userId.uuidString,
            "token": token,
            "platform": "ios",
            "updated_at": ISO8601DateFormatter().string(from: Date())
        ])
        .execute()
}
```

### Backend: Send Push Notification

Create Edge Function `supabase/functions/send-push-notification/index.ts`:

```typescript
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { userId, title, body, type, tripId, metadata } = await req.json();
    
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );
    
    // Fetch user's device tokens
    const { data: tokens } = await supabase
      .from("device_tokens")
      .select("token, platform")
      .eq("user_id", userId);
    
    if (!tokens || tokens.length === 0) {
      return new Response(JSON.stringify({ error: "No device tokens found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }
    
    // Send to APNs
    const apnsTokens = tokens.filter(t => t.platform === "ios");
    
    for (const tokenData of apnsTokens) {
      await sendToAPNs({
        token: tokenData.token,
        title,
        body,
        type,
        tripId,
        metadata
      });
    }
    
    return new Response(JSON.stringify({ success: true, sent: apnsTokens.length }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }
});

async function sendToAPNs(payload: any) {
  // Use APNs HTTP/2 API with your certificate
  // Implementation depends on your APNs setup (token-based or certificate-based)
  
  const apnsPayload = {
    aps: {
      alert: {
        title: payload.title,
        body: payload.body
      },
      badge: 1,
      sound: "default",
      "mutable-content": 1
    },
    type: payload.type,
    tripId: payload.tripId,
    metadata: payload.metadata
  };
  
  // Send to APNs server (sandbox or production)
  const apnsUrl = Deno.env.get("APNS_SANDBOX") === "true"
    ? "https://api.sandbox.push.apple.com"
    : "https://api.push.apple.com";
  
  // ... APNs HTTP/2 request implementation
}
```

---

## 3. Local Notifications (Event Reminders)

### Schedule Local Notification

```swift
func scheduleEventReminder(event: TripEvent, minutesBefore: Int = 60) async throws {
    let center = UNUserNotificationCenter.current()
    
    let content = UNMutableNotificationContent()
    content.title = "Upcoming Event"
    content.body = "\(event.title) starts in \(minutesBefore) minutes"
    content.sound = .default
    content.badge = 1
    content.userInfo = [
        "type": "eventReminder",
        "eventId": event.id.uuidString,
        "tripId": event.tripId
    ]
    
    let reminderDate = event.startTime.addingTimeInterval(-Double(minutesBefore * 60))
    let dateComponents = Calendar.current.dateComponents([.year, .month, .day, .hour, .minute], from: reminderDate)
    
    let trigger = UNCalendarNotificationTrigger(dateMatching: dateComponents, repeats: false)
    let request = UNNotificationRequest(
        identifier: "event-\(event.id.uuidString)",
        content: content,
        trigger: trigger
    )
    
    try await center.add(request)
}
```

### Cancel Local Notification

```swift
func cancelEventReminder(eventId: UUID) {
    let center = UNUserNotificationCenter.current()
    center.removePendingNotificationRequests(withIdentifiers: ["event-\(eventId.uuidString)"])
}
```

---

## 4. In-App Notifications

### In-App Banner

```swift
struct InAppNotificationBanner: View {
    let notification: NotificationPayload
    @Binding var isPresented: Bool
    
    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            HStack {
                Image(systemName: iconForType(notification.type))
                    .foregroundColor(colorForPriority(notification.priority))
                
                VStack(alignment: .leading) {
                    Text(notification.title)
                        .font(.headline)
                    Text(notification.body)
                        .font(.caption)
                        .foregroundColor(.secondary)
                }
                
                Spacer()
                
                Button(action: { isPresented = false }) {
                    Image(systemName: "xmark")
                        .foregroundColor(.gray)
                }
            }
            .padding()
            .background(Color(.systemBackground))
            .cornerRadius(12)
            .shadow(radius: 8)
        }
        .padding()
        .transition(.move(edge: .top).combined(with: .opacity))
        .onTapGesture {
            handleNotificationTap(notification)
            isPresented = false
        }
    }
    
    func iconForType(_ type: NotificationType) -> String {
        switch type {
        case .broadcast: return "megaphone.fill"
        case .message: return "message.fill"
        case .mention: return "at"
        case .eventReminder: return "calendar"
        case .taskDue, .taskOverdue: return "checkmark.circle"
        case .paymentRequest: return "dollarsign.circle"
        case .tripInvite: return "envelope.fill"
        case .tripUpdate: return "info.circle"
        }
    }
    
    func colorForPriority(_ priority: NotificationPriority) -> Color {
        switch priority {
        case .low: return .gray
        case .normal: return .blue
        case .high: return .orange
        case .critical: return .red
        }
    }
    
    func handleNotificationTap(_ notification: NotificationPayload) {
        // Deep link to relevant screen
        if let tripId = notification.tripId {
            // Navigate to trip detail
        }
    }
}
```

---

## 5. Notification Preferences

### Data Model

From `src/components/notifications/NotificationPreferences.tsx`:

```swift
struct NotificationPreferences: Codable {
    var enablePush: Bool = true
    var enableEmail: Bool = true
    
    // Per-type toggles
    var broadcasts: Bool = true
    var messages: Bool = true
    var mentions: Bool = true
    var events: Bool = true
    var tasks: Bool = true
    var payments: Bool = true
    
    // Quiet hours
    var quietHoursEnabled: Bool = false
    var quietHoursStart: String = "22:00"
    var quietHoursEnd: String = "08:00"
    
    // Sound & vibration
    var soundEnabled: Bool = true
    var vibrationEnabled: Bool = true
}
```

### API: Update Preferences

```swift
func updateNotificationPreferences(preferences: NotificationPreferences) async throws {
    guard let userId = supabase.auth.currentUser?.id else { return }
    
    let encoder = JSONEncoder()
    let preferencesData = try encoder.encode(preferences)
    let preferencesDict = try JSONSerialization.jsonObject(with: preferencesData) as! [String: Any]
    
    try await supabase
        .from("notification_preferences")
        .upsert([
            "user_id": userId.uuidString,
            "preferences": preferencesDict
        ])
        .execute()
}
```

### UI: Preferences View

```swift
struct NotificationPreferencesView: View {
    @State private var preferences = NotificationPreferences()
    
    var body: some View {
        Form {
            Section(header: Text("Channels")) {
                Toggle("Push Notifications", isOn: $preferences.enablePush)
                Toggle("Email Notifications", isOn: $preferences.enableEmail)
            }
            
            Section(header: Text("Notification Types")) {
                Toggle("Broadcasts", isOn: $preferences.broadcasts)
                Toggle("Messages", isOn: $preferences.messages)
                Toggle("@Mentions", isOn: $preferences.mentions)
                Toggle("Events", isOn: $preferences.events)
                Toggle("Tasks", isOn: $preferences.tasks)
                Toggle("Payments", isOn: $preferences.payments)
            }
            
            Section(header: Text("Quiet Hours")) {
                Toggle("Enable Quiet Hours", isOn: $preferences.quietHoursEnabled)
                
                if preferences.quietHoursEnabled {
                    DatePicker("Start Time", selection: Binding(
                        get: { timeFromString(preferences.quietHoursStart) },
                        set: { preferences.quietHoursStart = stringFromTime($0) }
                    ), displayedComponents: .hourAndMinute)
                    
                    DatePicker("End Time", selection: Binding(
                        get: { timeFromString(preferences.quietHoursEnd) },
                        set: { preferences.quietHoursEnd = stringFromTime($0) }
                    ), displayedComponents: .hourAndMinute)
                }
            }
            
            Section(header: Text("Sound & Vibration")) {
                Toggle("Sound", isOn: $preferences.soundEnabled)
                Toggle("Vibration", isOn: $preferences.vibrationEnabled)
            }
        }
        .navigationTitle("Notification Preferences")
        .task {
            preferences = try? await fetchNotificationPreferences() ?? NotificationPreferences()
        }
        .onChange(of: preferences) { _ in
            Task {
                try? await updateNotificationPreferences(preferences: preferences)
            }
        }
    }
    
    func timeFromString(_ time: String) -> Date {
        let formatter = DateFormatter()
        formatter.dateFormat = "HH:mm"
        return formatter.date(from: time) ?? Date()
    }
    
    func stringFromTime(_ date: Date) -> String {
        let formatter = DateFormatter()
        formatter.dateFormat = "HH:mm"
        return formatter.string(from: date)
    }
}
```

---

## 6. Badge Management

### Update Badge Count

```swift
class BadgeManager: ObservableObject {
    @Published var unreadCount: Int = 0
    
    func updateBadge() {
        Task {
            let count = try? await fetchUnreadCount()
            await MainActor.run {
                unreadCount = count ?? 0
                UIApplication.shared.applicationIconBadgeNumber = unreadCount
            }
        }
    }
    
    func clearBadge() {
        unreadCount = 0
        UIApplication.shared.applicationIconBadgeNumber = 0
    }
}

func fetchUnreadCount() async throws -> Int {
    guard let userId = supabase.auth.currentUser?.id else { return 0 }
    
    // Count unread messages
    let messagesResponse = try await supabase
        .from("trip_chat_messages")
        .select("id", head: true, count: .exact)
        .neq("sender_id", value: userId.uuidString)
        .gt("created_at", value: lastReadTimestamp)
        .execute()
    
    // Count unread broadcasts
    let broadcastsResponse = try await supabase
        .from("broadcasts")
        .select("id", head: true, count: .exact)
        .not("read_by", operator: .contains, value: "{\(userId.uuidString)}")
        .execute()
    
    let messageCount = messagesResponse.count ?? 0
    let broadcastCount = broadcastsResponse.count ?? 0
    
    return messageCount + broadcastCount
}
```

---

## 7. Deep Linking

### Handle Notification Tap

```swift
func handleNotificationTap(userInfo: [AnyHashable: Any]) {
    guard let typeString = userInfo["type"] as? String,
          let type = NotificationType(rawValue: typeString) else {
        return
    }
    
    switch type {
    case .broadcast, .message, .mention:
        if let tripId = userInfo["tripId"] as? String {
            // Navigate to chat
            navigateTo(.chat(tripId: tripId))
        }
        
    case .eventReminder:
        if let eventId = userInfo["eventId"] as? String {
            // Navigate to calendar
            navigateTo(.calendar(eventId: eventId))
        }
        
    case .taskDue, .taskOverdue:
        if let taskId = userInfo["taskId"] as? String {
            // Navigate to tasks
            navigateTo(.tasks(taskId: taskId))
        }
        
    case .paymentRequest:
        if let paymentId = userInfo["paymentId"] as? String {
            // Navigate to payments
            navigateTo(.payments(paymentId: paymentId))
        }
        
    case .tripInvite:
        if let inviteCode = userInfo["inviteCode"] as? String {
            // Navigate to join flow
            navigateTo(.joinTrip(inviteCode: inviteCode))
        }
        
    case .tripUpdate:
        if let tripId = userInfo["tripId"] as? String {
            // Navigate to trip detail
            navigateTo(.tripDetail(tripId: tripId))
        }
    }
}
```

---

## Testing Checklist

- [ ] Push notification authorization request appears on first launch
- [ ] Device token registers with backend
- [ ] Receive push notification for new broadcast
- [ ] Receive push notification for @mention
- [ ] Local notification fires 1 hour before event
- [ ] In-app banner displays for new message while app is open
- [ ] Tapping notification deep links to correct screen
- [ ] Badge count updates with unread messages/broadcasts
- [ ] Quiet hours prevent notifications during set time
- [ ] Per-type notification toggles work
- [ ] Sound and vibration settings apply correctly

---

## Next Steps

- Rich notifications with media attachments
- Notification grouping by trip
- Custom notification sounds per type
- Notification action buttons (e.g., "Reply", "Mark as Read")
- Analytics on notification open rates
