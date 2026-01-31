import { headers as getHeaders } from 'next/headers'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { redirect } from 'next/navigation'
import { Header } from '@/components/Header'
import { getCart } from '@/actions/cart'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ProductCard } from '@/components/ProductCard'
import {
    ShoppingBag,
    User,
    Package,
    Bell,
    Search,
    Grid3x3,
    ShoppingCart,
    TrendingUp,
} from 'lucide-react'
import Link from 'next/link'
import { DashboardNav } from '@/components/DashboardNav'

export default async function DashboardPage() {
    const payloadConfig = await config
    const payload = await getPayload({ config: payloadConfig })
    const headers = await getHeaders()
    const { user } = await payload.auth({ headers })

    // Redirect to login if not authenticated
    if (!user) {
        redirect('/login')
    }

    // Fetch user's orders
    const orders = await payload.find({
        collection: 'orders',
        where: {
            user: {
                equals: user.id,
            },
        },
        depth: 2,
        limit: 5,
        sort: '-createdAt',
    })

    // Fetch all products
    const products = await payload.find({
        collection: 'products',
        depth: 2,
        limit: 8,
    })

    // Fetch all categories
    const categories = await payload.find({
        collection: 'categories',
        limit: 100,
    })

    // Fetch notifications
    const notifications = await payload.find({
        collection: 'notifications',
        where: {
            user: {
                equals: user.id,
            },
        },
        limit: 5,
        sort: '-createdAt',
    })

    // Get cart
    const cart = await getCart()
    const cartItemsCount = cart?.items?.length || 0

    // Calculate stats
    const totalOrders = orders.totalDocs
    const totalSpent = orders.docs.reduce((sum, order: any) => sum + (order.total || 0), 0)

    return (
        <div className="min-h-screen bg-background">
            <Header user={user} cartItemsCount={cartItemsCount} />
            <DashboardNav />

            <div className="container mx-auto px-4 py-8">
                {/* Welcome Section */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold">Welcome back!</h1>
                    <p className="mt-2 text-muted-foreground">
                        Here's what's happening with your account
                    </p>
                </div>

                {/* Stats Cards */}
                <div className="mb-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{totalOrders}</div>
                            <p className="text-xs text-muted-foreground">All time orders</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
                            <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">₹{totalSpent.toLocaleString()}</div>
                            <p className="text-xs text-muted-foreground">Lifetime spending</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Cart Items</CardTitle>
                            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{cartItemsCount}</div>
                            <p className="text-xs text-muted-foreground">Items in your cart</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Notifications</CardTitle>
                            <Bell className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{notifications.totalDocs}</div>
                            <p className="text-xs text-muted-foreground">Unread messages</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Main Grid */}
                <div className="grid gap-8 lg:grid-cols-3">
                    {/* Left Column - Main Content */}
                    <div className="space-y-8 lg:col-span-2">
                        {/* Search Bar */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Search className="h-5 w-5" />
                                    Search Products
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex gap-2">
                                    <Input placeholder="Search for products..." className="flex-1" />
                                    <Button>Search</Button>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Products Section */}
                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle className="flex items-center gap-2">
                                            <Grid3x3 className="h-5 w-5" />
                                            Featured Products
                                        </CardTitle>
                                        <CardDescription>Browse our latest collection</CardDescription>
                                    </div>
                                    <Link href="/products">
                                        <Button variant="outline" size="sm">
                                            View All
                                        </Button>
                                    </Link>
                                </div>
                            </CardHeader>
                            <CardContent>
                                {products.docs.length === 0 ? (
                                    <div className="flex min-h-50 items-center justify-center rounded-lg border-2 border-dashed">
                                        <div className="text-center">
                                            <h3 className="text-lg font-semibold">No products available</h3>
                                            <p className="mt-1 text-sm text-muted-foreground">
                                                Check back later for new products!
                                            </p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="grid gap-4 sm:grid-cols-2">
                                        {products.docs.slice(0, 4).map((product) => (
                                            <ProductCard key={product.id} product={product} />
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Recent Orders */}
                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle className="flex items-center gap-2">
                                            <Package className="h-5 w-5" />
                                            Recent Orders
                                        </CardTitle>
                                        <CardDescription>Your latest purchases</CardDescription>
                                    </div>
                                    <Link href="/orders">
                                        <Button variant="outline" size="sm">
                                            View All
                                        </Button>
                                    </Link>
                                </div>
                            </CardHeader>
                            <CardContent>
                                {orders.docs.length === 0 ? (
                                    <div className="flex min-h-50 items-center justify-center rounded-lg border-2 border-dashed">
                                        <div className="text-center">
                                            <h3 className="text-lg font-semibold">No orders yet</h3>
                                            <p className="mt-1 text-sm text-muted-foreground">
                                                Start shopping to see your orders here!
                                            </p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {orders.docs.map((order: any) => (
                                            <div
                                                key={order.id}
                                                className="flex items-center justify-between rounded-lg border p-4"
                                            >
                                                <div>
                                                    <p className="font-medium">Order #{order.id.slice(0, 8)}</p>
                                                    <p className="text-sm text-muted-foreground">
                                                        {new Date(order.createdAt).toLocaleDateString()}
                                                    </p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-bold">₹{order.total?.toLocaleString()}</p>
                                                    <Badge variant={order.status === 'completed' ? 'default' : 'secondary'}>
                                                        {order.status}
                                                    </Badge>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column - Sidebar */}
                    <div className="space-y-8">
                        {/* Profile Section */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <User className="h-5 w-5" />
                                    Profile
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div>
                                        <p className="text-sm text-muted-foreground">Email</p>
                                        <p className="font-medium">{user.email}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Role</p>
                                        <Badge>{user.role}</Badge>
                                    </div>
                                    <Link href="/profile">
                                        <Button className="w-full" variant="outline">
                                            Edit Profile
                                        </Button>
                                    </Link>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Categories */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Grid3x3 className="h-5 w-5" />
                                    Categories
                                </CardTitle>
                                <CardDescription>Browse by category</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {categories.docs.length === 0 ? (
                                    <p className="text-sm text-muted-foreground">No categories available</p>
                                ) : (
                                    <div className="flex flex-wrap gap-2">
                                        {categories.docs.map((category: any) => (
                                            <Badge key={category.id} variant="secondary">
                                                {category.name}
                                            </Badge>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Cart Summary */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <ShoppingCart className="h-5 w-5" />
                                    Shopping Cart
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <p className="text-sm text-muted-foreground">Items in cart</p>
                                        <p className="font-bold">{cartItemsCount}</p>
                                    </div>
                                    {cart && cart.items && cart.items.length > 0 && (
                                        <div className="flex items-center justify-between">
                                            <p className="text-sm text-muted-foreground">Total</p>
                                            <p className="font-bold">
                                                ₹
                                                {cart.items
                                                    .reduce((sum: number, item: any) => {
                                                        const price = item.product?.price || 0
                                                        const quantity = item.quantity || 0
                                                        return sum + price * quantity
                                                    }, 0)
                                                    .toLocaleString()}
                                            </p>
                                        </div>
                                    )}
                                    <Link href="/cart">
                                        <Button className="w-full">View Cart</Button>
                                    </Link>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Notifications */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Bell className="h-5 w-5" />
                                    Notifications
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                {notifications.docs.length === 0 ? (
                                    <p className="text-sm text-muted-foreground">No new notifications</p>
                                ) : (
                                    <div className="space-y-3">
                                        {notifications.docs.map((notification: any) => (
                                            <div key={notification.id} className="rounded-lg border p-3">
                                                <p className="text-sm font-medium">{notification.title}</p>
                                                <p className="text-xs text-muted-foreground">
                                                    {notification.message}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}
