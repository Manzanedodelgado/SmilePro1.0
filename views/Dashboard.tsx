
import React from 'react';
import {
    Armchair,
    Euro,
    Ban,
    ThumbsUp,
    Flame,
    Zap,
    BarChart3,
    Package,
    TrendingUp,
    MessageSquare,
    CheckCircle2,
    Calendar,
    ChevronRight,
    ArrowUpRight,
    ArrowDownRight,
    Target,
    Activity
} from 'lucide-react';
import { StatCard, Badge } from '../components/UI';

const MAIN_KPIS = [
    {
        id: 1,
        title: "Tasa Ocupación Real",
        value: "87%",
        trend: "+5%",
        isPositive: true,
        icon: Armchair,
        color: "text-primary",
        desc: "Tiempo de sillón productivo"
    },
    {
        id: 2,
        title: "Producción / Hora",
        value: "342€",
        trend: "+12€",
        isPositive: true,
        icon: Euro,
        color: "text-emerald-600",
        desc: "Rentabilidad media gabinete"
    },
    {
        id: 3,
        title: "Lucro Cesante",
        value: "1.250€",
        trend: "-15%",
        isPositive: true,
        icon: Ban,
        color: "text-rose-600",
        desc: "Pérdida por huecos/no-shows"
    },
    {
        id: 4,
        title: "Case Acceptance",
        value: "68%",
        trend: "-2%",
        isPositive: false,
        icon: ThumbsUp,
        color: "text-amber-600",
        desc: "% Presupuestos aceptados"
    }
];

const HEATMAP_DATA = [
    { hour: '09:00', mon: 80, tue: 90, wed: 60, thu: 85, fri: 50 },
    { hour: '10:00', mon: 95, tue: 100, wed: 80, thu: 90, fri: 70 },
    { hour: '11:00', mon: 100, tue: 100, wed: 90, thu: 95, fri: 85 },
    { hour: '12:00', mon: 70, tue: 80, wed: 50, thu: 60, fri: 40 },
    { hour: '13:00', mon: 40, tue: 50, wed: 30, thu: 40, fri: 20 },
    { hour: '16:00', mon: 90, tue: 95, wed: 85, thu: 90, fri: 60 },
    { hour: '17:00', mon: 100, tue: 100, wed: 100, thu: 100, fri: 50 },
    { hour: '18:00', mon: 85, tue: 90, wed: 80, thu: 85, fri: 30 },
];

const getHeatmapColor = (value: number) => {
    if (value >= 90) return 'bg-primary shadow-sm';
    if (value >= 75) return 'bg-primary/70';
    if (value >= 60) return 'bg-primary/40';
    if (value >= 45) return 'bg-primary/20';
    if (value >= 30) return 'bg-slate-100';
    return 'bg-slate-50 opacity-50';
};

