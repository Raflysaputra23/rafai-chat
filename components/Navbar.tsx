"use client"

import { Menu, Moon, Sun, X, Zap } from 'lucide-react';
import { useEffect, useState } from 'react'
import { Button } from './ui/button';
import Link from 'next/link';
import useTheme from '@/hooks/useTheme';

const Navbar = () => {
    const { isDark, toggleTheme } = useTheme();
    const [scrolled, setScrolled] = useState(false);
    const [sidebar, setSidebar] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        const handleResize = () => {
            if (window.innerWidth > 768) {
                setSidebar(false);
            }
        };

        window.addEventListener("resize", handleResize);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const toggleSidebar = () => {
        setSidebar(!sidebar);
    };

    return (
        <nav
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-background/80 backdrop-blur-md border-b border-border" : "bg-transparent"
                }`}
        >
            <div className="container mx-auto px-6 h-16 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                        <Zap className="w-5 h-5 text-primary-foreground" />
                    </div>
                    <span className="text-xl font-bold text-foreground">RafAI</span>
                </div>

                <div className="hidden md:flex items-center gap-8">
                    <Link href="#fitur" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
                        Fitur
                    </Link>
                    <Link href="#dokumentasi" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
                        Dokumentasi
                    </Link>
                    <Link href="#kontak" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
                        Kontak
                    </Link>
                </div>

                <section className="flex items-center gap-2">
                    <Button
                        onClick={toggleTheme}
                        variant={'heroOutline'}
                        className="w-9 h-9 rounded-lg bg-secondary flex items-center justify-center text-foreground hover:bg-secondary/80 transition-colors"
                        aria-label="Toggle theme"
                    >
                        {isDark ? <Moon size={14} className='text-primary'/> : <Sun size={14} className='text-primary'/>}
                    </Button>
                    <Button onClick={toggleSidebar} variant={'hero'} className={`${sidebar && "bg-red-500 hover:bg-red-600"} w-9 h-9 md:hidden rounded-lg flex items-center justify-center`}>
                        {sidebar ? <X size={14} className="text-primary-foreground" /> : <Menu size={14} className="text-primary-foreground" />}
                    </Button>
                </section>

                {/* Sidebar Mobile */}
                <section className={`${sidebar ? "opacity-100 visible translate-x-0" : "opacity-0 invisible translate-x-24"} fixed left-0 right-0 top-16 h-screen z-50 bg-background/95 backdrop-blur-md transition-all duration-300`}>
                    <div className="flex flex-col pt-32 items-center gap-2 px-6 py-4 h-full">
                        <Link onClick={toggleSidebar} href="#fitur" className="font-bold text-muted-foreground hover:text-foreground transition-colors text-3xl">
                            Fitur
                        </Link>
                        <Link onClick={toggleSidebar} href="#dokumentasi" className="font-bold text-muted-foreground hover:text-foreground transition-colors text-3xl">
                            Dokumentasi
                        </Link>
                        <Link onClick={toggleSidebar} href="#kontak" className="font-bold text-muted-foreground hover:text-foreground transition-colors text-3xl">
                            Kontak
                        </Link>
                    </div>
                </section>
            </div>
        </nav>
    )
}

export default Navbar
