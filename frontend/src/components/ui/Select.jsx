// src/components/ui/Select.jsx
import { useEffect, useRef, useState } from 'react';
import { FaChevronDown, FaCheck } from 'react-icons/fa';

/**
 * Dark-themed dropdown matching the app's Tailwind input style.
 * Native <select> popups can't be restyled cross-browser, hence this component.
 */
const Select = ({ value, onChange, options, icon: Icon, placeholder = 'Seleccionar', className = '' }) => {
    const [open, setOpen] = useState(false);
    const ref = useRef(null);
    const selected = options.find((o) => o.value === value);

    useEffect(() => {
        const onClickOutside = (e) => {
            if (ref.current && !ref.current.contains(e.target)) setOpen(false);
        };
        document.addEventListener('mousedown', onClickOutside);
        return () => document.removeEventListener('mousedown', onClickOutside);
    }, []);

    return (
        <div className={`relative ${className}`} ref={ref}>
            {Icon && <Icon className="absolute top-1/2 left-3 -translate-y-1/2 text-sm text-slate-500" />}
            <button
                type="button"
                onClick={() => setOpen(!open)}
                className={`flex w-full items-center justify-between rounded-lg border border-white/10 bg-white/5 py-2.5 ${Icon ? 'pl-10' : 'pl-3.5'} pr-3 text-left text-sm outline-none transition focus:border-brand-primary focus:bg-white/7 focus:ring-1 focus:ring-brand-primary`}
            >
                <span className={selected ? 'text-white' : 'text-slate-500'}>{selected?.label || placeholder}</span>
                <FaChevronDown className={`text-xs text-slate-500 transition-transform ${open ? 'rotate-180' : ''}`} />
            </button>

            {open && (
                <ul className="absolute z-10 mt-1.5 max-h-60 w-full overflow-y-auto rounded-lg border border-white/10 bg-[#121a2b] py-1 shadow-xl shadow-black/40">
                    {options.map((opt) => (
                        <li key={opt.value}>
                            <button
                                type="button"
                                onClick={() => { onChange(opt.value); setOpen(false); }}
                                className={`flex w-full items-center justify-between px-3.5 py-2 text-left text-sm transition ${
                                    opt.value === value
                                        ? 'bg-brand-primary/15 text-brand-secondary'
                                        : 'text-slate-300 hover:bg-white/5 hover:text-white'
                                }`}
                            >
                                {opt.label}
                                {opt.value === value && <FaCheck className="text-xs" />}
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default Select;
