'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Shield, CheckCircle, Package, Mail, Phone } from 'lucide-react';

export default function BestellingBevestigdPage() {
    const searchParams = useSearchParams();
    const orderId = searchParams.get('orderId');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simulate loading
        setTimeout(() => {
            setLoading(false);
        }, 1000);
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-xl text-gray-600">Bevestiging laden...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
            {/* Header */}
            <header className="bg-white shadow-sm border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center">
                            <Shield className="h-8 w-8 text-blue-600 mr-3" />
                            <Link href="/" className="text-2xl font-bold text-gray-900">SmartLock Store</Link>
                        </div>
                        <nav className="hidden md:flex space-x-8">
                            <Link href="/" className="text-gray-700 hover:text-blue-600 transition-colors">Home</Link>
                            <Link href="/producten" className="text-gray-700 hover:text-blue-600 transition-colors">Producten</Link>
                            <Link href="/over-ons" className="text-gray-700 hover:text-blue-600 transition-colors">Over Ons</Link>
                            <Link href="/contact" className="text-gray-700 hover:text-blue-600 transition-colors">Contact</Link>
                        </nav>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="text-center mb-12">
                    <div className="mx-auto mb-6 w-24 h-24 bg-green-100 rounded-full flex items-center justify-center">
                        <CheckCircle className="h-12 w-12 text-green-600" />
                    </div>
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">Bedankt voor je bestelling!</h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Je bestelling is succesvol geplaatst en we zijn er al mee bezig.
                        Je ontvangt binnenkort een bevestigingsmail.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Order Details */}
                    <div className="bg-white rounded-xl shadow-lg p-6">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                            <Package className="h-6 w-6 mr-3" />
                            Bestelling Details
                        </h2>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Bestelnummer</label>
                                <p className="text-lg font-semibold text-blue-600">#{orderId || 'LOADING'}</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Status</label>
                                <p className="text-lg font-semibold text-green-600">In behandeling</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Besteldatum</label>
                                <p className="text-lg font-medium text-gray-900">{new Date().toLocaleDateString('nl-NL')}</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Verwachte levering</label>
                                <p className="text-lg font-medium text-gray-900">
                                    {new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString('nl-NL')}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* What's Next */}
                    <div className="bg-white rounded-xl shadow-lg p-6">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Wat nu?</h2>

                        <div className="space-y-6">
                            <div className="flex items-start">
                                <div className="bg-blue-100 p-2 rounded-lg mr-4">
                                    <Mail className="h-5 w-5 text-blue-600" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900">Bevestigingsmail</h3>
                                    <p className="text-gray-600">Je ontvangt binnen 5 minuten een bevestigingsmail met alle details.</p>
                                </div>
                            </div>

                            <div className="flex items-start">
                                <div className="bg-green-100 p-2 rounded-lg mr-4">
                                    <Package className="h-5 w-5 text-green-600" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900">Verwerking</h3>
                                    <p className="text-gray-600">We verwerken je bestelling binnen 24 uur en sturen je een trackingcode.</p>
                                </div>
                            </div>

                            <div className="flex items-start">
                                <div className="bg-purple-100 p-2 rounded-lg mr-4">
                                    <Phone className="h-5 w-5 text-purple-600" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900">Vragen?</h3>
                                    <p className="text-gray-600">Neem contact op via <a href="mailto:info@smartlockstore.nl" className="text-blue-600 hover:underline">info@smartlockstore.nl</a></p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                        href="/producten"
                        className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors text-center font-semibold"
                    >
                        Verder winkelen
                    </Link>

                    <Link
                        href="/"
                        className="border border-gray-300 text-gray-700 px-8 py-3 rounded-lg hover:bg-gray-50 transition-colors text-center font-semibold"
                    >
                        Terug naar home
                    </Link>
                </div>

                {/* Additional Information */}
                <div className="mt-16 bg-gray-50 rounded-xl p-8">
                    <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Jouw SmartLock Setup</h3>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                        <div>
                            <div className="bg-blue-100 p-4 rounded-lg mb-4 mx-auto w-16 h-16 flex items-center justify-center">
                                <Package className="h-8 w-8 text-blue-600" />
                            </div>
                            <h4 className="font-semibold text-gray-900 mb-2">1. Ontvang je SmartLock</h4>
                            <p className="text-gray-600">Je SmartLock wordt zorgvuldig ingepakt en binnen 1-3 werkdagen geleverd.</p>
                        </div>

                        <div>
                            <div className="bg-green-100 p-4 rounded-lg mb-4 mx-auto w-16 h-16 flex items-center justify-center">
                                <Phone className="h-8 w-8 text-green-600" />
                            </div>
                            <h4 className="font-semibold text-gray-900 mb-2">2. Download de app</h4>
                            <p className="text-gray-600">Download onze gratis SmartLock app uit de App Store of Google Play.</p>
                        </div>

                        <div>
                            <div className="bg-purple-100 p-4 rounded-lg mb-4 mx-auto w-16 h-16 flex items-center justify-center">
                                <Shield className="h-8 w-8 text-purple-600" />
                            </div>
                            <h4 className="font-semibold text-gray-900 mb-2">3. Koppel en geniet</h4>
                            <p className="text-gray-600">Koppel je SmartLock aan de app en geniet van gemak en veiligheid.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="bg-gray-900 text-white py-12">
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