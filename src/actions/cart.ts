'use server'

import { headers as getHeaders } from 'next/headers'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { revalidatePath } from 'next/cache'

export async function addToCart(productId: string, quantity: number = 1) {
    try {
        const payloadConfig = await config
        const payload = await getPayload({ config: payloadConfig })
        const headers = await getHeaders()
        const { user } = await payload.auth({ headers })

        if (!user) {
            return { success: false, error: 'Please login to add items to cart' }
        }

        // Find user's cart
        const carts = await payload.find({
            collection: 'carts',
            where: {
                user: {
                    equals: user.id,
                },
            },
        })

        let cart = carts.docs[0]

        if (!cart) {
            // Create new cart
            cart = await payload.create({
                collection: 'carts',
                data: {
                    user: user.id,
                    items: [{ product: parseInt(productId), quantity }],
                },
            })
        } else {
            // Update existing cart
            const existingItems = cart.items || []
            const productIdNum = parseInt(productId) // Convert once
            const existingItemIndex = existingItems.findIndex(
                (item: any) => {
                    const itemProductId = typeof item.product === 'object' ? item.product?.id : item.product
                    return itemProductId === productIdNum
                }
            )

            let updatedItems
            if (existingItemIndex > -1) {
                // Update quantity if product exists
                updatedItems = [...existingItems]
                updatedItems[existingItemIndex] = {
                    ...updatedItems[existingItemIndex],
                    quantity: updatedItems[existingItemIndex].quantity + quantity,
                }
            } else {
                // Add new product - FIX: Convert to number
                updatedItems = [...existingItems, { product: parseInt(productId), quantity }]
            }

            cart = await payload.update({
                collection: 'carts',
                id: cart.id,
                data: {
                    items: updatedItems,
                },
            })
        }

        revalidatePath('/cart')
        return { success: true, cart }
    } catch (error: any) {
        console.error('Add to cart error:', error)
        return { success: false, error: error.message || 'Failed to add to cart' }
    }
}

export async function updateCartItem(productId: string, quantity: number) {
    try {
        const payloadConfig = await config
        const payload = await getPayload({ config: payloadConfig })
        const headers = await getHeaders()
        const { user } = await payload.auth({ headers })

        if (!user) {
            return { success: false, error: 'Please login' }
        }

        const carts = await payload.find({
            collection: 'carts',
            where: {
                user: {
                    equals: user.id,
                },
            },
        })

        const cart = carts.docs[0]
        if (!cart) {
            return { success: false, error: 'Cart not found' }
        }

        const productIdNum = parseInt(productId) // Convert once
        const updatedItems = (cart?.items ?? [])
            .map((item: any) => {
                const itemProductId = typeof item.product === 'object' ? item.product?.id : item.product
                if (itemProductId === productIdNum) {
                    return quantity > 0 ? { ...item, quantity } : null
                }
                return item
            })
            .filter(Boolean)

        await payload.update({
            collection: 'carts',
            id: cart.id,
            data: {
                items: updatedItems,
            },
        })

        revalidatePath('/cart')
        return { success: true }
    } catch (error: any) {
        console.error('Update cart error:', error)
        return { success: false, error: error.message || 'Failed to update cart' }
    }
}

export async function removeFromCart(productId: string) {
    return updateCartItem(productId, 0)
}

export async function getCart() {
    try {
        const payloadConfig = await config
        const payload = await getPayload({ config: payloadConfig })
        const headers = await getHeaders()
        const { user } = await payload.auth({ headers })

        if (!user) {
            return null
        }

        const carts = await payload.find({
            collection: 'carts',
            where: {
                user: {
                    equals: user.id,
                },
            },
            depth: 2,
        })

        return carts.docs[0] || null
    } catch (error) {
        console.error('Get cart error:', error)
        return null
    }
}