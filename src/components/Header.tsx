'use client'

import Link from 'next/link'
import { ShoppingCart, User, LogOut, Package, LayoutDashboard } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface HeaderProps {
    user: any
    cartItemsCount: number
}

export function Header({ user, cartItemsCount }: HeaderProps) {
    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto flex h-16 items-center justify-between px-4">
                <Link href="/" className="flex items-center space-x-2">
                    <ShoppingCart className="h-6 w-6 text-primary" />
                    <span className="text-xl font-bold">Mini Kart</span>
                </Link>

                <nav className="flex items-center space-x-6">
                    <Link href="/" className="text-sm font-medium transition-colors hover:text-primary">
                        Home
                    </Link>
                    <Link href="/products" className="text-sm font-medium transition-colors hover:text-primary">
                        Products
                    </Link>
                    {user && (
                        <Link href="/dashboard" className="text-sm font-medium transition-colors hover:text-primary">
                            Dashboard
                        </Link>
                    )}

                    {user ? (
                        <>
                            <Link href="/cart" className="relative">
                                <Button variant="ghost" size="icon">
                                    <ShoppingCart className="h-5 w-5" />
                                    {cartItemsCount > 0 && (
                                        <Badge className="absolute -right-2 -top-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                                            {cartItemsCount}
                                        </Badge>
                                    )}
                                </Button>
                            </Link>

                            <Link href="/orders">
                                <Button variant="ghost" size="icon">
                                    <Package className="h-5 w-5" />
                                </Button>
                            </Link>



                            <Link href="/profile">
                                <Button variant="ghost" size="icon">
                                    <User className="h-5 w-5" />
                                </Button>
                            </Link>

                            <form action="/api/logout" method="POST">
                                <Button variant="ghost" size="icon" type="submit">
                                    <LogOut className="h-5 w-5" />
                                </Button>
                            </form>
                        </>
                    ) : (
                        <>
                            <Link href="/login">
                                <Button variant="ghost">Login</Button>
                            </Link>
                            <Link href="/signup">
                                <Button>Sign Up</Button>
                            </Link>
                        </>
                    )}
                </nav>
            </div>
        </header>
    )
}
