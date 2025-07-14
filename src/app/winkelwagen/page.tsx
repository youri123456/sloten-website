'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Shield, ShoppingCart, Trash2, Plus, Minus, ArrowLeft } from 'lucide-react';
import { useCart } from '../../contexts/CartContext';
import Header from '../../components/Header';



export default function WinkelwagenPage() {
    const [loading, setLoading] = useState(true);
    const { cartItems, updateQuantity, removeFromCart, clearCart, getTotalPrice, cartCount } = useCart();

    useEffect(() => {
        setLoading(false);
    }, []);

    const getTotalItems = () => {
        return cartCount;
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-xl text-gray-600">Winkelwagen laden...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
            <Header currentPage="winkelwagen" />

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Back to Shopping */}
                <div className="mb-8">
                    <Link href="/producten" className="flex items-center text-blue-600 hover:text-blue-800 transition-colors">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Verder winkelen
                    </Link>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Cart Items */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                            <div className="p-6 border-b border-gray-200">
                                <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                                    <ShoppingCart className="h-6 w-6 mr-3" />
                                    Winkelwagen ({getTotalItems()} {getTotalItems() === 1 ? 'item' : 'items'})
                                </h1>
                            </div>

                            {cartItems.length === 0 ? (
                                <div className="p-12 text-center">
                                    <ShoppingCart className="h-24 w-24 text-gray-300 mx-auto mb-4" />
                                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Je winkelwagen is leeg</h3>
                                    <p className="text-gray-600 mb-6">
                                        Voeg wat producten toe om aan de slag te gaan!
                                    </p>
                                    <Link
                                        href="/producten"
                                        className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                    >
                                        Start met winkelen
                                    </Link>
                                </div>
                            ) : (
                                <div className="p-6">
                                    {cartItems.map((item) => (
                                        <div key={item.id} className="flex items-center py-6 border-b border-gray-200 last:border-b-0">
                                            <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                                <Shield className="h-10 w-10 text-blue-600" />
                                            </div>

                                            <div className="ml-6 flex-1">
                                                <h3 className="text-lg font-semibold text-gray-900">{item.name}</h3>
                                                <p className="text-gray-600 text-sm mt-1">{item.description.substring(0, 100)}...</p>
                                                <div className="flex items-center mt-2">
                                                    <span className="text-lg font-bold text-blue-600">€{item.price}</span>
                                                    <span className="text-sm text-gray-500 ml-2">per stuk</span>
                                                </div>
                                            </div>

                                            <div className="flex items-center space-x-4">
                                                <div className="flex items-center space-x-2">
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                        className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                                                        disabled={item.quantity <= 1}
                                                    >
                                                        <Minus className="h-4 w-4 text-gray-600" />
                                                    </button>
                                                    <span className="w-8 text-center font-medium">{item.quantity}</span>
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                        className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                                                        disabled={item.quantity >= item.stock}
                                                    >
                                                        <Plus className="h-4 w-4 text-gray-600" />
                                                    </button>
                                                </div>

                                                <div className="text-right">
                                                    <div className="font-semibold text-gray-900">
                                                        €{(item.price * item.quantity).toFixed(2)}
                                                    </div>
                                                </div>

                                                <button
                                                    onClick={() => removeFromCart(item.id)}
                                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                >
                                                    <Trash2 className="h-5 w-5" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}

                                    {cartItems.length > 0 && (
                                        <div className="mt-6 text-right">
                                            <button
                                                onClick={clearCart}
                                                className="text-red-600 hover:text-red-800 transition-colors"
                                            >
                                                Winkelwagen legen
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Order Summary */}
                    {cartItems.length > 0 && (
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-8">
                                <h2 className="text-xl font-bold text-gray-900 mb-6">Bestelling</h2>

                                <div className="space-y-4">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Subtotaal</span>
                                        <span className="font-medium">€{getTotalPrice().toFixed(2)}</span>
                                    </div>

                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Verzendkosten</span>
                                        <span className="font-medium text-green-600">Gratis</span>
                                    </div>

                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500">BTW (21%)</span>
                                        <span className="text-gray-500">Inbegrepen</span>
                                    </div>

                                    <div className="border-t pt-4">
                                        <div className="flex justify-between text-lg font-bold">
                                            <span>Totaal</span>
                                            <span className="text-blue-600">€{getTotalPrice().toFixed(2)}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-6 space-y-4">
                                    <Link
                                        href="/afrekenen"
                                        className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors text-center font-semibold block"
                                    >
                                        Afrekenen
                                    </Link>

                                    <Link
                                        href="/producten"
                                        className="w-full border border-gray-300 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors text-center font-semibold block"
                                    >
                                        Verder winkelen
                                    </Link>
                                </div>

                                <div className="mt-6 text-sm text-gray-500">
                                    <p>✓ Gratis verzending binnen Nederland</p>
                                    <p>✓ 30 dagen retourrecht</p>
                                    <p>✓ 2 jaar garantie</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Footer */}
            <footer className="bg-gray-900 text-white py-12 mt-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        <div>
                            <div className="flex items-center mb-4">
                                <Shield className="h-8 w-8 text-blue-400 mr-3" />
                                <h3 className="text-xl font-bold">SmartLock Store</h3>
                            </div>
                            <p className="text-gray-400">
                                Jouw betrouwbare partner voor innovatieve slottechnologie.
                            </p>
                        </div>

                        <div>
                            <h4 className="text-lg font-semibold mb-4">Producten</h4>
                            <ul className="space-y-2 text-gray-400">
                                <li><Link href="/producten" className="hover:text-white transition-colors">Alle Producten</Link></li>
                                <li><Link href="/producten?category=fietsslot" className="hover:text-white transition-colors">Fietssloten</Link></li>
                                <li><Link href="/producten?category=kabelslot" className="hover:text-white transition-colors">Kabelsloten</Link></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="text-lg font-semibold mb-4">Klantenservice</h4>
                            <ul className="space-y-2 text-gray-400">
                                <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="text-lg font-semibold mb-4">Bedrijf</h4>
                            <ul className="space-y-2 text-gray-400">
                                <li><Link href="/over-ons" className="hover:text-white transition-colors">Over Ons</Link></li>
                                <li><Link href="/voorwaarden" className="hover:text-white transition-colors">Voorwaarden</Link></li>
                            </ul>
                        </div>
                    </div>

                    <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
                        <p>&copy; 2025 SmartLock Store. Alle rechten voorbehouden.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
} 