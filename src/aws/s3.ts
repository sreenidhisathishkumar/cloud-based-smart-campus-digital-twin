/**
 * Intended S3 helper. Not called until VITE_S3_MEDIA_BUCKET and a presign API exist.
 */
export async function putObjectPlaceholder(_key: string, _body: Blob): Promise<never> {
  throw new Error('S3 upload is not configured. Local image preview is used instead.')
}
