import { CollectionConfig } from 'payload'
import { isOwnerOrAdmin } from '../payload/access/isOwnerOrAdmin'

const Carts: CollectionConfig = {
    slug: 'carts',
    access: {
        read: isOwnerOrAdmin,
        update: isOwnerOrAdmin,
        delete: isOwnerOrAdmin,
        create: ({ req: { user } }) => !!user,
    },
    fields: [
        {
            name: 'user',
            type: 'relationship',
            relationTo: 'users',
            required: true,
            unique: true,
        },
        {
            name: 'items',
            type: 'array',
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
            ],
        },
    ],
}

export default Carts
