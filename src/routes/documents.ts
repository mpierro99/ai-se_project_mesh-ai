import { Router } from 'express';
import multer from 'multer';
import {
  createDocument,
  getDocuments,
  getDocumentById,
  deleteDocument,
} from '../controllers/documents.js';
import { auth } from '../middleware/auth.js';

const documentsRouter = Router();
const upload = multer({ dest: 'uploads/' });

documentsRouter.use(auth);

documentsRouter.post('/', upload.single('file'), createDocument);
documentsRouter.get('/', getDocuments);
documentsRouter.get('/:id', getDocumentById);
documentsRouter.delete('/:id', deleteDocument);

export { documentsRouter };