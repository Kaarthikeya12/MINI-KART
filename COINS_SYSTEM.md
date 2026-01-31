# Coins Reward System - How It Works

## 🪙 Overview

The coins system is a unique reward program that incentivizes repeat purchases. Users earn coins with every 2 orders and can redeem them for discounts on future purchases.

## 💰 Coin Value

```
1 Coin = ₹100 Discount
```

## 📈 Earning Coins

### Automatic Award System

```
Orders Placed → Coins Earned
─────────────────────────────
1 order      → 0 coins
2 orders     → 1 coin  (₹100 value)
3 orders     → 1 coin  (₹100 value)
4 orders     → 2 coins (₹200 value)
5 orders     → 2 coins (₹200 value)
6 orders     → 3 coins (₹300 value)
...and so on
```

### Formula
```javascript
Total Coins = Math.floor(Total Orders / 2)
```

### When Coins Are Awarded

Coins are automatically calculated and awarded **after each order is placed**:

1. User places an order
2. Order is saved to database
3. System counts total orders for user
4. Calculates: `coins = totalOrders / 2` (rounded down)
5. Updates user's coin balance
6. User can see new balance immediately

## 🎁 Using Coins

### At Checkout

1. **View Available Coins**
   - Displayed in header (always visible)
   - Shown in cart summary
   - Highlighted in checkout

2. **Redemption Interface**
   - Input field to enter number of coins
   - Maximum coins calculated automatically
   - Real-time discount preview

3. **Maximum Coins Limit**
   ```javascript
   Max Coins = Math.min(
     User's Available Coins,
     Math.floor(Order Total / 100)
   )
   ```

   **Example:**
   - Order total: ₹5,000
   - User has: 10 coins
   - Max usable: 5 coins (because ₹5,000 / 100 = 50, but user only has 10)
   
   - Order total: ₹2,000
   - User has: 30 coins
   - Max usable: 20 coins (because ₹2,000 / 100 = 20)

4. **Discount Calculation**
   ```javascript
   Coins Discount = Coins Used × 100
   Final Total = Subtotal - Discount Code - Coins Discount
   ```

## 🔄 Complete Order Flow with Coins

```
1. User adds products to cart
   ↓
2. Goes to checkout
   ↓
3. Enters shipping address
   ↓
4. Selects payment method
   ↓
5. (Optional) Applies discount code
   ↓
6. (Optional) Redeems coins
   │
   ├─→ System validates coin balance
   ├─→ Calculates maximum usable coins
   ├─→ Applies discount (coins × 100)
   └─→ Updates order total
   ↓
7. Reviews final total
   ↓
8. Places order
   ↓
9. Order saved to database
   ↓
10. Coins deducted from user balance
    ↓
11. System counts total orders
    ↓
12. Awards new coins if eligible
    │
    └─→ If totalOrders / 2 > current coins
        → Update coins to new amount
    ↓
13. Cart cleared
    ↓
14. Redirect to order confirmation
```

## 📊 Example Scenarios

### Scenario 1: First-Time Buyer
```
Initial State:
- Orders: 0
- Coins: 0

After 1st Order:
- Orders: 1
- Coins: 0 (1/2 = 0.5, rounded down to 0)

After 2nd Order:
- Orders: 2
- Coins: 1 (2/2 = 1) ✨ First coin earned!
```

### Scenario 2: Regular Customer
```
Current State:
- Orders: 5
- Coins: 2
- Used 1 coin on last order

After 6th Order:
- Orders: 6
- Coins: 3 (6/2 = 3)
- Net gain: 1 coin (despite using 1)
```

### Scenario 3: Using Coins at Checkout
```
Cart Total: ₹8,500
Available Coins: 12
Max Usable: 8 coins (₹8,500 / 100 = 85, but user has 12)

User chooses to use: 5 coins

Calculation:
- Subtotal: ₹8,500
- Coins Discount: -₹500 (5 × 100)
- Final Total: ₹8,000

After Order:
- Coins Remaining: 7 (12 - 5)
- Orders: +1
- New Coins: 8 (if this was 16th order)
```

