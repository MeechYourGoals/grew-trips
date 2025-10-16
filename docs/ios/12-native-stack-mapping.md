# Native Stack Mapping

**Feature Owner**: Core Infrastructure  
**Purpose**: Map web technologies to iOS equivalents

---

## Overview

This guide maps Chravel's React/TypeScript web stack to native iOS (Swift/SwiftUI) patterns.

---

## 1. State Management

### React: TanStack Query → iOS: Combine + async/await

**Web (TanStack Query)**:
```typescript
const { data: trips, isLoading } = useQuery({
  queryKey: ['trips'],
  queryFn: fetchTrips
});
```

**iOS (Combine + async/await)**:
```swift
class TripViewModel: ObservableObject {
    @Published var trips: [Trip] = []
    @Published var isLoading = false
    
    func loadTrips() async {
        isLoading = true
        defer { isLoading = false }
        
        do {
            trips = try await fetchTrips()
        } catch {
            print("Error loading trips: \(error)")
        }
    }
}

// Usage in View
struct TripsView: View {
    @StateObject private var viewModel = TripViewModel()
    
    var body: some View {
        List(viewModel.trips) { trip in
            TripRow(trip: trip)
        }
        .task {
            await viewModel.loadTrips()
        }
    }
}
```

### React: Zustand → iOS: ObservableObject

**Web (Zustand)**:
```typescript
const useStore = create<State>((set) => ({
  user: null,
  setUser: (user) => set({ user })
}));

const { user, setUser } = useStore();
```

**iOS (ObservableObject)**:
```swift
class AppState: ObservableObject {
    @Published var user: User?
    
    func setUser(_ user: User?) {
        self.user = user
    }
}

// Usage
@main
struct ChravelApp: App {
    @StateObject private var appState = AppState()
    
    var body: some Scene {
        WindowGroup {
            ContentView()
                .environmentObject(appState)
        }
    }
}

// In View
struct ProfileView: View {
    @EnvironmentObject var appState: AppState
    
    var body: some View {
        if let user = appState.user {
            Text(user.displayName)
        }
    }
}
```

---

## 2. Routing & Navigation

### React: React Router → iOS: NavigationStack

**Web (React Router)**:
```typescript
<Routes>
  <Route path="/" element={<Home />} />
  <Route path="/trips/:id" element={<TripDetail />} />
  <Route path="/settings" element={<Settings />} />
</Routes>
```

**iOS (NavigationStack)**:
```swift
enum Route: Hashable {
    case home
    case tripDetail(id: String)
    case settings
}

struct AppNavigator: View {
    @State private var path = NavigationPath()
    
    var body: some View {
        NavigationStack(path: $path) {
            HomeView()
                .navigationDestination(for: Route.self) { route in
                    switch route {
                    case .home:
                        HomeView()
                    case .tripDetail(let id):
                        TripDetailView(tripId: id)
                    case .settings:
                        SettingsView()
                    }
                }
        }
    }
    
    func navigate(to route: Route) {
        path.append(route)
    }
    
    func pop() {
        path.removeLast()
    }
}
```

---

## 3. UI Components

### React: Tailwind CSS → iOS: SwiftUI Modifiers

**Web (Tailwind)**:
```tsx
<button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
  Click Me
</button>
```

**iOS (SwiftUI)**:
```swift
Button("Click Me") {
    // Action
}
.padding(.horizontal, 16)
.padding(.vertical, 8)
.background(Color.blue)
.foregroundColor(.white)
.cornerRadius(12)
```

### Design System (index.css → Swift Extensions)

**Web (CSS Variables)**:
```css
:root {
  --primary: 210 100% 50%;
  --secondary: 220 90% 60%;
  --background: 0 0% 98%;
}
```

**iOS (Color Extensions)**:
```swift
extension Color {
    static let primary = Color(hue: 210/360, saturation: 1.0, brightness: 0.5)
    static let secondary = Color(hue: 220/360, saturation: 0.9, brightness: 0.6)
    static let customBackground = Color(hue: 0, saturation: 0, brightness: 0.98)
}
```

---

## 4. Forms & Validation

### React: React Hook Form + Zod → iOS: SwiftUI + Validation

**Web**:
```typescript
const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});

const { register, handleSubmit } = useForm({
  resolver: zodResolver(schema)
});
```

**iOS**:
```swift
struct LoginForm: View {
    @State private var email = ""
    @State private var password = ""
    @State private var emailError: String?
    @State private var passwordError: String?
    
    var body: some View {
        Form {
            TextField("Email", text: $email)
                .textContentType(.emailAddress)
                .autocapitalization(.none)
                .onChange(of: email) { _ in validateEmail() }
            
            if let emailError = emailError {
                Text(emailError).foregroundColor(.red).font(.caption)
            }
            
            SecureField("Password", text: $password)
                .onChange(of: password) { _ in validatePassword() }
            
            if let passwordError = passwordError {
                Text(passwordError).foregroundColor(.red).font(.caption)
            }
            
            Button("Submit") {
                if validate() {
                    submit()
                }
            }
            .disabled(!isValid)
        }
    }
    
    func validateEmail() {
        if !email.contains("@") {
            emailError = "Invalid email"
        } else {
            emailError = nil
        }
    }
    
    func validatePassword() {
        if password.count < 8 {
            passwordError = "Password must be at least 8 characters"
        } else {
            passwordError = nil
        }
    }
    
    var isValid: Bool {
        emailError == nil && passwordError == nil && !email.isEmpty && !password.isEmpty
    }
}
```

