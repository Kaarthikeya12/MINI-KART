'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ShoppingCart, Minus, Plus, Zap } from 'lucide-react'
import { addToCart } from '@/actions/cart'
import { useRouter } from 'next/navigation'

interface ProductDetailProps {
    product: any
}

export function ProductDetail({ product }: ProductDetailProps) {
    const router = useRouter()
    const [quantity, setQuantity] = useState(1)
    const [isAdding, setIsAdding] = useState(false)
    const [isBuying, setIsBuying] = useState(false)
    const [selectedImage, setSelectedImage] = useState(0)

    const images = product.images || []
    const currentImageUrl = images[selectedImage]?.image?.url || '/placeholder.png'

    const handleAddToCart = async () => {
        setIsAdding(true)
        try {
            const result = await addToCart(product.id, quantity)
            if (result.success) {
                alert('Added to cart!')
            } else {
                alert(result.error || 'Failed to add to cart')
            }
        } catch (error) {
            alert('Failed to add to cart')
        } finally {
            setIsAdding(false)
        }
    }

    const handleBuyNow = async () => {
        setIsBuying(true)
        try {
            const result = await addToCart(product.id, quantity)
            if (result.success) {
                router.push('/cart')
            } else {
                alert(result.error || 'Failed to proceed')
            }
        } catch (error) {
            alert('Failed to proceed')
        } finally {
            setIsBuying(false)
        }
    }

    return (
        <div className="grid gap-8 lg:grid-cols-2">
            {/* Product Images */}
            <div className="space-y-4">
                <div className="relative aspect-square overflow-hidden rounded-lg bg-muted">
                    <Image
                        src={currentImageUrl}
                        alt={product.name}
                        fill
                        className="object-cover"
                        priority
                    />
                    {product.stock === 0 && (
                        <Badge className="absolute right-4 top-4" variant="destructive">
                            Out of Stock
                        </Badge>
                    )}
                </div>

                {images.length > 1 && (
                    <div className="grid grid-cols-4 gap-4">
                        {images.map((img: any, index: number) => (
                            <button
                                key={index}
                                onClick={() => setSelectedImage(index)}
                                className={`relative aspect-square overflow-hidden rounded-md border-2 transition-all ${selectedImage === index ? 'border-primary' : 'border-transparent'
                                    }`}
                            >
                                <Image
                                    src={img.image?.url || '/placeholder.png'}
                                    alt={`${product.name} ${index + 1}`}
                                    fill
                                    className="object-cover"
                                />
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Product Info */}
            <div className="space-y-6">
                <div>
                    <h1 className="mb-2 text-4xl font-bold">{product.name}</h1>
                    {product.categories && product.categories.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                            {product.categories.map((category: any) => (
                                <Badge key={category.id} variant="secondary">
                                    {typeof category === 'object' ? category.name : category}
                                </Badge>
                            ))}
                        </div>
                    )}
                </div>

                <div className="flex items-baseline gap-4">
                    <span className="text-4xl font-bold text-primary">
                        ₹{product.price.toLocaleString()}
                    </span>
                    {product.stock > 0 && product.stock < 10 && (
                        <Badge variant="destructive">Only {product.stock} left!</Badge>
                    )}
                </div>

                <Card>
                    <CardContent className="p-6">
                        <h2 className="mb-3 font-semibold">Description</h2>
                        <p className="text-muted-foreground">{product.description}</p>
                    </CardContent>
                </Card>

                {product.stock > 0 && (
                    <Card>
                        <CardContent className="p-6 space-y-4">
                            <div className="flex items-center gap-4">
                                <span className="font-semibold">Quantity:</span>
                                <div className="flex items-center gap-2">
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        disabled={isAdding}
                                    >
                                        <Minus className="h-4 w-4" />
                                    </Button>
                                    <span className="w-12 text-center font-semibold">{quantity}</span>
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                                        disabled={isAdding}
                                    >
                                        <Plus className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <Button
                                    className="flex-1"
                                    size="lg"
                                    variant="outline"
                                    onClick={handleAddToCart}
                                    disabled={isAdding || isBuying}
                                >
                                    <ShoppingCart className="mr-2 h-5 w-5" />
                                    {isAdding ? 'Adding...' : 'Add to Cart'}
                                </Button>
                                <Button
                                    className="flex-1"
                                    size="lg"
                                    onClick={handleBuyNow}
                                    disabled={isAdding || isBuying}
                                >
                                    <Zap className="mr-2 h-5 w-5" />
                                    {isBuying ? 'Processing...' : 'Buy Now'}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {product.stock === 0 && (
                    <Card className="border-destructive">
                        <CardContent className="p-6">
                            <p className="text-center font-semibold text-destructive">
                                This product is currently out of stock
                            </p>
                        </CardContent>
                    </Card>
                )}

                <Card className="bg-muted/50">
                    <CardContent className="p-6 space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                            <svg className="h-5 w-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span>Free shipping on all orders</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <svg className="h-5 w-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span>Earn coins with every purchase</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <svg className="h-5 w-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span>Multiple payment options available</span>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
