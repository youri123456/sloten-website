'use client';

import Link from 'next/link';
import { Shield, Users, Award, Target, Heart, Zap } from 'lucide-react';
import Header from '../../components/Header';

export default function OverOnsPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
            <Header currentPage="over-ons" />

            {/* Hero Section */}
            <section className="bg-gradient-to-r from-blue-600 to-purple-700 text-white py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">Over SmartLock Store</h1>
                    <p className="text-xl md:text-2xl max-w-3xl mx-auto">
                        Jouw betrouwbare partner in innovatieve slottechnologie sinds 2020
                    </p>
                </div>
            </section>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                {/* Our Story */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-6">Ons Verhaal</h2>
                        <div className="prose prose-lg text-gray-700">
                            <p className="mb-4">
                                SmartLock Store werd opgericht in 2020 met een eenvoudige maar krachtige missie:
                                het combineren van traditionele veiligheid met moderne technologie. Onze oprichters,
                                zelf slachtoffers van fietsdiefstal, wilden een oplossing creëren die zowel veilig
                                als gebruiksvriendelijk zou zijn.
                            </p>
                            <p className="mb-4">
                                Na jaren van onderzoek en ontwikkeling hebben we een unieke lijn smartlocks gelanceerd
                                die je leven gemakkelijker en veiliger maakt. Van fietssloten tot kabelsloten,
                                al onze producten worden ontwikkeld met de gebruiker in gedachten.
                            </p>
                            <p>
                                Vandaag de dag zijn we trots om duizenden klanten in Nederland te bedienen met
                                onze innovatieve beveiligingsoplossingen.
                            </p>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-lg p-8">
                        <div className="grid grid-cols-2 gap-6 text-center">
                            <div>
                                <div className="text-3xl font-bold text-blue-600 mb-2">2025</div>
                                <div className="text-gray-800">Oprichting</div>
                            </div>
                            <div>
                                <div className="text-3xl font-bold text-purple-600 mb-2">100%</div>
                                <div className="text-gray-800">Nederlands</div>
                            </div>
                            <div>
                                <div className="text-3xl font-bold text-green-600 mb-2">2 jaar</div>
                                <div className="text-gray-800">Garantie</div>
                            </div>
                            <div>
                                <div className="text-3xl font-bold text-orange-600 mb-2">24/7</div>
                                <div className="text-gray-800">Beschikbaar</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Our Values */}
                <div className="mb-16">
                    <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Onze Waarden</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Shield className="h-8 w-8 text-blue-600" />
                            </div>
                            <h3 className="text-xl font-bold mb-4">Veiligheid Eerst</h3>
                            <p className="text-gray-800">
                                Veiligheid staat altijd centraal in alles wat we doen. Onze producten worden
                                uitgebreid getest om de hoogste beveiligingsstandaarden te waarborgen.
                            </p>
                        </div>

                        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                            <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Zap className="h-8 w-8 text-green-600" />
                            </div>
                            <h3 className="text-xl font-bold mb-4">Innovatie</h3>
                            <p className="text-gray-800">
                                We blijven vooroplopen door continu te investeren in nieuwe technologieën
                                en het verbeteren van onze bestaande producten.
                            </p>
                        </div>

                        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                            <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Heart className="h-8 w-8 text-purple-600" />
                            </div>
                            <h3 className="text-xl font-bold mb-4">Klanttevredenheid</h3>
                            <p className="text-gray-800">
                                Onze klanten staan centraal. We luisteren naar feedback en streven ernaar
                                om ieders verwachtingen te overtreffen.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Our Mission */}
                <div className="bg-white rounded-xl shadow-lg p-8 mb-16">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900 mb-6">Onze Missie</h2>
                            <p className="text-lg text-gray-700 mb-4">
                                Wij geloven dat veiligheid niet ten koste hoeft te gaan van gemak. Daarom ontwikkelen
                                we smartlocks die beide combineren - geavanceerde beveiliging met de eenvoud van
                                smartphone-bediening.
                            </p>
                            <p className="text-lg text-gray-700">
                                Ons doel is om elke Nederlander te voorzien van betrouwbare, intelligente
                                beveiligingsoplossingen die perfect passen in het moderne leven.
                            </p>
                        </div>
                        <div className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl p-8 text-center">
                            <Target className="h-24 w-24 text-blue-600 mx-auto mb-4" />
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Onze Visie</h3>
                            <p className="text-gray-700">
                                Een Nederland waar iedereen vertrouwt op slimme, veilige technologie
                                voor de bescherming van hun waardevolle bezittingen.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Why Choose Us */}
                <div className="mb-16">
                    <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Waarom SmartLock Store?</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="bg-white rounded-lg shadow-md p-6 text-center">
                            <Award className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                            <h4 className="font-bold mb-2">Premium Kwaliteit</h4>
                            <p className="text-sm text-gray-800">Alleen de beste materialen en componenten</p>
                        </div>

                        <div className="bg-white rounded-lg shadow-md p-6 text-center">
                            <Users className="h-12 w-12 text-green-600 mx-auto mb-4" />
                            <h4 className="font-bold mb-2">Expert Support</h4>
                            <p className="text-sm text-gray-800">Ons team staat altijd klaar om je te helpen</p>
                        </div>

                        <div className="bg-white rounded-lg shadow-md p-6 text-center">
                            <Shield className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                            <h4 className="font-bold mb-2">Bewezen Veiligheid</h4>
                            <p className="text-sm text-gray-800">Uitgebreid getest en gecertificeerd</p>
                        </div>

                        <div className="bg-white rounded-lg shadow-md p-6 text-center">
                            <Zap className="h-12 w-12 text-orange-600 mx-auto mb-4" />
                            <h4 className="font-bold mb-2">Continue Innovatie</h4>
                            <p className="text-sm text-gray-800">Altijd op de hoogte van de nieuwste technologie</p>
                        </div>
                    </div>
                </div>

                {/* Call to Action */}
                <div className="bg-gradient-to-r from-blue-600 to-purple-700 rounded-xl text-white p-12 text-center">
                    <h2 className="text-3xl font-bold mb-4">Klaar om je veiligheid te upgraden?</h2>
                    <p className="text-xl mb-8 max-w-2xl mx-auto">
                        Ontdek onze collectie smartlocks en ervaar het gemak van moderne beveiliging.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            href="/producten"
                            className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                        >
                            Bekijk Producten
                        </Link>
                        <Link
                            href="/contact"
                            className="border border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
                        >
                            Neem Contact Op
                        </Link>
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