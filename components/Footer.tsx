import { ArrowUpRight, Github, Mail, Twitter, Zap } from 'lucide-react';
import Link from 'next/link';
import React from 'react'

const footerLinks = [
    {
        title: "Produk",
        links: [
            { label: "Features", href: "#features" },
            { label: "Dokumentasi", href: "#docs" },
            { label: "Pricing", href: "#" },
        ],
    },
    {
        title: "Developer",
        links: [
            { label: "API Reference", href: "#" },
            { label: "SDK Python", href: "#" },
            { label: "SDK Node.js", href: "#" },
        ],
    },
    {
        title: "Perusahaan",
        links: [
            { label: "Tentang Kami", href: "#" },
            { label: "Kontak", href: "#contact" },
            { label: "Blog", href: "#" },
        ],
    },
];

const Footer = () => {
    return (
        <footer className="border-t border-border bg-card/50">
            <div className="container mx-auto px-6 pt-10 pb-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
                    {/* Brand */}
                    <div className="col-span-2 md:col-span-1 space-y-5">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                                <Zap className="w-5 h-5 text-primary-foreground" />
                            </div>
                            <span className="text-lg font-bold text-foreground">RafAI</span>
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
                            API gateway AI terbaik untuk developer Indonesia. Satu API key, akses semua model AI.
                        </p>
                        <div className="flex items-center gap-3">
                            <Link href="#" className="group w-9 h-9 bg-primary-foreground border border-border rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary/80 transition-colors">
                                <Github className="w-4 h-4 group-hover:text-primary" />
                            </Link>
                            <Link href="#" className="group w-9 h-9 bg-primary-foreground border border-border rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary/80 transition-colors">
                                <Twitter className="w-4 h-4 group-hover:text-primary" />
                            </Link>
                            <Link href="#" className="group w-9 h-9 bg-primary-foreground border border-border rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary/80 transition-colors">
                                <Mail className="w-4 h-4 group-hover:text-primary" />
                            </Link>
                        </div>
                    </div>

                    {/* Links */}
                    {footerLinks.map((group) => (
                        <div key={group.title}>
                            <h4 className="text-md font-semibold text-foreground mb-2">{group.title}</h4>
                            <ul className="space-y-1">
                                {group.links.map((link) => (
                                    <li key={link.label}>
                                        <Link
                                            href={link.href}
                                            className="text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1 group"
                                        >
                                            {link.label}
                                            <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Bottom */}
                <div className="mt-6 pt-6 border-t border-border flex flex-col md:flex-row items-center justify-between gap-3">
                    <p className="text-sm text-muted-foreground">
                        © 2026 RafAI. All rights reserved.
                    </p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a>
                        <a href="#" className="hover:text-foreground transition-colors">Terms of Service</a>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer
