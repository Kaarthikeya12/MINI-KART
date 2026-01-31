import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST() {
    const cookieStore = await cookies()

    // Clear the payload token cookie
    cookieStore.delete('payload-token')

    return NextResponse.redirect(new URL('/', process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'))
}
