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
    Direccion?: string;
    CP?: string;
    Notas?: string;
    Sexo?: string;
}

/** Convierte fila de BD al tipo Paciente del frontend */
const rowToPaciente = (row: PacienteRow): Paciente => ({
    numPac: row.NumPac ?? String(row.IdPac ?? ''),
    idPac: row.IdPac,
    nombre: row.Nombre?.trim() ?? '',
    apellidos: row.Apellidos?.trim() ?? '',
    dni: row.NIF?.trim() ?? '',
    telefono: row.TelMovil?.trim() ?? row.Tel1?.trim() ?? row.Tel2?.trim() ?? '',
    tel1: row.Tel1?.trim(),
    tel2: row.Tel2?.trim(),
    email: row.Email?.trim(),
    fechaNacimiento: '',
    direccion: row.Direccion?.trim(),
    cp: row.CP?.trim(),
    sexo: row.Sexo?.trim(),
    notas: row.Notas?.trim(),
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
    Direccion: p.direccion,
    CP: p.cp,
    Notas: p.notas,
});

// ── Búsqueda de pacientes ────────────────────────────────────────

/**
 * Busca pacientes en la tabla "Pacientes" por:
 *   NumPac, Nombre, Apellidos, NIF, TelMovil
 * Soporta nombre+apellidos combinados (parte de cada campo).
 */
export const searchPacientes = async (query: string): Promise<Paciente[]> => {
    if (!isDbConfigured()) return [];

    const selectCols = 'IdPac,NumPac,Nombre,Apellidos,NIF,Tel1,Tel2,TelMovil,Email,Direccion,CP,Notas,Sexo';

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
    const selectCols = 'IdPac,NumPac,Nombre,Apellidos,NIF,Tel1,Tel2,TelMovil,Email,Direccion,CP,Notas,Sexo';
    const rows = await dbSelect<PacienteRow>('Pacientes', {
        select: selectCols,
        NumPac: `eq.${numPac}`,
    });
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
