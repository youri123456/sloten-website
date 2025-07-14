'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image'
import Link from 'next/link'
import { ShoppingCart, Shield, Smartphone, Zap, Star } from 'lucide-react'
import Header from '../components/Header'

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  stock: number;
  features: string[];
  created_at: string;
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products');
      if (response.ok) {
        const data = await response.json();
        setProducts(data);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Header currentPage="home" />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-600 to-purple-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              De Toekomst van
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
                Slot Technologie
              </span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
              Ontdek onze revolutionaire smartlocks die je met je smartphone kunt bedienen.
              Veiligheid en gemak in één apparaat.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/producten" className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                Bekijk Producten
              </Link>
              <Link href="#features" className="border border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors">
                Meer Informatie
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Waarom Kiezen Voor Onze Smartlocks?
            </h2>
            <p className="text-xl text-gray-700 max-w-2xl mx-auto">
              Onze innovatieve sloten combineren geavanceerde technologie met gebruiksvriendelijkheid
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-8 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl">
              <div className="bg-blue-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Smartphone className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Smartphone Bediening</h3>
              <p className="text-gray-700">Open je slot eenvoudig met je smartphone via onze gebruiksvriendelijke app.</p>
            </div>

            <div className="text-center p-8 bg-gradient-to-br from-purple-50 to-pink-100 rounded-xl">
              <div className="bg-purple-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Maximale Veiligheid</h3>
              <p className="text-gray-700">Geavanceerde encryptie en alarm functionaliteit beschermen je waardevolle bezittingen.</p>
            </div>

            <div className="text-center p-8 bg-gradient-to-br from-green-50 to-emerald-100 rounded-xl">
              <div className="bg-green-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Lange Batterijduur</h3>
              <p className="text-gray-700">Tot 6 maanden gebruiksduur op één batterijlading. Nooit meer zorgen over lege batterijen.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Products Preview */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Onze Populaire Producten
            </h2>
            <p className="text-xl text-gray-700">
              Ontdek onze meest verkochte smartlocks
            </p>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Producten laden...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {products.map((product) => (
                <div key={product.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                  <div className="h-64 bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                    {product.image && product.image !== '/images/default-product.jpg' ? (
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Shield className="h-24 w-24 text-blue-600" />
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{product.name}</h3>
                    <p className="text-gray-700 mb-4">
                      {product.description}
                    </p>
                    <div className="flex items-center mb-4">
                      <div className="flex text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="h-5 w-5 fill-current" />
                        ))}
                      </div>
                      <span className="ml-2 text-gray-700">(Premium Smart Lock Technologie)</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-3xl font-bold text-blue-600">€{product.price.toFixed(2)}</span>
                      <Link
                        href={`/producten/${product.id}`}
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Bekijk Product
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
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
                <li><Link href="/producten/1" className="hover:text-white transition-colors">Fietssloten</Link></li>
                <li><Link href="/producten/2" className="hover:text-white transition-colors">Kabelsloten</Link></li>
                <li><Link href="/producten" className="hover:text-white transition-colors">Alle Producten</Link></li>
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
  )
}
