// ─────────────────────────────────────────────────────────────────
//  services/historial.service.ts
//  Historial clínico, presupuestos y citas de un paciente
//  contra Supabase → tablas FDW TtosMed, PRESUTTO, DCitas
//
//  NOTA: el wrapper MSSQL de Supabase NO soporta Numeric, TinyInt
//  ni SmallDateTime. Solo están disponibles columnas integer y text.
// ─────────────────────────────────────────────────────────────────
import { dbSelect, isDbConfigured } from './db';

// ── Tipos internos ───────────────────────────────────────────────

interface TtosMedRow {
    IdPac?: number;
    NumTto?: number;
    IdTto?: number;
    IdCol?: number;
    IdUser?: number;
    Notas?: string;
    CId?: string;
}

interface PresuttoRow {
    Ident?: number;
    Id_Presu?: number;
    IdPac?: number;
    Orden?: number;
    IdTto?: number;
    IdTratamiento?: number;
    IdColabo?: number;
    Notas?: string;
}

interface CitaRow {
    IdPac?: number;
    NUMPAC?: string;
    Fecha?: number;
    Hora?: number;
    Duracion?: number;
    Texto?: string;
    IdSitC?: number;
    NOTAS?: string;
    Contacto?: string;
    IdCol?: number;
    IdBox?: number;
}

// ── Tipos exportados ─────────────────────────────────────────────

export interface Tratamiento {
    numTto: number;
    idTto?: number;
    idCol?: number;
    notas: string;          // descripción del tratamiento
}

export interface LineaPresupuesto {
    ident: number;
    idPresu: number;
    orden: number;
    idTto?: number;
    idTratamiento?: number;
    notas: string;          // nombre del tratamiento
}

export interface CitaHistorial {
    fecha: string;
    hora: string;
    duracion: number;
    texto: string;
    estado: string;
    notas: string;
    idCol?: number;
}

// ── Mapeos ────────────────────────────────────────────────────────
const ESTADO_CITA: Record<number, string> = {
    0: 'Planificada',
    1: 'Anulada',
    2: 'Confirmada',
    3: 'En espera',
    4: 'En gabinete',
    5: 'Finalizada',
    6: 'No presentado',
    8: 'Cancelada',
};

// helpers para fechas numéricas GELITE (OLE serial date)
const geliteFecha = (n?: number): string => {
    if (!n || n < 1000) return '';
    try {
        const d = new Date(Date.UTC(1899, 11, 30));
        d.setUTCDate(d.getUTCDate() + n);
        return d.toISOString().slice(0, 10);
    } catch { return ''; }
};

const geliteHora = (n?: number): string => {
    if (n == null || n < 0) return '';
    const h = Math.floor(n / 100);
    const m = n % 100;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
};

// ── Columnas select seguras (solo integer + text) ────────────────
const TTOS_COLS = 'IdPac,NumTto,IdTto,IdCol,IdUser,Notas,CId';
const PRESU_COLS = 'Ident,Id_Presu,IdPac,Orden,IdTto,IdTratamiento,IdColabo,Notas';
const CITA_COLS = 'IdPac,NUMPAC,Fecha,Hora,Duracion,Texto,IdSitC,NOTAS,Contacto,IdCol,IdBox';

// ── Funciones de consulta ────────────────────────────────────────

/** Obtiene tratamientos realizados de un paciente */
export const getTratamientos = async (idPac: number): Promise<Tratamiento[]> => {
    if (!isDbConfigured()) return [];
    try {
        const rows = await dbSelect<TtosMedRow>('TtosMed', {
            select: TTOS_COLS,
            IdPac: `eq.${idPac}`,
            order: 'NumTto.desc',
            limit: '100',
        });
        return rows.map(r => ({
            numTto: r.NumTto ?? 0,
            idTto: r.IdTto,
            idCol: r.IdCol,
            notas: r.Notas?.trim() ?? '',
        }));
    } catch (err) {
        console.warn('[historial] getTratamientos error:', err);
        return [];
    }
};

/** Obtiene líneas de presupuesto de un paciente */
export const getPresupuestos = async (idPac: number): Promise<LineaPresupuesto[]> => {
    if (!isDbConfigured()) return [];
    try {
        const rows = await dbSelect<PresuttoRow>('PRESUTTO', {
            select: PRESU_COLS,
            IdPac: `eq.${idPac}`,
            order: 'Id_Presu.desc,Orden.asc',
            limit: '200',
        });
        return rows.map(r => ({
            ident: r.Ident ?? 0,
            idPresu: r.Id_Presu ?? 0,
            orden: r.Orden ?? 0,
            idTto: r.IdTto,
            idTratamiento: r.IdTratamiento,
            notas: r.Notas?.trim() ?? '',
        }));
    } catch (err) {
        console.warn('[historial] getPresupuestos error:', err);
        return [];
    }
};

/** Obtiene historial de citas de un paciente */
export const getCitasHistorial = async (idPac: number): Promise<CitaHistorial[]> => {
    if (!isDbConfigured()) return [];
    try {
        const rows = await dbSelect<CitaRow>('DCitas', {
            select: CITA_COLS,
            IdPac: `eq.${idPac}`,
            order: 'Fecha.desc',
            limit: '100',
        });
        return rows.map(r => ({
            fecha: geliteFecha(r.Fecha),
            hora: geliteHora(r.Hora),
            duracion: r.Duracion ?? 0,
            texto: r.Texto?.trim() ?? '',
            estado: ESTADO_CITA[r.IdSitC ?? 0] ?? `Estado ${r.IdSitC}`,
            notas: r.NOTAS?.trim() ?? '',
            idCol: r.IdCol,
        }));
    } catch (err) {
        console.warn('[historial] getCitasHistorial error:', err);
        return [];
    }
};

/** Resumen rápido: todos los datos de un paciente */
export const getResumenPaciente = async (idPac: number) => {
    const [tratamientos, presupuestos, citas] = await Promise.all([
        getTratamientos(idPac),
        getPresupuestos(idPac),
        getCitasHistorial(idPac),
    ]);
    return { tratamientos, presupuestos, citas };
};
