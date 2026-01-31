'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react'
import { updateCartItem, removeFromCart } from '@/actions/cart'
import { useRouter } from 'next/navigation'

interface CartItemsProps {
    cart: any
    user: any
}

export function CartItems({ cart, user }: CartItemsProps) {
    const router = useRouter()
    const [updatingItems, setUpdatingItems] = useState<Set<string>>(new Set())

    if (!cart || !cart.items || cart.items.length === 0) {
        return (
            <div className="flex min-h-[400px] flex-col items-center justify-center rounded-lg border-2 border-dashed">
                <ShoppingBag className="mb-4 h-16 w-16 text-muted-foreground" />
                <h2 className="mb-2 text-2xl font-semibold">Your cart is empty</h2>
                <p className="mb-6 text-muted-foreground">
                    Add some products to get started
                </p>
                <Link href="/">
                    <Button>Continue Shopping</Button>
                </Link>
            </div>
        )
    }

    const handleUpdateQuantity = async (productId: string, newQuantity: number) => {
        setUpdatingItems(prev => new Set(prev).add(productId))
        await updateCartItem(productId, newQuantity)
        router.refresh()
        setUpdatingItems(prev => {
            const next = new Set(prev)
            next.delete(productId)
            return next
        })
    }

    const handleRemove = async (productId: string) => {
        setUpdatingItems(prev => new Set(prev).add(productId))
        await removeFromCart(productId)
        router.refresh()
    }

    const subtotal = cart.items.reduce((total: number, item: any) => {
        const product = item.product
        const price = typeof product === 'object' ? product.price : 0
        return total + price * item.quantity
    }, 0)

    return (
        <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-4">
                {cart.items.map((item: any) => {
                    const product = item.product
                    if (typeof product !== 'object') return null

                    const isUpdating = updatingItems.has(product.id)
                    const imageUrl = product.images?.[0]?.image?.url || '/placeholder.png'

                    return (
                        <Card key={product.id}>
                            <CardContent className="p-4">
                                <div className="flex gap-4">
                                    <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-md bg-muted">
                                        <Image
                                            src={imageUrl}
                                            alt={product.name}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>

                                    <div className="flex flex-1 flex-col justify-between">
                                        <div>
                                            <Link href={`/products/${product.slug}`}>
                                                <h3 className="font-semibold hover:text-primary transition-colors">
                                                    {product.name}
                                                </h3>
                                            </Link>
                                            <p className="mt-1 text-sm text-muted-foreground line-clamp-1">
                                                {product.description}
                                            </p>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <Button
                                                    variant="outline"
                                                    size="icon"
                                                    className="h-8 w-8"
                                                    onClick={() => handleUpdateQuantity(product.id, item.quantity - 1)}
                                                    disabled={isUpdating || item.quantity <= 1}
                                                >
                                                    <Minus className="h-3 w-3" />
                                                </Button>
                                                <span className="w-12 text-center font-medium">
                                                    {item.quantity}
                                                </span>
                                                <Button
                                                    variant="outline"
                                                    size="icon"
                                                    className="h-8 w-8"
                                                    onClick={() => handleUpdateQuantity(product.id, item.quantity + 1)}
                                                    disabled={isUpdating || item.quantity >= product.stock}
                                                >
                                                    <Plus className="h-3 w-3" />
                                                </Button>
                                            </div>

                                            <div className="flex items-center gap-4">
                                                <span className="text-lg font-bold">
                                                    ₹{(product.price * item.quantity).toLocaleString()}
                                                </span>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => handleRemove(product.id)}
                                                    disabled={isUpdating}
                                                >
                                                    <Trash2 className="h-4 w-4 text-destructive" />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )
                })}
            </div>

            <div className="lg:col-span-1">
                <Card className="sticky top-20">
                    <CardContent className="p-6 space-y-4">
                        <h2 className="text-xl font-semibold">Order Summary</h2>

                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Subtotal</span>
                                <span className="font-medium">₹{subtotal.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Shipping</span>
                                <span className="font-medium">FREE</span>
                            </div>
                            <div className="border-t pt-2">
                                <div className="flex justify-between">
                                    <span className="font-semibold">Total</span>
                                    <span className="text-2xl font-bold text-primary">
                                        ₹{subtotal.toLocaleString()}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2 pt-4">
                            <Link href="/checkout">
                                <Button className="w-full" size="lg">
                                    Proceed to Checkout
                                </Button>
                            </Link>
                            <Link href="/">
                                <Button variant="outline" className="w-full">
                                    Continue Shopping
                                </Button>
                            </Link>
                        </div>

                        {user.coins > 0 && (
                            <div className="rounded-lg bg-primary/10 p-4 text-sm">
                                <p className="font-medium text-primary">
                                    You have {user.coins} coins!
                                </p>
                                <p className="mt-1 text-xs text-muted-foreground">
                                    Use them at checkout to save ₹{user.coins * 100}
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
