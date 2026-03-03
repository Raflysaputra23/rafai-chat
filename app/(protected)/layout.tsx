import Navbar from '@/components/dashboard/Navbar';
import { Metadata } from 'next';
import React from 'react'

export const metadata: Metadata = {
    title: "Dashboard"
}

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-dvh overflow-hidden bg-background">
        <Navbar />
        {children}
    </div>
  );
}

export default DashboardLayout;
