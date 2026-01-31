'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Coins, CreditCard, Smartphone, Building2, Banknote } from 'lucide-react'
import { createOrder } from '@/actions/orders'

interface CheckoutFormProps {
    cart: any
    user: any
}

export function CheckoutForm({ cart, user }: CheckoutFormProps) {
    const router = useRouter()
    const [isProcessing, setIsProcessing] = useState(false)
    const [error, setError] = useState('')
    const [discountCode, setDiscountCode] = useState('')
    const [coinsToUse, setCoinsToUse] = useState(0)
    const [paymentMethod, setPaymentMethod] = useState<'cod' | 'card' | 'upi' | 'netbanking'>('cod')

    const subtotal = cart.items.reduce((total: number, item: any) => {
        const product = item.product
        const price = typeof product === 'object' ? product.price : 0
        return total + price * item.quantity
    }, 0)

    const maxCoins = Math.min(user.coins || 0, Math.floor(subtotal / 100))
    const coinsDiscount = coinsToUse * 100

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsProcessing(true)
        setError('')

        const formData = new FormData(e.currentTarget)

        const result = await createOrder({
            paymentMethod,
            discountCode: discountCode || undefined,
            coinsToUse,
            shippingAddress: {
                fullName: formData.get('fullName') as string,
                phone: formData.get('phone') as string,
                addressLine1: formData.get('addressLine1') as string,
                addressLine2: formData.get('addressLine2') as string,
                city: formData.get('city') as string,
                state: formData.get('state') as string,
                pincode: formData.get('pincode') as string,
            },
        })

        if (result.success) {
            router.push(`/orders/${result.orderId}`)
        } else {
            setError(result.error || 'Failed to place order')
            setIsProcessing(false)
        }
    }

    const paymentMethods = [
        { id: 'cod', label: 'Cash on Delivery', icon: Banknote },
        { id: 'card', label: 'Credit/Debit Card', icon: CreditCard },
        { id: 'upi', label: 'UPI', icon: Smartphone },
        { id: 'netbanking', label: 'Net Banking', icon: Building2 },
    ]

    return (
        <form onSubmit={handleSubmit}>
            <div className="grid gap-8 lg:grid-cols-3">
                <div className="lg:col-span-2 space-y-6">
                    {/* Shipping Address */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Shipping Address</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <label htmlFor="fullName" className="text-sm font-medium">
                                        Full Name *
                                    </label>
                                    <Input
                                        id="fullName"
                                        name="fullName"
                                        required
                                        disabled={isProcessing}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="phone" className="text-sm font-medium">
                                        Phone Number *
                                    </label>
                                    <Input
                                        id="phone"
                                        name="phone"
                                        type="tel"
                                        required
                                        disabled={isProcessing}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="addressLine1" className="text-sm font-medium">
                                    Address Line 1 *
                                </label>
                                <Input
                                    id="addressLine1"
                                    name="addressLine1"
                                    required
                                    disabled={isProcessing}
                                />
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="addressLine2" className="text-sm font-medium">
                                    Address Line 2
                                </label>
                                <Input
                                    id="addressLine2"
                                    name="addressLine2"
                                    disabled={isProcessing}
                                />
                            </div>

                            <div className="grid gap-4 sm:grid-cols-3">
                                <div className="space-y-2">
                                    <label htmlFor="city" className="text-sm font-medium">
                                        City *
                                    </label>
                                    <Input
                                        id="city"
                                        name="city"
                                        required
                                        disabled={isProcessing}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="state" className="text-sm font-medium">
                                        State *
                                    </label>
                                    <Input
                                        id="state"
                                        name="state"
                                        required
                                        disabled={isProcessing}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="pincode" className="text-sm font-medium">
                                        Pincode *
                                    </label>
                                    <Input
                                        id="pincode"
                                        name="pincode"
                                        required
                                        disabled={isProcessing}
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Payment Method */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Payment Method</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-3 sm:grid-cols-2">
                                {paymentMethods.map((method) => {
                                    const Icon = method.icon
                                    return (
                                        <button
                                            key={method.id}
                                            type="button"
                                            onClick={() => setPaymentMethod(method.id as any)}
                                            disabled={isProcessing}
                                            className={`flex items-center gap-3 rounded-lg border-2 p-4 transition-all ${paymentMethod === method.id
                                                    ? 'border-primary bg-primary/5'
                                                    : 'border-border hover:border-primary/50'
                                                }`}
                                        >
                                            <Icon className="h-5 w-5" />
                                            <span className="font-medium">{method.label}</span>
                                        </button>
                                    )
                                })}
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
                            {/* Cart Items */}
                            <div className="space-y-3 border-b pb-4">
                                {cart.items.map((item: any) => {
                                    const product = item.product
                                    if (typeof product !== 'object') return null
                                    const imageUrl = product.images?.[0]?.image?.url || '/placeholder.png'

                                    return (
                                        <div key={product.id} className="flex gap-3">
                                            <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md bg-muted">
                                                <Image
                                                    src={imageUrl}
                                                    alt={product.name}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-sm font-medium line-clamp-1">{product.name}</p>
                                                <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                                                <p className="text-sm font-semibold">
                                                    ₹{(product.price * item.quantity).toLocaleString()}
                                                </p>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>

                            {/* Discount Code */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Discount Code</label>
                                <div className="flex gap-2">
                                    <Input
                                        placeholder="Enter code"
                                        value={discountCode}
                                        onChange={(e) => setDiscountCode(e.target.value)}
                                        disabled={isProcessing}
                                    />
                                </div>
                            </div>

                            {/* Coins */}
                            {maxCoins > 0 && (
                                <div className="space-y-2 rounded-lg bg-primary/10 p-3">
                                    <div className="flex items-center justify-between">
                                        <label className="text-sm font-medium flex items-center gap-1">
                                            <Coins className="h-4 w-4 text-primary" />
                                            Use Coins
                                        </label>
                                        <Badge variant="secondary">{user.coins} available</Badge>
                                    </div>
                                    <Input
                                        type="number"
                                        min="0"
                                        max={maxCoins}
                                        value={coinsToUse}
                                        onChange={(e) => setCoinsToUse(Math.min(maxCoins, parseInt(e.target.value) || 0))}
                                        disabled={isProcessing}
                                    />
                                    <p className="text-xs text-muted-foreground">
                                        Max {maxCoins} coins (₹{maxCoins * 100} off)
                                    </p>
                                </div>
                            )}

                            {/* Price Breakdown */}
                            <div className="space-y-2 border-t pt-4">
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Subtotal</span>
                                    <span>₹{subtotal.toLocaleString()}</span>
                                </div>
                                {coinsDiscount > 0 && (
                                    <div className="flex justify-between text-sm text-primary">
                                        <span>Coins Discount</span>
                                        <span>-₹{coinsDiscount.toLocaleString()}</span>
                                    </div>
                                )}
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Shipping</span>
                                    <span>FREE</span>
                                </div>
                                <div className="border-t pt-2">
                                    <div className="flex justify-between">
                                        <span className="font-semibold">Total</span>
                                        <span className="text-2xl font-bold text-primary">
                                            ₹{Math.max(0, subtotal - coinsDiscount).toLocaleString()}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {error && (
                                <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                                    {error}
                                </div>
                            )}

                            <Button type="submit" className="w-full" size="lg" disabled={isProcessing}>
                                {isProcessing ? 'Processing...' : 'Place Order'}
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </form>
    )
}
