import { StorageClient } from "@supabase/storage-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const BUCKET = "imoveis-fotos";

function getStorageClient(): StorageClient {
  return new StorageClient(`${SUPABASE_URL}/storage/v1`, {
    apikey: SERVICE_ROLE_KEY,
    Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
  });
}

/**
 * Faz upload de um buffer para o bucket imoveis-fotos.
 * Retorna a URL pública do arquivo.
 */
export async function uploadFoto(params: {
  buffer: Buffer;
  nomeArquivo: string;
  contentType?: string;
}): Promise<{ url: string; nomeArquivo: string }> {
  const { buffer, nomeArquivo, contentType = "image/webp" } = params;
  const storage = getStorageClient();

  const { error } = await storage
    .from(BUCKET)
    .upload(nomeArquivo, buffer, {
      contentType,
      upsert: false,
    });

  if (error) throw new Error(`Storage upload falhou: ${error.message}`);

  const { data } = storage.from(BUCKET).getPublicUrl(nomeArquivo);
  return { url: data.publicUrl, nomeArquivo };
}

/**
 * Remove um arquivo do bucket pelo nome do arquivo.
 */
export async function deletarFoto(nomeArquivo: string): Promise<void> {
  const storage = getStorageClient();
  const { error } = await storage.from(BUCKET).remove([nomeArquivo]);
  if (error) throw new Error(`Storage delete falhou: ${error.message}`);
}

/**
 * Gera nome único para arquivo no bucket.
 * Formato: imoveis/{imovelId}/{timestamp}-{random}.webp
 */
export function gerarNomeArquivo(imovelId: string): string {
  const ts = Date.now();
  const rand = Math.random().toString(36).slice(2, 8);
  return `imoveis/${imovelId}/${ts}-${rand}.webp`;
}
