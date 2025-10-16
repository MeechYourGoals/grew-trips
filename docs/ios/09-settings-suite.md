# Settings Suite

**Feature Owner**: Settings Module  
**Dependencies**: All feature modules

---

## Overview

Chravel provides comprehensive settings for both Consumer and Enterprise users, accessible via a unified Settings menu. Settings are organized into logical sections with clear navigation.

---

## 1. Settings Architecture

### Navigation Structure

From `src/components/SettingsMenu.tsx`:

```swift
enum SettingsSection: String, CaseIterable {
    // Consumer sections
    case billingSubscription = "Billing & Subscription"
    case aiConcierge = "AI Concierge"
    case travelWallet = "Travel Wallet"
    case savedRecommendations = "Saved Recommendations"
    case notifications = "Notifications"
    case privacySecurity = "Privacy & Security"
    case generalSettings = "General Settings"
    case archivedTrips = "Archived Trips"
    
    // Enterprise sections (Pro/Event users only)
    case integrations = "Integrations"
    case teamRoles = "Team & Roles"
    case gameSchedule = "Game Schedule"
    case showSchedule = "Show Schedule"
    case enterpriseNotifications = "Enterprise Notifications"
    case enterprisePrivacy = "Enterprise Privacy"
}

struct SettingsMenuItem {
    let section: SettingsSection
    let icon: String
    let description: String
    let requiresPro: Bool
    let requiresEnterprise: Bool
}
```

### Main Settings View

```swift
struct SettingsView: View {
    @EnvironmentObject var authManager: AuthManager
    @State private var selectedSection: SettingsSection?
    
    var availableSections: [SettingsMenuItem] {
        var sections: [SettingsMenuItem] = [
            SettingsMenuItem(section: .billingSubscription, icon: "creditcard", description: "Manage subscription & billing", requiresPro: false, requiresEnterprise: false),
            SettingsMenuItem(section: .aiConcierge, icon: "brain", description: "Configure AI assistant", requiresPro: true, requiresEnterprise: false),
            SettingsMenuItem(section: .travelWallet, icon: "wallet.pass", description: "Loyalty programs & rewards", requiresPro: true, requiresEnterprise: false),
            SettingsMenuItem(section: .savedRecommendations, icon: "bookmark", description: "Your saved places", requiresPro: false, requiresEnterprise: false),
            SettingsMenuItem(section: .notifications, icon: "bell", description: "Notification preferences", requiresPro: false, requiresEnterprise: false),
            SettingsMenuItem(section: .privacySecurity, icon: "lock.shield", description: "Privacy & security settings", requiresPro: false, requiresEnterprise: false),
            SettingsMenuItem(section: .generalSettings, icon: "gear", description: "App preferences", requiresPro: false, requiresEnterprise: false),
            SettingsMenuItem(section: .archivedTrips, icon: "archivebox", description: "View archived trips", requiresPro: false, requiresEnterprise: false)
        ]
        
        // Add enterprise sections if user has organization
        if authManager.hasOrganization {
            sections.append(contentsOf: [
                SettingsMenuItem(section: .integrations, icon: "link", description: "Connected services", requiresPro: false, requiresEnterprise: true),
                SettingsMenuItem(section: .teamRoles, icon: "person.3", description: "Manage team members", requiresPro: false, requiresEnterprise: true),
                SettingsMenuItem(section: .gameSchedule, icon: "sportscourt", description: "Game schedule import", requiresPro: false, requiresEnterprise: true),
                SettingsMenuItem(section: .showSchedule, icon: "theatermasks", description: "Show schedule import", requiresPro: false, requiresEnterprise: true)
            ])
        }
        
        return sections.filter { item in
            if item.requiresEnterprise && !authManager.hasOrganization {
                return false
            }
            if item.requiresPro && !authManager.hasProSubscription {
                return false
            }
            return true
        }
    }
    
    var body: some View {
        NavigationStack {
            List {
                ForEach(availableSections, id: \.section) { item in
                    NavigationLink(value: item.section) {
                        HStack {
                            Image(systemName: item.icon)
                                .frame(width: 32)
                                .foregroundColor(.blue)
                            
                            VStack(alignment: .leading) {
                                Text(item.section.rawValue)
                                    .font(.headline)
                                Text(item.description)
                                    .font(.caption)
                                    .foregroundColor(.secondary)
                            }
                            
                            Spacer()
                            
                            if item.requiresPro && !authManager.hasProSubscription {
                                Text("PRO")
                                    .font(.caption)
                                    .padding(.horizontal, 8)
                                    .padding(.vertical, 4)
                                    .background(Color.blue.opacity(0.2))
                                    .cornerRadius(8)
                            }
                        }
                    }
                }
                
                Section {
                    Button(action: { authManager.signOut() }) {
                        HStack {
                            Image(systemName: "arrow.right.square")
                            Text("Sign Out")
                        }
                        .foregroundColor(.red)
                    }
                }
            }
            .navigationTitle("Settings")
            .navigationDestination(for: SettingsSection.self) { section in
                destinationView(for: section)
            }
        }
    }
    
    @ViewBuilder
    func destinationView(for section: SettingsSection) -> some View {
        switch section {
        case .billingSubscription:
            BillingSubscriptionView()
        case .aiConcierge:
            AIConciergeSettingsView()
        case .travelWallet:
            TravelWalletView()
        case .savedRecommendations:
            SavedRecommendationsView()
        case .notifications:
            NotificationPreferencesView()
        case .privacySecurity:
            PrivacySecurityView()
        case .generalSettings:
            GeneralSettingsView()
        case .archivedTrips:
            ArchivedTripsView()
        case .integrations:
            IntegrationsView()
        case .teamRoles:
            TeamRolesView()
        case .gameSchedule:
            GameScheduleImportView()
        case .showSchedule:
            ShowScheduleImportView()
        case .enterpriseNotifications:
            EnterpriseNotificationsView()
        case .enterprisePrivacy:
            EnterprisePrivacyView()
        }
    }
}
```

