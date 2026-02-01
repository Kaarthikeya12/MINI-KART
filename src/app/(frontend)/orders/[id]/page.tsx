import { headers as getHeaders } from 'next/headers'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { Header } from '@/components/Header'
import { getCart } from '@/actions/cart'
import { redirect } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CheckCircle2 } from 'lucide-react'

type PageProps = {
    params: Promise<{ id: string }>
}

export default async function OrderDetailPage({ params }: PageProps) {
    const { id } = await params

    const payloadConfig = await config
    const payload = await getPayload({ config: payloadConfig })
    const headers = await getHeaders()
    const { user } = await payload.auth({ headers })

    if (!user) {
        redirect('/login')
    }

    const order = await payload.findByID({
        collection: 'orders',
        id,
        depth: 2,
    })

    if (
        !order ||
        (order.user !== user.id &&
            typeof order.user === 'object' &&
            order.user.id !== user.id)
    ) {
        redirect('/orders')
    }

    const cart = await getCart()
    const cartItemsCount = cart?.items?.length || 0

    const statusColors: Record<string, string> = {
        pending: 'bg-yellow-500',
        processing: 'bg-blue-500',
        shipped: 'bg-purple-500',
        delivered: 'bg-green-500',
        cancelled: 'bg-red-500',
    }

    return (
        <div className="min-h-screen bg-background">
            <Header user={user} cartItemsCount={cartItemsCount} />

            <div className="container mx-auto px-4 py-8">
                {/* Success Message */}
                <div className="mb-8 rounded-lg bg-green-50 p-6 text-center dark:bg-green-950">
                    <CheckCircle2 className="mx-auto mb-4 h-16 w-16 text-green-600" />
                    <h1 className="mb-2 text-3xl font-bold text-green-900 dark:text-green-100">
                        Order Placed Successfully!
                    </h1>
                    <p className="text-green-700 dark:text-green-300">
                        Thank you for your order. We&apos;ll send you a confirmation email shortly.
                    </p>
                </div>

                <div className="grid gap-8 lg:grid-cols-3">
                    <div className="lg:col-span-2 space-y-6">
                        {/* Order Items */}
                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle>Order Items</CardTitle>
                                    <Badge className={statusColors[order.status || 'pending']}>
                                        {order.status || 'pending'}
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {order.items?.map((item: any, index: number) => {
                                    const product = item.product
                                    if (typeof product !== 'object') return null

                                    const imageUrl =
                                        product.images?.[0]?.image?.url || '/placeholder.png'

                                    return (
                                        <div
                                            key={index}
                                            className="flex gap-4 border-b pb-4 last:border-0 last:pb-0"
                                        >
                                            <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md bg-muted">
                                                <Image
                                                    src={imageUrl}
                                                    alt={product.name}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="font-semibold">{product.name}</h3>
                                                <p className="text-sm text-muted-foreground">
                                                    Quantity: {item.quantity}
                                                </p>
                                                <p className="mt-1 font-semibold">
                                                    ₹{(item.price * item.quantity).toLocaleString()}
                                                </p>
                                            </div>
                                        </div>
                                    )
                                })}
                            </CardContent>
                        </Card>

                        {/* Shipping Address */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Shipping Address</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-1 text-sm">
                                    <p className="font-semibold">
                                        {order.shippingAddress.fullName}
                                    </p>
                                    <p>{order.shippingAddress.phone}</p>
                                    <p>{order.shippingAddress.addressLine1}</p>
                                    {order.shippingAddress.addressLine2 && (
                                        <p>{order.shippingAddress.addressLine2}</p>
                                    )}
                                    <p>
                                        {order.shippingAddress.city},{' '}
                                        {order.shippingAddress.state} -{' '}
                                        {order.shippingAddress.pincode}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <Card className="sticky top-20">
                            <CardHeader>
                                <CardTitle>Order Summary</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Order ID</span>
                                        <span className="font-mono">
                                            #{order.id.toString().slice(-8)}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Order Date</span>
                                        <span>
                                            {new Date(order.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">
                                            Payment Method
                                        </span>
                                        <span className="capitalize">
                                            {order.paymentMethod}
                                        </span>
                                    </div>
                                </div>

                                <div className="space-y-2 border-t pt-4">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Subtotal</span>
                                        <span>
                                            ₹{order.subtotal.toLocaleString()}
                                        </span>
                                    </div>

                                    {(order.discountAmount || 0) > 0 && (
                                        <div className="flex justify-between text-sm text-green-600">
                                            <span>Discount</span>
                                            <span>
                                                -₹{(order.discountAmount || 0).toLocaleString()}
                                            </span>
                                        </div>
                                    )}

                                    {(order.coinsUsed || 0) > 0 && (
                                        <div className="flex justify-between text-sm text-primary">
                                            <span>
                                                Coins Used ({order.coinsUsed || 0})
                                            </span>
                                            <span>
                                                -₹{((order.coinsUsed || 0) * 100).toLocaleString()}
                                            </span>
                                        </div>
                                    )}

                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Shipping</span>
                                        <span>FREE</span>
                                    </div>

                                    <div className="border-t pt-2">
                                        <div className="flex justify-between">
                                            <span className="font-semibold">Total Paid</span>
                                            <span className="text-2xl font-bold text-primary">
                                                ₹{order.total.toLocaleString()}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2 pt-4">
                                    <Link href="/orders">
                                        <button className="w-full rounded-md border border-input bg-background px-4 py-2 hover:bg-accent">
                                            View All Orders
                                        </button>
                                    </Link>
                                    <Link href="/">
                                        <button className="w-full rounded-md bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90">
                                            Continue Shopping
                                        </button>
                                    </Link>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}
