import React, { useEffect } from "react";
import Header from "../features/landing/components/Header";
import { FooterSection } from "../features/landing/components/FooterSection";
import { motion } from "framer-motion";

const PrivacyPolicy = () => {
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
                        Privacy <span className="text-transparent bg-clip-text bg-gradient-to-r from-electric-cyan to-hot-magenta">Policy</span>
                    </h1>

                    <div className="space-y-12 text-gray-400 leading-relaxed text-lg">
                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4">Introduction</h2>
                            <p>
                                At EduSparkz, we value your privacy and are committed to protecting your personal data. This Privacy Policy outlines how we collect, use, and safeguard your information when you use our AI-powered quiz platform.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4">Information We Collect</h2>
                            <div className="space-y-4">
                                <p>
                                    <strong>Personal Data:</strong> When you register, we collect your name, email address, and account preferences.
                                </p>
                                <p>
                                    <strong>Uploaded Content:</strong> We process the PDFs, documents, and images you upload to generate quizzes. This content is processed securely and is not used to train public models without your consent.
                                </p>
                                <p>
                                    <strong>Usage Data:</strong> We collect information on how you interact with our platform, including quiz scores, study patterns, and device information.
                                </p>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4">How We Use Your Information</h2>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>To provide and maintain our service.</li>
                                <li>To generate personalized quizzes based on your uploaded materials.</li>
                                <li>To track your progress and provide performance analytics.</li>
                                <li>To communicate with you regarding updates, security, and support.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4">Data Security</h2>
                            <p>
                                We implement industry-standard security measures, including JWT-based authentication and end-to-end encryption, to protect your data from unauthorized access or disclosure.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4">Your Rights</h2>
                            <p>
                                You have the right to access, update, or delete your personal information at any time through your account settings. If you have any questions regarding your data, please contact our support team.
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

export default PrivacyPolicy;
