import { CollectionConfig } from 'payload'
import { isOwnerOrAdmin } from '../payload/access/isOwnerOrAdmin'

const Notifications: CollectionConfig = {
    slug: 'notifications',
    admin: {
        useAsTitle: 'message',
    },
    access: {
        read: isOwnerOrAdmin,
        create: () => false, // Only system/admin can create
        update: ({ req: { user } }) => user?.role === 'admin',
        delete: isOwnerOrAdmin,
    },
    fields: [
        {
            name: 'user',
            type: 'relationship',
            relationTo: 'users',
            required: true,
        },
        {
            name: 'message',
            type: 'text',
            required: true,
        },
        {
            name: 'type',
            type: 'select',
            options: [
                { label: 'Order Placed', value: 'order_placed' },
                { label: 'Status Update', value: 'status_update' },
            ],
        },
    ],
}

export default Notifications
