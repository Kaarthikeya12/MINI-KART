'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ShoppingCart, Zap } from 'lucide-react'
import { addToCart } from '@/actions/cart'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface ProductCardProps {
    product: any
}

export function ProductCard({ product }: ProductCardProps) {
    const router = useRouter()
    const [isAdding, setIsAdding] = useState(false)
    const [isBuying, setIsBuying] = useState(false)
    const imageUrl = product.images?.[0]?.image?.url || '/placeholder.png'

    const handleAddToCart = async () => {
        setIsAdding(true)
        try {
            const result = await addToCart(product.id, 1)
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
            const result = await addToCart(product.id, 1)
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
        <Card className="group overflow-hidden transition-all hover:shadow-lg">
            <Link href={`/products/${product.slug}`}>
                <div className="relative aspect-square overflow-hidden bg-muted">
                    <Image
                        src={imageUrl}
                        alt={product.name}
                        fill
                        className="object-cover transition-transform group-hover:scale-105"
                    />
                    {product.stock === 0 && (
                        <Badge className="absolute right-2 top-2" variant="destructive">
                            Out of Stock
                        </Badge>
                    )}
                </div>
            </Link>

            <CardContent className="p-4">
                <Link href={`/products/${product.slug}`}>
                    <h3 className="font-semibold line-clamp-1 hover:text-primary transition-colors">
                        {product.name}
                    </h3>
                </Link>
                <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                    {product.description}
                </p>
                <div className="mt-2 flex items-center justify-between">
                    <span className="text-2xl font-bold text-primary">
                        ₹{product.price.toLocaleString()}
                    </span>
                    {product.stock > 0 && product.stock < 10 && (
                        <Badge variant="secondary">Only {product.stock} left</Badge>
                    )}
                </div>
            </CardContent>

            <CardFooter className="p-4 pt-0 flex gap-2">
                <Button
                    className="flex-1"
                    variant="outline"
                    onClick={handleAddToCart}
                    disabled={product.stock === 0 || isAdding || isBuying}
                >
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    {isAdding ? 'Adding...' : 'Add to Cart'}
                </Button>
                <Button
                    className="flex-1"
                    onClick={handleBuyNow}
                    disabled={product.stock === 0 || isAdding || isBuying}
                >
                    <Zap className="mr-2 h-4 w-4" />
                    {isBuying ? 'Processing...' : 'Buy Now'}
                </Button>
            </CardFooter>
        </Card>
    )
}