### Scenario 4: Combining Discounts
```
Cart Total: ₹10,000
Discount Code: SAVE500 (₹500 flat)
Available Coins: 20
Max Usable: 10 coins

User uses:
- Discount code: ₹500 off
- 8 coins: ₹800 off

Calculation:
- Subtotal: ₹10,000
- Discount Code: -₹500
- Coins (8): -₹800
- Final Total: ₹8,700

Savings: ₹1,300 (13% off!)
```

## 💡 User Benefits

### For Customers
1. **Earn While Shopping**: Every purchase brings you closer to rewards
2. **Real Savings**: ₹100 per coin is significant
3. **No Expiry**: Coins never expire
4. **Flexible Use**: Use as many or as few as you want
5. **Stackable**: Combine with discount codes

### For Business
1. **Repeat Purchases**: Incentivizes customers to return
2. **Customer Loyalty**: Builds long-term relationships
3. **Increased AOV**: Customers may add more to use coins
4. **Competitive Edge**: Unique reward system
5. **Trackable**: Easy to monitor in admin panel

## 🎯 Where Coins Are Displayed

### 1. Header (Always Visible)
```
[Coins Icon] 5
```
Shows current balance for logged-in users

### 2. Cart Page
```
┌─────────────────────────────┐
│ You have 5 coins!           │
│ Use them at checkout to     │
│ save ₹500                   │
└─────────────────────────────┘
```

### 3. Checkout Page
```
┌─────────────────────────────┐
│ Use Coins         [5 available] │
│ ┌─────────────┐             │
│ │ Enter coins │             │
│ └─────────────┘             │
│ Max 10 coins (₹1000 off)    │
└─────────────────────────────┘
```

### 4. Profile Page
```
┌─────────────────────────────┐
│ Available Coins             │
│        5                    │
│ Worth ₹500                  │
│                             │
│ How to earn coins?          │
│ Get 1 coin for every        │
│ 2 orders you place!         │
└─────────────────────────────┘
```

### 5. Order Confirmation
```
┌─────────────────────────────┐
│ Order Summary               │
│ Subtotal:        ₹10,000    │
│ Coins Used (5):  -₹500      │
│ Total:           ₹9,500     │
└─────────────────────────────┘
```

## 🔧 Technical Implementation

### Database Schema
```typescript
User {
  id: number
  email: string
  coins: number  // Current balance
  orders: Order[] // Relationship
}

Order {
  id: number
  user: User
  coinsUsed: number  // Coins redeemed
  total: number      // After all discounts
}
```

### Key Functions

**Award Coins** (in `src/actions/orders.ts`):
```typescript
const totalOrders = userOrders.totalDocs
const coinsToAward = Math.floor(totalOrders / 2)
const currentCoins = userData.coins - coinsUsed

if (coinsToAward > currentCoins) {
  await payload.update({
    collection: 'users',
    id: user.id,
    data: { coins: coinsToAward }
  })
}
```

**Validate Coins** (in checkout):
```typescript
const maxCoins = Math.min(
  user.coins || 0,
  Math.floor(subtotal / 100)
)
```

**Apply Discount**:
```typescript
const coinsDiscount = coinsUsed * 100
const total = Math.max(0, subtotal - discountAmount - coinsDiscount)
```

## 📱 User Experience Flow

1. **Discovery**: User sees coins in header after first login
2. **Education**: Profile page explains how to earn
3. **Motivation**: Cart reminds about available coins
4. **Action**: Checkout allows redemption
5. **Reward**: Order confirmation shows savings
6. **Retention**: New coins awarded automatically

## 🎨 Visual Indicators

- **Coins Icon**: 🪙 (Lucide `Coins` component)
- **Color**: Primary theme color
- **Badge**: Rounded pill showing count
- **Highlight**: Special background in checkout

## ✅ Best Practices

1. **Always show coin balance** when user is logged in
2. **Remind users** about coins in cart
3. **Make redemption easy** with clear UI
4. **Show savings** in order summary
5. **Celebrate milestones** (e.g., "You earned your first coin!")

## 🚀 Future Enhancements

Potential additions:
- Bonus coins for first order
- Double coins on special days
- Coin expiry (with warnings)
- Gift coins to friends
- Coin leaderboard
- Special rewards at milestones (10, 50, 100 coins)

---

**Remember**: The coins system is designed to be simple, transparent, and rewarding. Users should always know how many coins they have and how to use them!
