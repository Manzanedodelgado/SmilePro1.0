/// <reference types="vite/client" />
// ─────────────────────────────────────────────────────────────────
//  services/db.ts — Frontend2: NO BACKEND
//  All functions return empty/mock data. No Supabase connection.
// ─────────────────────────────────────────────────────────────────

export const isDbConfigured = (): boolean => false;

/** Mock fetch — always returns empty */
export const dbFetch = async (
    _path: string,
    _options?: RequestInit & { params?: Record<string, string> }
): Promise<Response> => {
    return new Response(JSON.stringify([]), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
    });
};

/** Mock select helper */
export const dbSelect = async <T = unknown>(
    _table: string,
    _query?: string,
    _options?: { signal?: AbortSignal }
): Promise<T[]> => {
    return [] as T[];
};

/** Mock insert */
export const dbInsert = async <T = unknown>(
    _table: string,
    _rows: T | T[]
): Promise<T[]> => {
    return (Array.isArray(_rows) ? _rows : [_rows]) as T[];
};

/** Mock update */
export const dbUpdate = async <T = unknown>(
    _table: string,
    _match: Record<string, unknown>,
    _data: Partial<T>
): Promise<T[]> => {
    return [] as T[];
};

/** Mock delete */
export const dbDelete = async (
    _table: string,
    _match: Record<string, unknown>
): Promise<void> => {
    return;
};

/** Mock RPC */
export const dbRpc = async <T = unknown>(
    _fn: string,
    _params?: Record<string, unknown>
): Promise<T> => {
    return [] as unknown as T;
};
