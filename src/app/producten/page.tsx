'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Shield, Star, Check } from 'lucide-react';
import { useCart } from '../../contexts/CartContext';
import { useToast } from '../../contexts/ToastContext';
import Header from '../../components/Header';
import { Product, getAllProducts } from '../../data/products';

// Fallback products in case import fails
const fallbackProducts: Product[] = [
    {
        id: 1,
        name: 'Smart Fietsslot Pro',
        description: 'Revolutionair fietsslot dat je met je smartphone kunt openen.',
        price: 89.99,
        image: '/images/fietsslot.png',
        category: 'fietsslot',
        stock: 25,
        features: ['Smartphone opening', 'Alarm functie', 'GPS tracking'],
        created_at: '2025-07-12T18:08:13.000Z'
    },
    {
        id: 2,
        name: 'Smart Kabelslot Secure',
        description: 'Flexibel kabelslot met smartphone bediening en alarm.',
        price: 79.99,
        image: '/images/kettingslot.png',
        category: 'kabelslot',
        stock: 30,
        features: ['Smartphone opening', 'Alarm functie', 'Verstelbare kabel'],
        created_at: '2025-07-12T18:08:13.000Z'
    }
];

export default function ProductenPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const { addToCart } = useCart();
    const { addToast } = useToast();

    useEffect(() => {
        // Load products directly from static data
        console.log('=== PRODUCTS PAGE LOADING ===');
        console.log('Component mounted, starting to load products...');

        try {
            console.log('Importing getAllProducts function...');
            console.log('getAllProducts function:', typeof getAllProducts);

            console.log('Calling getAllProducts()...');
            let staticProducts;
            try {
                staticProducts = getAllProducts();
                console.log('getAllProducts returned:', staticProducts);
                console.log('Number of products:', staticProducts.length);
                console.log('Products data:', staticProducts);
            } catch (importError) {
                console.warn('getAllProducts failed, using fallback products:', importError);
                staticProducts = fallbackProducts;
            }

            console.log('Setting products in state...');
            setProducts(staticProducts);
            console.log('Setting loading to false...');
            setLoading(false);
            console.log('=== PRODUCTS LOADED SUCCESSFULLY ===');
        } catch (error) {
            console.error('=== ERROR LOADING PRODUCTS ===');
            console.error('Error details:', error);
            console.error('Error type:', typeof error);
            console.error('Error message:', error instanceof Error ? error.message : 'Unknown error');

            // Use fallback products as last resort
            console.log('Using fallback products as last resort...');
            setProducts(fallbackProducts);
            setLoading(false);
        }
    }, []);



    const handleAddToCart = (product: Product) => {
        addToCart(product);
        addToast('Product toegevoegd aan winkelwagen!', 'success', 3000);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-xl text-gray-600">Producten laden...</p>
                </div>
            </div>
        );
    }



    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
            <Header currentPage="producten" />

            {/* Hero Section */}
            <section className="bg-gradient-to-r from-blue-600 to-purple-700 text-white py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">Onze Producten</h1>
                    <p className="text-xl md:text-2xl max-w-2xl mx-auto">
                        Ontdek onze volledige collectie smart locks met geavanceerde technologie
                    </p>
                </div>
            </section>

            {/* Products Grid */}
            <section className="py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {products.map((product) => (
                            <div key={product.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                                <div className="h-64 bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                                    {product.image && product.image !== '/images/default-product.jpg' ? (
                                        <Image
                                            src={product.image}
                                            alt={product.name}
                                            width={400}
                                            height={300}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <Shield className="h-24 w-24 text-blue-600" />
                                    )}
                                </div>

                                <div className="p-6">
                                    <div className="flex items-center justify-between mb-2">
                                        <h3 className="text-xl font-bold text-gray-900">{product.name}</h3>
                                        <span className={`px-2 py-1 text-xs rounded-full ${product.stock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                            }`}>
                                            {product.stock > 0 ? `${product.stock} op voorraad` : 'Uitverkocht'}
                                        </span>
                                    </div>

                                    <p className="text-gray-600 mb-4 line-clamp-3">{product.description}</p>

                                    <div className="flex items-center mb-4">
                                        <div className="flex text-yellow-400">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} className="h-4 w-4 fill-current" />
                                            ))}
                                        </div>
                                        <span className="ml-2 text-sm text-gray-600">(Premium kwaliteit)</span>
                                    </div>

                                    <div className="mb-4">
                                        <h4 className="text-sm font-semibold text-gray-900 mb-2">Kenmerken:</h4>
                                        <ul className="space-y-1">
                                            {product.features.slice(0, 3).map((feature, index) => (
                                                <li key={index} className="flex items-center text-sm text-gray-600">
                                                    <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                                                    {feature}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    <div className="border-t pt-4">
                                        <div className="flex items-center justify-between">
                                            <span className="text-2xl font-bold text-blue-600">€{product.price}</span>
                                            <div className="flex space-x-2">
                                                <Link
                                                    href={`/producten/${product.id}`}
                                                    className="px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                                                >
                                                    Details
                                                </Link>
                                                <button
                                                    onClick={() => handleAddToCart(product)}
                                                    disabled={product.stock === 0}
                                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                                                >
                                                    {product.stock > 0 ? 'Bestellen' : 'Uitverkocht'}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {products.length === 0 && !loading && (
                        <div className="text-center py-12">
                            <Shield className="h-24 w-24 text-gray-400 mx-auto mb-4" />
                            <p className="text-xl text-gray-600">Geen producten gevonden</p>
                        </div>
                    )}
                </div>
            </section>

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