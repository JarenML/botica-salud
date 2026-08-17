// src/components/auth/LoginForm.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import loginBg from '../../assets/login-bg.jpg';
import { FaUser, FaEye, FaEyeSlash, FaLock, FaCapsules } from 'react-icons/fa';

const LoginForm = () => {
    const [data, setData] = useState({ username: '', password: '' });
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => setData({ ...data, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post('/usuarios/login', data);
            localStorage.setItem('usuario', JSON.stringify({
                nombre: res.data.nombre || res.data.username,
                rol: res.data.rol
            }));

            navigate('/home');
        } catch {
            setError('Credenciales inválidas');
        }
    };

    return (
        <div className="flex min-h-screen bg-brand-ink">
            <div
                className="relative hidden w-1/2 flex-col justify-between bg-left-bottom bg-cover p-12 lg:flex"
                style={{ backgroundImage: `url(${loginBg})` }}
            >
                <div className="absolute inset-0 bg-gradient-to-t from-brand-ink via-brand-ink/10 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-brand-ink" />

                <div className="relative flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-brand-primary to-brand-secondary text-white">
                        <FaCapsules />
                    </span>
                    <span className="text-lg font-semibold tracking-wide text-white">Botica Nova Salud</span>
                </div>

                <div className="relative max-w-md">
                    <h2 className="text-3xl leading-tight font-semibold text-white">
                        Gestión farmacéutica, sin fricción.
                    </h2>
                    <p className="mt-3 text-sm text-slate-300">
                        Inventario, ventas y clientes en un solo lugar.
                    </p>
                </div>
            </div>

            <div className="flex flex-1 items-center justify-center px-6 py-12">
                <div className="w-full max-w-sm">
                    <h1 className="text-2xl font-semibold text-white">Iniciar sesión</h1>
                    <p className="mt-1 text-sm text-slate-400">Ingresa tus credenciales para continuar.</p>

                    <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                        <div>
                            <label className="mb-1.5 block text-xs font-medium text-slate-400">Usuario</label>
                            <div className="relative">
                                <FaUser className="absolute top-1/2 left-3 -translate-y-1/2 text-sm text-slate-500" />
                                <input
                                    name="username"
                                    value={data.username}
                                    onChange={handleChange}
                                    required
                                    placeholder="tu.usuario"
                                    className="w-full rounded-lg border border-white/10 bg-white/5 py-2.5 pr-3 pl-10 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-brand-primary focus:bg-white/7 focus:ring-1 focus:ring-brand-primary"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="mb-1.5 block text-xs font-medium text-slate-400">Contraseña</label>
                            <div className="relative">
                                <FaLock className="absolute top-1/2 left-3 -translate-y-1/2 text-sm text-slate-500" />
                                <input
                                    name="password"
                                    type={showPassword ? 'text' : 'password'}
                                    value={data.password}
                                    onChange={handleChange}
                                    required
                                    placeholder="••••••••"
                                    className="w-full rounded-lg border border-white/10 bg-white/5 py-2.5 pr-10 pl-10 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-brand-primary focus:bg-white/7 focus:ring-1 focus:ring-brand-primary"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute top-1/2 right-3 -translate-y-1/2 text-slate-500 transition hover:text-slate-300"
                                >
                                    {showPassword ? <FaEye /> : <FaEyeSlash />}
                                </button>
                            </div>
                        </div>

                        {error && (
                            <p className="rounded-md border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-400">
                                {error}
                            </p>
                        )}

                        <button
                            type="submit"
                            className="w-full rounded-lg bg-brand-primary py-2.5 text-sm font-semibold text-white transition hover:bg-brand-primary/90"
                        >
                            Entrar
                        </button>
                    </form>

                    <p className="mt-6 text-center text-sm text-slate-400">
                        ¿No tienes cuenta?{' '}
                        <a href="/registro" className="font-medium text-brand-secondary hover:text-brand-primary">
                            Regístrate
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginForm;
