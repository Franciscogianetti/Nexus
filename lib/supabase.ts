
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://beqwyccvlbiytyybkyoj.supabase.co';
const supabaseAnonKey = 'sb_publishable_EbEMKqo6m6lD0eqp5z1EVQ_95B4Oscb';


let supabase: any;
try {
    supabase = createClient(supabaseUrl, supabaseAnonKey);
    (window as any).supabase = supabase;
} catch (error) {
    console.error('Failed to initialize Supabase client:', error);
    // In a production environment, you might want to show a user-friendly error message
}

export { supabase };
