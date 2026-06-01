import multer from 'multer';

const storage = multer.memoryStorage();
const limit = { fileSize: 5 * 1024 * 1024 };
const upload = multer({ storage: storage, limits: limit });

export default upload;
