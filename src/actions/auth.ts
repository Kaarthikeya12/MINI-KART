'use server'

import { headers as getHeaders, cookies } from 'next/headers'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { redirect } from 'next/navigation'

export async function loginAction(formData: FormData) {
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    try {
        const payloadConfig = await config
        const payload = await getPayload({ config: payloadConfig })

        const result = await payload.login({
            collection: 'users',
            data: { email, password },
        })

        if (result.token) {
            const cookieStore = await cookies()
            cookieStore.set('payload-token', result.token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                path: '/',
                maxAge: 60 * 60 * 24 * 30, // 30 days
                sameSite: 'lax',
            })
            return { success: true, user: result.user }
        }

        return { success: false, error: 'Invalid credentials' }
    } catch (error: any) {
        console.error('Login error:', error)
        return { success: false, error: 'Login failed' }
    }
}

export async function signupAction(formData: FormData) {
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    try {
        const payloadConfig = await config
        const payload = await getPayload({ config: payloadConfig })

        const user = await payload.create({
            collection: 'users',
            data: {
                email,
                password,
                role: 'user',
                coins: 0,
            },
        })

        if (user) {
            // Auto login after signup
            const result = await payload.login({
                collection: 'users',
                data: { email, password },
            })

            if (result.token) {
                const cookieStore = await cookies()
                cookieStore.set('payload-token', result.token, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    path: '/',
                    maxAge: 60 * 60 * 24 * 30, // 30 days
                    sameSite: 'lax',
                })
            }

            return { success: true, user: result.user }
        }

        return { success: false, error: 'Signup failed' }
    } catch (error: any) {
        console.error('Signup error:', error)
        return { success: false, error: error.message || 'Signup failed' }
    }
}

export async function logoutAction() {
    try {
        const payloadConfig = await config
        const payload = await getPayload({ config: payloadConfig })
        const headers = await getHeaders()
        
        const cookieStore = await cookies()
        cookieStore.delete('payload-token')

        redirect('/')
    } catch (error) {
        console.error('Logout error:', error)
    }
}

export async function getCurrentUser() {
    try {
        const payloadConfig = await config
        const payload = await getPayload({ config: payloadConfig })
        const headers = await getHeaders()

        const { user } = await payload.auth({ headers })
        return user
    } catch (error) {
        return null
    }
}
