'use client';

import Link from 'next/link';
import { Shield, ShoppingCart } from 'lucide-react';
import { useCart } from '../contexts/CartContext';

interface HeaderProps {
    currentPage?: string;
}

export default function Header({ currentPage = '' }: HeaderProps) {
    const { cartCount } = useCart();

    return (
        <header className="bg-white shadow-sm border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                        <Shield className="h-8 w-8 text-blue-600 mr-3" />
                        <Link href="/" className="text-2xl font-bold text-gray-900">SmartLock Store</Link>
                    </div>
                    <nav className="hidden md:flex space-x-8">
                        <Link
                            href="/"
                            className={`transition-colors ${currentPage === 'home' ? 'text-blue-600 font-semibold' : 'text-gray-700 hover:text-blue-600'}`}
                        >
                            Home
                        </Link>
                        <Link
                            href="/producten"
                            className={`transition-colors ${currentPage === 'producten' ? 'text-blue-600 font-semibold' : 'text-gray-700 hover:text-blue-600'}`}
                        >
                            Producten
                        </Link>
                        <Link
                            href="/over-ons"
                            className={`transition-colors ${currentPage === 'over-ons' ? 'text-blue-600 font-semibold' : 'text-gray-700 hover:text-blue-600'}`}
                        >
                            Over Ons
                        </Link>
                        <Link
                            href="/contact"
                            className={`transition-colors ${currentPage === 'contact' ? 'text-blue-600 font-semibold' : 'text-gray-700 hover:text-blue-600'}`}
                        >
                            Contact
                        </Link>
                    </nav>
                    <div className="flex items-center space-x-4">
                        <Link href="/winkelwagen" className="relative p-2 text-gray-700 hover:text-blue-600 transition-colors">
                            <ShoppingCart className="h-6 w-6" />
                            {cartCount > 0 && (
                                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                    {cartCount}
                                </span>
                            )}
                        </Link>
                    </div>
                </div>
            </div>
        </header>
    );
} 