"use client"

import ReactMarkdown from "react-markdown";
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { useState } from "react";
import { Check, Copy } from "lucide-react";

interface Props {
    content: string;
}

const cleanTheme = {
    ...oneDark,
    'pre[class*="language-"]': {
        ...oneDark['pre[class*="language-"]'],
        background: "transparent",
    },
};

const ChatRemarkdown = ({ content }: Props) => {
    const [copied, setCopied] = useState(false);
    const copyCode = (code: string) => {
        navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <ReactMarkdown

            remarkPlugins={[remarkGfm]}
            components={{
                code({ className, children, ...props }) {
                    const match = /language-(\w+)/.exec(className || "");
                    const isBlock = !!match;

                    if (isBlock) {
                        return (
                            <div className="my-4 rounded-xl overflow-hidden border border-zinc-700 bg-[#1e1e1e]">

                                {/* Header terminal */}
                                <div className="flex items-center justify-between gap-2 px-4 py-2 bg-zinc-800">
                                    <div className="flex items-center gap-2">
                                        <span className="w-3 h-3 bg-red-500 rounded-full" />
                                        <span className="w-3 h-3 bg-yellow-500 rounded-full" />
                                        <span className="w-3 h-3 bg-green-500 rounded-full" />
                                        <span className="ml-3 text-xs text-zinc-400">
                                            {match[1]}
                                        </span>
                                    </div>
                                    <button
                                        onClick={() => copyCode(String(children).replace(/\n$/, ""))}
                                        className="flex items-center cursor-pointer gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        {copied ? <Check className="w-3.5 h-3.5 text-primary" /> : <Copy className="w-3.5 h-3.5" />}
                                        {copied ? "Disalin!" : "Salin"}
                                    </button>
                                </div>
                                <SyntaxHighlighter
                                    style={cleanTheme}
                                    language={match[1]}
                                    PreTag="div"

                                >
                                    {String(children).replace(/\n$/, "")}
                                </SyntaxHighlighter>
                            </div>
                        );
                    }

                    return (
                        <code className="bg-zinc-800 px-1 py-0.5 rounded text-sm">
                            {children}
                        </code>
                    );
                }
            }}
        >
            {content}
        </ReactMarkdown>
    )
}

export default ChatRemarkdown;
