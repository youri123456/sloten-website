'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Shield, Star, Check, ArrowLeft, Plus, Minus, Smartphone } from 'lucide-react';
import { useCart } from '../../../contexts/CartContext';
import { useToast } from '../../../contexts/ToastContext';
import Header from '../../../components/Header';
import { getProductById, Product } from '../../../data/products';



export default function ProductDetailPage() {
    const params = useParams();
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [quantity, setQuantity] = useState(1);
    const { addToCart } = useCart();
    const { addToast } = useToast();

    useEffect(() => {
        if (params.id) {
            loadProduct(params.id as string);
        }
    }, [params.id]);

    const loadProduct = (id: string) => {
        try {
            const productId = parseInt(id);
            if (isNaN(productId)) {
                setError('Ongeldig product ID');
                setLoading(false);
                return;
            }
            const foundProduct = getProductById(productId);
            if (foundProduct) {
                setProduct(foundProduct);
            } else {
                setError('Product niet gevonden');
            }
            setLoading(false);
        } catch {
            setError('Fout bij laden van product');
            setLoading(false);
        }
    };

    const handleAddToCart = () => {
        if (product) {
            for (let i = 0; i < quantity; i++) {
                addToCart(product);
            }
            addToast(
                `${quantity} ${product.name} toegevoegd aan winkelwagen!`,
                'success',
                3000
            );
        }
    };

    const incrementQuantity = () => {
        if (product && quantity < product.stock) {
            setQuantity(prev => prev + 1);
        }
    };

    const decrementQuantity = () => {
        if (quantity > 1) {
            setQuantity(prev => prev - 1);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-xl text-gray-600">Product laden...</p>
                </div>
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
                <Header />
                <div className="flex items-center justify-center min-h-[60vh]">
                    <div className="text-center">
                        <Shield className="h-24 w-24 text-red-500 mx-auto mb-4" />
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">Product niet gevonden</h1>
                        <p className="text-gray-600 mb-6">{error || 'Het opgevraagde product bestaat niet.'}</p>
                        <Link href="/producten" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
                            Terug naar producten
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
            <Header currentPage="producten" />

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Back to Products */}
                <div className="mb-8">
                    <Link href="/producten" className="flex items-center text-blue-600 hover:text-blue-800 transition-colors">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Terug naar alle producten
                    </Link>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Product Image */}
                    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                        <div className="h-96 bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                            {product.image && product.image !== '/images/default-product.jpg' ? (
                                <Image
                                    src={product.image}
                                    alt={product.name}
                                    width={400}
                                    height={400}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <Shield className="h-32 w-32 text-blue-600" />
                            )}
                        </div>
                    </div>

                    {/* Product Info */}
                    <div className="bg-white rounded-xl shadow-lg p-8">
                        <div className="mb-6">
                            <span className={`inline-block px-3 py-1 text-sm rounded-full ${product.stock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                }`}>
                                {product.stock > 0 ? `${product.stock} op voorraad` : 'Uitverkocht'}
                            </span>
                        </div>

                        <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>

                        <div className="flex items-center mb-6">
                            <div className="flex text-yellow-400 mr-3">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} className="h-5 w-5 fill-current" />
                                ))}
                            </div>
                            <span className="text-gray-600">Premium Smart Lock Technologie</span>
                        </div>

                        <div className="text-4xl font-bold text-blue-600 mb-6">
                            €{product.price.toFixed(2)}
                            <span className="text-lg text-gray-500 font-normal ml-2">incl. BTW</span>
                        </div>

                        <p className="text-gray-700 text-lg mb-8 leading-relaxed">
                            {product.description}
                        </p>

                        {/* Features */}
                        <div className="mb-8">
                            <h3 className="text-xl font-bold text-gray-900 mb-4">Belangrijkste kenmerken:</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {product.features.map((feature, index) => (
                                    <div key={index} className="flex items-center">
                                        <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                                        <span className="text-gray-700">{feature}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Quantity and Add to Cart */}
                        <div className="border-t pt-6">
                            <div className="flex items-center space-x-6 mb-6">
                                <div className="flex items-center">
                                    <label className="text-sm font-medium text-gray-700 mr-4">Aantal:</label>
                                    <div className="flex items-center border border-gray-300 rounded-lg">
                                        <button
                                            onClick={decrementQuantity}
                                            className="p-2 hover:bg-gray-100 transition-colors"
                                            disabled={quantity <= 1}
                                        >
                                            <Minus className="h-4 w-4" />
                                        </button>
                                        <span className="px-4 py-2 font-medium">{quantity}</span>
                                        <button
                                            onClick={incrementQuantity}
                                            className="p-2 hover:bg-gray-100 transition-colors"
                                            disabled={quantity >= product.stock}
                                        >
                                            <Plus className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <button
                                    onClick={handleAddToCart}
                                    disabled={product.stock === 0}
                                    className="w-full bg-blue-600 text-white py-4 px-6 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-semibold text-lg"
                                >
                                    {product.stock > 0 ? `Toevoegen aan winkelwagen - €${(product.price * quantity).toFixed(2)}` : 'Uitverkocht'}
                                </button>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <Link
                                        href="/producten"
                                        className="w-full border border-gray-300 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors text-center font-semibold"
                                    >
                                        Meer producten
                                    </Link>
                                    <Link
                                        href="/winkelwagen"
                                        className="w-full border border-blue-600 text-blue-600 py-3 px-4 rounded-lg hover:bg-blue-50 transition-colors text-center font-semibold"
                                    >
                                        Naar winkelwagen
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Additional Info */}
                <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="bg-white rounded-xl shadow-lg p-6 text-center">
                        <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Check className="h-8 w-8 text-green-600" />
                        </div>
                        <h3 className="text-lg font-semibold mb-2">Gratis verzending</h3>
                        <p className="text-gray-800">Voor alle bestellingen binnen Nederland</p>
                    </div>

                    <div className="bg-white rounded-xl shadow-lg p-6 text-center">
                        <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Shield className="h-8 w-8 text-blue-600" />
                        </div>
                        <h3 className="text-lg font-semibold mb-2">Betrouwbare garantie</h3>
                        <p className="text-gray-800">Volledige fabrieksgarantie op alle producten</p>
                    </div>

                    <div className="bg-white rounded-xl shadow-lg p-6 text-center">
                        <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Smartphone className="h-8 w-8 text-purple-600" />
                        </div>
                        <h3 className="text-lg font-semibold mb-2">App ondersteuning</h3>
                        <p className="text-gray-800">Gratis smartphone app voor iOS en Android</p>
                    </div>
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