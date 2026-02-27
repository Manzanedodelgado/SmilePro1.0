// ─────────────────────────────────────────────────────────────────
//  services/auth.service.ts — Frontend2: NO BACKEND
//  Auto-bypass login. No Supabase connection.
// ─────────────────────────────────────────────────────────────────

export interface AuthUser {
    id: string;
    email?: string;
    phone?: string;
    last_sign_in_at?: string;
}

export interface AuthSession {
    access_token: string;
    refresh_token: string;
    user: AuthUser;
}

const MOCK_SESSION: AuthSession = {
    access_token: 'frontend2-mock-token',
    refresh_token: 'frontend2-mock-refresh',
    user: {
        id: 'admin-jmd',
        email: 'jmd@rubiogarcia.dental',
        last_sign_in_at: new Date().toISOString()
    }
};

/** Login — always succeeds with mock session */
export const signIn = async (_email: string, _password: string): Promise<AuthSession | null> => {
    return MOCK_SESSION;
};

/** Get user — returns mock user */
export const getUser = async (_token: string): Promise<AuthUser | null> => {
    return MOCK_SESSION.user;
};

/** Logout — always succeeds */
export const signOut = async (_token: string): Promise<boolean> => {
    return true;
};
