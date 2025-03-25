import { createClient } from "@supabase/supabase-js";
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const SUPABASE_BUCKET = import.meta.env.VITE_SUPABASE_BUCKET;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function uploadImageToSupabase(file, folder = "chat") {
    const fileName = `${folder}/${Date.now()}_${file.name}`;

    const { error } = await supabase.storage.from(SUPABASE_BUCKET).upload(fileName, file);
    if (error) throw error;

    const { data, error: urlError } = supabase.storage.from(SUPABASE_BUCKET).getPublicUrl(fileName);
    if (urlError) throw urlError;

    return data.publicUrl;
}


