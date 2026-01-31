import { headers as getHeaders } from 'next/headers'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { Header } from '@/components/Header'
import { getCart } from '@/actions/cart'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Coins, Package, User as UserIcon } from 'lucide-react'
import { DashboardNav } from '@/components/DashboardNav'

export default async function ProfilePage() {
    const payloadConfig = await config
    const payload = await getPayload({ config: payloadConfig })
    const headers = await getHeaders()
    const { user } = await payload.auth({ headers })

    if (!user) {
        redirect('/login')
    }

    const cart = await getCart()
    const cartItemsCount = cart?.items?.length || 0

    const orders = await payload.find({
        collection: 'orders',
        where: {
            user: {
                equals: user.id,
            },
        },
    })

    return (
        <div className="min-h-screen bg-background">
            <Header user={user} cartItemsCount={cartItemsCount} />
            <DashboardNav />

            <div className="container mx-auto px-4 py-8">
                <h1 className="mb-8 text-3xl font-bold">My Profile</h1>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <UserIcon className="h-5 w-5" />
                                Account Details
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <div>
                                <p className="text-sm text-muted-foreground">Email</p>
                                <p className="font-medium">{user.email}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Role</p>
                                <Badge variant="secondary" className="capitalize">
                                    {user.role}
                                </Badge>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Coins className="h-5 w-5 text-primary" />
                                Rewards
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <div>
                                <p className="text-sm text-muted-foreground">Available Coins</p>
                                <p className="text-4xl font-bold text-primary">{user.coins || 0}</p>
                                <p className="text-xs text-muted-foreground">
                                    Worth ₹{(user.coins || 0) * 100}
                                </p>
                            </div>
                            <div className="rounded-lg bg-muted p-3 text-xs">
                                <p className="font-medium">How to earn coins?</p>
                                <p className="text-muted-foreground">
                                    Get 1 coin for every 2 orders you place!
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Package className="h-5 w-5" />
                                Orders
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <div>
                                <p className="text-sm text-muted-foreground">Total Orders</p>
                                <p className="text-4xl font-bold">{orders.totalDocs}</p>
                            </div>
                            <div className="text-xs text-muted-foreground">
                                {Math.floor(orders.totalDocs / 2)} coins earned from orders
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
