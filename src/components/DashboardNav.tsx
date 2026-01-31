'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
    ShoppingBag,
    User,
    Package,
    Bell,
    Search,
    Grid3x3,
    ShoppingCart,
    LayoutDashboard,
} from 'lucide-react'

const navItems = [
    {
        name: 'Dashboard',
        href: '/dashboard',
        icon: LayoutDashboard,
    },
    {
        name: 'Products',
        href: '/products',
        icon: ShoppingBag,
    },
    {
        name: 'Categories',
        href: '/categories',
        icon: Grid3x3,
    },
    {
        name: 'Search',
        href: '/search',
        icon: Search,
    },
    {
        name: 'Orders',
        href: '/orders',
        icon: Package,
    },
    {
        name: 'Cart',
        href: '/cart',
        icon: ShoppingCart,
    },
    {
        name: 'Profile',
        href: '/profile',
        icon: User,
    },
    {
        name: 'Notifications',
        href: '/notifications',
        icon: Bell,
    },
]

export function DashboardNav() {
    const pathname = usePathname()

    return (
        <nav className="border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
            <div className="container mx-auto px-4">
                <div className="flex items-center gap-1 overflow-x-auto py-3">
                    {navItems.map((item) => {
                        const Icon = item.icon
                        const isActive = pathname === item.href

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    'flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors whitespace-nowrap',
                                    isActive
                                        ? 'bg-primary text-primary-foreground'
                                        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                                )}
                            >
                                <Icon className="h-4 w-4" />
                                {item.name}
                            </Link>
                        )
                    })}
                </div>
            </div>
        </nav>
    )
}
