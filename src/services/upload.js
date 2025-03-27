import { createClient } from "@supabase/supabase-js";
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const SUPABASE_BUCKET = import.meta.env.VITE_SUPABASE_BUCKET;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// 안전한 파일명 생성 함수
function generateSafeFileName(file, folder = "chat") {
    const extension = file.name.split('.').pop(); // 확장자 추출
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 10000);
    return `${folder}/${timestamp}_${random}.${extension}`; // 예: chat/1711523900000_1234.jpeg
}

export async function uploadImageToSupabase(file, folder = "chat") {
    const fileName = generateSafeFileName(file, folder);

    const { error } = await supabase.storage.from(SUPABASE_BUCKET).upload(fileName, file);
    if (error) throw error;

    const { data, error: urlError } = supabase.storage.from(SUPABASE_BUCKET).getPublicUrl(fileName);
    if (urlError) throw urlError;

    return data.publicUrl;
}