const Dashboard: React.FC = () => {
    return (
        <div className="space-y-8 pb-10 animate-in fade-in duration-700 p-6 lg:p-10 max-w-6xl mx-auto w-full">
            {/* Header Section — DentalClinic Pro pattern */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-slate-900">Panel de Control</h1>
                    <p className="text-slate-500 text-sm">Gestiona la actividad clínica y rendimiento del día</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex bg-white p-1 rounded-lg border border-blue-200">
                        <button className="px-4 py-1.5 rounded-md text-xs font-bold bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-sm">Gerencia</button>
                        <button className="px-4 py-1.5 rounded-md text-xs font-bold text-slate-500 hover:text-slate-700">Recepción</button>
                    </div>
                </div>
            </div>

            {/* KPI Stats Grid — matches reference statistics row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {MAIN_KPIS.map(kpi => (
                    <StatCard
                        key={kpi.id}
                        icon={kpi.icon}
                        title={kpi.title}
                        value={kpi.value}
                        trend={kpi.trend}
                        isPositive={kpi.isPositive}
                        color={kpi.color}
                        description={kpi.desc}
                    />
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Heatmap — matches reference calendar grid pattern */}
                <div className="lg:col-span-8">
                    <div className="rounded-2xl border border-primary/10 bg-white p-6 shadow-sm">
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-4">
                                <h3 className="text-xl font-bold flex items-center gap-2">
                                    <Flame className="w-5 h-5 text-rose-500" />
                                    Ocupación por Slots
                                </h3>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-xs text-slate-500 font-medium mr-2">Intensidad:</span>
                                <div className="flex gap-1">
                                    <div className="size-3 rounded-full bg-slate-100" title="Baja"></div>
                                    <div className="size-3 rounded-full bg-primary/30" title="Media"></div>
                                    <div className="size-3 rounded-full bg-primary/60" title="Alta"></div>
                                    <div className="size-3 rounded-full bg-primary" title="Completa"></div>
                                </div>
                            </div>
                        </div>

                        <div className="w-full overflow-x-auto">
                            <table className="w-full text-center border-separate border-spacing-y-2">
                                <thead>
                                    <tr>
                                        <th className="px-4 py-2 text-xs font-bold text-slate-400 uppercase tracking-widest w-20">Slot</th>
                                        {['Lun', 'Mar', 'Mié', 'Jue', 'Vie'].map(day => (
                                            <th key={day} className="px-4 py-2 text-xs font-bold text-slate-400 uppercase tracking-widest">{day}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {HEATMAP_DATA.map((row, idx) => (
                                        <tr key={idx} className="group">
                                            <td className="px-4 py-1 text-xs font-bold text-slate-500">{row.hour}</td>
                                            {[row.mon, row.tue, row.wed, row.thu, row.fri].map((val, i) => (
                                                <td key={i} className="px-1 py-1">
                                                    <div
                                                        className={`w-full h-8 rounded-lg ${getHeatmapColor(val)} hover:scale-105 transform transition-all cursor-pointer`}
                                                        title={`Ocupación: ${val}%`}
                                                    >
                                                    </div>
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Side Panel — matches reference sidebar pattern */}
                <div className="lg:col-span-4 space-y-6">
                    {/* Sara IA Card — like reference "Today's Schedule" card */}
                    <div className="rounded-2xl border border-primary/10 bg-white shadow-sm overflow-hidden h-auto flex flex-col">
                        <div className="border-b border-primary/10 p-6 flex items-center justify-between bg-primary/5">
                            <div>
                                <h3 className="text-lg font-bold flex items-center gap-2">
                                    Sara Intelligence
                                    <Badge variant="primary">v4.2</Badge>
                                </h3>
                                <p className="text-xs text-slate-500">Motor de IA clínica activo</p>
                            </div>
                            <div className="flex size-10 items-center justify-center rounded-lg bg-primary text-white">
                                <Zap className="w-5 h-5" />
                            </div>
                        </div>
                        <div className="p-6">
                            <div>
                                <div className="flex justify-between items-end mb-2">
                                    <span className="text-xs text-slate-500 font-medium">Eficiencia IA</span>
                                    <span className="text-2xl font-black">72%</span>
                                </div>
                                <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                                    <div className="bg-primary h-full rounded-full" style={{ width: '72%' }}></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* AI Insights — matches reference appointment list pattern */}
                    <div className="rounded-2xl border border-primary/10 bg-white shadow-sm overflow-hidden flex flex-col">
                        <div className="border-b border-primary/10 p-6 flex items-center justify-between">
                            <h3 className="font-bold flex items-center gap-2">
                                <Target className="w-4 h-4 text-primary" />
                                AI Insights Board
                            </h3>
                            <span className="flex size-4 items-center justify-center rounded-full bg-rose-500 text-[9px] text-white font-bold">!</span>
                        </div>

                        <div className="p-4 space-y-3">
                            {/* Insight item — matches reference appointment item */}
                            <div className="group relative flex items-center gap-4 rounded-xl border border-blue-100 p-4 hover:border-primary/40 hover:bg-primary/5 transition-all cursor-pointer">
                                <div className="flex size-10 items-center justify-center rounded-lg bg-primary/20 text-primary shrink-0">
                                    <MessageSquare className="w-4 h-4" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-bold text-slate-900">Campaña de Alerta</p>
                                    <p className="text-xs text-slate-500 mt-0.5">Baja ocupación Jueves. Lanzar recordatorio.</p>
                                </div>
                                <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-primary transition-colors" />
                            </div>

                            <div className="group relative flex items-center gap-4 rounded-xl border border-blue-100 p-4 hover:border-primary/40 hover:bg-primary/5 transition-all cursor-pointer">
                                <div className="flex size-10 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600 shrink-0">
                                    <CheckCircle2 className="w-4 h-4" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-bold text-slate-900">Seguimiento Implantes</p>
                                    <p className="text-xs text-slate-500 mt-0.5">3 pacientes con revisión pendiente esta semana.</p>
                                </div>
                                <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-primary transition-colors" />
                            </div>
                        </div>

                        <div className="p-4 border-t border-primary/10">
                            <button className="w-full rounded-lg bg-slate-100 py-2.5 text-xs font-bold text-slate-600 hover:bg-primary/20 hover:text-primary transition-all">
                                Ver Todos los Insights
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
