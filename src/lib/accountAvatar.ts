const AVATAR_MAX_DIMENSION = 256;
const AVATAR_JPEG_QUALITY = 0.85;
const AVATAR_MAX_FILE_BYTES = 5 * 1024 * 1024;

const ACCEPTED_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

export function validateAvatarFile(file: File): string | null {
  if (!ACCEPTED_TYPES.has(file.type)) {
    return "נא לבחור תמונה בפורמט JPG, PNG או WebP.";
  }
  if (file.size > AVATAR_MAX_FILE_BYTES) {
    return "הקובץ גדול מדי. נסו תמונה עד 5MB.";
  }
  return null;
}

export function readImageAsAvatarDataUrl(file: File): Promise<string> {
  const validationError = validateAvatarFile(file);
  if (validationError) {
    return Promise.reject(new Error(validationError));
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("לא הצלחנו לקרוא את התמונה."));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error("לא הצלחנו לעבד את התמונה."));
      img.onload = () => {
        const scale = Math.min(
          1,
          AVATAR_MAX_DIMENSION / img.width,
          AVATAR_MAX_DIMENSION / img.height,
        );
        const width = Math.max(1, Math.round(img.width * scale));
        const height = Math.max(1, Math.round(img.height * scale));

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("לא הצלחנו לעבד את התמונה."));
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", AVATAR_JPEG_QUALITY));
      };
      img.src = String(reader.result);
    };
    reader.readAsDataURL(file);
  });
}
