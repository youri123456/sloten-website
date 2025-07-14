'use client';

import { useEffect } from 'react';
import { X, CheckCircle, AlertCircle, XCircle, Info } from 'lucide-react';

export interface ToastData {
    id: string;
    message: string;
    type: 'success' | 'error' | 'warning' | 'info';
    duration?: number;
}

interface ToastProps {
    toast: ToastData;
    onClose: (id: string) => void;
}

export default function Toast({ toast, onClose }: ToastProps) {
    const { id, message, type, duration = 4000 } = toast;

    useEffect(() => {
        const timer = setTimeout(() => {
            onClose(id);
        }, duration);

        return () => clearTimeout(timer);
    }, [id, duration, onClose]);

    const getIcon = () => {
        switch (type) {
            case 'success':
                return <CheckCircle className="h-5 w-5 text-green-500" />;
            case 'error':
                return <XCircle className="h-5 w-5 text-red-500" />;
            case 'warning':
                return <AlertCircle className="h-5 w-5 text-yellow-500" />;
            case 'info':
                return <Info className="h-5 w-5 text-blue-500" />;
            default:
                return <Info className="h-5 w-5 text-blue-500" />;
        }
    };

    const getBackgroundColor = () => {
        switch (type) {
            case 'success':
                return 'bg-green-50 border-green-200';
            case 'error':
                return 'bg-red-50 border-red-200';
            case 'warning':
                return 'bg-yellow-50 border-yellow-200';
            case 'info':
                return 'bg-blue-50 border-blue-200';
            default:
                return 'bg-blue-50 border-blue-200';
        }
    };

    const getTextColor = () => {
        switch (type) {
            case 'success':
                return 'text-green-800';
            case 'error':
                return 'text-red-800';
            case 'warning':
                return 'text-yellow-800';
            case 'info':
                return 'text-blue-800';
            default:
                return 'text-blue-800';
        }
    };

    return (
        <div className={`
            min-w-80 max-w-md w-full ${getBackgroundColor()} border rounded-lg shadow-lg p-4 
            transform transition-all duration-300 ease-in-out
            animate-in slide-in-from-right-5
        `}>
            <div className="flex items-start">
                <div className="flex-shrink-0 mt-0.5">
                    {getIcon()}
                </div>
                <div className="ml-3 flex-1">
                    <p className={`text-sm font-medium ${getTextColor()} leading-relaxed`}>
                        {message}
                    </p>
                </div>
                <div className="ml-4 flex-shrink-0 flex">
                    <button
                        onClick={() => onClose(id)}
                        className={`
                            inline-flex ${getTextColor()} hover:opacity-70 
                            focus:outline-none focus:ring-2 focus:ring-offset-2 
                            focus:ring-offset-gray-50 focus:ring-blue-500
                        `}
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>
            </div>
        </div>
    );
} 