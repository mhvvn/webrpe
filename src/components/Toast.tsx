
import React, { useEffect } from 'react';
import { CheckCircle, XCircle, X, AlertTriangle } from 'lucide-react';

interface ToastProps {
    message: string;
    type: 'success' | 'error' | 'warning';
    onClose: () => void;
    duration?: number;
}

const Toast: React.FC<ToastProps> = ({ message, type, onClose, duration = 3000 }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, duration);
        return () => clearTimeout(timer);
    }, [duration, onClose]);

    // Styles based on type
    let styles = '';
    let Icon;
    let title = '';

    switch (type) {
        case 'success':
            styles = 'bg-gradient-to-r from-green-500 to-emerald-600 shadow-green-500/30';
            Icon = CheckCircle;
            title = 'Sukses';
            break;
        case 'error':
            styles = 'bg-gradient-to-r from-red-500 to-rose-600 shadow-red-500/30';
            Icon = XCircle;
            title = 'Gagal';
            break;
        case 'warning':
            styles = 'bg-gradient-to-r from-amber-500 to-orange-600 shadow-amber-500/30';
            Icon = AlertTriangle;
            title = 'Peringatan';
            break;
    }

    return (
        <div className={`fixed top-24 right-4 md:right-8 z-50 flex items-center p-4 w-full max-w-sm text-white rounded-xl shadow-xl transition-all duration-500 transform translate-y-0 opacity-100 animate-slide-in-right ${styles}`}>
            <div className="inline-flex items-center justify-center flex-shrink-0 w-10 h-10 text-white rounded-lg bg-white/20 backdrop-blur-sm">
                <Icon className="w-6 h-6" />
            </div>
            <div className="ml-4 mr-2">
                <h4 className="font-bold text-sm tracking-wide">{title}</h4>
                <p className="text-sm font-medium opacity-90">{message}</p>
            </div>
            <button
                type="button"
                onClick={onClose}
                className="ml-auto -mx-1.5 -my-1.5 bg-transparent text-white/80 hover:text-white rounded-lg focus:ring-2 focus:ring-white/50 p-1.5 inline-flex h-8 w-8 transition-colors"
            >
                <span className="sr-only">Close</span>
                <X className="w-5 h-5" />
            </button>
        </div>
    );
};

export default Toast;
