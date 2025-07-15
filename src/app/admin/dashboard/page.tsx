'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Shield, Users, TrendingUp, Package, Calendar, Euro, User, Phone, MapPin, LogOut, Mail, MessageSquare } from 'lucide-react';
import { useToast } from '../../../contexts/ToastContext';

interface Order {
    id: number;
    customer_name: string;
    customer_email: string;
    customer_phone: string;
    customer_address: string;
    customer_city: string;
    customer_postal_code: string;
    total_amount: number;
    order_items: string;
    status: string;
    created_at: string;
}

interface Analytics {
    total_visits: number;
    unique_visitors: number;
    today_visits: number;
    week_visits: number;
    month_visits: number;
}

interface ContactMessage {
    id: number;
    name: string;
    email: string;
    subject: string;
    message: string;
    status: string;
    created_at: string;
}

interface OrderItem {
    id: number;
    name: string;
    quantity: number;
    price: number;
}

export default function AdminDashboard() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [analytics, setAnalytics] = useState<Analytics>({ total_visits: 0, unique_visitors: 0, today_visits: 0, week_visits: 0, month_visits: 0 });
    const [contactMessages, setContactMessages] = useState<ContactMessage[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [updatingStatus, setUpdatingStatus] = useState<number | null>(null);
    const [updatingMessageStatus, setUpdatingMessageStatus] = useState<number | null>(null);
    const router = useRouter();
    const { addToast } = useToast();

    const fetchData = useCallback(async () => {
        try {
            // Set a timeout to prevent hanging
            const timeoutPromise = new Promise((_, reject) =>
                setTimeout(() => reject(new Error('Timeout')), 5000)
            );

            const fetchPromise = Promise.all([
                fetch('/api/admin/orders'),
                fetch('/api/admin/analytics'),
                fetch('/api/admin/contact')
            ]);

            const [ordersResponse, analyticsResponse, contactResponse] = await Promise.race([
                fetchPromise,
                timeoutPromise
            ]) as [Response, Response, Response];

            if (!ordersResponse.ok || !analyticsResponse.ok || !contactResponse.ok) {
                if (ordersResponse.status === 401 || analyticsResponse.status === 401 || contactResponse.status === 401) {
                    router.push('/admin');
                    return;
                }
                throw new Error('Failed to fetch data');
            }

            const ordersData = await ordersResponse.json();
            const analyticsData = await analyticsResponse.json();
            const contactData = await contactResponse.json();

            setOrders(ordersData);
            setAnalytics(analyticsData);
            setContactMessages(contactData);
        } catch (error) {
            console.error('Dashboard fetch error:', error);
            setError('Admin dashboard werkt alleen lokaal. Database is niet beschikbaar op Vercel.');
        } finally {
            setLoading(false);
        }
    }, [router]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleLogout = async () => {
        try {
            // Clear the admin token cookie
            document.cookie = 'admin_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
            router.push('/admin');
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'processing':
                return 'bg-blue-100 text-blue-800';
            case 'shipped':
                return 'bg-green-100 text-green-800';
            case 'completed':
                return 'bg-green-100 text-green-800';
            case 'cancelled':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getTotalRevenue = () => {
        return orders.reduce((total, order) => total + order.total_amount, 0);
    };

    const updateOrderStatus = async (orderId: number, newStatus: string) => {
        setUpdatingStatus(orderId);

        try {
            const response = await fetch(`/api/admin/orders/${orderId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status: newStatus }),
            });

            if (response.ok) {
                addToast('Bestellingsstatus succesvol bijgewerkt!', 'success', 3000);
                fetchData();
            } else {
                const errorData = await response.json();
                addToast(`Fout bij het bijwerken van de status: ${errorData.error}`, 'error', 4000);
            }
        } catch (error) {
            console.error('Error updating order status:', error);
            addToast('Er is een fout opgetreden bij het bijwerken van de status', 'error', 4000);
        } finally {
            setUpdatingStatus(null);
        }
    };

    const updateContactMessageStatus = async (messageId: number, newStatus: string) => {
        setUpdatingMessageStatus(messageId);

        try {
            const response = await fetch('/api/admin/contact', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ messageId, status: newStatus }),
            });

            if (response.ok) {
                addToast('Berichten status succesvol bijgewerkt!', 'success', 3000);
                fetchData();
            } else {
                const errorData = await response.json();
                addToast(`Fout bij het bijwerken van de berichten status: ${errorData.error}`, 'error', 4000);
            }
        } catch (error) {
            console.error('Error updating message status:', error);
            addToast('Er is een fout opgetreden bij het bijwerken van de berichten status', 'error', 4000);
        } finally {
            setUpdatingMessageStatus(null);
        }
    };

    const getMessageStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'new':
                return 'bg-red-100 text-red-800';
            case 'read':
                return 'bg-yellow-100 text-yellow-800';
            case 'replied':
                return 'bg-green-100 text-green-800';
            case 'archived':
                return 'bg-gray-100 text-gray-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-xl text-gray-600">Dashboard laden...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
                {/* Header */}
                <header className="bg-white shadow-sm border-b border-gray-200">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between h-16">
                            <div className="flex items-center">
                                <Shield className="h-8 w-8 text-blue-600 mr-3" />
                                <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
                            </div>
                            <div className="flex items-center space-x-4">
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center px-4 py-2 text-gray-700 hover:text-red-600 transition-colors"
                                >
                                    <LogOut className="h-5 w-5 mr-2" />
                                    Logout
                                </button>
                            </div>
                        </div>
                    </div>
                </header>

                <div className="flex items-center justify-center min-h-[60vh]">
                    <div className="text-center max-w-md mx-auto">
                        <Shield className="h-24 w-24 text-orange-500 mx-auto mb-6" />
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Admin Dashboard</h2>
                        <p className="text-gray-600 mb-6">{error}</p>
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                            <p className="text-sm text-blue-800">
                                <strong>Tip:</strong> Voor volledige admin functionaliteit, run de webshop lokaal met <code className="bg-blue-100 px-2 py-1 rounded">npm run dev</code>
                            </p>
                        </div>
                        <button
                            onClick={() => window.location.href = '/'}
                            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Terug naar webshop
                        </button>
                    </div>
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
                            <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
                        </div>
                        <div className="flex items-center space-x-4">
                            <a
                                href="/admin/products"
                                className="flex items-center px-4 py-2 text-gray-700 hover:text-blue-600 transition-colors"
                            >
                                <Package className="h-5 w-5 mr-2" />
                                Producten
                            </a>
                            <button
                                onClick={handleLogout}
                                className="flex items-center px-4 py-2 text-gray-700 hover:text-red-600 transition-colors"
                            >
                                <LogOut className="h-5 w-5 mr-2" />
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-6 mb-8">
                    <div className="bg-white rounded-xl shadow-lg p-6">
                        <div className="flex items-center">
                            <div className="bg-blue-100 p-3 rounded-lg">
                                <Users className="h-6 w-6 text-blue-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Totaal Bezoekers</p>
                                <p className="text-2xl font-bold text-gray-900">{analytics.total_visits}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-lg p-6">
                        <div className="flex items-center">
                            <div className="bg-green-100 p-3 rounded-lg">
                                <TrendingUp className="h-6 w-6 text-green-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Unieke Bezoekers</p>
                                <p className="text-2xl font-bold text-gray-900">{analytics.unique_visitors}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-lg p-6">
                        <div className="flex items-center">
                            <div className="bg-purple-100 p-3 rounded-lg">
                                <Calendar className="h-6 w-6 text-purple-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Vandaag</p>
                                <p className="text-2xl font-bold text-gray-900">{analytics.today_visits}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-lg p-6">
                        <div className="flex items-center">
                            <div className="bg-indigo-100 p-3 rounded-lg">
                                <Calendar className="h-6 w-6 text-indigo-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Deze Week</p>
                                <p className="text-2xl font-bold text-gray-900">{analytics.week_visits}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-lg p-6">
                        <div className="flex items-center">
                            <div className="bg-pink-100 p-3 rounded-lg">
                                <Calendar className="h-6 w-6 text-pink-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Deze Maand</p>
                                <p className="text-2xl font-bold text-gray-900">{analytics.month_visits}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-lg p-6">
                        <div className="flex items-center">
                            <div className="bg-yellow-100 p-3 rounded-lg">
                                <Euro className="h-6 w-6 text-yellow-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Totaal Omzet</p>
                                <p className="text-2xl font-bold text-gray-900">€{getTotalRevenue().toFixed(2)}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-lg p-6">
                        <div className="flex items-center">
                            <div className="bg-red-100 p-3 rounded-lg">
                                <MessageSquare className="h-6 w-6 text-red-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Nieuwe Berichten</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {contactMessages.filter(msg => msg.status === 'new').length}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Orders Table */}
                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h2 className="text-xl font-bold text-gray-900 flex items-center">
                            <Package className="h-5 w-5 mr-2" />
                            Bestellingen ({orders.length})
                        </h2>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Bestelling
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Klant
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Producten
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Totaal
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Datum
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {orders.map((order) => (
                                    <tr key={order.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">#{order.id}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="bg-blue-100 p-2 rounded-full mr-3">
                                                    <User className="h-4 w-4 text-blue-600" />
                                                </div>
                                                <div>
                                                    <div className="text-sm font-medium text-gray-900">{order.customer_name}</div>
                                                    <div className="text-sm text-gray-500">{order.customer_email}</div>
                                                    <div className="text-sm text-gray-500 flex items-center">
                                                        <Phone className="h-3 w-3 mr-1" />
                                                        {order.customer_phone}
                                                    </div>
                                                    <div className="text-sm text-gray-500 flex items-center">
                                                        <MapPin className="h-3 w-3 mr-1" />
                                                        {order.customer_address}, {order.customer_city}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">
                                                {JSON.parse(order.order_items).map((item: OrderItem, index: number) => (
                                                    <div key={index} className="mb-1">
                                                        {item.quantity}x {item.name}
                                                    </div>
                                                ))}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">€{order.total_amount.toFixed(2)}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center space-x-2">
                                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                                                    {order.status}
                                                </span>
                                                <select
                                                    value={order.status}
                                                    onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                                                    disabled={updatingStatus === order.id}
                                                    className="text-xs border border-gray-300 rounded px-2 py-1 focus:ring-1 focus:ring-blue-500 disabled:bg-gray-100"
                                                >
                                                    <option value="pending">Pending</option>
                                                    <option value="processing">Processing</option>
                                                    <option value="shipped">Shipped</option>
                                                    <option value="delivered">Delivered</option>
                                                    <option value="cancelled">Cancelled</option>
                                                </select>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {new Date(order.created_at).toLocaleDateString('nl-NL')}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {orders.length === 0 && (
                        <div className="text-center py-12">
                            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-500">Nog geen bestellingen</p>
                        </div>
                    )}
                </div>

                {/* Contact Messages */}
                <div className="bg-white rounded-xl shadow-lg overflow-hidden mt-8">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h2 className="text-xl font-bold text-gray-900 flex items-center">
                            <MessageSquare className="h-5 w-5 mr-2" />
                            Contact Berichten ({contactMessages.length})
                        </h2>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Naam
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        E-mail
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Onderwerp
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Bericht
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Datum
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {contactMessages.map((message) => (
                                    <tr key={message.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="bg-blue-100 p-2 rounded-full mr-3">
                                                    <User className="h-4 w-4 text-blue-600" />
                                                </div>
                                                <div className="text-sm font-medium text-gray-900">{message.name}</div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <Mail className="h-4 w-4 text-gray-400 mr-2" />
                                                <div className="text-sm text-gray-900">{message.email}</div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900 max-w-xs truncate">{message.subject}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-gray-900 max-w-md">
                                                {message.message.length > 100
                                                    ? `${message.message.substring(0, 100)}...`
                                                    : message.message
                                                }
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center space-x-2">
                                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getMessageStatusColor(message.status)}`}>
                                                    {message.status}
                                                </span>
                                                <select
                                                    value={message.status}
                                                    onChange={(e) => updateContactMessageStatus(message.id, e.target.value)}
                                                    disabled={updatingMessageStatus === message.id}
                                                    className="text-xs border border-gray-300 rounded px-2 py-1 focus:ring-1 focus:ring-blue-500 disabled:bg-gray-100"
                                                >
                                                    <option value="new">New</option>
                                                    <option value="read">Read</option>
                                                    <option value="replied">Replied</option>
                                                    <option value="archived">Archived</option>
                                                </select>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {new Date(message.created_at).toLocaleDateString('nl-NL')}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {contactMessages.length === 0 && (
                        <div className="text-center py-12">
                            <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-500">Nog geen contact berichten</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
} 