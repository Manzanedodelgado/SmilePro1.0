// ─────────────────────────────────────────────────────────────────
//  services/pacientes.service.ts
//  CRUD completo de pacientes contra Supabase → tabla "Pacientes".
//  Búsqueda por NumPac, Nombre, Apellidos, NIF, TelMovil.
// ─────────────────────────────────────────────────────────────────
import { Paciente } from '../types';
import { dbSelect, dbInsert, dbUpdate, dbDelete, isDbConfigured } from './db';

// Tipo interno de BD (PascalCase heredado de GELITE)
interface PacienteRow {
    IdPac?: number;
    NumPac?: string;
    Nombre?: string;
    Apellidos?: string;
    NIF?: string;
    Tel1?: string;
    Tel2?: string;
    TelMovil?: string;
    Email?: string;
    FecNacim?: string;
    Direccion?: string;
    CP?: string;
    Observaciones?: string;
    Notas?: string;
}

/** Convierte fila de BD al tipo Paciente del frontend */
const rowToPaciente = (row: PacienteRow): Paciente => ({
    numPac: row.NumPac ?? String(row.IdPac ?? ''),
    idPac: row.IdPac,          // ← guardamos el IdPac GELITE para queries directas
    nombre: row.Nombre ?? '',
    apellidos: row.Apellidos ?? '',
    dni: row.NIF ?? '',
    telefono: row.TelMovil ?? row.Tel1 ?? row.Tel2 ?? '',
    fechaNacimiento: row.FecNacim ?? '',
    tutor: undefined,
    alergias: [],
    medicacionActual: undefined,
    deuda: false,
    historial: [],
    consentimientosFirmados: false,
});

const pacienteToRow = (p: Partial<Paciente>): Partial<PacienteRow> => ({
    NumPac: p.numPac,
    Nombre: p.nombre,
    Apellidos: p.apellidos,
    NIF: p.dni,
    TelMovil: p.telefono,
    FecNacim: p.fechaNacimiento,
    Observaciones: p.tutor ? `Tutor: ${p.tutor}` : undefined,
});

// ── Búsqueda de pacientes ────────────────────────────────────────

/**
 * Busca pacientes en la tabla "Pacientes" por:
 *   NumPac, Nombre, Apellidos, NIF, TelMovil
 * Soporta nombre+apellidos combinados (parte de cada campo).
 */
export const searchPacientes = async (query: string): Promise<Paciente[]> => {
    if (!isDbConfigured()) return [];

    const selectCols = 'Nombre,Apellidos,NIF,TelMovil,Email';

    if (!query.trim()) {
        const rows = await dbSelect<PacienteRow>('Pacientes', {
            select: selectCols,
            order: 'Nombre.asc',
            limit: '30',
        });
        return rows.map(rowToPaciente);
    }

    const q = query.trim().toUpperCase();

    // FDW (SQL Server) no soporta ilike ni or(). Buscar con like + UPPERCASE.
    let rows = await dbSelect<PacienteRow>('Pacientes', {
        select: selectCols,
        Nombre: `like.*${q}*`,
        order: 'Nombre.asc',
        limit: '30',
    });

    if (rows.length === 0) {
        rows = await dbSelect<PacienteRow>('Pacientes', {
            select: selectCols,
            Apellidos: `like.*${q}*`,
            order: 'Apellidos.asc',
            limit: '30',
        });
    }

    if (rows.length === 0) {
        rows = await dbSelect<PacienteRow>('Pacientes', {
            select: selectCols,
            NIF: `like.*${q}*`,
            order: 'Nombre.asc',
            limit: '30',
        });
    }

    return rows.map(rowToPaciente);
};

export const getPaciente = async (numPac: string): Promise<Paciente | null> => {
    if (!isDbConfigured()) return null;
    const rows = await dbSelect<PacienteRow>('Pacientes', { NumPac: `eq.${numPac}` });
    return rows[0] ? rowToPaciente(rows[0]) : null;
};

export const createPaciente = async (p: Omit<Paciente, 'historial'>): Promise<Paciente | null> => {
    const row = await dbInsert<PacienteRow>('Pacientes', pacienteToRow(p));
    return row ? rowToPaciente(row) : null;
};

/** Actualiza datos de un paciente existente */
export const updatePaciente = async (
    numPac: string,
    updates: Partial<Omit<Paciente, 'historial'>>
): Promise<Paciente | null> => {
    const row = await dbUpdate<PacienteRow>('Pacientes', numPac, pacienteToRow(updates), 'NumPac');
    return row ? rowToPaciente(row) : null;
};

export const deletePaciente = async (numPac: string): Promise<boolean> =>
    dbDelete('Pacientes', numPac, 'NumPac');

export { isDbConfigured };
