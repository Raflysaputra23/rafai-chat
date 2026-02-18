"use client"

import { Github, Mail, MessageCircle } from 'lucide-react';
import { motion } from "framer-motion";

const contacts = [
    {
        icon: Mail,
        label: "Email",
        value: "966raflisaputra@gmail.com",
        href: "mailto:966raflisaputra@gmail.com",
    },
    {
        icon: MessageCircle,
        label: "WhatsApp",
        value: "+62 853-3336-9015",
        href: "https://wa.me/6285333369015?text=Halo,%20saya%20ingin%20bertanya%20tentang%20RafAI%20API",
    },
    {
        icon: Github,
        label: "GitHub",
        value: "github.com/RaflySaputra23",
        href: "https://github.com/RaflySaputra23",
    },
];

const ContactSection = () => {
    return (
        <section id='kontak' className='py-24 relative'>
            <div className='container mx-auto px-6'>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <h2 className="font-sans text-3xl md:text-4xl font-black text-foreground mb-4">
                        Hubungi <span className="gradient-text">Saya</span>
                    </h2>
                    <p className="text-muted-foreground text-md max-w-xl mx-auto">
                        Punya pertanyaan atau butuh bantuan? Kami siap membantu.
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-3 gap-6 max-w-xs md:max-w-3xl mx-auto">
                    {contacts.map((contact, index) => (
                        <motion.a
                            key={contact.label}
                            href={contact.href}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1, duration: 0.5 }}
                            target='_blank'
                            className="group w-full mx-auto rounded-xl bg-card border shadow-[1px_1px_8px_rgba(0,0,0,0.2)] hover:scale-105 border-border p-6 text-center hover:border-primary/30 transition-all duration-300"
                        >
                            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                                <contact.icon className="w-5 h-5 text-primary" />
                            </div>
                            <h3 className="font-semibold text-foreground mb-1">{contact.label}</h3>
                            <p className="text-sm text-muted-foreground">{contact.value}</p>
                        </motion.a>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default ContactSection
