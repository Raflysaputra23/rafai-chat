import React from 'react'



const AuthLayout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
    return (
        <div className='w-full min-h-screen flex items-center justify-center grid-pattern overflow-y-auto overflow-x-hidden'>
            {/* Glow orb */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 rounded-full bg-primary/10 blur-[120px] animate-pulse pointer-events-none" />
            {children}
        </div>
    )
}

export default AuthLayout;
