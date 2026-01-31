import { CollectionConfig } from 'payload'

export const Orders: CollectionConfig = {
    slug: 'orders',
    admin: {
        useAsTitle: 'id',
    },
    access: {
        read: ({ req: { user } }) => {
            if (user?.role === 'admin') return true
            if (user) return { user: { equals: user.id } }
            return false
        },
        create: ({ req: { user } }) => !!user,
        update: ({ req: { user } }) => user?.role === 'admin',
        delete: ({ req: { user } }) => user?.role === 'admin',
    },
    fields: [
        {
            name: 'user',
            type: 'relationship',
            relationTo: 'users',
            required: true,
            index: false,
        },
        {
            name: 'items',
            type: 'array',
            required: true,
            fields: [
                {
                    name: 'product',
                    type: 'relationship',
                    relationTo: 'products',
                    required: true,
                },
                {
                    name: 'quantity',
                    type: 'number',
                    required: true,
                    min: 1,
                },
                {
                    name: 'price',
                    type: 'number',
                    required: true,
                },
            ],
        },
        {
            name: 'subtotal',
            type: 'number',
            required: true,
        },
        {
            name: 'discount',
            type: 'relationship',
            relationTo: 'discounts',
        },
        {
            name: 'discountAmount',
            type: 'number',
            defaultValue: 0,
        },
        {
            name: 'coinsUsed',
            type: 'number',
            defaultValue: 0,
            admin: {
                description: '1 coin = ₹100 discount',
            },
        },
        {
            name: 'total',
            type: 'number',
            required: true,
        },
        {
            name: 'paymentMethod',
            type: 'select',
            required: true,
            options: [
                { label: 'Cash on Delivery', value: 'cod' },
                { label: 'Credit/Debit Card', value: 'card' },
                { label: 'UPI', value: 'upi' },
                { label: 'Net Banking', value: 'netbanking' },
            ],
        },
        {
            name: 'shippingAddress',
            type: 'group',
            fields: [
                {
                    name: 'fullName',
                    type: 'text',
                    required: true,
                },
                {
                    name: 'phone',
                    type: 'text',
                    required: true,
                },
                {
                    name: 'addressLine1',
                    type: 'text',
                    required: true,
                },
                {
                    name: 'addressLine2',
                    type: 'text',
                },
                {
                    name: 'city',
                    type: 'text',
                    required: true,
                },
                {
                    name: 'state',
                    type: 'text',
                    required: true,
                },
                {
                    name: 'pincode',
                    type: 'text',
                    required: true,
                },
            ],
        },
        {
            name: 'status',
            type: 'select',
            defaultValue: 'pending',
            options: [
                { label: 'Pending', value: 'pending' },
                { label: 'Processing', value: 'processing' },
                { label: 'Shipped', value: 'shipped' },
                { label: 'Delivered', value: 'delivered' },
                { label: 'Cancelled', value: 'cancelled' },
            ],
        },
    ],
}
