import { headers as getHeaders } from 'next/headers'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { redirect } from 'next/navigation'
import { Header } from '@/components/Header'
import { getCart } from '@/actions/cart'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Bell, CheckCircle } from 'lucide-react'
import { DashboardNav } from '@/components/DashboardNav'

export default async function NotificationsPage() {
    const payloadConfig = await config
    const payload = await getPayload({ config: payloadConfig })
    const headers = await getHeaders()
    const { user } = await payload.auth({ headers })

    // Redirect to login if not authenticated
    if (!user) {
        redirect('/login')
    }

    // Fetch notifications
    const notifications = await payload.find({
        collection: 'notifications',
        where: {
            user: {
                equals: user.id,
            },
        },
        limit: 50,
        sort: '-createdAt',
    })

    // Get cart
    const cart = await getCart()
    const cartItemsCount = cart?.items?.length || 0

    return (
        <div className="min-h-screen bg-background">
            <Header user={user} cartItemsCount={cartItemsCount} />
            <DashboardNav />

            <div className="container mx-auto px-4 py-8">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold flex items-center gap-3">
                        <Bell className="h-10 w-10" />
                        Notifications
                    </h1>
                    <p className="mt-2 text-muted-foreground">
                        Stay updated with your latest notifications
                    </p>
                </div>

                {notifications.docs.length === 0 ? (
                    <Card>
                        <CardContent className="flex min-h-96 items-center justify-center">
                            <div className="text-center">
                                <CheckCircle className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
                                <h3 className="text-xl font-semibold">You&apos;re all caught up!</h3>
                                <p className="mt-2 text-sm text-muted-foreground">
                                    No new notifications at the moment
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="space-y-4 max-w-3xl mx-auto">
                        {notifications.docs.map((notification: any) => (
                            <Card key={notification.id} className="transition-all hover:shadow-md">
                                <CardHeader>
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <CardTitle className="text-lg">{notification.title}</CardTitle>
                                            <CardDescription className="mt-1">
                                                {new Date(notification.createdAt).toLocaleString()}
                                            </CardDescription>
                                        </div>
                                        {notification.read === false && (
                                            <Badge variant="default">New</Badge>
                                        )}
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm">{notification.message}</p>
                                    {notification.type && (
                                        <Badge variant="outline" className="mt-3">
                                            {notification.type}
                                        </Badge>
                                    )}
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
