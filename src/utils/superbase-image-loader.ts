const projectId = 'uhvjljbcyqfpccwrvkqx'; // your supabase project id

export default function supabaseLoader({
  src,
  width,
  quality,
}: {
  src: string;
  width: number;
  quality?: number | undefined;
}) {
  return `https://${projectId}.supabase.co/storage/v1/object/public/images/${src}?width=${width}&quality=${
    quality || 75
  }`;
}
