import { AuthOptions, getServerSession } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import Bycript from 'bcrypt'
import { Session } from 'next-auth'
import { JWT } from "next-auth/jwt"
import { prisma } from '@/lib/prisma'

const authOptions: AuthOptions = {
    providers: [
        CredentialsProvider({
            type: 'credentials',
            name: 'credentials',
            credentials: {
                email: { label: 'email', type: 'text' },
                password: { label: 'password', type: 'password' },
            },
            async authorize(credentials, req) {
                try {
                    if (!credentials) {
                        throw new Error('No credentials provided')
                    }

                    const userLogin = await prisma.user.findFirst({
                        where: {
                            Email: credentials.email,
                        },
                        select: {
                            UserId: true,
                            Nama: true,
                            Email: true,
                            Password: true,
                            UserHasRoles: {
                                select: {
                                    Role: {
                                        select: {
                                            RoleId: true,
                                            Nama: true,
                                            Icon: true
                                        },
                                    },
                                },
                            },
                        },
                    })

                    console.dir(userLogin)

                    if (userLogin === null) {
                        throw new Error('User tidak ditemukan')
                    }

                    if (!userLogin.Password) {
                        throw new Error('Password kosong')
                    }
                    const isPasswordValid = await Bycript.compare(
                        credentials.password,
                        userLogin.Password
                    )
                    if (!isPasswordValid) {
                        throw new Error('Password salah')
                    }

                    const user = {
                        id: userLogin.UserId,
                        nama: userLogin.Nama,
                        email: userLogin.Email,
                        roles: userLogin.UserHasRoles.flatMap(
                            (f) => f.Role
                        ),
                    }

                    return user
                } catch (error) {
                    if (error instanceof Error) {
                        return Promise.reject(error)
                    }
                    return Promise.reject('An unknown error occurred')
                }
            },
        }),
    ],
    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60,
    },
    callbacks: {
        async jwt({ token, user }:{ token: any; user?: any; }) {
            if (user) {
                token.id = user.id
                token.nama = user.nama
                token.email = user.email
                token.roles = user.roles
            }
            return token
        },
        async session({ session, token }: { session: Session; token: JWT }) {
            session.user.id = token.id
            session.user.nama = token.nama
            session.user.email = token.email
            session.user.roles = token.roles
            return session
        },
    },
    pages: {
        signIn: '/login',
        error: '/login',
    },
    cookies: {
        sessionToken: {
            name: `pkl-alif.session-token`,
            options: {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                path: '/',
            },
        },
        callbackUrl: {
            name: `pkl-alif.callback-url`,
            options: {
                sameSite: 'lax',
                path: '/',
                secure: process.env.NODE_ENV === 'production',
            },
        },
        csrfToken: {
            name: `pkl-alif.csrf-token`,
            options: {
                httpOnly: true,
                sameSite: 'lax',
                path: '/',
                secure: process.env.NODE_ENV === 'production',
            },
        },
    },
    secret: process.env.NEXTAUTH_SECRET,
}

const getSession = () => getServerSession(authOptions)

export { authOptions, getSession }