---

## 2. Consumer Settings

### 2.1 Billing & Subscription

From `src/components/ConsumerSettings.tsx`:

```swift
struct BillingSubscriptionView: View {
    @State private var subscriptionStatus: SubscriptionStatus?
    @State private var showCheckout = false
    
    var body: some View {
        Form {
            if let status = subscriptionStatus {
                Section(header: Text("Current Plan")) {
                    HStack {
                        VStack(alignment: .leading) {
                            Text(status.planName)
                                .font(.headline)
                            Text(status.isActive ? "Active" : "Inactive")
                                .font(.caption)
                                .foregroundColor(status.isActive ? .green : .red)
                        }
                        Spacer()
                        if status.isActive {
                            Text("$\(status.price, specifier: "%.2f")/mo")
                                .font(.headline)
                        }
                    }
                    
                    if status.isActive, let endDate = status.subscriptionEnd {
                        Text("Renews on \(endDate, style: .date)")
                            .font(.caption)
                            .foregroundColor(.secondary)
                    }
                }
                
                if !status.isActive {
                    Section {
                        Button("Upgrade to Plus") {
                            showCheckout = true
                        }
                        .foregroundColor(.blue)
                    }
                } else {
                    Section {
                        Button("Manage Subscription") {
                            openCustomerPortal()
                        }
                    }
                }
            }
            
            Section(header: Text("Plus Features")) {
                FeatureRow(icon: "infinite", title: "Unlimited Storage", subtitle: "Upload unlimited photos & videos")
                FeatureRow(icon: "brain", title: "AI Concierge", subtitle: "Personalized recommendations")
                FeatureRow(icon: "wallet.pass", title: "Travel Wallet", subtitle: "Loyalty program tracking")
                FeatureRow(icon: "sparkles", title: "Priority Support", subtitle: "Fast response times")
            }
        }
        .navigationTitle("Billing & Subscription")
        .sheet(isPresented: $showCheckout) {
            CheckoutView()
        }
        .task {
            subscriptionStatus = try? await checkSubscription()
        }
    }
}

struct FeatureRow: View {
    let icon: String
    let title: String
    let subtitle: String
    
    var body: some View {
        HStack {
            Image(systemName: icon)
                .frame(width: 32)
                .foregroundColor(.blue)
            VStack(alignment: .leading) {
                Text(title).font(.headline)
                Text(subtitle).font(.caption).foregroundColor(.secondary)
            }
        }
    }
}
```

### 2.2 AI Concierge Settings

