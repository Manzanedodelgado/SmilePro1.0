import React, { useState } from 'react';
import { type Area } from '../types';
import { navigationItems } from '../navigation';
import {
    LayoutDashboard, Calendar, Users, BarChart2, Package, Settings, MessageSquare,
    Search, UserPlus, ChevronRight, Activity, Clock, AlertCircle, TrendingUp,
    MoreHorizontal, PlusCircle, AlertTriangle, Monitor, FileText, Grid, CreditCard,
    Brain, FileCheck, ClipboardList, ShoppingCart, QrCode, Receipt, PieChart, Bot
} from 'lucide-react';

interface SidebarProps {
    activeArea: Area;
    activeSubArea: string;
    onNavigate: (area: Area, subArea: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeArea, activeSubArea, onNavigate }) => {
    const [isHovered, setIsHovered] = useState(false);
    const currentMenuItem = navigationItems.find(item => item.name === activeArea);

    if (!currentMenuItem?.children) {
        return null;
    }

    const getIcon = (iconName: string) => {
        switch (iconName) {
            case 'dashboard': return LayoutDashboard;
            case 'calendar_today': return Calendar;
            case 'people': return Users;
            case 'psychology': return Brain;
            case 'inventory_2': return Package;
            case 'admin_panel_settings': return Settings;
            case 'chat': return MessageSquare;
            case 'view_week': return Calendar;
            case 'view_day': return Calendar;
            case 'edit_calendar': return Settings;
            case 'hourglass_top': return Clock;
            case 'medical_information': return Activity;
            case 'grid_view': return Grid;
            case 'sick': return AlertCircle;
            case 'description': return FileText;
            case 'payments': return CreditCard;
            case 'request_quote': return Receipt;
            case 'smart_toy': return Brain;
            case 'fact_check': return FileCheck;
            case 'rule': return ClipboardList;
            case 'qr_code_scanner': return QrCode;
            case 'shopping_cart': return ShoppingCart;
            case 'account_balance': return BarChart2;
            case 'receipt_long': return FileText;
            case 'request_page': return FileText;
            case 'analytics': return PieChart;
            case 'inbox': return MessageSquare;
            case 'contacts': return Users;
            default: return Activity;
        }
    };

    const stats = {
        espera: [
            { id: "p1", nombre: "Bárbara Ruiz", tiempo: "12 min", alerta: "Látex", trat: "Cirugía" },
            { id: "p2", nombre: "Javier Abad", tiempo: "4 min", alerta: "Deuda", trat: "Limpieza" }
        ],
        gabinete: [
            { id: "p3", nombre: "Maria Carmen", gab: "G1", doctor: "Pérez", tiempo: "35 min" }
        ],
        waitlist: [
            { id: "w1", nombre: "Fuensanta Aguado", trat: "Revision", urgencia: "Alta" },
            { id: "w2", nombre: "Roberto Solís", trat: "Urgencia", urgencia: "Media" }
        ],
        produccion: { actual: 3450, objetivo: 5000 }
    };

    const isAgenda = activeArea === 'Agenda';
    const MainIcon = getIcon(currentMenuItem.icon || 'clinic');
    const isExpanded = isHovered;

    return (
        <div className={`relative h-full flex-shrink-0 z-40 transition-all duration-300 ${isExpanded ? 'w-72' : 'w-[72px]'}`}>
            <aside
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className={`absolute inset-y-0 left-0 h-full flex flex-col z-40 transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] flex-shrink-0 overflow-hidden
                    bg-white border-r border-blue-200 shadow-sm
                    ${isExpanded ? 'w-72' : 'w-[72px]'}`}
            >
                {/* ── Header ── */}
                <div className="h-14 flex items-center justify-center px-3 border-b border-blue-200 flex-shrink-0 bg-white">
                    {isExpanded ? (
                        <div className="flex w-full gap-2 animate-fade-in">
                            <button
                                onClick={() => onNavigate('Pacientes', 'ACTION_SEARCH')}
                                className="flex-1 flex items-center justify-center gap-2 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-all active:scale-95"
                            >
                                <Search className="w-3.5 h-3.5" />
                                <span className="text-[13px] font-bold uppercase tracking-wider">Buscar</span>
                            </button>
                            <button
                                onClick={() => onNavigate('Pacientes', 'ACTION_NEW')}
                                className="flex-1 flex items-center justify-center gap-2 py-2 bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-lg transition-all active:scale-95 font-black"
                            >
                                <UserPlus className="w-3.5 h-3.5" />
                                <span className="text-[13px] font-bold uppercase tracking-wider">Nuevo</span>
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={() => onNavigate('Pacientes', 'ACTION_SEARCH')}
                            title="Buscar"
                            className="w-full flex items-center justify-center py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg transition-all active:scale-95"
                        >
                            <Search className="w-4 h-4" />
                        </button>
                    )}
                </div>

                {/* ── Scrollable Content ── */}
                <div className={`flex-1 overflow-y-auto overflow-x-hidden ${isExpanded ? 'px-3' : 'px-2'} flex flex-col gap-4 py-4`}>

                    {/* Area Title */}
                    {currentMenuItem.title && (
                        <div className={`transition-all duration-300 ${isExpanded ? 'px-3 pt-2 pb-3 mb-1' : 'px-1 py-1 mb-1 flex flex-col items-center'}`}>
                            {isExpanded ? (
                                <div className="animate-fade-in">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="w-9 h-9 rounded-xl bg-blue-600/15 border border-blue-600/30 flex items-center justify-center flex-shrink-0">
                                            <MainIcon className="w-4.5 h-4.5 text-blue-700" />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] leading-none mb-0.5">{activeArea}</p>
                                            <h2 className="text-[16px] font-black text-slate-900 uppercase tracking-tight leading-tight truncate">{currentMenuItem.title}</h2>
                                        </div>
                                    </div>
                                    <div className="h-px w-full" style={{ background: 'linear-gradient(to right, rgba(30,64,175,0.4), transparent)' }} />
                                </div>
                            ) : (
                                <div className="w-10 h-10 rounded-xl bg-blue-600/15 border border-blue-600/30 flex items-center justify-center flex-shrink-0 animate-fade-in mb-1" title={`${activeArea} - ${currentMenuItem.title}`}>
                                    <MainIcon className="w-5 h-5 text-blue-700" />
                                </div>
                            )}
                        </div>
                    )}

                    {/* ── Navigation Items ── */}
                    <nav className="flex flex-col gap-1 w-full">
                        {currentMenuItem.children.map((subItem) => {
                            const SubIcon = getIcon(subItem.icon || 'dashboard');
                            const isActive = activeSubArea === subItem.name;
                            return (
                                <button
                                    key={subItem.name}
                                    title={subItem.name}
                                    onClick={() => onNavigate(activeArea, subItem.name)}
                                    className={`flex items-center rounded-lg group transition-all duration-200 ${isExpanded ? 'w-full gap-3 px-3 py-2.5' : 'w-11 h-11 justify-center mx-auto'
                                        } ${isActive
                                            ? 'bg-blue-600/10 text-blue-700 shadow-sm border border-blue-600/20'
                                            : 'bg-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-transparent'
                                        }`}
                                >
                                    <SubIcon className={`flex-shrink-0 ${isExpanded ? 'w-4 h-4' : 'w-[18px] h-[18px]'} ${isActive ? 'text-blue-700' : 'text-slate-500 group-hover:text-slate-700'}`} />
                                    {isExpanded && (
                                        <div className="flex-1 flex items-center justify-between min-w-0 animate-fade-in">
                                            <span className="text-[15px] font-semibold flex-1 text-left leading-tight truncate">
                                                {subItem.name}
                                            </span>
                                            {isActive && <ChevronRight className="w-3.5 h-3.5 text-blue-600/60" />}
                                        </div>
                                    )}
                                </button>
                            );
                        })}
                    </nav>

                    {/* ── Agenda: Sala de Espera ── */}
                    {isAgenda && isExpanded && (
                        <div className="mt-2 border-t border-blue-200 pt-4">
                            <div className="animate-fade-in space-y-6">
                                <div>
                                    <div className="flex items-center justify-between mb-2 px-1">
                                        <div className="flex items-center gap-2 text-slate-500">
                                            <Clock className="w-3.5 h-3.5" />
                                            <span className="text-[10px] font-bold uppercase tracking-wider">Sala de Espera</span>
                                        </div>
                                        <span className="bg-primary text-slate-900 text-[10px] font-black px-1.5 py-0.5 rounded-md">{stats.espera.length}</span>
                                    </div>
                                    <div className="space-y-1.5">
                                        {stats.espera.map((p) => (
                                            <div key={p.id} className="bg-slate-50 p-2.5 rounded-lg flex items-center gap-3 hover:bg-slate-100 transition-all cursor-pointer border border-blue-200">
                                                <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${parseInt(p.tiempo) > 10 ? 'bg-red-50 text-red-500 border border-red-200' : 'bg-emerald-50 text-emerald-600 border border-emerald-200'}`}>
                                                    <div className="flex flex-col items-center leading-none">
                                                        <span className="text-xs font-bold">{p.tiempo.split(' ')[0]}</span>
                                                        <span className="text-[7px] font-bold uppercase">min</span>
                                                    </div>
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-[14px] font-bold text-slate-800 truncate leading-tight">{p.nombre}</p>
                                                    <div className="flex items-center gap-1.5 mt-0.5">
                                                        <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide truncate">{p.trat}</span>
                                                        {p.alerta === "Látex" && <span className="w-1.5 h-1.5 bg-red-400 rounded-full"></span>}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* En Gabinete */}
                                <div>
                                    <div className="flex items-center justify-between mb-3 px-1 mt-2">
                                        <div className="flex items-center gap-2 text-slate-500">
                                            <Activity className="w-3.5 h-3.5" />
                                            <span className="text-[12px] font-black uppercase tracking-widest">En Gabinete</span>
                                        </div>
                                        <span className="bg-primary text-slate-900 text-[12px] font-black px-1.5 py-0.5 rounded-md">1</span>
                                    </div>
                                    <div className="bg-white border-l-4 border-l-primary border border-blue-200 p-3 rounded-lg flex items-center gap-3 hover:bg-slate-50 transition-all cursor-pointer">
                                        <div className="w-10 h-10 rounded-lg bg-primary text-slate-900 flex items-center justify-center flex-shrink-0 font-black text-sm">
                                            G1
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs font-bold text-slate-800 truncate leading-tight">Maria Carmen</p>
                                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Dr. Pérez • 35 min</span>
                                        </div>
                                        <span className="w-2 h-2 rounded-full bg-primary shadow-[0_0_8px_rgba(76,204,230,0.5)]"></span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* ── Footer Actions ── */}
                <div className={`p-3 border-t border-blue-200 transition-all duration-300 mt-auto bg-slate-50 ${isExpanded ? 'grid grid-cols-2 gap-2' : 'flex flex-col gap-2 items-center'}`}>
                    {isExpanded ? (
                        <>
                            <button className="flex items-center justify-center gap-2 py-2 bg-primary/10 hover:bg-primary/20 text-primary rounded-lg transition-all active:scale-95 animate-fade-in">
                                <PlusCircle className="w-4 h-4" />
                                <span className="text-[12px] font-bold uppercase tracking-wider">Cita</span>
                            </button>
                            <button className="flex items-center justify-center gap-2 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-all active:scale-95 animate-fade-in">
                                <AlertTriangle className="w-4 h-4" />
                                <span className="text-[12px] font-bold uppercase tracking-wider">Urgente</span>
                            </button>
                        </>
                    ) : (
                        <>
                            <button className="w-10 h-10 flex items-center justify-center bg-primary/10 hover:bg-primary/20 text-primary rounded-lg transition-all active:scale-95 animate-fade-in" title="Nueva Cita">
                                <PlusCircle className="w-[18px] h-[18px]" />
                            </button>
                            <button className="w-10 h-10 flex items-center justify-center bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-all active:scale-95 animate-fade-in" title="Urgencia">
                                <AlertTriangle className="w-[18px] h-[18px]" />
                            </button>
                        </>
                    )}
                </div>
            </aside>
        </div>
    );
};

export default Sidebar;