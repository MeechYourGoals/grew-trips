# Billing & Subscription

**Feature Owner**: Billing Module  
**Dependencies**: Stripe, Supabase Edge Functions

---

## Overview

Chravel uses Stripe for subscription management via Supabase Edge Functions. The iOS app calls existing backend functions for checkout, subscription status, and portal access.

---

## 1. Subscription Tiers

### Consumer Plans

```swift
enum ConsumerPlan: String, Codable {
    case free = "Free"
    case plus = "Plus"
    
    var price: Double {
        switch self {
        case .free: return 0
        case .plus: return 9.99
        }
    }
    
    var features: [String] {
        switch self {
        case .free:
            return [
                "Up to 10 trips",
                "500MB storage",
                "Basic collaboration",
                "Standard support"
            ]
        case .plus:
            return [
                "Unlimited trips",
                "Unlimited storage (50GB soft cap)",
                "AI Concierge",
                "Travel Wallet",
                "Priority support"
            ]
        }
    }
}
```

### Organization Plans

From `src/types/pro.ts`:

```swift
enum OrganizationPlan: String, Codable {
    case starter = "Starter Pro"
    case growing = "Growth Pro"
    case enterprise = "Enterprise Pro"
    case enterprisePlus = "Enterprise Plus"
    
    var price: String {
        switch self {
        case .starter: return "$49"
        case .growing: return "$199"
        case .enterprise: return "$499"
        case .enterprisePlus: return "Contact Sales"
        }
    }
    
    var seatLimit: Int {
        switch self {
        case .starter: return 25
        case .growing: return 100
        case .enterprise: return 500
        case .enterprisePlus: return 999
        }
    }
    
    var features: [String] {
        switch self {
        case .starter:
            return [
                "Up to 25 team members",
                "Multi-city tour management",
                "Advanced team roles & permissions",
                "Broadcast messaging with translation",
                "Shared itinerary building",
                "Travel wallet integration",
                "Basic compliance tools",
                "Email support"
            ]
        case .growing:
            return [
                "Up to 100 team members",
                "Advanced role management",
                "Multi-language broadcast system",
                "Travel booking integrations (Saber, Concur)",
                "Financial tools integration",
                "Travel wallet & rewards tracking",
                "Advanced compliance & reporting",
                "Priority phone support",
                "Custom branding options",
                "Usage analytics & reporting"
            ]
        case .enterprise:
            return [
                "Up to 500 team members",
                "Full SSO/MFA integration",
                "Advanced integrations & APIs",
                "GDPR compliance suite",
                "White-label options",
                "Advanced security features",
                "Priority support",
                "Custom branding",
                "Advanced analytics",
                "Dedicated account manager"
            ]
        case .enterprisePlus:
            return [
                "Unlimited team members",
                "Full SSO/MFA integration",
                "Custom integrations & APIs",
                "GDPR compliance suite",
                "White-label options",
                "Advanced security features",
                "Custom feature development",
                "24/7 dedicated support",
                "On-premise deployment options",
                "Custom SLA agreements",
                "Quarterly business reviews",
                "Executive support line"
            ]
        }
    }
}
```

---

## 2. Subscription Status Management

### Data Model

```swift
struct SubscriptionStatus: Codable {
    let subscribed: Bool
    let productId: String?
    let subscriptionEnd: Date?
    
    var planName: String {
        guard let productId = productId else { return "Free" }
        
        // Map Stripe product IDs to plan names
        switch productId {
        case "prod_consumer_plus":
            return "Plus"
        case "prod_starter_pro":
            return "Starter Pro"
        case "prod_growing_pro":
            return "Growth Pro"
        case "prod_enterprise_pro":
            return "Enterprise Pro"
        default:
            return "Free"
        }
    }
    
    var isActive: Bool {
        guard subscribed, let endDate = subscriptionEnd else { return false }
        return endDate > Date()
    }
}
```

### API: Check Subscription

Calls existing Edge Function `supabase/functions/check-subscription`:

```swift
func checkSubscription() async throws -> SubscriptionStatus {
    let response = try await supabase.functions
        .invoke("check-subscription")
    
    let data = response.data
    let decoder = JSONDecoder()
    decoder.dateDecodingStrategy = .iso8601
    
    return try decoder.decode(SubscriptionStatus.self, from: data)
}
```

### Periodic Status Check

```swift
class SubscriptionManager: ObservableObject {
    @Published var status: SubscriptionStatus?
    @Published var isLoading = false
    
    private var timer: Timer?
    
    func startPeriodicCheck(interval: TimeInterval = 60) {
        // Initial check
        Task {
            await refreshStatus()
        }
        
        // Periodic refresh every 60 seconds
        timer = Timer.scheduledTimer(withTimeInterval: interval, repeats: true) { [weak self] _ in
            Task {
                await self?.refreshStatus()
            }
        }
    }
    
    func stopPeriodicCheck() {
        timer?.invalidate()
        timer = nil
    }
    
    @MainActor
    func refreshStatus() async {
        isLoading = true
        defer { isLoading = false }
        
        do {
            status = try await checkSubscription()
        } catch {
            print("Failed to check subscription: \(error)")
        }
    }
}
```

