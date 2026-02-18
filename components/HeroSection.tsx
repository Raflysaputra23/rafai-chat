"use client"

import { motion } from "framer-motion";
import { ArrowRight, FileText, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import Link from "next/link";


const codeTabs = [
    {
        id: "javascript",
        label: "JavaScript",
        file: "request.js",
        code: (
            <>
                <span className="text-primary">const</span>{" "}
                <span className="text-foreground">response</span>{" "}
                <span className="text-muted-foreground">=</span>{" "}
                <span className="text-primary">await</span>{" "}
                <span className="text-foreground">fetch</span>
                <span className="text-muted-foreground">(</span>
                <span className="text-accent">&quot;https://rafai-api.vercel.app/v1/chat&quot;</span>
                <span className="text-muted-foreground">, {"{"}</span>
                {"\n"}{"  "}
                <span className="text-foreground">method</span>
                <span className="text-muted-foreground">:</span>{" "}
                <span className="text-accent">&quot;POST&quot;</span>
                <span className="text-muted-foreground">,</span>
                {"\n"}{"  "}
                <span className="text-foreground">headers</span>
                <span className="text-muted-foreground">:</span>{" "}
                <span className="text-muted-foreground">{"{"}</span>{" "}
                <span className="text-accent">&quot;Authorization&quot;</span>
                <span className="text-muted-foreground">:</span>{" "}
                <span className="text-accent">{"`Bearer ${" + "API_KEY" + "}`"}</span>{" "}
                <span className="text-muted-foreground">{"}"}</span>
                <span className="text-muted-foreground">,</span>
                {"\n"}{"  "}
                <span className="text-foreground">body</span>
                <span className="text-muted-foreground">:</span>{" "}
                <span className="text-foreground">JSON</span>
                <span className="text-muted-foreground">.</span>
                <span className="text-foreground">stringify</span>
                <span className="text-muted-foreground">({"{"}</span>{" "}
                <span className="text-foreground">prompt</span>
                <span className="text-muted-foreground">:</span>{" "}
                <span className="text-accent">&quot;Hello RafAI!&quot;</span>{" "}
                <span className="text-muted-foreground">{"}"})</span>
                {"\n"}
                <span className="text-muted-foreground">{"}"})</span>
            </>
        ),
    },
    {
        id: "python",
        label: "Python",
        file: "request.py",
        code: (
            <>
                <span className="text-primary">import</span>{" "}
                <span className="text-foreground">requests</span>
                {"\n\n"}
                <span className="text-foreground">response</span>{" "}
                <span className="text-muted-foreground">=</span>{" "}
                <span className="text-foreground">requests</span>
                <span className="text-muted-foreground">.</span>
                <span className="text-foreground">post</span>
                <span className="text-muted-foreground">(</span>
                {"\n"}{"  "}
                <span className="text-accent">&quot;https://rafai-api.vercel.app/v1/chat&quot;</span>
                <span className="text-muted-foreground">,</span>
                {"\n"}{"  "}
                <span className="text-foreground">headers</span>
                <span className="text-muted-foreground">={"{"}</span>
                <span className="text-accent">&quot;Authorization&quot;</span>
                <span className="text-muted-foreground">:</span>{" "}
                <span className="text-accent">&quot;Bearer {"{"}</span>
                <span className="text-foreground">API_KEY</span>
                <span className="text-accent">{"}"}&quot;</span>
                <span className="text-muted-foreground">{"}"}</span>
                <span className="text-muted-foreground">,</span>
                {"\n"}{"  "}
                <span className="text-foreground">json</span>
                <span className="text-muted-foreground">={"{"}</span>
                <span className="text-accent">&quot;prompt&quot;</span>
                <span className="text-muted-foreground">:</span>{" "}
                <span className="text-accent">&quot;Hello RafAI!&quot;</span>
                <span className="text-muted-foreground">{"}"}</span>
                {"\n"}
                <span className="text-muted-foreground">)</span>
            </>
        ),
    },
];

const HeroSection = () => {
    const [activeTab, setActiveTab] = useState("javascript");
    const activeCode = codeTabs.find((t) => t.id === activeTab)!;

    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden grid-pattern">
            {/* Glow orb */}
            <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 rounded-full bg-primary/10 blur-[120px] animate-pulse pointer-events-none" />

            <div className="container mx-auto px-6 pt-24 pb-16 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="text-center max-w-4xl mx-auto"
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-8"
                    >
                        <Sparkles className="w-4 h-4 animate-pulse" />
                        API AI Terpercaya di Indonesia
                    </motion.div>

                    <h1 className="text-5xl md:text-7xl font-sans font-black tracking-tight mb-6 text-foreground leading-[1.1]">
                        Bangun Masa Depan
                        <br />
                        dengan{" "}
                        <span className="gradient-text">RafAI API</span>
                    </h1>

                    <p className="text-md md:text-lg text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
                        Akses berbagai model AI canggih melalui satu API sederhana.
                        Mulai integrasikan kecerdasan buatan ke aplikasimu dalam hitungan menit.
                    </p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5, duration: 0.6 }}
                        className="flex flex-col sm:flex-row items-center justify-center gap-4"
                    >
                        <Button variant="hero" size="lg" className="group px-8 py-6 text-base flex items-center gap-2" asChild>
                            <Link href="/chat">
                                Mulai Sekarang
                                <ArrowRight className="group-hover:translate-x-1.5 w-6 h-6 transition" />
                            </Link>
                        </Button>
                        <Button variant="heroOutline" size="lg" className="px-8 py-6 text-base flex items-center gap-2">
                            Lihat Dokumentasi
                            <FileText className="w-6 h-6" />
                        </Button>
                    </motion.div>

                    {/* Code preview */}
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8, duration: 0.8 }}
                        className="mt-16 max-w-2xl mx-auto"
                    >
                        <div className="rounded-xl bg-card border border-border overflow-hidden shadow-[1px_1px_8px_rgba(0,0,0,0.2)]">
                            <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-destructive/60" />
                                    <div className="w-3 h-3 rounded-full bg-primary/40" />
                                    <div className="w-3 h-3 rounded-full bg-primary/60" />
                                    <span className="text-xs text-muted-foreground ml-2 font-mono">{activeCode.file}</span>
                                </div>
                                <div className="flex items-center gap-1 bg-muted/50 rounded-lg p-0.5">
                                    {codeTabs.map((tab) => (
                                        <button
                                            key={tab.id}
                                            onClick={() => setActiveTab(tab.id)}
                                            className={`px-3 cursor-pointer py-1 text-xs font-medium rounded-md transition-all ${activeTab === tab.id
                                                ? "bg-primary text-primary-foreground shadow-sm"
                                                : "text-muted-foreground hover:text-foreground"
                                                }`}
                                        >
                                            {tab.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <pre className="p-5 text-sm font-mono text-left overflow-x-auto">
                                <code>{activeCode.code}</code>
                            </pre>
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
}

export default HeroSection
