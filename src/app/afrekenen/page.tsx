'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Shield, ShoppingCart, ArrowLeft, User } from 'lucide-react';
import { useCart } from '../../contexts/CartContext';
import { useToast } from '../../contexts/ToastContext';
import Header from '../../components/Header';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface PaymentFormProps {
    totalPrice: number;
    customerInfo: CustomerInfo;
    cartItems: CartItem[];
    onPaymentComplete: () => void;
    onPaymentError: (message: string) => void;
    onSetProcessing: (processing: boolean) => void;
}

function PaymentForm({ totalPrice, customerInfo, cartItems, onPaymentComplete, onPaymentError, onSetProcessing }: PaymentFormProps) {
    const stripe = useStripe();
    const elements = useElements();
    const [submitting, setSubmitting] = useState(false);


    const handlePayment = async () => {
        if (!stripe || !elements) {
            onPaymentError('Stripe is nog niet geladen. Probeer het over een paar seconden opnieuw.');
            return;
        }

        // Check if PaymentElement is mounted
        const paymentElement = elements.getElement('payment');
        if (!paymentElement) {
            onPaymentError('Betaalformulier is nog niet klaar. Probeer het over een paar seconden opnieuw.');
            return;
        }

        setSubmitting(true);
        onSetProcessing(true);

        try {
            // Confirm payment with all payment methods (including iDEAL)
            const { error, paymentIntent } = await stripe.confirmPayment({
                elements,
                confirmParams: {
                    return_url: `${window.location.origin}/bestelling-bevestigd`,
                },
                redirect: 'if_required',
            });

            if (error) {
                console.error('Payment failed:', error);
                onPaymentError(`Betaling mislukt: ${error.message}`);
                onSetProcessing(false);
            } else if (paymentIntent?.status === 'succeeded') {
                // Payment successful, now create the order
                const orderData = {
                    customer_name: customerInfo.name,
                    customer_email: customerInfo.email,
                    customer_phone: customerInfo.phone,
                    customer_address: customerInfo.address,
                    customer_city: customerInfo.city,
                    customer_postal_code: customerInfo.postal_code,
                    total_amount: totalPrice,
                    order_items: cartItems.map(item => ({
                        id: item.id,
                        quantity: item.quantity,
                        price: item.price
                    })),
                    payment_intent_id: paymentIntent.id
                };

                // Create order in database
                const orderResponse = await fetch('/api/orders', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(orderData),
                });

                if (orderResponse.ok) {
                    const order = await orderResponse.json();
                    onPaymentComplete();
                    window.location.href = `/bestelling-bevestigd?order=${order.id}`;
                } else {
                    const errorData = await orderResponse.json();
                    if (errorData.error === 'Insufficient stock') {
                        throw new Error('Voorraad onvoldoende voor een of meer producten');
                    } else {
                        throw new Error('Failed to create order');
                    }
                }
            }
        } catch (error) {
            console.error('Payment error:', error);
            onPaymentError('Er is een fout opgetreden bij de betaling');
            onSetProcessing(false);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Betaalmethode *
                </label>
                <div className="border border-gray-300 rounded-lg p-4">
                    <PaymentElement
                        options={{
                            layout: 'accordion',
                            paymentMethodOrder: ['card', 'ideal', 'bancontact', 'sofort']
                        }}
                    />
                </div>
            </div>

            <button
                onClick={handlePayment}
                disabled={submitting || !stripe || !elements}
                className="w-full bg-green-600 text-white py-4 px-6 rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-semibold text-lg"
            >
                {submitting ? 'Betaling verwerken...' :
                    !stripe || !elements ? 'Betaalformulier laden...' :
                        `Betaal €${totalPrice.toFixed(2)}`}
            </button>
        </div>
    );
}

interface CartItem {
    id: number;
    name: string;
    description: string;
    price: number;
    image: string;
    category: string;
    stock: number;
    features: string[];
    created_at: string;
    quantity: number;
}

interface CustomerInfo {
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    postal_code: string;
}

