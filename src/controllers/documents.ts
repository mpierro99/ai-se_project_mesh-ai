import type { Request, Response } from 'express';
import { readFileSync } from 'fs';
import mongoose from 'mongoose';
import { PDFParse } from 'pdf-parse';
import Document from '../models/document.js';
import Chunk from '../models/chunk.js';
import { chunkText } from '../utils/chunk.js';
import { createEmbedding } from '../utils/embeddings.js';

export const createDocument = async (req: Request, res: Response): Promise<void> => {
  if (!req.file) {
    res.status(400).json({
      success: false,
      data: null,
      error: { message: 'File is required' },
    });
    return;
  }

  // Parse the PDF
  const buffer = readFileSync(req.file.path);
  const parser = new PDFParse({ data: buffer });
  const { text } = await parser.getText();

  // Chunk the text
  const chunks = chunkText(text);

  const title = req.body.title || req.file.originalname;

  // Create the document record
  const document = await Document.create({
    title,
    fileName: req.file.originalname,
    userId: req.user!.userId,
  });

  // Embed each chunk and save it
  await Promise.all(
    chunks.map(async (text) => {
      const embedding = await createEmbedding(text);
      return Chunk.create({ documentId: document._id, text, embedding });
    })
  );

  res.status(201).json({ success: true, data: document, error: null });
};

export const getDocuments = async (req: Request, res: Response): Promise<void> => {
  const documents = await Document.find({ userId: req.user!.userId });

  res.status(200).json({ success: true, data: documents, error: null });
};

export const getDocumentById = async (req: Request, res: Response): Promise<void> => {
  const userId = req.user!.userId;

  if (!mongoose.isValidObjectId(req.params.id)) {
    res.status(404).json({
      success: false,
      data: null,
      error: { message: 'Document not found' },
    });
    return;
  }

  const document = await Document.findOne({ _id: req.params.id, userId });

  if (!document) {
    res.status(404).json({
      success: false,
      data: null,
      error: { message: 'Document not found' },
    });
    return;
  }

  res.status(200).json({ success: true, data: document, error: null });
};

export const deleteDocument = async (req: Request, res: Response): Promise<void> => {
  const userId = req.user!.userId;

  if (!mongoose.isValidObjectId(req.params.id)) {
    res.status(404).json({
      success: false,
      data: null,
      error: { message: 'Document not found' },
    });
    return;
  }

  const document = await Document.findOneAndDelete({ _id: req.params.id, userId });

  if (!document) {
    res.status(404).json({
      success: false,
      data: null,
      error: { message: 'Document not found' },
    });
    return;
  }

  await Chunk.deleteMany({ documentId: document._id });

  res.status(204).send();
};