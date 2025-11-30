import React, { useState, useEffect } from 'react';
import { AdminSidebar } from './AdminSidebar';
import Header from './Header';
import { useMediaQuery } from 'react-responsive';
import { motion, AnimatePresence } from 'framer-motion';

export const AdminLayout = ({ children }) => {
    const isLaptop = useMediaQuery({ minWidth: 1024 });
    const [sidebarOpen, setSidebarOpen] = useState(true);

    useEffect(() => {
        setSidebarOpen(isLaptop);
    }, [isLaptop]);

    const toggleSidebar = () => setSidebarOpen((prev) => !prev);

    return (
        <div className="flex h-[100dvh] overflow-hidden bg-space-dark text-white relative">
            {/* 🌌 Background Effects */}
            <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10 pointer-events-none z-0" />
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-red-500/5 rounded-full blur-[100px] pointer-events-none z-0" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-orange-500/5 rounded-full blur-[100px] pointer-events-none z-0" />

            {/* Sidebar */}
            <AnimatePresence mode="wait">
                {sidebarOpen && (
                    <motion.aside
                        initial={{ x: isLaptop ? 0 : -300, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: isLaptop ? 0 : -300, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 120, damping: 20 }}
                        className={`fixed lg:static inset-y-0 left-0 z-[60] w-64 flex-shrink-0 bg-space-dark/80 backdrop-blur-xl border-r border-white/10`}
                    >
                        <AdminSidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
                    </motion.aside>
                )}
            </AnimatePresence>

            {/* Main Content Wrapper */}
            <div className="flex-1 flex flex-col min-w-0 relative z-10 transition-all duration-300">
                <Header toggleSidebar={toggleSidebar} />

                <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-6 lg:p-8 scrollbar-thin scrollbar-thumb-red-500/20 scrollbar-track-transparent">
                    {children}
                </main>
            </div>

            {/* Mobile Overlay */}
            <AnimatePresence>
                {!isLaptop && sidebarOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSidebarOpen(false)}
                        className="fixed inset-0 bg-black/80 z-40 backdrop-blur-sm lg:hidden"
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

export default AdminLayout;
