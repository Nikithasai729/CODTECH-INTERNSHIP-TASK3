import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import { io } from "socket.io-client";

const SAVE_INTERVAL = 2000;

export default function Editor() {
  const { id } = useParams();
  const wrapperRef = useRef(null);
  const [status, setStatus] = useState("Saving...");
  const [pages, setPages] = useState([1]);

  useEffect(() => {
    const container = document.createElement("div");
    container.classList.add("editor-container");

    wrapperRef.current.innerHTML = "";
    wrapperRef.current.append(container);

    const quill = new Quill(container, {
      theme: "snow",
      modules: {
        toolbar: [
          [{ header: [1, 2, 3, false] }],
          ["bold", "italic", "underline"],
          [{ list: "ordered" }, { list: "bullet" }],
          [{ align: [] }],
          ["link"],
          ["clean"]
        ]
      }
    });

    quill.disable();
    quill.setText("Loading...");

    const socket = io("http://localhost:5000");

    socket.once("load-document", (document) => {
      quill.setContents(document || "");
      quill.enable();
      setStatus("All changes saved");
    });

    socket.emit("get-document", id);

    quill.on("text-change", (delta, oldDelta, source) => {
      if (source !== "user") return;
      setStatus("Saving...");
      socket.emit("send-changes", delta);
    });

    socket.on("receive-changes", (delta) => {
      quill.updateContents(delta);
    });

    const interval = setInterval(() => {
      socket.emit("save-document", quill.getContents());
      setStatus("All changes saved");
    }, SAVE_INTERVAL);

    return () => {
      socket.disconnect();
      clearInterval(interval);
    };
  }, [id]);

  // ➕ Add page (UI only like Word pages)
  const addPage = () => {
    setPages((prev) => [...prev, prev.length + 1]);
  };

  return (
    <>
      {/* HEADER */}
      <div style={{
        textAlign: "center",
        fontSize: "22px",
        fontWeight: "bold",
        padding: "10px",
        background: "#f5f5f5",
        borderBottom: "1px solid #ccc"
      }}>
        📝 Collaborative Document Editor
      </div>

      {/* STATUS */}
      <div style={{
        textAlign: "right",
        padding: "5px 20px",
        color: "gray"
      }}>
        {status}
      </div>

      {/* MAIN AREA */}
      <div style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "20px",
        marginTop: "20px"
      }}>
        
        {/* FIRST PAGE (REAL EDITOR) */}
        <div
          ref={wrapperRef}
          style={{
            display: "flex",
            justifyContent: "center"
          }}
        ></div>

        {/* EXTRA PAGES (WORD STYLE LOOK ONLY) */}
        {pages.slice(1).map((p) => (
          <div key={p} className="page-box">
            <div style={{ color: "#999" }}>New Page {p}</div>
          </div>
        ))}

        {/* ADD PAGE BUTTON */}
        <button onClick={addPage} style={{
          padding: "10px 20px",
          fontSize: "15px",
          cursor: "pointer"
        }}>
          + Add Page
        </button>
      </div>

      {/* STYLES */}
      <style>
        {`
          .editor-container {
            background: white;
            width: 794px;
            min-height: 1123px;
            padding: 40px;
            box-shadow: 0 0 10px rgba(0,0,0,0.15);
          }

          .page-box {
            width: 794px;
            height: 1123px;
            background: white;
            box-shadow: 0 0 10px rgba(0,0,0,0.15);
            display: flex;
            align-items: center;
            justify-content: center;
          }

          body {
            background: #e6e6e6;
          }
        `}
      </style>
    </>
  );
}