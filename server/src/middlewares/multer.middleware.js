import multer from "multer";

const storage = multer.memoryStorage(); // ✅ Stores files in memory as Buffer

export const upload = multer({ storage });