```swift
struct AIConciergeSettingsView: View {
    @State private var preferences = AIConciergePreferences()
    
    var body: some View {
        Form {
            Section(header: Text("Dietary Preferences")) {
                MultiSelectList(
                    title: "Select dietary restrictions",
                    options: ["Vegetarian", "Vegan", "Gluten-Free", "Kosher", "Halal", "Dairy-Free", "Nut-Free"],
                    selections: $preferences.dietary
                )
            }
            
            Section(header: Text("Vibe")) {
                MultiSelectList(
                    title: "Select travel vibes",
                    options: ["Relaxing", "Adventure", "Luxury", "Budget", "Family-Friendly", "Nightlife", "Cultural", "Nature"],
                    selections: $preferences.vibe
                )
            }
            
            Section(header: Text("Accessibility")) {
                MultiSelectList(
                    title: "Select accessibility needs",
                    options: ["Wheelchair Accessible", "Hearing Assistance", "Visual Assistance", "Service Animal Friendly"],
                    selections: $preferences.accessibility
                )
            }
            
            Section(header: Text("Budget Range")) {
                HStack {
                    Text("$\(Int(preferences.budgetMin))")
                    Slider(value: $preferences.budgetMin, in: 0...10000, step: 50)
                    Text("$\(Int(preferences.budgetMax))")
                }
            }
        }
        .navigationTitle("AI Concierge")
        .task {
            preferences = try? await fetchAIConciergePreferences() ?? AIConciergePreferences()
        }
        .onChange(of: preferences) { _ in
            Task {
                try? await updateAIConciergePreferences(preferences: preferences)
            }
        }
    }
}

struct AIConciergePreferences: Codable {
    var dietary: [String] = []
    var vibe: [String] = []
    var accessibility: [String] = []
    var budgetMin: Double = 0
    var budgetMax: Double = 1000
}
```

### 2.3 Travel Wallet

```swift
struct TravelWalletView: View {
    @State private var airlines: [AirlineProgram] = []
    @State private var hotels: [HotelProgram] = []
    @State private var rentals: [RentalCarProgram] = []
    @State private var showAddAirline = false
    
    var body: some View {
        Form {
            Section(header: Text("Airlines")) {
                ForEach(airlines) { program in
                    VStack(alignment: .leading) {
                        HStack {
                            Text(program.airline).font(.headline)
                            Spacer()
                            if program.isPreferred {
                                Image(systemName: "star.fill")
                                    .foregroundColor(.yellow)
                            }
                        }
                        Text("\(program.programName) • \(program.membershipNumber)")
                            .font(.caption)
                            .foregroundColor(.secondary)
                        if let tier = program.tier {
                            Text("Tier: \(tier)")
                                .font(.caption)
                                .foregroundColor(.blue)
                        }
                    }
                }
                .onDelete(perform: deleteAirline)
                
                Button(action: { showAddAirline = true }) {
                    Label("Add Airline Program", systemImage: "plus.circle")
                }
            }
            
            Section(header: Text("Hotels")) {
                ForEach(hotels) { program in
                    VStack(alignment: .leading) {
                        HStack {
                            Text(program.hotelChain).font(.headline)
                            Spacer()
                            if program.isPreferred {
                                Image(systemName: "star.fill")
                                    .foregroundColor(.yellow)
                            }
                        }
                        Text("\(program.programName) • \(program.membershipNumber)")
                            .font(.caption)
                            .foregroundColor(.secondary)
                    }
                }
            }
            
            Section(header: Text("Rental Cars")) {
                ForEach(rentals) { program in
                    VStack(alignment: .leading) {
                        Text(program.company).font(.headline)
                        Text("\(program.programName) • \(program.membershipNumber)")
                            .font(.caption)
                            .foregroundColor(.secondary)
                    }
                }
            }
        }
        .navigationTitle("Travel Wallet")
        .sheet(isPresented: $showAddAirline) {
            AddAirlineProgramView()
        }
        .task {
            airlines = try? await fetchAirlinePrograms() ?? []
            hotels = try? await fetchHotelPrograms() ?? []
            rentals = try? await fetchRentalCarPrograms() ?? []
        }
    }
    
    func deleteAirline(at offsets: IndexSet) {
        // Delete from database
    }
}
```

### 2.4 Privacy & Security

