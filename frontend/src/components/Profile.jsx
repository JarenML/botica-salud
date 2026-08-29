// src/components/Profile.jsx
import React, { useEffect, useState } from 'react';
import { FaUserCircle, FaIdBadge, FaEnvelope, FaUserTag, FaSpinner } from 'react-icons/fa';
import userService from '../services/user.service';
import { useToast } from '../context/ToastContext';

const Profile = () => {
    const [usuario, setUsuario] = useState(null);
    const [cargando, setCargando] = useState(true);
    const toast = useToast();

    useEffect(() => {
        const sesion = JSON.parse(localStorage.getItem('usuario')) || {};

        const fetchUsuario = async () => {
            try {
                const usuarios = await userService.listUsers();
                const encontrado = usuarios.find(
                    (u) => u.username === sesion.nombre || u.nombre === sesion.nombre
                );
                setUsuario(encontrado || sesion);
            } catch (error) {
                toast.error(error?.response?.data?.message || 'Error al obtener el perfil.');
                setUsuario(sesion);
            } finally {
                setCargando(false);
            }
        };

        fetchUsuario();
    }, []);

    if (cargando) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-brand-ink">
                <FaSpinner className="animate-spin text-2xl text-brand-secondary" />
            </div>
        );
    }

    const nombreCompleto = [usuario?.nombre, usuario?.apellidos].filter(Boolean).join(' ') || usuario?.username || 'Usuario';

    return (
        <div className="min-h-screen bg-brand-ink">
            <main className="mx-auto max-w-3xl px-6 pt-6 pb-10 lg:px-10">
                <div className="mb-8">
                    <h1 className="flex items-center gap-3 text-2xl font-semibold text-white">
                        <FaUserCircle className="text-brand-secondary" /> Mi Perfil
                    </h1>
                    <p className="mt-1 text-sm text-slate-400">Información de tu cuenta.</p>
                </div>

                <div className="rounded-xl border border-white/10 bg-white/5 p-6">
                    <div className="flex items-center gap-4">
                        <FaUserCircle className="text-6xl text-brand-secondary" />
                        <div>
                            <p className="text-lg font-semibold text-white">{nombreCompleto}</p>
                            <p className="text-sm capitalize text-slate-400">{usuario?.rol}</p>
                        </div>
                    </div>

                    <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/5 px-4 py-3">
                            <FaIdBadge className="text-brand-secondary" />
                            <div>
                                <p className="text-xs uppercase tracking-wide text-slate-500">Usuario</p>
                                <p className="text-sm text-white">{usuario?.username || '—'}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/5 px-4 py-3">
                            <FaUserTag className="text-brand-secondary" />
                            <div>
                                <p className="text-xs uppercase tracking-wide text-slate-500">Rol</p>
                                <p className="text-sm capitalize text-white">{usuario?.rol || '—'}</p>
                            </div>
                        </div>

                        {usuario?.email && (
                            <div className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/5 px-4 py-3 sm:col-span-2">
                                <FaEnvelope className="text-brand-secondary" />
                                <div>
                                    <p className="text-xs uppercase tracking-wide text-slate-500">Correo</p>
                                    <p className="text-sm text-white">{usuario.email}</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Profile;
