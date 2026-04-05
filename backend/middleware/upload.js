import multer from "multer";
import path   from "path";
import fs     from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

// ── Absolute path to backend/uploads  ────────────────────────────
// Works correctly on Windows and Linux regardless of CWD
const UPLOAD_ROOT = path.join(__dirname, "..", "uploads");

const SUBDIRS = ["vehicles", "ricemills", "marketplace"];
SUBDIRS.forEach(d => {
  const full = path.join(UPLOAD_ROOT, d);
  if (!fs.existsSync(full)) fs.mkdirSync(full, { recursive: true });
  console.log(`📁 Upload dir ready: ${full}`);
});

function diskStorage(subDir) {
  return multer.diskStorage({
    destination: (_req, _file, cb) => {
      cb(null, path.join(UPLOAD_ROOT, subDir));
    },
    filename: (_req, file, cb) => {
      // Keep original name but sanitize + add timestamp to avoid collisions
      const ext  = path.extname(file.originalname).toLowerCase();
      const base = path.basename(file.originalname, ext)
        .replace(/[^a-zA-Z0-9_-]/g, "_")
        .substring(0, 40);
      const ts   = Date.now();
      cb(null, `${base}_${ts}${ext}`);
    },
  });
}

const imageFilter = (_req, file, cb) => {
  const allowed = [".jpg", ".jpeg", ".png", ".webp", ".gif"];
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowed.includes(ext)) cb(null, true);
  else cb(new Error(`Only JPG/PNG/WEBP images allowed (got ${ext})`), false);
};

const limits = { fileSize: 10 * 1024 * 1024 }; // 10 MB

export const uploadVehicle     = multer({ storage: diskStorage("vehicles"),     fileFilter: imageFilter, limits });
export const uploadRiceMill    = multer({ storage: diskStorage("ricemills"),    fileFilter: imageFilter, limits });
export const uploadMarketplace = multer({ storage: diskStorage("marketplace"),  fileFilter: imageFilter, limits });
