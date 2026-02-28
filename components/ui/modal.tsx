import React from 'react'
import { AnimatePresence, motion } from 'framer-motion'

interface ModalProps {
    showForm: boolean;
    children: React.ReactNode;
    resetForm: () => void;
    size: 'sm' | 'md' | 'lg';
}

const Modal = ({ showForm, children, resetForm, size }: ModalProps) => {
    return (
        <AnimatePresence>
            {showForm && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4"
                    onClick={(e) => { if (e.target === e.currentTarget) resetForm(); }}
                >
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.95, opacity: 0 }}
                        className={`bg-card border border-border rounded-2xl p-6 w-[96%] ${size === 'sm' ? 'max-w-sm' : size === 'md' ? 'max-w-md' : 'max-w-lg'} shadow-2xl`}
                    >
                        {children}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}

export default Modal;
