import { CollectionConfig } from 'payload'

const Discounts: CollectionConfig = {
    slug: 'discounts',
    admin: {
        useAsTitle: 'code',
    },
    access: {
        read: () => true, // Anyone can check if a code is valid (usually logic handled in service)
    },
    fields: [
        {
            name: 'code',
            type: 'text',
            required: true,
            unique: true,
        },
        {
            name: 'type',
            type: 'select',
            required: true,
            options: [
                { label: 'Flat Amount', value: 'flat' },
                { label: 'Percentage', value: 'percentage' },
            ],
        },
        {
            name: 'value',
            type: 'number',
            required: true,
        },
        {
            name: 'expiry',
            type: 'date',
            required: true,
        },
        {
            name: 'maxUses',
            type: 'number',
            required: true,
            admin: {
                description: 'Total number of times this code can be used',
            },
        },
        {
            name: 'usedCount',
            type: 'number',
            defaultValue: 0,
            admin: {
                readOnly: true,
            }
        }
    ],
}

export default Discounts
