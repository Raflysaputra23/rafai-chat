"use client"

import { useState } from "react";
import { LoadingScreen } from "../loading/LoadingScreen";
import Navbar from "../Navbar";
import HeroSection from "../HeroSection";
import FeaturesSection from "../FeaturesSection";
import DocsSection from "../DocsSection";
import ContactSection from "../ContactSection";
import Footer from "../Footer";


const LandingPage = () => {
    const [loading, setLoading] = useState<boolean>(true);
    
    return loading ? <LoadingScreen onFinish={() => setLoading(false)} /> : (
        <div className="min-h-screen bg-background">
            <Navbar />
            <HeroSection />
            <FeaturesSection />
            <DocsSection />
            <ContactSection />
            <Footer />
        </div>);
}

export default LandingPage;