---

## 5. Lists & Scrolling

### React: Virtual List → iOS: LazyVStack/LazyHStack

**Web (react-window)**:
```tsx
<VirtualList
  height={600}
  itemCount={trips.length}
  itemSize={80}
>
  {({ index, style }) => (
    <div style={style}>
      <TripRow trip={trips[index]} />
    </div>
  )}
</VirtualList>
```

**iOS (LazyVStack)**:
```swift
ScrollView {
    LazyVStack(spacing: 16) {
        ForEach(trips) { trip in
            TripRow(trip: trip)
        }
    }
    .padding()
}
```

---

## 6. Capacitor Plugins → Native iOS

| Capacitor Plugin | iOS Native Equivalent | Implementation |
|------------------|----------------------|----------------|
| **Camera** | `UIImagePickerController` or `PhotosUI` | `PhotosPicker` in SwiftUI |
| **Filesystem** | `FileManager` | `FileManager.default.urls(for:in:)` |
| **Geolocation** | `CoreLocation` | `CLLocationManager` |
| **Haptics** | `UIImpactFeedbackGenerator` | `UIImpactFeedbackGenerator().impactOccurred()` |
| **Local Notifications** | `UNUserNotificationCenter` | `UNUserNotificationCenter.current()` |
| **Push Notifications** | APNs + `UNUserNotificationCenter` | `UIApplication.registerForRemoteNotifications()` |
| **Share** | `UIActivityViewController` | `ShareLink` in SwiftUI |
| **StatusBar** | `UIApplication.statusBarStyle` | Set in Info.plist or via UIKit bridge |

### Example: Camera

**Web (Capacitor)**:
```typescript
const image = await Camera.getPhoto({
  quality: 90,
  allowEditing: true,
  resultType: CameraResultType.DataUrl
});
```

**iOS (PhotosPicker)**:
```swift
import PhotosUI

struct ImagePicker: View {
    @State private var selectedItem: PhotosPickerItem?
    @State private var selectedImage: UIImage?
    
    var body: some View {
        VStack {
            if let selectedImage = selectedImage {
                Image(uiImage: selectedImage)
                    .resizable()
                    .scaledToFit()
            }
            
            PhotosPicker(selection: $selectedItem, matching: .images) {
                Label("Select Photo", systemImage: "photo")
            }
        }
        .onChange(of: selectedItem) { newItem in
            Task {
                if let data = try? await newItem?.loadTransferable(type: Data.self),
                   let uiImage = UIImage(data: data) {
                    selectedImage = uiImage
                }
            }
        }
    }
}
```

### Example: Share

**Web (Capacitor)**:
```typescript
await Share.share({
  title: 'Join My Trip',
  text: 'Check out this trip!',
  url: 'https://chravel.app/trip/123'
});
```

**iOS (ShareLink)**:
```swift
ShareLink(item: URL(string: "https://chravel.app/trip/123")!) {
    Label("Share Trip", systemImage: "square.and.arrow.up")
}
```

### Example: Haptics

**Web (Capacitor)**:
```typescript
import { Haptics, ImpactStyle } from '@capacitor/haptics';

await Haptics.impact({ style: ImpactStyle.Medium });
```

**iOS (UIKit)**:
```swift
import UIKit

let generator = UIImpactFeedbackGenerator(style: .medium)
generator.impactOccurred()
```

---

## 7. API Calls

### React: fetch/axios → iOS: async/await + URLSession

**Web**:
```typescript
const response = await fetch('/api/trips', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ name: 'Trip' })
});
const data = await response.json();
```

**iOS (URLSession)**:
```swift
func createTrip(name: String) async throws -> Trip {
    let url = URL(string: "https://api.chravel.app/trips")!
    var request = URLRequest(url: url)
    request.httpMethod = "POST"
    request.setValue("application/json", forHTTPHeaderField: "Content-Type")
    
    let body = ["name": name]
    request.httpBody = try JSONEncoder().encode(body)
    
    let (data, response) = try await URLSession.shared.data(for: request)
    
    guard let httpResponse = response as? HTTPURLResponse,
          (200...299).contains(httpResponse.statusCode) else {
        throw NetworkError.invalidResponse
    }
    
    return try JSONDecoder().decode(Trip.self, from: data)
}
```

**Better: Use Supabase SDK**:
```swift
let response = try await supabase
    .from("trips")
    .insert(["name": name])
    .select()
    .single()
    .execute()

let trip = try JSONDecoder().decode(Trip.self, from: response.data)
```

---

## 8. Animations

