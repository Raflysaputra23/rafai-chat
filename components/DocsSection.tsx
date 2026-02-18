"use client"

import { motion } from "framer-motion"
import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";

interface CodeExample {
    title: string;
    language: string;
    code: string;
}

const codeExamples = [
    {
        title: "2. Kirim Request Pertama",
        language: "javascript",
        code: `const response = await fetch("https://api.rafai.id/v1/chat", {
  method: "POST",
  headers: {
    "Authorization": "Bearer YOUR_API_KEY",
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    model: "gpt-4",
    messages: [{ role: "user", content: "Halo RafAI!" }]
  })
});

const data = await response.json();
console.log(data.choices[0].message.content);`,
    },
    {
        title: "3. Streaming Response",
        language: "javascript",
        code: `const stream = await fetch("https://api.rafai.id/v1/chat/stream", {
  method: "POST",
  headers: { "Authorization": "Bearer YOUR_API_KEY" },
  body: JSON.stringify({
    model: "claude-3",
    messages: [{ role: "user", content: "Jelaskan AI" }],
    stream: true
  })
});`,
    },
];

const CodeBlock = ({ example }: { example: CodeExample }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(example.code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="rounded-xl bg-card border border-border overflow-hidden shadow-[1px_1px_8px_rgba(0,0,0,0.2)]">
            <div className="flex justify-between items-center gap-2 px-4 py-3 border-b border-border">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-destructive/60" />
                    <div className="w-3 h-3 rounded-full bg-primary/40" />
                    <div className="w-3 h-3 rounded-full bg-primary/60" />
                    <span className="text-xs text-muted-foreground ml-2 font-mono">rafai.js</span>
                </div>
                <button
                    onClick={handleCopy}
                    className="flex items-center cursor-pointer gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                    {copied ? <Check className="w-3.5 h-3.5 text-primary" /> : <Copy className="w-3.5 h-3.5" />}
                    {copied ? "Copied!" : "Copy"}
                </button>
            </div>
            <pre className="p-5 text-sm font-mono text-left overflow-x-auto">
                <code className="text-foreground/85">{example.code}</code>
            </pre>
        </div>
    );
};

const DocsSection = () => {
    return (
        <section id="dokumentasi" className="py-24 relative">
            <div className="container mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <h2 className="font-sans text-3xl md:text-4xl font-black text-foreground mb-4">
                        Mulai dalam <span className="gradient-text">3 Langkah</span>?
                    </h2>
                    <p className="text-muted-foreground text-md max-w-xl mx-auto">
                        Integrasi semudah copy-paste. Tidak perlu setup rumit.
                    </p>
                </motion.div>

                <div className="max-w-3xl mx-auto mb-16 space-y-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="text-start"
                    >
                        <h3 className="text-lg font-medium text-foreground">1. Dapatkan API Key</h3>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="text-start"
                    >
                        <Button variant={"heroOutline"} className="text-xl p-6">Dapatkan API Key</Button>
                    </motion.div>
                </div>

                <div className="max-w-3xl mx-auto space-y-6">
                    {codeExamples.map((example, index) => (
                        <motion.div
                            key={example.title}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.15, duration: 0.5 }}
                            className="space-y-6"
                        >
                            <h3 className="text-lg font-medium text-foreground">{example.title}</h3>
                            <CodeBlock example={example} />
                        </motion.div>
                    ))}
                </div>
            </div>

        </section>
    )
}

export default DocsSection
