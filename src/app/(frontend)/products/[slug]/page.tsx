import { headers as getHeaders } from 'next/headers'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { Header } from '@/components/Header'
import { getCart } from '@/actions/cart'
import { notFound } from 'next/navigation'

import { ProductDetail } from '../../../../components/ProductDetail'

type PageProps = {
    params: Promise<{
        slug: string
    }>
}

export default async function ProductPage({ params }: PageProps) {
    const { slug } = await params
    const payloadConfig = await config
    const payload = await getPayload({ config: payloadConfig })
    const headers = await getHeaders()
    const { user } = await payload.auth({ headers })

    const products = await payload.find({
        collection: 'products',
        where: {
            slug: {
                equals: slug,
            },
        },
        depth: 2,
    })

    const product = products.docs[0]

    if (!product) {
        notFound()
    }

    const cart = await getCart()
    const cartItemsCount = cart?.items?.length || 0

    return (
        <div className="min-h-screen bg-background">
            <Header user={user} cartItemsCount={cartItemsCount} />

            <div className="container mx-auto px-4 py-8">
                <ProductDetail product={product} />
            </div>
        </div>
    )
}
