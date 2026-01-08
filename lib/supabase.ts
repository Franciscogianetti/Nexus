
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://beqwyccvlbiytyybkyoj.supabase.co';
const supabaseAnonKey = 'sb_publishable_EbEMKqo6m6lD0eqp5z1EVQ_95B4Oscb';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
(window as any).supabase = supabase;
