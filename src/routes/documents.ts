import { Router } from 'express';
import {
  createDocument,
  getDocuments,
  getDocumentById,
  deleteDocument,
} from '../controllers/documents.js';
import { auth } from '../middleware/auth.js';

const documentsRouter = Router();

documentsRouter.use(auth);

documentsRouter.post('/', createDocument);
documentsRouter.get('/', getDocuments);
documentsRouter.get('/:id', getDocumentById);
documentsRouter.delete('/:id', deleteDocument);

export { documentsRouter };