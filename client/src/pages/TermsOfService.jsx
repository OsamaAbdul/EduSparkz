import React, { useEffect } from "react";
import Header from "../features/landing/components/Header";
import { FooterSection } from "../features/landing/components/FooterSection";
import { motion } from "framer-motion";

const TermsOfService = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="min-h-screen bg-space-dark text-white selection:bg-electric-cyan/30">
            <Header />

            <main className="max-w-4xl mx-auto px-6 pt-32 pb-20">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <h1 className="text-4xl md:text-6xl font-bold mb-8 tracking-tighter">
                        Terms of <span className="text-transparent bg-clip-text bg-gradient-to-r from-electric-cyan to-hot-magenta">Service</span>
                    </h1>

                    <div className="space-y-12 text-gray-400 leading-relaxed text-lg">
                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4">Acceptance of Terms</h2>
                            <p>
                                By accessing or using EduSparkz, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4">User Responsibilities</h2>
                            <div className="space-y-4">
                                <p>
                                    You are responsible for maintaining the confidentiality of your account information and for all activities that occur under your account.
                                </p>
                                <p>
                                    You agree not to upload any content that is illegal, harmful, or infringes upon the intellectual property rights of others.
                                </p>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4">Intellectual Property</h2>
                            <p>
                                The platform, including its AI models, algorithms, and interface, is the property of EduSparkz. You retain ownership of the content you upload, but grant us a license to process it for the purpose of providing our services.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4">Limitation of Liability</h2>
                            <p>
                                EduSparkz provides its services "as is" without any warranties. We shall not be liable for any indirect, incidental, or consequential damages resulting from the use or inability to use our services.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4">Changes to Terms</h2>
                            <p>
                                We reserve the right to modify these terms at any time. Your continued use of the platform after such changes constitutes acceptance of the new terms.
                            </p>
                        </section>

                        <section className="pt-8 border-t border-white/10">
                            <p className="text-sm">
                                Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                            </p>
                        </section>
                    </div>
                </motion.div>
            </main>

            <FooterSection />
        </div>
    );
};

export default TermsOfService;
