/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff, Lock, Mail } from 'lucide-react';
import { useActionState, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { formLoginValidation } from '@/lib/formValidation';
import ButtonForm from '@/components/loading/ButtonForm';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';

const Login = () => {
    const { signIn, user } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(true);
    const [message, setMessage] = useState<string | null>(null);
    const [error, setError] = useState<boolean>(false);
    const [state, formAction]: any = useActionState(formLoginValidation, null);
    const router = useRouter();


    const resetInput = () => {
        setEmail('');
        setPassword('');
        setShowPassword(true);
        const timeout = setTimeout(() => {
            setMessage("");
            setError(false);
            clearTimeout(timeout);
        }, 4000);
    }

    useEffect(() => {
        if(user) {
            router.push("/dashboard");
        }
    }, [user, router]);

    useEffect(() => {
        if (state) {
            if (state.success) {
                (async () => {
                    try {
                        const { error } = await signIn(email, password);
                        if (error) throw error;
                        setMessage("Login Berhasil");
                        setError(false);
                    } catch (error: unknown) {
                        setMessage(error instanceof Error ? error.message : "Login Gagal");
                        setError(true);
                    } finally {
                        resetInput();
                    }
                })();
            } else {
                setMessage(state.message);
                setError(true);
                resetInput();
            }
        }
    }, [state]);

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className='flex flex-col justify-center items-center w-[96%] max-w-[400] gap-5 overflow-hidden'>
            <div className='w-full shadow-[2px_2px_10px_rgba(0,0,0,0.2)] p-6 rounded-xl bg-card border border-border relative'>
                <h1 className='text-2xl text-foreground tracking-wide text-center font-black mb-1'>Selamat Datang <span className='gradient-text'>Kembali</span></h1>
                <p className='text-sm text-muted-foreground text-center mb-4'>Masuk ke akun anda untuk melanjutkan</p>
                {message && <div className={`flex items-center justify-center ${(state?.success && !error) ? 'bg-green-500/10 border-green-500/30' : 'bg-red-500/10 border-red-500/30'} p-4 rounded-md border mb-4`}>
                    <p className={`text-xs ${(state?.success && !error) ? 'text-green-500/50' : 'text-red-500/50'}`}>{message}</p>
                </div>}
                <form action={formAction} className='w-full space-y-5'>
                    <div className="space-y-1">
                        <Label htmlFor="email" className="text-secondary-foreground text-md">Email</Label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                            <Input
                                id="email"
                                type="email"
                                name='email'
                                placeholder="nama@email.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="pl-10 py-5 bg-input border-border text-foreground placeholder:text-muted-foreground focus:ring-primary focus:border-primary"
                                required
                            />
                            <p className='text-xs text-destructive absolute -bottom-4.5 left-1'>{state?.error?.email}</p>
                        </div>
                    </div>
                    <div className="space-y-1 mb-6">
                        <Label htmlFor="password" className="text-secondary-foreground text-md">Password</Label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                            <Input
                                id="password"
                                type={showPassword ? "password" : "text"}
                                placeholder="********"
                                value={password}
                                name='password'
                                onChange={(e) => setPassword(e.target.value)}
                                className="pl-10 py-5 bg-input border-border text-foreground placeholder:text-muted-foreground focus:ring-primary focus:border-primary"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                            >
                                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                            </button>
                            <p className='text-xs text-destructive absolute -bottom-4.5 left-1'>{state?.error?.password}</p>
                        </div>
                    </div>
                    <ButtonForm variant='hero'>Masuk</ButtonForm>
                </form>
                <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-border" />
                    </div>
                    <div className="relative flex justify-center text-xs">
                        <span className="bg-card px-3 text-muted-foreground">atau</span>
                    </div>
                </div>

                <Button
                    variant="outline"
                    className="w-full border-border bg-secondary/50 text-foreground hover:bg-secondary hover:text-foreground h-11 font-medium"
                >
                    <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                    </svg>
                    Masuk dengan Google
                </Button>
            </div>
            <p className='text-muted-foreground'>Belum punya akun? <Link href="/register" className="text-primary hover:underline">Daftar</Link></p>
        </motion.div>
    )
}

export default Login;
