import { headers as getHeaders } from 'next/headers'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { Header } from '@/components/Header'
import { ProductCard } from '@/components/ProductCard'
import { getCart } from '@/actions/cart'
import { Badge } from '@/components/ui/badge'
import { Sparkles } from 'lucide-react'

export default async function HomePage() {
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })
  const headers = await getHeaders()
  const { user } = await payload.auth({ headers })

  // Fetch all published products
  const products = await payload.find({
    collection: 'products',
    depth: 2,
    limit: 100,
  })

  // Get cart items count
  let cartItemsCount = 0
  if (user) {
    const cart = await getCart()
    cartItemsCount = cart?.items?.length || 0
  }

  return (
    <div className="min-h-screen bg-background">
      <Header user={user} cartItemsCount={cartItemsCount} />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-secondary/10 py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <Badge className="mb-4" variant="secondary">
              <Sparkles className="mr-1 h-3 w-3" />
              Welcome to Mini Kart
            </Badge>
            <h1 className="mb-6 text-5xl font-bold tracking-tight sm:text-6xl">
              Shop the Best Products at{' '}
              <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                Amazing Prices
              </span>
            </h1>
            <p className="mb-8 text-lg text-muted-foreground">
              Discover a wide range of quality products at amazing prices!
            </p>

          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <h2 className="text-3xl font-bold">Featured Products</h2>
          <p className="mt-2 text-muted-foreground">
            Browse our collection of {products.totalDocs} amazing products
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
      </section>

      {/* Features Section */}
      <section className="border-t bg-muted/50 py-16">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 md:grid-cols-3">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <svg className="h-6 w-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="mb-2 font-semibold">Fast Shipping</h3>
              <p className="text-sm text-muted-foreground">
                Quick and reliable delivery on all orders
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <svg className="h-6 w-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="mb-2 font-semibold">Best Prices</h3>
              <p className="text-sm text-muted-foreground">
                Competitive prices on all products with regular discounts
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <svg className="h-6 w-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="mb-2 font-semibold">Quality Products</h3>
              <p className="text-sm text-muted-foreground">
                All products are carefully selected for quality and value
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© 2026 Mini Kart. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
