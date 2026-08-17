// src/components/auth/RegisterForm.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import registerBg from '../../assets/register2-bg.jpg';
import Select from '../ui/Select';
import { FaUser, FaLock, FaEnvelope, FaIdCard, FaEye, FaEyeSlash, FaUserTie, FaCapsules } from 'react-icons/fa';

const fieldClass =
    'w-full rounded-lg border border-white/10 bg-white/5 py-2.5 pr-3 pl-10 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-brand-primary focus:bg-white/7 focus:ring-1 focus:ring-brand-primary';

const ROLES = [
    { value: 'farmaceutico', label: 'Farmacéutico' },
    { value: 'admin', label: 'Administrador' },
    { value: 'cajero', label: 'Cajero' },
];

const RegisterForm = () => {
    const [datos, setDatos] = useState({
        nombre: '', apellidos: '', email: '', username: '', password: '', rol: 'farmaceutico'
    });
    const [mensaje, setMensaje] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => setDatos({ ...datos, [e.target.name]: e.target.value });
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/usuarios/registro', datos);
            setMensaje('Usuario registrado exitosamente');
            setTimeout(() => navigate('/'), 2000);
        } catch {
            setMensaje('Error al registrar usuario');
        }
    };

    const exito = mensaje.includes('exitosamente');

    return (
        <div className="flex min-h-screen flex-col bg-brand-ink lg:flex-row">
            <div className="flex flex-1 items-center justify-center px-6 py-12">
                <div className="w-full max-w-sm">
                    <div className="mb-8 flex items-center gap-3">
                        <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-brand-primary to-brand-secondary text-white">
                            <FaCapsules />
                        </span>
                        <span className="text-lg font-semibold tracking-wide text-white">Botica Nova Salud</span>
                    </div>

                    <h1 className="text-2xl font-semibold text-white">Crear cuenta</h1>
                    <p className="mt-1 text-sm text-slate-400">Completa tus datos para registrarte.</p>

                    <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="mb-1.5 block text-xs font-medium text-slate-400">Nombre</label>
                                <div className="relative">
                                    <FaIdCard className="absolute top-1/2 left-3 -translate-y-1/2 text-sm text-slate-500" />
                                    <input name="nombre" value={datos.nombre} onChange={handleChange} required
                                        placeholder="Nombre" className={fieldClass} />
                                </div>
                            </div>
                            <div>
                                <label className="mb-1.5 block text-xs font-medium text-slate-400">Apellidos</label>
                                <div className="relative">
                                    <FaIdCard className="absolute top-1/2 left-3 -translate-y-1/2 text-sm text-slate-500" />
                                    <input name="apellidos" value={datos.apellidos} onChange={handleChange} required
                                        placeholder="Apellidos" className={fieldClass} />
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="mb-1.5 block text-xs font-medium text-slate-400">Email</label>
                            <div className="relative">
                                <FaEnvelope className="absolute top-1/2 left-3 -translate-y-1/2 text-sm text-slate-500" />
                                <input name="email" type="email" value={datos.email} onChange={handleChange} required
                                    placeholder="tu@correo.com" className={fieldClass} />
                            </div>
                        </div>

                        <div>
                            <label className="mb-1.5 block text-xs font-medium text-slate-400">Usuario</label>
                            <div className="relative">
                                <FaUser className="absolute top-1/2 left-3 -translate-y-1/2 text-sm text-slate-500" />
                                <input name="username" value={datos.username} onChange={handleChange} required
                                    placeholder="tu.usuario" className={fieldClass} />
                            </div>
                        </div>

                        <div>
                            <label className="mb-1.5 block text-xs font-medium text-slate-400">Contraseña</label>
                            <div className="relative">
                                <FaLock className="absolute top-1/2 left-3 -translate-y-1/2 text-sm text-slate-500" />
                                <input name="password" type={showPassword ? 'text' : 'password'} value={datos.password}
                                    onChange={handleChange} required placeholder="••••••••"
                                    className={`${fieldClass} pr-10`} />
                                <button type="button" onClick={() => setShowPassword(!showPassword)}
                                    className="absolute top-1/2 right-3 -translate-y-1/2 text-slate-500 transition hover:text-slate-300">
                                    {showPassword ? <FaEye /> : <FaEyeSlash />}
                                </button>
                            </div>
                        </div>

                        <div>
                            <label className="mb-1.5 block text-xs font-medium text-slate-400">Rol</label>
                            <Select
                                icon={FaUserTie}
                                value={datos.rol}
                                onChange={(rol) => setDatos({ ...datos, rol })}
                                options={ROLES}
                            />
                        </div>

                        {mensaje && (
                            <p className={
                                exito
                                    ? 'rounded-md border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-400'
                                    : 'rounded-md border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-400'
                            }>
                                {mensaje}
                            </p>
                        )}

                        <button type="submit"
                            className="w-full rounded-lg bg-brand-primary py-2.5 text-sm font-semibold text-white transition hover:bg-brand-primary/90">
                            Registrarse
                        </button>
                    </form>

                    <p className="mt-6 text-center text-sm text-slate-400">
                        ¿Ya tienes una cuenta?{' '}
                        <a href="/" className="font-medium text-brand-secondary hover:text-brand-primary">
                            Inicia sesión
                        </a>
                    </p>
                </div>
            </div>

            <div
                className="relative hidden w-1/2 flex-col justify-between bg-cover bg-right p-12 lg:flex"
                style={{ backgroundImage: `url(${registerBg})` }}
            >
                <div className="absolute inset-0 bg-gradient-to-t from-brand-ink via-brand-ink/20 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-l from-brand-ink via-brand-ink/10 to-transparent" />
                <div className="absolute inset-0 bg-brand-primary/15" />

                <div className="relative ml-auto max-w-md text-right">
                    <h2 className="text-3xl leading-tight font-semibold text-white">
                        Únete al equipo de tu farmacia.
                    </h2>
                    <p className="mt-3 text-sm text-slate-300">
                        Cada rol con el acceso justo que necesita.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default RegisterForm;
