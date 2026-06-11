// Lightweight client-side gate for the static admin page.
// Not a real security boundary — anyone with the source can read it.
// Change DEFAULT_PASSWORD to rotate access.
export const DEFAULT_PASSWORD = "vorteqon2025";

const PW_KEY = "vorteqon.admin.pw.v1";
const SESSION_KEY = "vorteqon.admin.session.v1";

export function getPassword(): string {
  if (typeof window === "undefined") return DEFAULT_PASSWORD;
  return window.localStorage.getItem(PW_KEY) || DEFAULT_PASSWORD;
}

export function setPassword(next: string) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(PW_KEY, next);
}

export function isAuthed(): boolean {
  if (typeof window === "undefined") return false;
  return window.sessionStorage.getItem(SESSION_KEY) === "1";
}

export function signIn(pw: string): boolean {
  if (pw !== getPassword()) return false;
  window.sessionStorage.setItem(SESSION_KEY, "1");
  return true;
}

export function signOut() {
  if (typeof window === "undefined") return;
  window.sessionStorage.removeItem(SESSION_KEY);
}

// Downscale + compress an uploaded image to a data URL safe for localStorage.
export function fileToCompressedDataURL(file: File, maxDim = 600, quality = 0.82): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(reader.error);
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error("Invalid image"));
      img.onload = () => {
        const scale = Math.min(1, maxDim / Math.max(img.width, img.height));
        const w = Math.round(img.width * scale);
        const h = Math.round(img.height * scale);
        const canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d");
        if (!ctx) return reject(new Error("Canvas unsupported"));
        ctx.drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL("image/jpeg", quality));
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
}
