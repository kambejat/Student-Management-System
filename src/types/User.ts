export interface User {
    user_id: number | null;
    username: string | null;
    roles: string[];
    permissions: string[];
}