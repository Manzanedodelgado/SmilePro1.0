import React from 'react';
import { ArrowUpRight, ArrowDownRight, LucideIcon } from 'lucide-react';

interface StatCardProps {
    icon: LucideIcon;
    title: React.ReactNode;
    value: React.ReactNode;
    trend?: string;
    isPositive?: boolean;
    color: string;
    description?: string;
    onClick?: () => void;
}

/**
 * DentalClinic Pro — StatCard
 * Matches reference: rounded-xl, border-primary/10, icon in colored bg, pill badges
 */
export const StatCard: React.FC<StatCardProps> = ({
    icon: Icon,
    title,
    value,
    trend,
    isPositive = true,
    color,
    description,
    onClick
}) => (
    <div
        onClick={onClick}
        className={`bg-white p-5 rounded-xl shadow-sm border border-primary/10 hover:border-primary/30 transition-all group relative overflow-hidden ${onClick ? 'cursor-pointer active:scale-[0.98]' : ''}`}
    >
        <div className="flex justify-between items-start mb-3 relative z-10">
            <div className={`flex size-10 items-center justify-center rounded-lg ${color} bg-opacity-10`}>
                <Icon className={`w-5 h-5 ${color}`} />
            </div>
            {trend && (
                <div className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[12px] font-bold ${isPositive ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
                    {isPositive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                    {trend}
                </div>
            )}
        </div>
        <div className="relative z-10">
            <p className="text-xs text-slate-500 font-medium">{title}</p>
            <p className="text-2xl font-black mt-1">{value}</p>
            {description && <p className="text-xs text-slate-500 font-medium mt-1">{description}</p>}
        </div>
    </div>
);

interface PremiumContainerProps {
    children: React.ReactNode;
    title?: React.ReactNode;
    subtitle?: React.ReactNode;
    actions?: React.ReactNode;
    footer?: React.ReactNode;
    className?: string;
}

/**
 * DentalClinic Pro — Container
 * Matches reference: rounded-2xl, border-primary/10, clean header with border-b
 */
export const PremiumContainer: React.FC<PremiumContainerProps> = ({
    children,
    title,
    subtitle,
    actions,
    footer,
    className = ""
}) => (
    <div className={`bg-white rounded-2xl border border-primary/10 shadow-sm overflow-hidden flex flex-col ${className}`}>
        {(title || actions) && (
            <div className="px-6 py-4 border-b border-primary/10 flex justify-between items-center">
                <div>
                    {title && <h3 className="font-bold text-slate-900 tracking-tight">{title}</h3>}
                    {subtitle && <p className="text-xs text-slate-500 font-medium mt-0.5">{subtitle}</p>}
                </div>
                {actions && <div className="flex items-center gap-2">{actions}</div>}
            </div>
        )}
        <div className="p-6 flex-1">
            {children}
        </div>
        {footer && (
            <div className="px-6 py-3 border-t border-primary/10">
                {footer}
            </div>
        )}
    </div>
);

interface BadgeProps {
    children: React.ReactNode;
    variant?: 'blue' | 'emerald' | 'rose' | 'amber' | 'slate' | 'primary';
    className?: string;
}

/**
 * DentalClinic Pro — Badge
 * Matches reference: rounded-full pill badges
 */
export const Badge: React.FC<BadgeProps> = ({ children, variant = 'slate', className = "" }) => {
    const variants = {
        primary: 'bg-primary/10 text-primary border-primary/20',
        blue: 'bg-blue-100 text-blue-600 border-blue-200',
        emerald: 'bg-emerald-100 text-emerald-600 border-emerald-200',
        rose: 'bg-rose-100 text-rose-600 border-rose-200',
        amber: 'bg-amber-100 text-amber-600 border-amber-200',
        slate: 'bg-slate-100 text-slate-600 border-blue-200',
    };

    return (
        <span className={`px-2.5 py-0.5 rounded-full border text-[12px] font-bold ${variants[variant]} ${className}`}>
            {children}
        </span>
    );
};
