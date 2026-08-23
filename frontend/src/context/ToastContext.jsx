// src/context/ToastContext.jsx
import { createContext, useCallback, useContext, useRef, useState } from 'react';
import { FaCheckCircle, FaExclamationCircle, FaInfoCircle, FaTimes } from 'react-icons/fa';

const ToastContext = createContext(null);

const VARIANTS = {
    success: { icon: FaCheckCircle, accent: 'border-l-emerald-400', iconColor: 'text-emerald-400' },
    error: { icon: FaExclamationCircle, accent: 'border-l-red-400', iconColor: 'text-red-400' },
    info: { icon: FaInfoCircle, accent: 'border-l-brand-secondary', iconColor: 'text-brand-secondary' },
};

let idCounter = 0;

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);
    const timers = useRef({});

    const dismiss = useCallback((id) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
        clearTimeout(timers.current[id]);
        delete timers.current[id];
    }, []);

    const showToast = useCallback((message, type = 'info', duration = 5000) => {
        const id = ++idCounter;
        setToasts((prev) => [...prev, { id, message, type }]);
        timers.current[id] = setTimeout(() => dismiss(id), duration);
    }, [dismiss]);

    const toast = {
        success: (message, duration) => showToast(message, 'success', duration),
        error: (message, duration) => showToast(message, 'error', duration),
        info: (message, duration) => showToast(message, 'info', duration),
    };

    return (
        <ToastContext.Provider value={toast}>
            {children}
            <div className="fixed bottom-5 right-5 z-[2000] flex w-full max-w-sm flex-col gap-3">
                {toasts.map(({ id, message, type }) => {
                    const { icon: Icon, accent, iconColor } = VARIANTS[type] || VARIANTS.info;
                    return (
                        <div
                            key={id}
                            role="alert"
                            className={`animate-toast-in flex items-start gap-3 rounded-lg border border-white/10 border-l-4 ${accent} bg-[#121a2b] p-4 shadow-2xl shadow-black/40`}
                        >
                            <Icon className={`mt-0.5 shrink-0 text-base ${iconColor}`} />
                            <p className="flex-1 text-sm text-slate-200">{message}</p>
                            <button
                                onClick={() => dismiss(id)}
                                className="shrink-0 text-slate-500 transition hover:text-white"
                            >
                                <FaTimes className="text-xs" />
                            </button>
                        </div>
                    );
                })}
            </div>
        </ToastContext.Provider>
    );
};

export const useToast = () => {
    const ctx = useContext(ToastContext);
    if (!ctx) throw new Error('useToast debe usarse dentro de ToastProvider');
    return ctx;
};
