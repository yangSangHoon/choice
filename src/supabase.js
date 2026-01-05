import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://suitgbuoinbqoxwoueoa.supabase.co';
const supabaseKey = 'sb_publishable_PkXw69Kl8IJE2S1zLD2MdA_GJQbPG-p';

export const supabase = createClient(supabaseUrl, supabaseKey);
