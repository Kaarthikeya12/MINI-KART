import { Access } from 'payload'

export const isOwnerOrAdmin: Access = ({ req: { user } }) => {
    if (!user) return false
    if (user.role === 'admin') return true

    return {
        user: {
            equals: user.id,
        },
    }
}
