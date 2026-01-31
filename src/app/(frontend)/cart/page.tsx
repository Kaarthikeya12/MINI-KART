import { headers as getHeaders } from 'next/headers'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { Header } from '@/components/Header'
import { CartItems } from '@/components/CartItems'
import { getCart } from '@/actions/cart'
import { redirect } from 'next/navigation'
import { DashboardNav } from '@/components/DashboardNav'

export default async function CartPage() {
    const payloadConfig = await config
    const payload = await getPayload({ config: payloadConfig })
    const headers = await getHeaders()
    const { user } = await payload.auth({ headers })

    if (!user) {
        redirect('/login')
    }

    const cart = await getCart()
    const cartItemsCount = cart?.items?.length || 0

    return (
        <div className="min-h-screen bg-background">
            <Header user={user} cartItemsCount={cartItemsCount} />
            <DashboardNav />

            <div className="container mx-auto px-4 py-8">
                <h1 className="mb-8 text-3xl font-bold">Shopping Cart</h1>
                <CartItems cart={cart} user={user} />
            </div>
        </div>
    )
}
