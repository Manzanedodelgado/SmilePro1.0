import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { signIn } from '../services/auth.service';
import { LogIn, Mail, Lock, AlertCircle, ShieldCheck } from 'lucide-react';

const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const session = await signIn(email, password);
            if (session) {
                login(session.access_token, session.user, session.refresh_token);
            } else {
                setError('Credenciales inválidas o configuración de Supabase ausente.');
            }
        } catch (err: any) {
            setError(err.message || 'Error al iniciar sesión');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background-light relative overflow-hidden font-display">
            {/* Background Decorations — teal tints */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px]" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px]" />

            <div className="w-full max-w-md p-8 relative z-10">
                <div className="bg-white/80 backdrop-blur-xl border border-blue-200 shadow-sm rounded-2xl p-8 lg:p-10">

                    {/* Brand / Logo — DentalClinic Pro style */}
                    <div className="text-center mb-10">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/20 rounded-2xl mb-4">
                            <ShieldCheck className="text-primary w-8 h-8" />
                        </div>
                        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Rubio García <span className="text-primary">Dental</span></h1>
                        <p className="text-slate-500 text-xs font-medium uppercase tracking-[0.2em] mt-1">Ecosistema Dental Inteligente</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="bg-rose-50 border border-rose-200 text-rose-600 px-4 py-3 rounded-xl flex items-center gap-3 animate-shake">
                                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                                <p className="text-sm font-semibold">{error}</p>
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-widest text-slate-400 ml-1">Email Profesional</label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                                <input
                                    type="text"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-blue-200 rounded-xl focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all outline-none text-sm font-medium placeholder:text-slate-400"
                                    placeholder="JMD o email profesional"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-widest text-slate-400 ml-1">Contraseña</label>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-blue-200 rounded-xl focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all outline-none text-sm font-medium placeholder:text-slate-400"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full py-4 rounded-xl bg-gradient-to-r from-blue-600 to-blue-800 text-white font-bold text-sm shadow-lg shadow-blue-500/20 hover:shadow-2xl hover:shadow-blue-500/30 active:scale-[0.98] transition-all flex items-center justify-center gap-2 group ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-slate-900/30 border-t-slate-900 rounded-full animate-spin" />
                            ) : (
                                <>
                                    <span>ACCEDER AL SISTEMA</span>
                                    <LogIn className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-10 text-center">
                        <p className="text-[12px] text-slate-400 font-bold uppercase tracking-widest leading-relaxed">
                            Acceso restringido a personal de <br />
                            RUBIO GARCIA DENTAL
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <p className="text-center mt-8 text-slate-400 text-[12px] font-bold uppercase tracking-widest opacity-50">
                    &copy; 2026 Antigravity Systems &bull; SmilePro v2.4
                </p>
            </div>

            <style>{`
                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    25% { transform: translateX(-4px); }
                    75% { transform: translateX(4px); }
                }
                .animate-shake { animation: shake 0.2s ease-in-out 0s 2; }
            `}</style>
        </div>
    );
};

export default Login;
