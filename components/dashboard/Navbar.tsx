"use client"

import { LogOut, Zap } from 'lucide-react'
import { Button } from '../ui/button'
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import Modal from '../ui/modal';
import { useState } from 'react';

const Navbar = () => {
    const { signOut } = useAuth();
    const [showModal, setShowModal] = useState(false);
    const router = useRouter();

    const handleLogout = () => {
        signOut().then(() => {
            router.push('/login');
        }).catch((error) => {
            console.log(error);
        })

    }

    return (
        <>
            <nav className="border-b border-border bg-card/50 backdrop-blur-xl sticky top-0 z-50">
                <div className="container mx-auto px-3 lg:px-6 h-16 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                            <Zap className="w-5 h-5 text-primary-foreground" />
                        </div>
                        <span className="text-xl font-bold text-foreground">RafAI</span>
                    </Link>
                    <Button onClick={() => setShowModal(true)} variant="default" className="bg-red-500/50 border border-red-500 cursor-pointer hover:bg-red-500/80 text-foreground" size={"lg"}>
                        <LogOut className="w-4 h-4 mr-2" /> Keluar
                    </Button>
                </div>
            </nav>
            <Modal showForm={showModal} size="md" resetForm={() => setShowModal(false)}>
                <h1 className='text-xl font-black mb-2'>Keluar</h1>
                <p className='text-sm text-muted-foreground mb-4'>Apakah anda yakin ingin keluar dari halaman ini?</p>
                <div className='flex justify-end gap-2'>
                    <Button onClick={() => setShowModal(false)} variant="hero" className="" size={"default"}>
                        Tidak
                    </Button>
                    <Button onClick={handleLogout} variant="hero" className="bg-red-500 border  cursor-pointer hover:bg-red-500/80 text-foreground" size={"default"}>
                        Keluar
                    </Button>
                </div>
            </Modal>
        </>
    )
}

export default Navbar;
