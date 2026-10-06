const ALLOWED = ['image/jpeg', 'image/png', 'image/webp']
const MAX_BYTES = 5 * 1024 * 1024

export async function readLocalImage(file: File): Promise<string> {
  if (!ALLOWED.includes(file.type)) {
    throw new Error('Upload a JPEG, PNG, or WebP image')
  }
  if (file.size > MAX_BYTES) {
    throw new Error('Image must be 5 MB or smaller')
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result === 'string') resolve(reader.result)
      else reject(new Error('Could not read image'))
    }
    reader.onerror = () => reject(new Error('Could not read image'))
    reader.readAsDataURL(file)
  })
}

/** Sprint 5: replace this with an S3 presigned PUT. UI already uses this module. */
export async function uploadIssueImage(file: File): Promise<string> {
  return readLocalImage(file)
}
