import { headers as getHeaders } from 'next/headers'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { Header } from '@/components/Header'
import { ProductCard } from '@/components/ProductCard'
import { getCart } from '@/actions/cart'
import { DashboardNav } from '@/components/DashboardNav'

export default async function ProductsPage() {
    const payloadConfig = await config
    const payload = await getPayload({ config: payloadConfig })
    const headers = await getHeaders()
    const { user } = await payload.auth({ headers })

    const products = await payload.find({
        collection: 'products',
        depth: 2,
        limit: 100,
    })

    const cart = await getCart()
    const cartItemsCount = cart?.items?.length || 0

    return (
        <div className="min-h-screen bg-background">
            <Header user={user} cartItemsCount={cartItemsCount} />
            <DashboardNav />

            <div className="container mx-auto px-4 py-8">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold">All Products</h1>
                    <p className="mt-2 text-muted-foreground">
                        Browse our collection of {products.totalDocs} products
                    </p>
                </div>

                {products.docs.length === 0 ? (
                    <div className="flex min-h-[400px] items-center justify-center rounded-lg border-2 border-dashed">
                        <div className="text-center">
                            <h3 className="text-xl font-semibold">No products available</h3>
                            <p className="mt-2 text-muted-foreground">
                                Check back later for new products!
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {products.docs.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
