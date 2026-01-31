import { headers as getHeaders } from 'next/headers'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { redirect } from 'next/navigation'
import { Header } from '@/components/Header'
import { getCart } from '@/actions/cart'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Grid3x3 } from 'lucide-react'
import Link from 'next/link'
import { DashboardNav } from '@/components/DashboardNav'

export default async function CategoriesPage() {
    const payloadConfig = await config
    const payload = await getPayload({ config: payloadConfig })
    const headers = await getHeaders()
    const { user } = await payload.auth({ headers })

    // Redirect to login if not authenticated
    if (!user) {
        redirect('/login')
    }

    // Fetch all categories
    const categories = await payload.find({
        collection: 'categories',
        limit: 100,
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
                        <Grid3x3 className="h-10 w-10" />
                        Categories
                    </h1>
                    <p className="mt-2 text-muted-foreground">
                        Browse products by category
                    </p>
                </div>

                {categories.docs.length === 0 ? (
                    <Card>
                        <CardContent className="flex min-h-96 items-center justify-center">
                            <div className="text-center">
                                <h3 className="text-xl font-semibold">No categories available</h3>
                                <p className="mt-2 text-sm text-muted-foreground">
                                    Categories will appear here once they are added
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {categories.docs.map((category: any) => (
                            <Card key={category.id} className="group cursor-pointer transition-all hover:shadow-lg">
                                <CardHeader>
                                    <CardTitle className="flex items-center justify-between">
                                        <span>{category.name}</span>
                                        <Badge variant="secondary">{category.slug}</Badge>
                                    </CardTitle>
                                    {category.description && (
                                        <CardDescription>{category.description}</CardDescription>
                                    )}
                                </CardHeader>
                                <CardContent>
                                    <Link href={`/products?category=${category.slug}`}>
                                        <div className="rounded-lg bg-primary/10 p-4 text-center transition-colors hover:bg-primary/20">
                                            <p className="text-sm font-medium text-primary">View Products</p>
                                        </div>
                                    </Link>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
