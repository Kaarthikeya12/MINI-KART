import { headers as getHeaders } from 'next/headers'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { Header } from '@/components/Header'
import { CheckoutForm } from '@/components/CheckoutForm'
import { getCart } from '@/actions/cart'
import { redirect } from 'next/navigation'

export default async function CheckoutPage() {
    const payloadConfig = await config
    const payload = await getPayload({ config: payloadConfig })
    const headers = await getHeaders()
    const { user } = await payload.auth({ headers })

    if (!user) {
        redirect('/login')
    }

    const cart = await getCart()

    if (!cart || !cart.items || cart.items.length === 0) {
        redirect('/cart')
    }

    const cartItemsCount = cart?.items?.length || 0

    return (
        <div className="min-h-screen bg-background">
            <Header user={user} cartItemsCount={cartItemsCount} />

            <div className="container mx-auto px-4 py-8">
                <h1 className="mb-8 text-3xl font-bold">Checkout</h1>
                <CheckoutForm cart={cart} user={user} />
            </div>
        </div>
    )
}
