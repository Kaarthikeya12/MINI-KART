# Mini Kart - E-commerce Platform

A full-featured e-commerce platform built with Next.js, Payload CMS, and shadcn/ui components. Features include product management, shopping cart, checkout with multiple payment options, discount codes, and a unique coins reward system.

## Features

### 🛍️ Shopping Experience
- **Product Catalog**: Browse all products with beautiful card layouts
- **Product Details**: Detailed product pages with image galleries
- **Shopping Cart**: Add, update, and remove items from cart
- **Smart Search**: Filter and search products by categories

### 💳 Checkout & Payments
- **Multiple Payment Methods**: 
  - Cash on Delivery (COD)
  - Credit/Debit Card
  - UPI
  - Net Banking
- **Discount Codes**: Apply promotional discount codes at checkout
- **Coins Redemption**: Use earned coins for discounts (1 coin = ₹100)

### 🎁 Rewards System
- **Earn Coins**: Get 1 coin for every 2 orders placed
- **Redeem Coins**: Use coins to get ₹100 off per coin at checkout
- **Track Rewards**: View your coin balance in your profile

### 👤 User Management
- **Authentication**: Secure login and signup
- **User Profile**: View account details and rewards
- **Order History**: Track all your orders with status updates

### 📦 Order Management
- **Order Tracking**: View order status (Pending, Processing, Shipped, Delivered, Cancelled)
- **Order Details**: Complete order information including items, shipping address, and payment details
- **Success Page**: Confirmation page after successful order placement

### 🎨 Design
- **Modern UI**: Built with shadcn/ui components
- **Responsive**: Works perfectly on all devices
- **Dark Mode Ready**: Theme system with light/dark mode support
- **Smooth Animations**: Enhanced user experience with transitions

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **CMS**: Payload CMS 3.74
- **Database**: SQLite (via @payloadcms/db-sqlite)
- **UI Components**: shadcn/ui
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Language**: TypeScript

## Getting Started

### Prerequisites

- Node.js 18.20.2 or higher
- pnpm 9 or 10

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd MINI-KART
```

2. Install dependencies:
```bash
pnpm install
```

3. Set up environment variables:
Create a `.env` file in the root directory with:
```env
DATABASE_URI=./database.db
PAYLOAD_SECRET=your-secret-key-here
NEXT_PUBLIC_SERVER_URL=http://localhost:3000
```

4. Run the development server:
```bash
pnpm dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

### Admin Panel

Access the Payload admin panel at [http://localhost:3000/admin](http://localhost:3000/admin)

**Default Admin Credentials** (create these on first run):
- Email: admin@example.com
- Password: (set your own)

## Project Structure

```
MINI-KART/
├── src/
│   ├── actions/          # Server actions
│   │   ├── auth.ts       # Authentication actions
│   │   ├── cart.ts       # Cart management
│   │   └── orders.ts     # Order processing
│   ├── app/
│   │   ├── (frontend)/   # Frontend pages
│   │   │   ├── page.tsx              # Home/Landing page
│   │   │   ├── login/                # Login page
│   │   │   ├── signup/               # Signup page
│   │   │   ├── products/             # Products listing & detail
│   │   │   ├── cart/                 # Shopping cart
│   │   │   ├── checkout/             # Checkout page
│   │   │   ├── orders/               # Order history & details
│   │   │   └── profile/              # User profile
│   │   ├── (payload)/    # Payload admin routes
│   │   └── api/          # API routes
│   ├── collections/      # Payload collections
│   │   ├── Products.ts   # Product collection
│   │   ├── Categories.ts # Category collection
│   │   ├── Orders.ts     # Order collection
│   │   ├── Carts.ts      # Cart collection
│   │   ├── Users.ts      # User collection
│   │   ├── Discounts.ts  # Discount codes
│   │   └── Media.ts      # Media/images
│   ├── components/       # React components
│   │   ├── ui/           # shadcn/ui components
│   │   ├── Header.tsx    # Navigation header
│   │   ├── ProductCard.tsx
│   │   ├── ProductDetail.tsx
│   │   ├── CartItems.tsx
│   │   └── CheckoutForm.tsx
│   └── lib/
│       └── utils.ts      # Utility functions
├── tailwind.config.ts
├── package.json
└── README.md
```

## Usage Guide

### For Customers

1. **Browse Products**: Visit the home page to see all available products
2. **View Details**: Click on any product to see detailed information
3. **Add to Cart**: Select quantity and add products to your cart
4. **Checkout**: 
   - Review your cart
   - Enter shipping address
   - Select payment method
   - Apply discount codes (if available)
   - Use coins for additional discounts
   - Place order
5. **Track Orders**: View order status in the Orders section
6. **Earn Rewards**: Get 1 coin for every 2 orders

### For Admins

1. **Access Admin Panel**: Go to `/admin`
2. **Manage Products**:
   - Add new products with images, descriptions, and pricing
   - Set stock levels
   - Publish/unpublish products
3. **Manage Categories**: Organize products into categories
4. **Create Discounts**: Set up promotional discount codes
5. **View Orders**: Monitor all customer orders
6. **Manage Users**: View and manage user accounts

## Key Features Explained

### Coins Reward System

- Users earn **1 coin for every 2 orders** placed
- Each coin is worth **₹100** discount
- Coins can be redeemed at checkout
- Maximum coins usable is limited by order total (1 coin per ₹100)
- Coin balance is displayed in header and profile

### Discount System

- Admin can create discount codes in Payload admin
- Two types of discounts:
  - **Flat Amount**: Fixed discount (e.g., ₹500 off)
  - **Percentage**: Percentage discount (e.g., 10% off)
- Discounts have expiry dates and usage limits
- Customers apply codes at checkout

### Order Flow

1. Customer adds items to cart
2. Proceeds to checkout
3. Enters shipping address
4. Selects payment method
5. Applies discount code (optional)
6. Redeems coins (optional)
7. Reviews order summary
8. Places order
9. Order is created in database
10. Cart is cleared
11. Coins are awarded (if applicable)
12. Redirected to order confirmation page

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URI` | SQLite database file path | `./database.db` |
| `PAYLOAD_SECRET` | Secret key for Payload CMS | Required |
| `NEXT_PUBLIC_SERVER_URL` | Public URL of the application | `http://localhost:3000` |

## Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint
- `pnpm generate:types` - Generate TypeScript types from Payload

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT

## Support

For support, email support@minikart.com or open an issue in the repository.

---

Built with ❤️ using Next.js and Payload CMS
