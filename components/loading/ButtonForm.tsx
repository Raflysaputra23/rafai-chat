"use client"

import React from 'react'
import { useFormStatus } from 'react-dom'
import { Button } from '../ui/button';
import { Loader2 } from 'lucide-react';

const ButtonForm = ({ children, variant, style }: { children: React.ReactNode; variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link" | "hero" | "heroOutline"; style?: string }) => {
    const { pending } = useFormStatus();
    return (
        <Button disabled={pending} type="submit" variant={variant} className={`disabled:cursor-not-allowed text-foreground w-full ${style}`}>
            {pending ? <>{children} <Loader2 strokeWidth={3} className="h-6 w-6 animate-spin" /> </> : children}
        </Button>)

}

export default ButtonForm;