### Usage in App

```swift
@main
struct ChravelApp: App {
    @StateObject private var subscriptionManager = SubscriptionManager()
    
    var body: some Scene {
        WindowGroup {
            ContentView()
                .environmentObject(subscriptionManager)
                .onAppear {
                    subscriptionManager.startPeriodicCheck()
                }
                .onDisappear {
                    subscriptionManager.stopPeriodicCheck()
                }
        }
    }
}
```

---

## 3. Stripe Checkout Flow

### API: Create Checkout Session

Calls existing Edge Function `supabase/functions/create-checkout`:

```swift
func createCheckout(priceId: String) async throws -> URL {
    let response = try await supabase.functions
        .invoke("create-checkout", options: FunctionInvokeOptions(
            body: ["price_id": priceId]
        ))
    
    struct CheckoutResponse: Codable {
        let url: String
    }
    
    let checkoutResponse = try JSONDecoder().decode(CheckoutResponse.self, from: response.data)
    
    guard let url = URL(string: checkoutResponse.url) else {
        throw URLError(.badURL)
    }
    
    return url
}
```

### UI: Checkout View

```swift
struct CheckoutView: View {
    @Environment(\.dismiss) private var dismiss
    @EnvironmentObject var subscriptionManager: SubscriptionManager
    @State private var isLoading = false
    
    let priceId = "price_consumer_plus_monthly" // From Stripe Dashboard
    
    var body: some View {
        VStack(spacing: 24) {
            Image(systemName: "crown.fill")
                .font(.system(size: 64))
                .foregroundColor(.yellow)
            
            Text("Upgrade to Plus")
                .font(.largeTitle)
                .fontWeight(.bold)
            
            Text("$9.99/month")
                .font(.title2)
                .foregroundColor(.secondary)
            
            VStack(alignment: .leading, spacing: 12) {
                ForEach(ConsumerPlan.plus.features, id: \.self) { feature in
                    HStack {
                        Image(systemName: "checkmark.circle.fill")
                            .foregroundColor(.green)
                        Text(feature)
                    }
                }
            }
            .padding()
            
            Spacer()
            
            Button(action: startCheckout) {
                if isLoading {
                    ProgressView()
                        .progressViewStyle(CircularProgressViewStyle(tint: .white))
                } else {
                    Text("Continue to Payment")
                        .fontWeight(.semibold)
                }
            }
            .frame(maxWidth: .infinity)
            .padding()
            .background(Color.blue)
            .foregroundColor(.white)
            .cornerRadius(12)
            .disabled(isLoading)
            
            Button("Cancel") {
                dismiss()
            }
            .foregroundColor(.secondary)
        }
        .padding()
    }
    
    func startCheckout() {
        isLoading = true
        
        Task {
            do {
                let checkoutURL = try await createCheckout(priceId: priceId)
                
                // Open in Safari (SFSafariViewController for better UX)
                await MainActor.run {
                    UIApplication.shared.open(checkoutURL)
                    
                    // Start polling for subscription status
                    DispatchQueue.main.asyncAfter(deadline: .now() + 3) {
                        subscriptionManager.startPeriodicCheck(interval: 5) // Check every 5 seconds
                    }
                    
                    dismiss()
                }
            } catch {
                await MainActor.run {
                    isLoading = false
                }
                print("Checkout error: \(error)")
            }
        }
    }
}
```

### Better UX: In-App Browser

```swift
import SafariServices

class CheckoutCoordinator: NSObject, ObservableObject {
    @Published var isPresenting = false
    private var safariVC: SFSafariViewController?
    
    func presentCheckout(from viewController: UIViewController, priceId: String) {
        Task {
            do {
                let checkoutURL = try await createCheckout(priceId: priceId)
                
                await MainActor.run {
                    let safariVC = SFSafariViewController(url: checkoutURL)
                    safariVC.delegate = self
                    self.safariVC = safariVC
                    viewController.present(safariVC, animated: true)
                }
            } catch {
                print("Checkout error: \(error)")
            }
        }
    }
}

extension CheckoutCoordinator: SFSafariViewControllerDelegate {
    func safariViewControllerDidFinish(_ controller: SFSafariViewController) {
        // User closed checkout - refresh subscription status
        Task {
            try? await Task.sleep(nanoseconds: 2_000_000_000) // Wait 2 seconds
            // Trigger subscription refresh
        }
    }
}
```

---

## 4. Customer Portal (Manage Subscription)

### API: Open Customer Portal

Calls existing Edge Function `supabase/functions/customer-portal`:

```swift
func openCustomerPortal() async throws -> URL {
    let response = try await supabase.functions
        .invoke("customer-portal")
    
    struct PortalResponse: Codable {
        let url: String
    }
    
    let portalResponse = try JSONDecoder().decode(PortalResponse.self, from: response.data)
    
    guard let url = URL(string: portalResponse.url) else {
        throw URLError(.badURL)
    }
    
    return url
}
```

### UI: Manage Subscription Button