### React: Framer Motion → iOS: withAnimation

**Web**:
```tsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.3 }}
>
  Content
</motion.div>
```

**iOS**:
```swift
struct AnimatedView: View {
    @State private var isVisible = false
    
    var body: some View {
        Text("Content")
            .opacity(isVisible ? 1 : 0)
            .offset(y: isVisible ? 0 : 20)
            .onAppear {
                withAnimation(.easeInOut(duration: 0.3)) {
                    isVisible = true
                }
            }
    }
}
```

---

## 9. Modals & Sheets

### React: Dialog/Modal → iOS: .sheet/.fullScreenCover

**Web**:
```tsx
<Dialog open={isOpen} onOpenChange={setIsOpen}>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Modal Title</DialogTitle>
    </DialogHeader>
    Modal content
  </DialogContent>
</Dialog>
```

**iOS**:
```swift
struct ContentView: View {
    @State private var showModal = false
    
    var body: some View {
        Button("Show Modal") {
            showModal = true
        }
        .sheet(isPresented: $showModal) {
            ModalView()
        }
    }
}

struct ModalView: View {
    @Environment(\.dismiss) private var dismiss
    
    var body: some View {
        NavigationView {
            VStack {
                Text("Modal content")
            }
            .navigationTitle("Modal Title")
            .toolbar {
                ToolbarItem(placement: .navigationBarLeading) {
                    Button("Close") {
                        dismiss()
                    }
                }
            }
        }
    }
}
```

---

## 10. Context & Dependency Injection

### React: Context API → iOS: EnvironmentObject

**Web**:
```typescript
const ThemeContext = createContext<Theme>(defaultTheme);

<ThemeContext.Provider value={theme}>
  <App />
</ThemeContext.Provider>

const theme = useContext(ThemeContext);
```

**iOS**:
```swift
class ThemeManager: ObservableObject {
    @Published var theme: Theme = .light
}

@main
struct ChravelApp: App {
    @StateObject private var themeManager = ThemeManager()
    
    var body: some Scene {
        WindowGroup {
            ContentView()
                .environmentObject(themeManager)
        }
    }
}

struct ContentView: View {
    @EnvironmentObject var themeManager: ThemeManager
    
    var body: some View {
        Text("Theme: \(themeManager.theme.rawValue)")
    }
}
```

---

## 11. Date/Time Handling

### React: date-fns → iOS: Foundation

**Web**:
```typescript
import { format, parseISO } from 'date-fns';

const formatted = format(new Date(), 'MMM dd, yyyy');
```

**iOS**:
```swift
let formatter = DateFormatter()
formatter.dateFormat = "MMM dd, yyyy"
let formatted = formatter.string(from: Date())

// Or use relative formatting
Text(date, style: .relative) // "2 hours ago"
Text(date, style: .date) // "Jan 15, 2025"
```

---

## 12. Testing

### React: Jest/Vitest → iOS: XCTest

**Web**:
```typescript
describe('Trip', () => {
  it('should calculate status correctly', () => {
    const trip = { startDate: '2025-01-20', endDate: '2025-01-25' };
    expect(getStatus(trip)).toBe('upcoming');
  });
});
```

**iOS**:
```swift
import XCTest
@testable import Chravel

class TripTests: XCTestCase {
    func testStatusCalculation() throws {
        let trip = Trip(
            id: "1",
            startDate: Date.from("2025-01-20"),
            endDate: Date.from("2025-01-25")
        )
        
        XCTAssertEqual(trip.status, .upcoming)
    }
}
```

---

## Summary Table

| Web Technology | iOS Equivalent | Notes |
|---------------|----------------|-------|
| React Components | SwiftUI Views | Declarative UI |
| TanStack Query | Combine + async/await | Data fetching |
| Zustand | ObservableObject | Global state |
| React Router | NavigationStack | Navigation |
| Tailwind CSS | SwiftUI Modifiers | Styling |
| Capacitor Camera | PhotosPicker | Native camera |
| Capacitor Share | ShareLink | Native sharing |
| Framer Motion | withAnimation | Animations |
| Context API | EnvironmentObject | Dependency injection |
| date-fns | DateFormatter | Date formatting |
| Jest/Vitest | XCTest | Unit testing |

---

## Best Practices

1. **Leverage SwiftUI's declarative nature** - Don't try to replicate React's lifecycle, use SwiftUI's .task, .onAppear, etc.
2. **Use Combine for reactive streams** - Map observable publishers to @Published properties
3. **Embrace Swift's type safety** - Use enums, structs, and protocols extensively
4. **Follow Apple's Human Interface Guidelines** - iOS has different UX patterns than web
5. **Use native navigation patterns** - Tab bars, navigation bars, modals instead of web routing
6. **Optimize for mobile** - Smaller screens, touch targets, gestures
7. **Handle offline gracefully** - Mobile connections are less reliable

---

## Next Steps

- Performance profiling with Instruments
- Memory leak detection
- SwiftUI preview optimization
- Modularization with Swift Packages
- CI/CD with Xcode Cloud or Fastlane
