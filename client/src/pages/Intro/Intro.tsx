import { useNavigate } from "react-router-dom";
import "./Intro.css";
import blob from "../../assets/logo-blob.png";
import documentsIcon from "../../assets/intro-icon-documents.png";
import folderIcon from "../../assets/intro-icon-folder.png";
import sparklesIcon from "../../assets/intro-icon-sparkles.png";

export default function Intro() {
  const navigate = useNavigate();

  return (
    <div className="intro">
      <h1 className="intro__title">
        Welcome to Mesh AI
        <img src={blob} alt="" className="intro__title-blob" />
      </h1>

      <ul className="intro__cards">
        <li className="intro__card">
          <img src={documentsIcon} alt="" className="intro__card-icon" />
          <p className="intro__card-text">
            Bring all your documents into one secure AI workspace
          </p>
        </li>
        <li className="intro__card">
          <img src={folderIcon} alt="" className="intro__card-icon" />
          <p className="intro__card-text">
            Organize and manage the documents that power your AI
          </p>
        </li>
        <li className="intro__card">
          <img src={sparklesIcon} alt="" className="intro__card-icon" />
          <p className="intro__card-text">
            Your knowledge base, accessible through a simple chat interface
          </p>
        </li>
      </ul>

      <div className="intro__start">
        <p className="intro__subtitle">
          Start by creating your Organisation's Knowledge Base
        </p>
        <button className="intro__button" onClick={() => navigate("/knowledge")}>
          Start
        </button>
      </div>
    </div>
  );
}