```swift
struct PrivacySecurityView: View {
    @State private var settings = PrivacySettings()
    
    var body: some View {
        Form {
            Section(header: Text("Profile Visibility")) {
                Toggle("Show Email", isOn: $settings.showEmail)
                Toggle("Show Phone", isOn: $settings.showPhone)
            }
            
            Section(header: Text("Trip Privacy")) {
                Picker("Default Privacy Mode", selection: $settings.defaultPrivacyMode) {
                    Text("Standard").tag("standard")
                    Text("High").tag("high")
                }
                
                Text("Standard: Normal trip visibility\nHigh: Restricted access, limited AI features")
                    .font(.caption)
                    .foregroundColor(.secondary)
            }
            
            Section(header: Text("AI Access")) {
                Toggle("Allow AI Access to Trip Data", isOn: $settings.aiAccessEnabled)
                
                Text("When enabled, AI can analyze trip data for recommendations")
                    .font(.caption)
                    .foregroundColor(.secondary)
            }
            
            Section(header: Text("Account")) {
                Button("Change Password") {
                    // Navigate to password change
                }
                
                Button("Delete Account", role: .destructive) {
                    // Show confirmation dialog
                }
            }
        }
        .navigationTitle("Privacy & Security")
        .task {
            settings = try? await fetchPrivacySettings() ?? PrivacySettings()
        }
        .onChange(of: settings) { _ in
            Task {
                try? await updatePrivacySettings(settings: settings)
            }
        }
    }
}

struct PrivacySettings: Codable {
    var showEmail: Bool = false
    var showPhone: Bool = false
    var defaultPrivacyMode: String = "standard"
    var aiAccessEnabled: Bool = true
}
```

---

## 3. Enterprise Settings

### 3.1 Team & Roles Management

```swift
struct TeamRolesView: View {
    @State private var members: [OrganizationMember] = []
    @State private var showInvite = false
    
    var body: some View {
        List {
            Section(header: Text("Team Members")) {
                ForEach(members) { member in
                    HStack {
                        VStack(alignment: .leading) {
                            Text(member.displayName).font(.headline)
                            Text(member.email).font(.caption).foregroundColor(.secondary)
                        }
                        Spacer()
                        RoleBadge(role: member.role)
                    }
                }
            }
            
            Section {
                Button(action: { showInvite = true }) {
                    Label("Invite Team Member", systemImage: "person.badge.plus")
                }
            }
        }
        .navigationTitle("Team & Roles")
        .sheet(isPresented: $showInvite) {
            InviteTeamMemberView()
        }
        .task {
            members = try? await fetchOrganizationMembers() ?? []
        }
    }
}

struct RoleBadge: View {
    let role: OrgMemberRole
    
    var body: some View {
        Text(role.rawValue.capitalized)
            .font(.caption)
            .padding(.horizontal, 8)
            .padding(.vertical, 4)
            .background(colorForRole.opacity(0.2))
            .foregroundColor(colorForRole)
            .cornerRadius(8)
    }
    
    var colorForRole: Color {
        switch role {
        case .owner: return .purple
        case .admin: return .blue
        case .member: return .gray
        }
    }
}
```

### 3.2 Integrations

```swift
struct IntegrationsView: View {
    @State private var integrations = [
        Integration(name: "Slack", icon: "message", isConnected: false),
        Integration(name: "Microsoft Teams", icon: "bubble.left.and.bubble.right", isConnected: false),
        Integration(name: "Google Calendar", icon: "calendar", isConnected: true),
        Integration(name: "Concur", icon: "dollarsign.circle", isConnected: false),
        Integration(name: "Sabre", icon: "airplane", isConnected: false)
    ]
    
    var body: some View {
        List {
            ForEach($integrations) { $integration in
                HStack {
                    Image(systemName: integration.icon)
                        .frame(width: 32)
                        .foregroundColor(.blue)
                    
                    Text(integration.name)
                        .font(.headline)
                    
                    Spacer()
                    
                    if integration.isConnected {
                        Text("Connected")
                            .font(.caption)
                            .foregroundColor(.green)
                    }
                    
                    Toggle("", isOn: $integration.isConnected)
                        .labelsHidden()
                }
            }
        }
        .navigationTitle("Integrations")
    }
}

struct Integration: Identifiable {
    let id = UUID()
    var name: String
    var icon: String
    var isConnected: Bool
}
```

---

## Testing Checklist

- [ ] Settings menu displays all available sections
- [ ] Pro-only sections hidden for free users
- [ ] Enterprise sections hidden for non-organization users
- [ ] Billing view shows current subscription status
- [ ] Upgrade to Plus flow works end-to-end
- [ ] Customer portal opens for subscription management
- [ ] AI Concierge preferences save correctly
- [ ] Travel Wallet programs add/edit/delete
- [ ] Privacy toggles apply to profile visibility
- [ ] Notification preferences persist across sessions
- [ ] Team members list loads for organization admins
- [ ] Integrations toggle on/off
- [ ] Sign out clears session and navigates to auth

---

## Next Steps

- Two-factor authentication setup
- Export trip data (GDPR compliance)
- Usage analytics dashboard (for Pro users)
- Referral program integration
- Custom branding for Enterprise (logo, colors)
