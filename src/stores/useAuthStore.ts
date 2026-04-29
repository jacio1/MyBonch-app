import { User } from "@supabase/supabase-js";


interface AuthState {
    user: User | null;
    loading: boolean;
    error: string | null;
}