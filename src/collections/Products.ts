import { CollectionConfig } from 'payload'

const Products: CollectionConfig = {
    slug: 'products',
    admin: {
        useAsTitle: 'name',
    },
    access: {
        read: ({ req: { user } }) => {
            // Admins can see everything
            if (user?.role === 'admin') return true

            // Others can only see published products
            return {
                status: {
                    equals: 'published',
                },
            }
        },
    },
    fields: [
        {
            name: 'name',
            type: 'text',
            required: true,
        },
        {
            name: 'slug',
            type: 'text',
            required: true,
            unique: true,
            admin: {
                description: 'Used for product URLs',
            },
        },
        {
            name: 'description',
            type: 'textarea',
            required: true,
        },
        {
            name: 'images',
            type: 'array',
            required: true,
            minRows: 1,
            fields: [
                {
                    name: 'image',
                    type: 'relationship',
                    relationTo: 'media',
                    required: true,
                },
            ],
        },
        {
            name: 'price',
            type: 'number',
            required: true,
            min: 0,
        },
        {
            name: 'categories',
            type: 'relationship',
            relationTo: 'categories',
            hasMany: true,
            required: true,
        },
        {
            name: 'stock',
            type: 'number',
            required: true,
            defaultValue: 0,
            min: 0,
        },
        {
            name: 'status',
            type: 'select',
            defaultValue: 'draft',
            options: [
                { label: 'Draft', value: 'draft' },
                { label: 'Published', value: 'published' },
            ],
            admin: {
                position: 'sidebar',
            },
        },
    ],
}

export default Products
