import React, { useState } from 'react';
import { Menu, X, Home, Users, Bell, Settings, User, LogOut, LogOutIcon } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { logout } from '../lib/api';
import useAuthUser from '../hooks/useAuthuser';

const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { authUser } = useAuthUser();
    const queryclient = useQueryClient();

    const { mutate: logoutMutaion } = useMutation({
        mutationFn: logout,
        onSuccess: () => queryclient.invalidateQueries({ queryKey: ['authUser'] })
    })

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    const closeMenu = () => {
        setIsOpen(false);
    };

    const menuItems = [
        { icon: Home, label: 'Home', href: '/' },
        { icon: Users, label: 'Friends', href: '/friends' },
        { icon: Bell, label: 'Notifications', href: '/notification' },
        { icon: User, label: 'Profile', href: '/profile' },
        { icon: Settings, label: 'Settings', href: '/settings' },
    ];

    return (
        <div className="relative">
            {/* Hamburger Toggle Button */}
            <button
                onClick={toggleMenu}
                className={`fixed top-2 left-1 z-50 w-12 h-12 flex items-center justify-center rounded-lg transition-all duration-300 ${isOpen
                        ? 'bg-transparent text-base-content hover:scale-105'
                        : 'bg-transparent text-base-content hover:bg-base-300/20 hover:scale-105'
                    }`}
                aria-label="Toggle menu"
                aria-expanded={isOpen}
            >
                <div className="relative w-6 h-6">
                    <span
                        className={`absolute left-0 w-6 h-0.5 bg-current transition-all duration-300 rounded-full ${isOpen 
                            ? 'rotate-45 top-2.5' 
                            : 'rotate-0 top-1'
                        }`}
                    />
                    <span
                        className={`absolute left-0 top-2.5 w-6 h-0.5 bg-current transition-all duration-300 rounded-full ${isOpen 
                            ? 'opacity-0 scale-0' 
                            : 'opacity-100 scale-100'
                        }`}
                    />
                    <span
                        className={`absolute left-0 w-6 h-0.5 bg-current transition-all duration-300 rounded-full ${isOpen 
                            ? '-rotate-45 top-2.5' 
                            : 'rotate-0 top-4'
                        }`}
                    />
                </div>
            </button>

            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-30 backdrop-blur-sm"
                    onClick={closeMenu}
                />
            )}

            <div
                className={`fixed top-0 left-0 h-full w-80 bg-base-100 shadow-2xl z-40 transform transition-transform duration-300 ease-in-out border-r border-base-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
            >
                <div className="p-6 bg-gradient-to-r from-primary to-secondary text-primary-content">
                    <div className="flex items-center gap-4 mt-8">
                        <div className="w-12 h-12 rounded-full flex items-center justify-center overflow-hidden ring-2 ring-white/30">
                            {authUser?.profilePic ? (
                                <img 
                                    src={authUser.profilePic} 
                                    alt="Profile" 
                                    className="w-12 h-12 rounded-full object-cover" 
                                />
                            ) : (
                                <img 
                                    src="/default-avatar.png" 
                                    alt="Default Avatar" 
                                    className="w-12 h-12 rounded-full object-cover" 
                                />
                            )}
                        </div>
                        <div>
                            <h2 className="font-bold text-lg">{authUser?.fullName || 'Guest User'}</h2>
                            <p className="text-sm opacity-90">{authUser?.location || 'guest@example.com'}</p>
                        </div>
                    </div>
                </div>

                <nav className="flex-1 py-4">
                    <ul className="space-y-2 px-4">
                        {menuItems.map((item, index) => (
                            <li key={item.label}>
                                <a
                                    href={item.href}
                                    onClick={closeMenu}
                                    className="flex items-center gap-4 px-4 py-3 rounded-lg transition-all duration-200 hover:scale-105 text-base-content hover:bg-base-200 hover:text-primary"
                                >
                                    <item.icon className="w-5 h-5" />
                                    <span className="flex-1 font-medium">{item.label}</span>
                                    {item.badge && (
                                        <div className="badge badge-primary badge-sm animate-pulse">
                                            {item.badge}
                                        </div>
                                    )}
                                </a>
                            </li>
                        ))}
                        
                        <li className="pt-2 border-t border-base-300 mt-4">
                            <button
                                onClick={logoutMutaion}
                                className="flex items-center gap-4 px-4 py-3 text-error rounded-lg transition-all hover:scale-105 hover:bg-error/10 w-full duration-200"
                            >
                                <LogOutIcon className="w-5 h-5" />
                                <span className="font-medium">Sign Out</span>
                            </button>
                        </li>
                    </ul>
                </nav>

                <div className="p-4 border-t border-base-300 bg-base-200/50">
                    <p className="text-sm text-base-content/60 text-center">
                        Version 1.0.0
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;