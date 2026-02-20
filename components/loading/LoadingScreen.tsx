"use client"

import { useState, useEffect } from "react";
import { Zap } from "lucide-react";
import { motion } from "framer-motion";

interface LoadingScreenProps {
  onFinish?: () => void;
  statusLoading?: boolean;
}

export function LoadingScreen({ onFinish, statusLoading }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (onFinish != null) {
          if (prev >= 100) {
            clearInterval(interval);
            setTimeout(onFinish, 50);
            return 100;
          }

          const increment = prev < 60 ? 2 : prev < 85 ? 3 : 4;
          return Math.min(prev + increment, 100);
        } else {
          if (!statusLoading) {
            clearInterval(interval);
            return 100;
          }

          const increment = prev < 60 ? 2 : prev < 85 ? 3 : 4;
          return Math.min(prev + increment, 90);
        }
      });
    }, 50);
    return () => clearInterval(interval);
  }, [onFinish, statusLoading]);

  useEffect(() => {
    const interval = setInterval(() => {
      setPhase((prev) => (prev + 1) % 4);
      if (phase === 3) {
        clearInterval(interval);
      }
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  const phrases = [
    "Memulai sistem...",
    "Memuat model AI...",
    "Menyiapkan RafAI...",
    "Siap membantu kamu! 🚀",
  ];

  return (
    <div
      className={`fixed inset-0 z-100 flex flex-col items-center justify-center bg-background transition-opacity duration-500 dark ${progress >= 100 ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
    >
      {/* Ambient glow rings */}
      <div className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none">
        <div className="w-125 h-125 rounded-full bg-primary/5 animate-pulse" />
        <div className="absolute w-87.5 h-87.5 rounded-full bg-primary/8 animate-[pulse_3s_ease-in-out_infinite]" />
        <div className="absolute w-50 h-50 rounded-full bg-primary/10 animate-[pulse_2s_ease-in-out_infinite]" />
      </div>

      {/* Logo */}
      <motion.div
        initial={{ opacity: 0, scale: 0.6 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: .7, ease: "easeOut" }}
        className={`relative z-10"
          }`}
      >
        <div className="h-20 w-20 rounded-2xl bg-primary/30 shadow shadow-primary flex items-center justify-center mb-6 glow-primary relative">
          <Zap className="h-10 w-10 text-primary" />
          {/* Orbiting dot */}
          <div className="absolute inset-0 animate-spin" style={{ animationDuration: "3s" }}>
            <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 h-3 w-3 rounded-full bg-primary glow-primary" />
          </div>
        </div>
      </motion.div>

      {/* Brand name */}
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: .7, delay: .2 }}
        className={`relative z-10 text-4xl font-bold text-foreground mb-2"
          }`}
      >
        Raf<span className="text-primary glow-text">AI</span>
      </motion.h1>

      {/* Status text */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: .5, delay: .4 }}
        className={`relative z-10 text-sm text-muted-foreground mb-4 h-5"
          }`}
      >
        {phrases[phase] || phrases[0]}
      </motion.p>

      {/* Progress bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: .5 }}
        className={`relative z-10 w-56 transition-all duration-500"
          }`}
      >
        <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
          <div
            className="h-full rounded-full bg-primary transition-all duration-200 ease-out"
            style={{
              width: `${progress}%`,
              boxShadow: "0 0 12px hsl(var(--glow) / 0.6)",
            }}
          />
        </div>
        <p className="text-sm text-muted-foreground text-center mt-3">
          {progress}%
        </p>
      </motion.div>

      {/* Floating particles */}
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className={`absolute rounded-full bg-primary/20 ${i % 2 == 0 ? "animate-spin" : "animate-pulse"} `}
          style={{
            width: `${6 + i * 3}px`,
            height: `${6 + i * 3}px`,
            top: `${15 + i * 13}%`,
            left: `${10 + i * 15}%`,
            animationDelay: `${i * 0.4}s`,
            animationDuration: `${2 + i * 0.5}s`,
          }}
        />
      ))}
    </div>
  );
}
