/// <reference types="vite/client" />
// ─────────────────────────────────────────────────────────────────
//  services/db.ts — Supabase REST API bridge
//  Provides generic CRUD helpers against Supabase PostgREST.
//  Reads credentials from VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY.
// ─────────────────────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const meta = import.meta as any;
const SUPABASE_URL = (meta.env?.VITE_SUPABASE_URL as string | undefined)?.replace(/\/$/, '');
const SUPABASE_KEY = meta.env?.VITE_SUPABASE_ANON_KEY as string | undefined;

export const isDbConfigured = (): boolean =>
    Boolean(SUPABASE_URL && SUPABASE_KEY);

// ── Internal fetch wrapper ─────────────────────────────────────

const sbFetch = async (
    path: string,
    options?: RequestInit & { params?: Record<string, string> }
): Promise<Response> => {
    if (!isDbConfigured()) throw new Error('DB not configured');

    let url = `${SUPABASE_URL}/rest/v1/${path}`;

    if (options?.params) {
        const qs = new URLSearchParams(options.params).toString();
        url += (url.includes('?') ? '&' : '?') + qs;
    }

    return fetch(url, {
        ...options,
        headers: {
            'apikey': SUPABASE_KEY!,
            'Authorization': `Bearer ${SUPABASE_KEY}`,
            'Content-Type': 'application/json',
            'Prefer': 'return=representation',
            ...(options?.headers ?? {}),
        },
    });
};

// ── Public helpers ──────────────────────────────────────────────

/**
 * Generic SELECT from a table.
 * `query` is a Record of PostgREST query params, e.g.
 *   { Nombre: 'ilike.*Juan*', order: 'Apellidos.asc', limit: '20' }
 *   { or: 'Nombre.ilike.*Juan*,Apellidos.ilike.*Juan*' }
 */
export const dbSelect = async <T = unknown>(
    table: string,
    query?: Record<string, string>,
): Promise<T[]> => {
    if (!isDbConfigured()) return [];
    try {
        const qs = query
            ? '?' + Object.entries(query).map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`).join('&')
            : '';
        const res = await sbFetch(`${table}${qs}`);
        if (!res.ok) {
            console.warn(`[db] SELECT ${table} failed:`, res.status, await res.text().catch(() => ''));
            return [];
        }
        return res.json();
    } catch (err) {
        console.warn('[db] SELECT error:', err);
        return [];
    }
};

/** INSERT a row into a table. Returns the inserted row. */
export const dbInsert = async <T = unknown>(
    table: string,
    data: Partial<T>
): Promise<T | null> => {
    if (!isDbConfigured()) return null;
    try {
        const res = await sbFetch(table, {
            method: 'POST',
            body: JSON.stringify(data),
        });
        if (!res.ok) {
            console.warn(`[db] INSERT ${table} failed:`, res.status, await res.text().catch(() => ''));
            return null;
        }
        const rows = await res.json();
        return Array.isArray(rows) ? rows[0] ?? null : rows;
    } catch (err) {
        console.warn('[db] INSERT error:', err);
        return null;
    }
};

/** UPDATE a row by match column. */
export const dbUpdate = async <T = unknown>(
    table: string,
    matchValue: string,
    data: Partial<T>,
    matchColumn = 'id'
): Promise<T | null> => {
    if (!isDbConfigured()) return null;
    try {
        const res = await sbFetch(`${table}?${encodeURIComponent(matchColumn)}=eq.${encodeURIComponent(matchValue)}`, {
            method: 'PATCH',
            body: JSON.stringify(data),
        });
        if (!res.ok) {
            console.warn(`[db] UPDATE ${table} failed:`, res.status, await res.text().catch(() => ''));
            return null;
        }
        const rows = await res.json();
        return Array.isArray(rows) ? rows[0] ?? null : rows;
    } catch (err) {
        console.warn('[db] UPDATE error:', err);
        return null;
    }
};

/** DELETE a row by match column. */
export const dbDelete = async (
    table: string,
    matchValue: string,
    matchColumn = 'id'
): Promise<boolean> => {
    if (!isDbConfigured()) return false;
    try {
        const res = await sbFetch(`${table}?${encodeURIComponent(matchColumn)}=eq.${encodeURIComponent(matchValue)}`, {
            method: 'DELETE',
        });
        return res.ok;
    } catch (err) {
        console.warn('[db] DELETE error:', err);
        return false;
    }
};

/** Generic RPC call */
export const dbRpc = async <T = unknown>(
    fn: string,
    params?: Record<string, unknown>
): Promise<T> => {
    if (!isDbConfigured()) return [] as unknown as T;
    const res = await sbFetch(`rpc/${fn}`, {
        method: 'POST',
        body: JSON.stringify(params ?? {}),
    });
    return res.json();
};

/** Re-export for convenience */
export const dbFetch = sbFetch;