```swift
struct ManageSubscriptionButton: View {
    @State private var isLoading = false
    
    var body: some View {
        Button(action: openPortal) {
            if isLoading {
                ProgressView()
            } else {
                Text("Manage Subscription")
            }
        }
        .disabled(isLoading)
    }
    
    func openPortal() {
        isLoading = true
        
        Task {
            do {
                let portalURL = try await openCustomerPortal()
                
                await MainActor.run {
                    UIApplication.shared.open(portalURL)
                    isLoading = false
                }
            } catch {
                await MainActor.run {
                    isLoading = false
                }
                print("Portal error: \(error)")
            }
        }
    }
}
```

---

## 5. Feature Gating

### Storage Quota Check

```swift
func checkStorageQuota(currentUsage: Int64) -> (allowed: Bool, upgradeRequired: Bool) {
    guard let status = subscriptionManager.status else {
        return (false, true)
    }
    
    if status.isActive {
        // Plus users have 50GB soft cap
        let softCap: Int64 = 50 * 1024 * 1024 * 1024
        return (currentUsage < softCap, false)
    } else {
        // Free users have 500MB hard cap
        let hardCap: Int64 = 500 * 1024 * 1024
        return (currentUsage < hardCap, currentUsage >= hardCap)
    }
}
```

### UI: Upload with Quota Check

```swift
func uploadMedia(data: Data) async throws {
    let currentUsage = try await fetchStorageUsage()
    let quotaCheck = checkStorageQuota(currentUsage: currentUsage)
    
    if !quotaCheck.allowed {
        if quotaCheck.upgradeRequired {
            // Show upgrade prompt
            showUpgradePrompt = true
            throw StorageError.quotaExceeded
        } else {
            // Soft cap warning for Plus users
            showSoftCapWarning = true
        }
    }
    
    // Proceed with upload
    try await uploadToStorage(data: data)
}
```

### Feature Lock UI

```swift
struct FeatureLockedView: View {
    let featureName: String
    @State private var showUpgrade = false
    
    var body: some View {
        VStack(spacing: 16) {
            Image(systemName: "lock.fill")
                .font(.system(size: 48))
                .foregroundColor(.gray)
            
            Text("\(featureName) is a Plus Feature")
                .font(.headline)
            
            Text("Upgrade to Plus to unlock this feature")
                .font(.caption)
                .foregroundColor(.secondary)
            
            Button("Upgrade to Plus") {
                showUpgrade = true
            }
            .padding()
            .background(Color.blue)
            .foregroundColor(.white)
            .cornerRadius(12)
        }
        .padding()
        .sheet(isPresented: $showUpgrade) {
            CheckoutView()
        }
    }
}
```

---

## 6. Subscription State in App

### Environment Object

```swift
struct ContentView: View {
    @EnvironmentObject var subscriptionManager: SubscriptionManager
    
    var body: some View {
        TabView {
            HomeView()
                .tabItem {
                    Label("Home", systemImage: "house")
                }
            
            if subscriptionManager.status?.isActive == true {
                AIView()
                    .tabItem {
                        Label("AI Concierge", systemImage: "brain")
                    }
            }
            
            SettingsView()
                .tabItem {
                    Label("Settings", systemImage: "gear")
                }
        }
    }
}
```

---

## 7. Restore Purchases (for App Store)

If you plan to offer In-App Purchases via Apple:

```swift
import StoreKit

class StoreManager: NSObject, ObservableObject {
    @Published var products: [Product] = []
    @Published var purchasedProducts: Set<String> = []
    
    func loadProducts() async {
        do {
            products = try await Product.products(for: ["com.chravel.plus.monthly"])
        } catch {
            print("Failed to load products: \(error)")
        }
    }
    
    func purchase(_ product: Product) async throws {
        let result = try await product.purchase()
        
        switch result {
        case .success(let verification):
            switch verification {
            case .verified(let transaction):
                // Grant access
                purchasedProducts.insert(product.id)
                await transaction.finish()
                
            case .unverified:
                throw StoreError.unverified
            }
            
        case .userCancelled:
            break
            
        case .pending:
            break
            
        @unknown default:
            break
        }
    }
    
    func restorePurchases() async {
        for await result in Transaction.currentEntitlements {
            if case .verified(let transaction) = result {
                purchasedProducts.insert(transaction.productID)
            }
        }
    }
}
```

---

## Testing Checklist

- [ ] Check subscription API returns correct status
- [ ] Free user sees upgrade prompts
- [ ] Plus user has unlimited storage access
- [ ] Checkout URL opens in Safari/in-app browser
- [ ] Subscription status refreshes after purchase
- [ ] Customer portal opens for managing subscription
- [ ] Feature gating works (AI Concierge, Travel Wallet)
- [ ] Storage quota enforced (500MB free, 50GB Plus)
- [ ] Periodic status check updates UI
- [ ] Handle subscription expiration gracefully
- [ ] Cancel subscription via portal works

---

## Next Steps

- Apple In-App Purchases integration (alternative to Stripe)
- Subscription analytics (MRR, churn, LTV)
- Promotional codes and discounts
- Annual billing option
- Family sharing support
- Referral credits
