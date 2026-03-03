"use client"

import { LoadingScreen } from "../loading/LoadingScreen";
import Navbar from "../Navbar";
import HeroSection from "../HeroSection";
import FeaturesSection from "../FeaturesSection";
import DocsSection from "../DocsSection";
import ContactSection from "../ContactSection";
import Footer from "../Footer";
import { useAuth } from "@/hooks/useAuth";


const LandingPage = () => {
    const { loading: authLoading } = useAuth();

    if(authLoading) return <LoadingScreen statusLoading={authLoading} />
    
    return (
        <div className="min-h-screen bg-background overflow-hidden">
            <Navbar />
            <HeroSection />
            <FeaturesSection />
            <DocsSection />
            <ContactSection />
            <Footer />
        </div>
    );
}

export default LandingPage;
