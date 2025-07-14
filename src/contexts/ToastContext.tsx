'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import Toast, { ToastData } from '../components/Toast';

interface ToastContextType {
    addToast: (message: string, type: ToastData['type'], duration?: number) => void;
    removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};

interface ToastProviderProps {
    children: ReactNode;
}

export default function ToastProvider({ children }: ToastProviderProps) {
    const [toasts, setToasts] = useState<ToastData[]>([]);

    const addToast = (message: string, type: ToastData['type'], duration?: number) => {
        const id = Date.now().toString();
        const toast: ToastData = {
            id,
            message,
            type,
            duration,
        };
        setToasts(prev => [...prev, toast]);
    };

    const removeToast = (id: string) => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
    };

    return (
        <ToastContext.Provider value={{ addToast, removeToast }}>
            {children}

            {/* Toast Container */}
            <div className="fixed top-4 right-4 space-y-2 z-50">
                {toasts.map(toast => (
                    <Toast
                        key={toast.id}
                        toast={toast}
                        onClose={removeToast}
                    />
                ))}
            </div>
        </ToastContext.Provider>
    );
} 