function CheckoutForm({ clientSecret, onClientSecretChange }: { clientSecret: string; onClientSecretChange: (secret: string) => void }) {
    const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
        name: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        postal_code: ''
    });
    const [submitting, setSubmitting] = useState(false);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [paymentStep, setPaymentStep] = useState<'form' | 'payment' | 'processing'>('form');
    const [isLoadingPostcode, setIsLoadingPostcode] = useState(false);
    const { cartItems, getTotalPrice } = useCart();
    const { addToast } = useToast();

    // Auto-transition to payment when clientSecret is available
    useEffect(() => {
        if (clientSecret && paymentStep === 'form') {
            setPaymentStep('payment');
        }
    }, [clientSecret, paymentStep]);



    // Postcode lookup function using a free Dutch API
    const lookupPostcode = async (postcode: string) => {
        if (!postcode || postcode.length < 6) return;

        // Clean postcode (remove spaces and make uppercase)
        const cleanPostcode = postcode.replace(/\s/g, '').toUpperCase();

        if (!/^[1-9][0-9]{3}[A-Z]{2}$/.test(cleanPostcode)) return;

        setIsLoadingPostcode(true);

        try {
            // Using free postcode API
            const response = await fetch(`https://api.postcode.nl/v1/postcode/${cleanPostcode}`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                }
            });

            // If the paid API doesn't work, try the free alternative
            if (!response.ok) {
                // Try alternative free API
                const altResponse = await fetch(`https://postcode.tech/api/v1/postcode?postcode=${cleanPostcode}`);
                if (altResponse.ok) {
                    const data = await altResponse.json();
                    if (data.city) {
                        setCustomerInfo(prev => ({
                            ...prev,
                            city: data.city,
                            postal_code: cleanPostcode
                        }));
                        addToast(`Plaats automatisch ingevuld: ${data.city}`, 'success', 2000);
                    }
                }
            } else {
                const data = await response.json();
                if (data.city) {
                    setCustomerInfo(prev => ({
                        ...prev,
                        city: data.city,
                        postal_code: cleanPostcode
                    }));
                    addToast(`Plaats automatisch ingevuld: ${data.city}`, 'success', 2000);
                }
            }
        } catch (error) {
            // Silently fail - postcode lookup is a nice-to-have feature
            console.log('Postcode lookup failed:', error);
        } finally {
            setIsLoadingPostcode(false);
        }
    };

    const validateForm = () => {
        const newErrors: { [key: string]: string } = {};

        if (!customerInfo.name.trim()) newErrors.name = 'Naam is verplicht';
        if (!customerInfo.email.trim()) newErrors.email = 'E-mailadres is verplicht';
        if (!customerInfo.phone.trim()) newErrors.phone = 'Telefoonnummer is verplicht';
        if (!customerInfo.address.trim()) newErrors.address = 'Adres is verplicht';
        if (!customerInfo.city.trim()) newErrors.city = 'Plaats is verplicht';
        if (!customerInfo.postal_code.trim()) newErrors.postal_code = 'Postcode is verplicht';

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (customerInfo.email && !emailRegex.test(customerInfo.email)) {
            newErrors.email = 'Ongeldig e-mailadres';
        }

        // Phone validation
        const phoneRegex = /^[0-9\s\-\+\(\)]{10,}$/;
        if (customerInfo.phone && !phoneRegex.test(customerInfo.phone)) {
            newErrors.phone = 'Ongeldig telefoonnummer';
        }

        // Postal code validation (Dutch format)
        const postalCodeRegex = /^[1-9][0-9]{3} ?[A-Z]{2}$/i;
        if (customerInfo.postal_code && !postalCodeRegex.test(customerInfo.postal_code)) {
            newErrors.postal_code = 'Ongeldige postcode (bijv. 1234 AB)';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Set submitting to true immediately to prevent double clicks
        setSubmitting(true);

        if (!validateForm()) {
            setSubmitting(false); // Reset submitting state
            return;
        }

        // Create payment intent
        try {
            const totalAmount = getTotalPrice(); // Prices already include VAT

            const response = await fetch('/api/stripe/create-payment-intent', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    amount: totalAmount,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to create payment intent');
            }

            const { clientSecret } = await response.json();

            if (!clientSecret) {
                throw new Error('No client secret received');
            }

            // Notify parent component about the client secret - this will trigger payment step via useEffect
            onClientSecretChange(clientSecret);
        } catch (error) {
            console.error('Error creating payment intent:', error);
            addToast('Er is een fout opgetreden bij het initialiseren van de betaling', 'error');
        } finally {
            // Always reset submitting state
            setSubmitting(false);
        }
    };



    const handleInputChange = (field: keyof CustomerInfo, value: string) => {
        setCustomerInfo(prev => ({
            ...prev,
            [field]: value
        }));

        // Clear error when user starts typing
        if (errors[field]) {
            setErrors(prev => ({
                ...prev,
                [field]: ''
            }));
        }

        // Trigger postcode lookup when postcode is complete
        if (field === 'postal_code' && value.length >= 6) {
            lookupPostcode(value);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
            <Header currentPage="afrekenen" />

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Back to Cart */}
                <div className="mb-8">
                    <Link href="/winkelwagen" className="flex items-center text-blue-600 hover:text-blue-800 transition-colors">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Terug naar winkelwagen
                    </Link>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Customer Information Form */}
                    <div className="bg-white rounded-xl shadow-lg p-6">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                            <User className="h-6 w-6 mr-3" />
                            {paymentStep === 'form' ? 'Klantgegevens' : paymentStep === 'payment' ? 'Betaling' : 'Bezig met verwerken...'}
                        </h2>

                        {paymentStep === 'form' && (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                                        Volledige naam *
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        value={customerInfo.name}
                                        onChange={(e) => handleInputChange('name', e.target.value)}
                                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500 ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
                                        placeholder="Voer je volledige naam in"
                                    />
                                    {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                                </div>

                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                        E-mailadres *
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        value={customerInfo.email}
                                        onChange={(e) => handleInputChange('email', e.target.value)}
                                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500 ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                                        placeholder="je@email.com"
                                    />
                                    {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                                </div>

                                <div>
                                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                                        Telefoonnummer *
                                    </label>
                                    <input
                                        type="tel"
                                        id="phone"
                                        value={customerInfo.phone}
                                        onChange={(e) => handleInputChange('phone', e.target.value)}
                                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500 ${errors.phone ? 'border-red-500' : 'border-gray-300'}`}
                                        placeholder="06-12345678"
                                    />
                                    {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
                                </div>

                                <div>
                                    <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                                        Adres *
                                    </label>
                                    <input
                                        type="text"
                                        id="address"
                                        value={customerInfo.address}
                                        onChange={(e) => handleInputChange('address', e.target.value)}
                                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500 ${errors.address ? 'border-red-500' : 'border-gray-300'}`}
                                        placeholder="Straatnaam 123"
                                    />
                                    {errors.address && <p className="mt-1 text-sm text-red-600">{errors.address}</p>}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="postal_code" className="block text-sm font-medium text-gray-700 mb-2">
                                            Postcode *
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                id="postal_code"
                                                value={customerInfo.postal_code}
                                                onChange={(e) => handleInputChange('postal_code', e.target.value)}
                                                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500 ${errors.postal_code ? 'border-red-500' : 'border-gray-300'}`}
                                                placeholder="1234 AB"
                                            />
                                            {isLoadingPostcode && (
                                                <div className="absolute right-3 top-2.5">
                                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                                                </div>
                                            )}
                                        </div>
                                        {errors.postal_code && <p className="mt-1 text-sm text-red-600">{errors.postal_code}</p>}
                                    </div>

                                    <div>
                                        <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
                                            Plaats *
                                        </label>
                                        <input
                                            type="text"
                                            id="city"
                                            value={customerInfo.city}
                                            onChange={(e) => handleInputChange('city', e.target.value)}
                                            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500 ${errors.city ? 'border-red-500' : 'border-gray-300'}`}
                                            placeholder="Amsterdam"
                                        />
                                        {errors.city && <p className="mt-1 text-sm text-red-600">{errors.city}</p>}
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="w-full bg-blue-600 text-white py-4 px-6 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-semibold text-lg"
                                >
                                    {submitting ? 'Bezig...' : 'Doorgaan naar betaling'}
                                </button>
                            </form>
                        )}

                        {paymentStep === 'payment' && (
                            <div className="space-y-6">
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                    <h3 className="font-semibold text-blue-900 mb-2">Veilige betaling</h3>
                                    <p className="text-blue-800">
                                        Je betaling wordt veilig verwerkt door Stripe. Kies je gewenste betaalmethode (kaart, iDEAL, etc.).
                                    </p>
                                </div>

                                {clientSecret ? (
                                    <PaymentForm
                                        totalPrice={getTotalPrice()}
                                        customerInfo={customerInfo}
                                        cartItems={cartItems}
                                        onPaymentComplete={() => {
                                            // Payment completed successfully
                                            setPaymentStep('processing');
                                        }}
                                        onPaymentError={(message) => {
                                            addToast(message, 'error');
                                        }}
                                        onSetProcessing={(processing) => {
                                            if (processing) {
                                                setPaymentStep('processing');
                                            } else {
                                                setPaymentStep('payment');
                                            }
                                        }}
                                    />
                                ) : (
                                    <div className="text-center py-8">
                                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                                        <p className="text-gray-600">Betaling voorbereiden...</p>
                                    </div>
                                )}

                                <div className="space-y-4">
                                    <button
                                        onClick={() => {
                                            setPaymentStep('form');
                                            onClientSecretChange('');
                                        }}
                                        className="w-full border border-gray-300 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-50 transition-colors"
                                    >
                                        Terug naar gegevens
                                    </button>
                                </div>
                            </div>
                        )}

                        {paymentStep === 'processing' && (
                            <div className="text-center py-8">
                                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">Betaling verwerken...</h3>
                                <p className="text-gray-600">Even geduld, we verwerken je betaling via Stripe.</p>
                            </div>
                        )}
                    </div>

                    {/* Order Summary */}
                    <div className="bg-white rounded-xl shadow-lg p-6">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Bestelling overzicht</h2>

                        <div className="space-y-4 mb-6">
                            {cartItems.map((item) => (
                                <div key={item.id} className="flex items-center justify-between py-4 border-b border-gray-200">
                                    <div className="flex items-center">
                                        <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                            {item.image && item.image !== '/images/default-product.jpg' ? (
                                                <Image
                                                    src={item.image}
                                                    alt={item.name}
                                                    width={48}
                                                    height={48}
                                                    className="w-full h-full object-cover rounded-lg"
                                                />
                                            ) : (
                                                <Shield className="h-6 w-6 text-blue-600" />
                                            )}
                                        </div>
                                        <div className="ml-4">
                                            <h4 className="font-semibold text-gray-900">{item.name}</h4>
                                            <p className="text-sm text-gray-600">Aantal: {item.quantity}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-semibold">€{(item.price * item.quantity).toFixed(2)}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="space-y-3 mb-6">
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

                            <div className="border-t pt-3">
                                <div className="flex justify-between text-xl font-bold">
                                    <span>Totaal</span>
                                    <span className="text-blue-600">€{getTotalPrice().toFixed(2)}</span>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 text-sm text-gray-500">
                            <p>✓ Veilige betaling via Stripe</p>
                            <p>✓ Gratis verzending binnen Nederland</p>
                            <p>✓ 30 dagen retourrecht</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function StripeWrapper({ clientSecret, children }: { clientSecret: string | null; children: React.ReactNode }) {
    if (!clientSecret) {
        return <>{children}</>;
    }

    return (
        <Elements stripe={stripePromise} options={{ clientSecret }}>
            {children}
        </Elements>
    );
}

export default function AfrekenenPage() {
    const { cartItems } = useCart();
    const [clientSecret, setClientSecret] = useState<string>('');

    if (cartItems.length === 0) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
                <Header />
                <div className="flex items-center justify-center min-h-[60vh]">
                    <div className="text-center">
                        <ShoppingCart className="h-24 w-24 text-gray-400 mx-auto mb-4" />
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">Winkelwagen is leeg</h1>
                        <p className="text-gray-600 mb-6">Voeg producten toe aan je winkelwagen om verder te gaan.</p>
                        <Link href="/producten" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
                            Naar producten
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <StripeWrapper clientSecret={clientSecret}>
            <CheckoutForm clientSecret={clientSecret} onClientSecretChange={setClientSecret} />
        </StripeWrapper>
    );
}