"use client"

import { Code2, Cpu, FileCode2, Shield } from 'lucide-react';
import { motion } from "framer-motion";

const features = [
    {
        icon: Cpu,
        title: "Multi-Model AI",
        description:
            "Akses berbagai model AI terbaik seperti GPT, Claude, Gemini, dan lainnya melalui satu endpoint API. Tidak perlu mengelola banyak API key dari berbagai provider.",
    },
    {
        icon: Shield,
        title: "Aman & Reliable",
        description:
            "Infrastruktur yang aman dengan enkripsi end-to-end, rate limiting cerdas, dan uptime 99.9%. Data pengguna kamu terlindungi dengan standar keamanan tertinggi.",
    },
    {
    icon: FileCode2,
    title: "Python SDK",
    description:
      "Gunakan RafAI langsung dari Python dengan SDK resmi. Cocok untuk machine learning, data science, automation, dan integrasi backend Python kamu.",
  },
  {
    icon: Code2,
    title: "JavaScript / Node.js SDK",
    description:
      "Integrasi seamless dengan JavaScript dan Node.js. Sempurna untuk web app, API server Express, dan project fullstack kamu.",
  },
];
const FeaturesSection = () => {

    return (
        <section id='fitur' className='py-24 relative'>
            <div className='containter mx-auto px-6'>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <h2 className="font-sans text-3xl md:text-4xl font-black text-foreground mb-4">
                        Kenapa <span className="gradient-text">RafAI</span>?
                    </h2>
                    <p className="text-muted-foreground text-md max-w-xl mx-auto">
                        Solusi API AI yang simpel, cepat, dan powerful untuk developer Indonesia.
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                    {features.map((feature, index) => (
                        <motion.div
                            key={feature.title}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.15, duration: 0.6 }}
                            className="group shadow-[1px_1px_8px_rgba(0,0,0,0.2)] hover:scale-105 relative rounded-2xl bg-card border border-border p-8 hover:border-primary/30 transition-all duration-300"
                        >
                            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-5 group-hover:bg-primary/20 transition-colors">
                                <feature.icon className="w-6 h-6 text-primary" />
                            </div>
                            <h3 className="text-xl font-semibold text-foreground mb-3">{feature.title}</h3>
                            <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default FeaturesSection
