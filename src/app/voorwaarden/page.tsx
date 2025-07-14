'use client';

import Link from 'next/link';
import { Shield, ArrowLeft } from 'lucide-react';
import Header from '../../components/Header';

export default function VoorwaardenPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
            <Header currentPage="voorwaarden" />

            {/* Hero Section */}
            <section className="bg-gradient-to-r from-blue-600 to-purple-700 text-white py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">Algemene Voorwaarden</h1>
                    <p className="text-xl md:text-2xl max-w-3xl mx-auto">
                        Transparantie en duidelijkheid over onze dienstverlening
                    </p>
                </div>
            </section>

            {/* Back Link */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <Link href="/" className="flex items-center text-blue-600 hover:text-blue-800 transition-colors mb-8">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Terug naar home
                </Link>

                {/* Main Content */}
                <div className="bg-white rounded-xl shadow-lg p-8 prose prose-lg prose-gray max-w-none">
                    <p className="text-sm text-gray-800 mb-8">
                        <strong>Laatst bijgewerkt:</strong> 12 juli 2025
                    </p>

                    <style jsx>{`
                        .prose-gray {
                            color: #1f2937;
                        }
                        .prose-gray p {
                            color: #1f2937;
                        }
                        .prose-gray ul li {
                            color: #1f2937;
                        }
                        .prose-gray h2 {
                            color: #111827;
                        }
                    `}</style>

                    <h2>1. Definities</h2>
                    <p>
                        In deze algemene voorwaarden wordt verstaan onder:
                    </p>
                    <ul>
                        <li><strong>SmartLock Store:</strong> de onderneming die deze voorwaarden hanteert;</li>
                        <li><strong>Klant:</strong> de natuurlijke of rechtspersoon die een overeenkomst aangaat met SmartLock Store;</li>
                        <li><strong>Producten:</strong> alle smartlocks, accessoires en gerelateerde artikelen;</li>
                        <li><strong>Diensten:</strong> alle door SmartLock Store geleverde diensten;</li>
                        <li><strong>Website:</strong> de online winkel van SmartLock Store.</li>
                    </ul>

                    <h2>2. Toepasselijkheid</h2>
                    <p>
                        Deze algemene voorwaarden zijn van toepassing op alle overeenkomsten tussen SmartLock Store en klant,
                        en op alle door SmartLock Store geleverde producten en diensten. Afwijkingen van deze voorwaarden
                        zijn alleen geldig indien uitdrukkelijk schriftelijk overeengekomen.
                    </p>

                    <h2>3. Aanbiedingen en Prijzen</h2>
                    <p>
                        Alle aanbiedingen zijn vrijblijvend en onder voorbehoud van beschikbaarheid. Prijzen zijn inclusief
                        BTW, tenzij anders vermeld. SmartLock Store behoudt zich het recht voor om prijzen en productspecificaties
                        te wijzigen zonder voorafgaande kennisgeving. Prijswijzigingen hebben geen invloed op reeds afgesloten overeenkomsten.
                    </p>

                    <h2>4. Bestellingen en Bevestiging</h2>
                    <p>
                        Een overeenkomst komt tot stand door:</p>
                    <ul>
                        <li>Het plaatsen van een bestelling via onze website;</li>
                        <li>Ontvangst van bevestiging van de bestelling door SmartLock Store;</li>
                        <li>Succesvolle verwerking van de betaling.</li>
                    </ul>
                    <p>
                        SmartLock Store behoudt zich het recht voor om bestellingen te weigeren of te annuleren,
                        bijvoorbeeld bij onvoldoende voorraad of vermoeden van fraude.
                    </p>

                    <h2>5. Betaling</h2>
                    <p>
                        Betaling dient plaats te vinden voorafgaand aan levering via de beschikbare betaalmethoden op onze website.
                        SmartLock Store gebruikt Stripe voor veilige betalingsverwerking. Bij niet-betaling behoudt SmartLock Store
                        zich het recht voor om rente en incassokosten in rekening te brengen.
                    </p>

                    <h2>6. Levering en Verzending</h2>
                    <p>
                        Producten worden geleverd op het door de klant opgegeven adres. Levertijden zijn indicatief en geen
                        fatale termijnen. SmartLock Store streeft ernaar bestellingen binnen 2-5 werkdagen te leveren binnen Nederland.
                        Verzending is gratis voor alle bestellingen binnen Nederland.
                    </p>

                    <h2>7. Herroepingsrecht</h2>
                    <p>
                        Conform de Nederlandse wet heeft de consument het recht om binnen 14 dagen na ontvangst van het product
                        de overeenkomst te herroepen, zonder opgave van redenen. Het product dient in originele staat en verpakking
                        te worden geretourneerd. Retourkosten zijn voor rekening van de klant, tenzij het product defect is.
                    </p>

                    <h2>8. Garantie en Conformiteit</h2>
                    <p>
                        SmartLock Store biedt 2 jaar fabrieksgarantie op alle smartlocks. De garantie dekt materiaal- en
                        fabricagefouten onder normaal gebruik. Uitgesloten zijn schade door:
                    </p>
                    <ul>
                        <li>Onoordeelkundig gebruik of installatie;</li>
                        <li>Normale slijtage;</li>
                        <li>Externe invloeden zoals water, vuur, diefstal;</li>
                        <li>Wijzigingen aan het product door de klant.</li>
                    </ul>

                    <h2>9. Aansprakelijkheid</h2>
                    <p>
                        De aansprakelijkheid van SmartLock Store is beperkt tot de waarde van de geleverde producten.
                        SmartLock Store is niet aansprakelijk voor indirecte schade, gevolgschade, gemiste besparingen
                        of schade door bedrijfsstagnatie. Deze beperking geldt niet bij opzet of grove schuld van SmartLock Store.
                    </p>

                    <h2>10. Privacy en Gegevensbescherming</h2>
                    <p>
                        SmartLock Store respecteert uw privacy en handelt conform de AVG (Algemene Verordening Gegevensbescherming).
                        Persoonsgegevens worden alleen gebruikt voor orderverwerkingr, klantenservice en het verbeteren van onze diensten.
                        Gegevens worden niet aan derden verkocht of verstrekt zonder toestemming.
                    </p>

                    <h2>11. Intellectueel Eigendom</h2>
                    <p>
                        Alle intellectuele eigendomsrechten betreffende producten, website, software en documentatie berusten
                        bij SmartLock Store of haar licentiegevers. Het is niet toegestaan om zonder schriftelijke toestemming
                        deze rechten te reproduceren, distribueren of openbaar te maken.
                    </p>

                    <h2>12. Overmacht</h2>
                    <p>
                        SmartLock Store is niet gehouden tot nakoming van enige verplichting indien zij daartoe verhinderd wordt
                        ten gevolge van overmacht. Onder overmacht wordt verstaan elke van de wil van SmartLock Store onafhankelijke
                        omstandigheid, zoals natuurrampen, oorlog, terrorisme, pandemieën, stakingen of leveringsproblemen van toeleveranciers.
                    </p>

                    <h2>13. Klachten en Geschillen</h2>
                    <p>
                        Klachten dienen binnen 14 dagen na ontdekking schriftelijk te worden ingediend bij SmartLock Store.
                        Wij streven ernaar alle klachten binnen 5 werkdagen af te handelen. Bij geschillen zal eerst getracht
                        worden tot een minnelijke schikking te komen. Is dit niet mogelijk, dan zijn de geschillen onderworpen
                        aan Nederlands recht en worden deze voorgelegd aan de bevoegde rechtbank.
                    </p>

                    <h2>14. Wijzigingen Voorwaarden</h2>
                    <p>
                        SmartLock Store behoudt zich het recht voor om deze voorwaarden te wijzigen. Wijzigingen worden
                        ten minste 30 dagen voor inwerkingtreding bekendgemaakt op onze website. Voor lopende overeenkomsten
                        blijven de oorspronkelijke voorwaarden van kracht, tenzij de wijzigingen wettelijk verplicht zijn.
                    </p>

                    <h2>15. Slotbepalingen</h2>
                    <p>
                        Indien één of meer bepalingen van deze voorwaarden nietig of vernietigbaar blijken te zijn,
                        blijven de overige bepalingen volledig van kracht. SmartLock Store zal de nietige bepaling vervangen
                        door een geldige bepaling die qua strekking zo dicht mogelijk bij de nietige bepaling aansluit.
                    </p>

                    <h2>16. Contactgegevens</h2>
                    <div className="bg-gray-50 p-6 rounded-lg">
                        <p><strong>SmartLock Store</strong></p>
                        <p>Innovatielaan 123</p>
                        <p>1234 AB Amsterdam</p>
                        <p>Nederland</p>
                        <p>E-mail: info@smartlockstore.nl</p>
                        <p>Telefoon: +31 (0)6 - 1234 5678</p>
                        <p>KvK nummer: [Hier komt uw KvK nummer]</p>
                        <p>BTW nummer: [Hier komt uw BTW nummer]</p>
                    </div>

                    <div className="mt-8 p-6 bg-blue-50 border-l-4 border-blue-400">
                        <p className="text-blue-800">
                            <strong>Let op:</strong> Deze algemene voorwaarden dienen als basis en moeten worden aangepast aan uw specifieke bedrijfssituatie.
                            Wij adviseren om juridisch advies in te winnen voor uw definitieve voorwaarden.
                        </p>
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
    );
} 