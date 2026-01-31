# Quick Setup Guide for Mini Kart

## Step-by-Step Setup

### 1. Initial Setup (Already Done ✅)
- ✅ Tailwind CSS installed and configured
- ✅ shadcn/ui components installed
- ✅ All necessary dependencies added
- ✅ Frontend pages created
- ✅ Server actions implemented
- ✅ Payload collections configured

### 2. Add Sample Data

To get started quickly, you need to add some products through the Payload admin panel:

1. **Access Admin Panel**:
   - Go to http://localhost:3000/admin
   - Create an admin account if you haven't already

2. **Create Categories** (Go to Collections → Categories):
   - Click "Create New"
   - Add categories like:
     - Electronics
     - Fashion
     - Home & Kitchen
     - Sports & Fitness
     - Books

3. **Upload Product Images** (Go to Collections → Media):
   - Click "Create New"
   - Upload product images
   - Add alt text for each image

4. **Create Products** (Go to Collections → Products):
   For each product, fill in:
   - **Name**: Product name (e.g., "Samsung Galaxy S23")
   - **Slug**: URL-friendly name (e.g., "samsung-galaxy-s23")
   - **Description**: Detailed product description
   - **Images**: Select uploaded images
   - **Price**: Product price (e.g., 74999)
   - **Categories**: Select relevant categories
   - **Stock**: Available quantity (e.g., 50)
   - **Status**: Set to "Published" to make it visible

5. **Create Discount Codes** (Optional - Go to Collections → Discounts):
   - **Code**: Discount code (e.g., "WELCOME10")
   - **Type**: Flat or Percentage
   - **Value**: Discount amount (e.g., 500 for flat, 10 for percentage)
   - **Expiry**: Set expiry date
   - **Max Uses**: Maximum number of times code can be used

### 3. Test the Application

1. **Homepage**: Visit http://localhost:3000
   - Should see all published products
   - Hero section with welcome message

2. **Sign Up**: Create a customer account
   - Go to http://localhost:3000/signup
   - Enter email and password
   - You'll be logged in automatically

3. **Browse Products**:
   - Click on any product to view details
   - See product images, description, price, and stock

4. **Add to Cart**:
   - Select quantity
   - Click "Add to Cart"
   - Cart icon in header should update

5. **View Cart**:
   - Click cart icon in header
   - Update quantities or remove items
   - See order summary

6. **Checkout**:
   - Click "Proceed to Checkout"
   - Fill in shipping address
   - Select payment method
   - Apply discount code (if you created one)
   - Use coins (if you have any)
   - Click "Place Order"

7. **View Orders**:
   - Click package icon in header
   - See all your orders
   - Click on an order to view details

8. **Check Profile**:
   - Click user icon in header
   - View your coins balance
   - See total orders

### 4. Understanding the Coins System

- **Earning Coins**: Users get 1 coin for every 2 orders
- **Using Coins**: Each coin = ₹100 discount at checkout
- **Example**:
  - Place 2 orders → Get 1 coin
  - Place 4 orders → Get 2 coins
  - 2 coins = ₹200 discount on next order

### 5. Sample Product Data

Here are some example products you can add:

**Product 1: Smartphone**
- Name: Samsung Galaxy S23
- Slug: samsung-galaxy-s23
- Description: Latest flagship smartphone with amazing camera
- Price: 74999
- Stock: 50
- Category: Electronics

**Product 2: Laptop**
- Name: MacBook Air M2
- Slug: macbook-air-m2
- Description: Powerful and portable laptop for professionals
- Price: 114900
- Stock: 30
- Category: Electronics

**Product 3: T-Shirt**
- Name: Cotton T-Shirt
- Slug: cotton-t-shirt
- Description: Comfortable cotton t-shirt for everyday wear
- Price: 499
- Stock: 100
- Category: Fashion

**Product 4: Book**
- Name: The Great Gatsby
- Slug: the-great-gatsby
- Description: Classic American novel by F. Scott Fitzgerald
- Price: 299
- Stock: 200
- Category: Books

### 6. Testing Payment Flow

1. Add products to cart
2. Go to checkout
3. Fill in shipping address:
   - Full Name: John Doe
   - Phone: 9876543210
   - Address Line 1: 123 Main Street
   - City: Mumbai
   - State: Maharashtra
   - Pincode: 400001

4. Select payment method (all methods work the same in this demo)
5. Apply discount code if available
6. Use coins if you have any
7. Place order
8. You'll be redirected to order confirmation page

### 7. Admin Features

As an admin, you can:
- View all orders from all users
- Update order status (Pending → Processing → Shipped → Delivered)
- Create and manage discount codes
- Add/edit/delete products
- Manage categories
- View user accounts

### 8. Troubleshooting

**Products not showing on homepage?**
- Make sure products are set to "Published" status
- Check that products have images and all required fields

**Can't add to cart?**
- Make sure you're logged in
- Check that product has stock available

**Discount code not working?**
- Verify code hasn't expired
- Check that max uses hasn't been reached
- Ensure code is typed correctly (case-sensitive)

**Coins not appearing?**
- Coins are awarded after placing orders
- You need 2 orders to get 1 coin
- Check your profile page to see coin balance

### 9. Next Steps

- Add more products with real images
- Create multiple categories
- Set up discount campaigns
- Test the complete order flow
- Customize the design and branding
- Add more payment gateway integrations (if needed)

## Important Notes

1. **Database**: Currently using SQLite (database.db file)
2. **Images**: Stored in the `media` folder
3. **Authentication**: Handled by Payload CMS
4. **Server Actions**: All cart and order operations use Next.js server actions

## Need Help?

- Check the main README.md for detailed documentation
- Review the code in `src/actions/` for business logic
- Look at `src/collections/` for data models
- Examine `src/components/` for UI components

Happy selling! 🛍️
