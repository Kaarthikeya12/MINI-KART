'use server'

import { headers as getHeaders } from 'next/headers'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { redirect } from 'next/navigation'

interface OrderData {
    paymentMethod: 'cod' | 'card' | 'upi' | 'netbanking'
    discountCode?: string
    coinsToUse?: number
    shippingAddress: {
        fullName: string
        phone: string
        addressLine1: string
        addressLine2?: string
        city: string
        state: string
        pincode: string
    }
}

export async function createOrder(orderData: OrderData) {
    try {
        const payloadConfig = await config
        const payload = await getPayload({ config: payloadConfig })
        const headers = await getHeaders()
        const { user } = await payload.auth({ headers })

        if (!user) {
            return { success: false, error: 'Please login to place order' }
        }

        // Get user's cart
        const carts = await payload.find({
            collection: 'carts',
            where: {
                user: {
                    equals: user.id,
                },
            },
            depth: 2,
        })

        const cart = carts.docs[0]
        if (!cart || !cart.items || cart.items.length === 0) {
            return { success: false, error: 'Cart is empty' }
        }

        // Calculate subtotal
        let subtotal = 0
        const orderItems = cart.items.map((item: any) => {
            const product = item.product
            const price = typeof product === 'object' ? product.price : 0
            subtotal += price * item.quantity
            return {
                product: typeof product === 'object' ? product.id : product,
                quantity: item.quantity,
                price,
            }
        })

        // Apply discount if provided
        let discountAmount = 0
        let discountId = null

        if (orderData.discountCode) {
            const discounts = await payload.find({
                collection: 'discounts',
                where: {
                    code: {
                        equals: orderData.discountCode,
                    },
                },
            })

            const discount = discounts.docs[0]
            if (discount) {
                const now = new Date()
                const expiry = new Date(discount.expiry)

                if (expiry > now && discount.usedCount < discount.maxUses) {
                    if (discount.type === 'flat') {
                        discountAmount = discount.value
                    } else if (discount.type === 'percentage') {
                        discountAmount = (subtotal * discount.value) / 100
                    }

                    discountId = discount.id

                    // Update discount usage
                    await payload.update({
                        collection: 'discounts',
                        id: discount.id,
                        data: {
                            usedCount: discount.usedCount + 1,
                        },
                    })
                }
            }
        }

        // Apply coins (1 coin = ₹100)
        const coinsUsed = orderData.coinsToUse || 0
        const coinsDiscount = coinsUsed * 100

        // Validate user has enough coins
        const userData = await payload.findByID({
            collection: 'users',
            id: user.id,
        })

        if (userData.coins < coinsUsed) {
            return { success: false, error: 'Insufficient coins' }
        }

        // Calculate total
        const total = Math.max(0, subtotal - discountAmount - coinsDiscount)

        // Create order
        const order = await payload.create({
            collection: 'orders',
            data: {
                user: user.id,
                items: orderItems,
                subtotal,
                discount: discountId,
                discountAmount,
                coinsUsed,
                total,
                paymentMethod: orderData.paymentMethod,
                shippingAddress: orderData.shippingAddress,
                status: 'pending',
            },
        })

        // Update user coins
        await payload.update({
            collection: 'users',
            id: user.id,
            data: {
                coins: userData.coins - coinsUsed,
            },
        })

        // Clear cart
        await payload.update({
            collection: 'carts',
            id: cart.id,
            data: {
                items: [],
            },
        })

        // Award coins for every 2 orders (1 coin per 2 orders)
        const userOrders = await payload.find({
            collection: 'orders',
            where: {
                user: {
                    equals: user.id,
                },
            },
        })

        const totalOrders = userOrders.totalDocs
        const coinsToAward = Math.floor(totalOrders / 2)
        const currentCoins = userData.coins - coinsUsed

        if (coinsToAward > currentCoins) {
            await payload.update({
                collection: 'users',
                id: user.id,
                data: {
                    coins: coinsToAward,
                },
            })
        }

        return { success: true, orderId: order.id }
    } catch (error: any) {
        console.error('Create order error:', error)
        return { success: false, error: error.message || 'Failed to create order' }
    }
}

export async function getOrders() {
    try {
        const payloadConfig = await config
        const payload = await getPayload({ config: payloadConfig })
        const headers = await getHeaders()
        const { user } = await payload.auth({ headers })

        if (!user) {
            return []
        }

        const orders = await payload.find({
            collection: 'orders',
            where: {
                user: {
                    equals: user.id,
                },
            },
            depth: 2,
            sort: '-createdAt',
        })

        return orders.docs
    } catch (error) {
        console.error('Get orders error:', error)
        return []
    }
}
