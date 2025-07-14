'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Shield, Package, Plus, Edit, Trash2, LogOut, Save, X, ArrowLeft } from 'lucide-react';
import { useToast } from '../../../contexts/ToastContext';

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

interface ProductFormData {
    name: string;
    description: string;
    price: string;
    image: string;
    category: string;
    stock: string;
    features: string[];
}

export default function AdminProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showForm, setShowForm] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [formData, setFormData] = useState<ProductFormData>({
        name: '',
        description: '',
        price: '',
        image: '',
        category: '',
        stock: '',
        features: []
    });
    const [newFeature, setNewFeature] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [uploadingImage, setUploadingImage] = useState(false);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const router = useRouter();
    const { addToast } = useToast();

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await fetch('/api/products');
            if (!response.ok) {
                throw new Error('Failed to fetch products');
            }
            const data = await response.json();
            setProducts(data);
        } catch (error) {
            setError('Failed to load products');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        try {
            document.cookie = 'admin_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
            router.push('/admin');
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    const resetForm = () => {
        setFormData({
            name: '',
            description: '',
            price: '',
            image: '',
            category: '',
            stock: '',
            features: []
        });
        setNewFeature('');
        setEditingProduct(null);
    };

    const handleAddProduct = () => {
        resetForm();
        setShowForm(true);
    };

    const handleEditProduct = (product: Product) => {
        setFormData({
            name: product.name,
            description: product.description,
            price: product.price.toString(),
            image: product.image,
            category: product.category,
            stock: product.stock.toString(),
            features: [...product.features]
        });
        setEditingProduct(product);
        setShowForm(true);
    };

    const handleDeleteProduct = async (id: number) => {
        if (!window.confirm('Weet je zeker dat je dit product wilt verwijderen?')) {
            return;
        }

        try {
            const response = await fetch(`/api/products?id=${id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                addToast('Product succesvol verwijderd!', 'success', 3000);
                fetchProducts();
            } else {
                const errorData = await response.json();
                addToast(`Fout bij verwijderen: ${errorData.error}`, 'error', 4000);
            }
        } catch (error) {
            console.error('Error deleting product:', error);
            addToast('Er is een fout opgetreden bij het verwijderen', 'error', 4000);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const newValue = e.target.value;
        console.log(`[ADMIN PRODUCTS] Input change for ${e.target.name}: "${newValue}"`);

        setFormData({
            ...formData,
            [e.target.name]: newValue
        });
    };

    const handleAddFeature = () => {
        if (newFeature.trim()) {
            setFormData({
                ...formData,
                features: [...formData.features, newFeature.trim()]
            });
            setNewFeature('');
        }
    };

    const handleRemoveFeature = (index: number) => {
        setFormData({
            ...formData,
            features: formData.features.filter((_, i) => i !== index)
        });
    };

    const handleImageUpload = async (file: File) => {
        setUploadingImage(true);
        try {
            const formData = new FormData();
            formData.append('file', file);

            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                const result = await response.json();
                setFormData(prev => ({
                    ...prev,
                    image: result.imageUrl
                }));
                setImagePreview(result.imageUrl);
                addToast('Afbeelding succesvol geüpload!', 'success', 3000);
            } else {
                const error = await response.json();
                addToast(`Fout bij uploaden: ${error.error}`, 'error', 4000);
            }
        } catch (error) {
            console.error('Error uploading image:', error);
            addToast('Er is een fout opgetreden bij het uploaden', 'error', 4000);
        } finally {
            setUploadingImage(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            const method = editingProduct ? 'PUT' : 'POST';
            const body = {
                ...(editingProduct && { id: editingProduct.id }),
                name: formData.name,
                description: formData.description,
                price: parseFloat(formData.price),
                image: formData.image || '/images/default-product.jpg',
                category: formData.category,
                stock: Math.max(0, parseInt(formData.stock) || 0),
                features: formData.features
            };

            console.log('[ADMIN PRODUCTS] Submitting form with data:', {
                formData,
                parsedStock: parseInt(formData.stock),
                body
            });

            const response = await fetch('/api/products', {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body),
            });

            if (response.ok) {
                addToast(
                    editingProduct ? 'Product succesvol bijgewerkt!' : 'Product succesvol toegevoegd!',
                    'success',
                    3000
                );
                setShowForm(false);
                resetForm();
                fetchProducts();
            } else {
                const errorData = await response.json();
                addToast(`Fout bij opslaan: ${errorData.error}`, 'error', 4000);
            }
        } catch (error) {
            console.error('Error saving product:', error);
            addToast('Er is een fout opgetreden bij het opslaan', 'error', 4000);
        } finally {
            setSubmitting(false);
        }
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

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
                <div className="text-center">
                    <Shield className="h-24 w-24 text-red-500 mx-auto mb-4" />
                    <p className="text-xl text-red-600">{error}</p>
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
                            <h1 className="text-2xl font-bold text-gray-900">Product Management</h1>
                        </div>
                        <div className="flex items-center space-x-4">
                            <a
                                href="/admin/dashboard"
                                className="flex items-center px-4 py-2 text-gray-700 hover:text-blue-600 transition-colors"
                            >
                                <ArrowLeft className="h-5 w-5 mr-2" />
                                Dashboard
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
                {!showForm ? (
                    <>
                        {/* Product List Header */}
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-3xl font-bold text-gray-900">Producten ({products.length})</h2>
                            <button
                                onClick={handleAddProduct}
                                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                            >
                                <Plus className="h-5 w-5 mr-2" />
                                Nieuw Product
                            </button>
                        </div>

                        {/* Products Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {products.map((product) => (
                                <div key={product.id} className="bg-white rounded-xl shadow-lg overflow-hidden">
                                    <div className="h-48 bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                                        {product.image && product.image !== '/images/default-product.jpg' ? (
                                            <img
                                                src={product.image}
                                                alt={product.name}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <Shield className="h-16 w-16 text-blue-600" />
                                        )}
                                    </div>
                                    <div className="p-6">
                                        <div className="flex items-center justify-between mb-2">
                                            <h3 className="text-xl font-bold text-gray-900">{product.name}</h3>
                                            <span className={`px-2 py-1 text-xs rounded-full ${product.stock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                {product.stock > 0 ? `${product.stock} voorraad` : 'Uitverkocht'}
                                            </span>
                                        </div>
                                        <p className="text-gray-600 mb-4 line-clamp-3">{product.description}</p>
                                        <div className="flex items-center justify-between">
                                            <span className="text-2xl font-bold text-blue-600">€{product.price}</span>
                                            <div className="flex space-x-2">
                                                <button
                                                    onClick={() => handleEditProduct(product)}
                                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                >
                                                    <Edit className="h-5 w-5" />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteProduct(product.id)}
                                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                >
                                                    <Trash2 className="h-5 w-5" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {products.length === 0 && (
                            <div className="text-center py-12">
                                <Package className="h-24 w-24 text-gray-400 mx-auto mb-4" />
                                <p className="text-xl text-gray-600">Geen producten gevonden</p>
                                <button
                                    onClick={handleAddProduct}
                                    className="mt-4 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    Eerste product toevoegen
                                </button>
                            </div>
                        )}
                    </>
                ) : (
                    /* Product Form */
                    <div className="bg-white rounded-xl shadow-lg p-8 max-w-4xl mx-auto">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-gray-900">
                                {editingProduct ? 'Product Bewerken' : 'Nieuw Product Toevoegen'}
                            </h2>
                            <button
                                onClick={() => setShowForm(false)}
                                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <X className="h-6 w-6" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Productnaam *
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                                        placeholder="Bijv. Smart Fietsslot Pro"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Prijs (€) *
                                    </label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        name="price"
                                        value={formData.price}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                                        placeholder="89.99"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Categorie *
                                    </label>
                                    <select
                                        name="category"
                                        value={formData.category}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                                    >
                                        <option value="">Selecteer categorie</option>
                                        <option value="fietsslot">Fietsslot</option>
                                        <option value="kabelslot">Kabelslot</option>
                                        <option value="hangslot">Hangslot</option>
                                        <option value="deurslot">Deurslot</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Voorraad *
                                    </label>
                                    <input
                                        type="number"
                                        name="stock"
                                        value={formData.stock}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                                        placeholder="25"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Beschrijving *
                                </label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    required
                                    rows={4}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                                    placeholder="Beschrijf het product..."
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Productafbeelding
                                </label>
                                <div className="space-y-4">
                                    {formData.image && (
                                        <div className="relative">
                                            <img
                                                src={formData.image}
                                                alt="Product preview"
                                                className="w-32 h-32 object-cover rounded-lg border border-gray-300"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setFormData(prev => ({ ...prev, image: '' }))}
                                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600"
                                            >
                                                ×
                                            </button>
                                        </div>
                                    )}
                                    <div>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => {
                                                const file = e.target.files?.[0];
                                                if (file) {
                                                    handleImageUpload(file);
                                                }
                                            }}
                                            disabled={uploadingImage}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                        />
                                        {uploadingImage && (
                                            <p className="mt-2 text-sm text-blue-600">Afbeelding uploaden...</p>
                                        )}
                                        <p className="mt-2 text-sm text-gray-500">
                                            Upload een JPG, PNG of WebP bestand (max 5MB)
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Kenmerken
                                </label>
                                <div className="flex space-x-2 mb-3">
                                    <input
                                        type="text"
                                        value={newFeature}
                                        onChange={(e) => setNewFeature(e.target.value)}
                                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                                        placeholder="Voeg kenmerk toe..."
                                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddFeature())}
                                    />
                                    <button
                                        type="button"
                                        onClick={handleAddFeature}
                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                    >
                                        <Plus className="h-5 w-5" />
                                    </button>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {formData.features.map((feature, index) => (
                                        <span
                                            key={index}
                                            className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center"
                                        >
                                            {feature}
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveFeature(index)}
                                                className="ml-2 text-blue-600 hover:text-blue-800"
                                            >
                                                <X className="h-4 w-4" />
                                            </button>
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div className="flex justify-end space-x-4">
                                <button
                                    type="button"
                                    onClick={() => setShowForm(false)}
                                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    Annuleren
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center"
                                >
                                    {submitting ? (
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                    ) : (
                                        <Save className="h-5 w-5 mr-2" />
                                    )}
                                    {submitting ? 'Opslaan...' : 'Opslaan'}
                                </button>
                            </div>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
} 