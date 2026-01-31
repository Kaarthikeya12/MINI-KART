import { headers as getHeaders } from 'next/headers'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { Header } from '@/components/Header'
import { getCart } from '@/actions/cart'
import { getOrders } from '@/actions/orders'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Package } from 'lucide-react'
import { DashboardNav } from '@/components/DashboardNav'

export default async function OrdersPage() {
    const payloadConfig = await config
    const payload = await getPayload({ config: payloadConfig })
    const headers = await getHeaders()
    const { user } = await payload.auth({ headers })

    if (!user) {
        redirect('/login')
    }

    const orders = await getOrders()
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
            <DashboardNav />

            <div className="container mx-auto px-4 py-8">
                <h1 className="mb-8 text-3xl font-bold">My Orders</h1>

                {orders.length === 0 ? (
                    <div className="flex min-h-[400px] flex-col items-center justify-center rounded-lg border-2 border-dashed">
                        <Package className="mb-4 h-16 w-16 text-muted-foreground" />
                        <h2 className="mb-2 text-2xl font-semibold">No orders yet</h2>
                        <p className="mb-6 text-muted-foreground">
                            Start shopping to see your orders here
                        </p>
                        <Link href="/">
                            <button className="rounded-md bg-primary px-6 py-2 text-primary-foreground hover:bg-primary/90">
                                Start Shopping
                            </button>
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {orders.map((order: any) => (
                            <Link key={order.id} href={`/orders/${order.id}`}>
                                <Card className="transition-all hover:shadow-lg">
                                    <CardContent className="p-6">
                                        <div className="flex items-start justify-between">
                                            <div className="space-y-2">
                                                <div className="flex items-center gap-3">
                                                    <h3 className="font-semibold">Order #{order.id.slice(-8)}</h3>
                                                    <Badge className={statusColors[order.status]}>
                                                        {order.status}
                                                    </Badge>
                                                </div>
                                                <p className="text-sm text-muted-foreground">
                                                    {order.items?.length || 0} item(s) • Placed on{' '}
                                                    {new Date(order.createdAt).toLocaleDateString()}
                                                </p>
                                                <p className="text-sm">
                                                    <span className="text-muted-foreground">Payment:</span>{' '}
                                                    <span className="font-medium capitalize">{order.paymentMethod}</span>
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-2xl font-bold text-primary">
                                                    ₹{order.total.toLocaleString()}
                                                </p>
                                                {order.coinsUsed > 0 && (
                                                    <p className="text-xs text-muted-foreground">
                                                        {order.coinsUsed} coins used
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
