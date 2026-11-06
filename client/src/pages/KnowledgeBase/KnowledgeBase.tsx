import { useEffect, useState } from "react";
import "./KnowledgeBase.css";
import UploadArea from "../../components/UploadArea/UploadArea";
import { getDocuments } from "../../utils/api";
import type { KnowledgeDoc } from "../../utils/api";
import deleteIcon from "../../assets/delete-icon.svg";

export default function KnowledgeBase() {
  const [documents, setDocuments] = useState<KnowledgeDoc[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getDocuments();
          setDocuments(res.data || []);
      } catch {
        setError("Failed to load documents.");
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, []);

  const handleFileSelect = (file: File) => {
    const newDoc: KnowledgeDoc = {
      _id: Date.now().toString(),
      title: file.name,
      fileName: file.name,
      userId: "local",
      createdAt: new Date().toISOString(),
    };
    setDocuments([newDoc, ...documents]);
  };

  return (
    <div className="knowledge-base">
      <h1 className="knowledge-base__title">Manage Your Knowledge Base</h1>
      <section className="knowledge-base__content">
                <p className="knowledge-base__label">Upload documents (PDF)</p>
        <UploadArea onFileSelect={handleFileSelect} />

        {isLoading && (
          <p className="knowledge-base__status">Loading documents...</p>
        )}

        {!isLoading && error && (
          <p className="knowledge-base__status knowledge-base__status_type_error">
            {error}
          </p>
        )}

        {!isLoading && !error && documents.length === 0 && (
          <p className="knowledge-base__status">No documents yet.</p>
        )}

        {!isLoading && !error && documents.length > 0 && (
          <ul className="knowledge-base__list">
            {documents.map((doc) => (
              <li key={doc._id} className="knowledge-base__item">
                 <span>{doc.title}</span>
                <button
                  className="knowledge-base__delete-btn"
                  aria-label={`Delete ${doc.fileName}`}
                >
                  <img src={deleteIcon} alt="" />
                </button>
              </li>
            ))}
          </ul>
        )}

        <button className="knowledge-base__save-btn">Save</button>
      </section>
    </div>
  );
}