import React, { useState } from 'react';
import * as ReactRouterDOM from 'react-router-dom';
import { Zap, Lock, User as UserIcon, AlertCircle } from 'lucide-react';
import { useUsers } from '../../context/UserContext';
import { USERS_DATA } from '../../constants';

const { useNavigate } = ReactRouterDOM;

const Login: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { login } = useUsers();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        // Attempt login via context
        const success = await login(username, password);

        if (success) {
            navigate('/admin');
        } else {
            setError('Username atau Password salah.');
        }
    };



    return (
        <div className="min-h-screen bg-sea-50 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="bg-sea-900 p-8 text-center">
                    <div className="inline-block p-3 bg-white/10 rounded-full mb-4">
                        <Zap className="h-8 w-8 text-amber-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-white">Admin Portal RPE</h2>
                    <p className="text-sea-200 text-sm mt-2">Silakan login untuk melanjutkan</p>
                </div>

                <form onSubmit={handleLogin} className="p-8 space-y-6">
                    {error && (
                        <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm flex items-center">
                            <AlertCircle size={16} className="mr-2 shrink-0" />
                            {error}
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Username</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <UserIcon size={18} className="text-slate-400" />
                            </div>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-sea-500 focus:border-transparent outline-none transition"
                                placeholder="Masukkan username"
                                required
                            />
                        </div>

                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Password</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Lock size={18} className="text-slate-400" />
                            </div>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-sea-500 focus:border-transparent outline-none transition"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-sea-600 text-white font-bold py-3 rounded-lg hover:bg-sea-700 transition shadow-lg shadow-sea-600/20"
                    >
                        Masuk Dashboard
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;