import { useState, useEffect, useRef } from "react";

export default function App() {
  const [isLogin, setIsLogin] = useState(true);
  const [isAuth, setIsAuth] = useState(false);

  const [user, setUser] = useState(null);
  const [showAccount, setShowAccount] = useState(false);

  const [registerData, setRegisterData] = useState({
    username: "",
    email: "",
    password: ""
  });

  const [loginData, setLoginData] = useState({
    email: "",
    password: ""
  });

  const [documents, setDocuments] = useState([]);
  const [currentDoc, setCurrentDoc] = useState(null);

  // Reference to directly target the editable document div without re-rendering
  const editorRef = useRef(null);

  // LOAD DOCS
  useEffect(() => {
    const docs = JSON.parse(localStorage.getItem("documents"));
    if (docs) setDocuments(docs);
  }, []);

  // REGISTER
  const handleRegister = () => {
    if (
      !registerData.username ||
      !registerData.email ||
      !registerData.password
    ) {
      alert("Please fill all fields");
      return;
    }

    localStorage.setItem("user", JSON.stringify(registerData));

    alert("Registered Successfully");
    setIsLogin(true);
  };

  // LOGIN
  const handleLogin = () => {
    const savedUser = JSON.parse(localStorage.getItem("user"));

    if (!savedUser) {
      alert("No user found. Please register first");
      return;
    }

    if (
      savedUser.email.trim().toLowerCase() ===
        loginData.email.trim().toLowerCase() &&
      savedUser.password.trim() === loginData.password.trim()
    ) {
      setUser(savedUser);
      setIsAuth(true);
    } else {
      alert("Invalid Credentials");
    }
  };

  // CREATE DOCUMENT
  const createDocument = () => {
    setCurrentDoc({
      id: Date.now(),
      title: "Untitled Document",
      content: ""
    });
  };

  // SAVE DOCUMENT
  const saveDocument = () => {
    const updated = [...documents];
    
    // Read the final rich-text contents directly from the DOM reference right before saving
    const finalContent = editorRef.current ? editorRef.current.innerHTML : currentDoc.content;

    const docToSave = {
      ...currentDoc,
      content: finalContent
    };

    const index = updated.findIndex(d => d.id === currentDoc.id);

    if (index >= 0) updated[index] = docToSave;
    else updated.push(docToSave);

    setDocuments(updated);
    localStorage.setItem("documents", JSON.stringify(updated));

    // Update currentDoc state so it stays in sync if they keep editing
    setCurrentDoc(docToSave);

    alert("Document Saved");
  };

  // LOGOUT
  const logout = () => {
    setIsAuth(false);
    setUser(null);
    setCurrentDoc(null);
    setShowAccount(false);
  };

  // TEXT FORMATTING HANDLER
  const formatText = (command, value = null) => {
    document.execCommand(command, false, value);
  };

  /* ================= LOGIN / REGISTER ================= */
  if (!isAuth) {
    return (
      <div className="auth-box">
        <h1>Collaborative Editor</h1>

        {isLogin ? (
          <>
            <h2>Login</h2>

            <input
              type="email"
              placeholder="Email"
              value={loginData.email}
              onChange={(e) =>
                setLoginData({ ...loginData, email: e.target.value })
              }
            />

            <input
              type="password"
              placeholder="Password"
              value={loginData.password}
              onChange={(e) =>
                setLoginData({ ...loginData, password: e.target.value })
              }
            />

            <button onClick={handleLogin}>Login</button>

            <p onClick={() => setIsLogin(false)}>Create account</p>
          </>
        ) : (
          <>
            <h2>Register</h2>

            <input
              type="text"
              placeholder="Username"
              value={registerData.username}
              onChange={(e) =>
                setRegisterData({ ...registerData, username: e.target.value })
              }
            />

            <input
              type="email"
              placeholder="Email"
              value={registerData.email}
              onChange={(e) =>
                setRegisterData({ ...registerData, email: e.target.value })
              }
            />

            <input
              type="password"
              placeholder="Password"
              value={registerData.password}
              onChange={(e) =>
                setRegisterData({ ...registerData, password: e.target.value })
              }
            />

            <button onClick={handleRegister}>Register</button>

            <p onClick={() => setIsLogin(true)}>Already have account?</p>
          </>
        )}
      </div>
    );
  }

  /* ================= MAIN APP ================= */
  return (
    <div className="main-container">

      {/* SIDEBAR */}
      <div className="sidebar">
        <h2>Coauthor</h2>

        <button onClick={() => setShowAccount(false)}>Home</button>
        <button onClick={() => setShowAccount(true)}>Account</button>
        <button onClick={logout}>Logout</button>
      </div>

      {/* CONTENT */}
      <div className="content">

        {/* ACCOUNT */}
        {showAccount ? (
          <div className="account-box">
            <h2>Account Details</h2>
            <p><b>Username:</b> {user?.username}</p>
            <p><b>Email:</b> {user?.email}</p>
          </div>
        ) : (
          <>
            {/* CREATE DOC VIEW */}
            {!currentDoc ? (
              <>
                <div className="plus-box" onClick={createDocument}>
                  +
                </div>

                <h2>Create Document</h2>

                {documents.map((d) => (
                  <div
                    key={d.id}
                    className="doc-card"
                    onClick={() => setCurrentDoc(d)}
                  >
                    <h3>{d.title}</h3>
                  </div>
                ))}
              </>
            ) : (
              <>
                {/* EDITOR */}
                <input
                  className="title-input"
                  style={{ width: "100%", boxSizing: "border-box" }}
                  value={currentDoc.title}
                  onChange={(e) =>
                    setCurrentDoc({
                      ...currentDoc,
                      title: e.target.value
                    })
                  }
                />

                {/* RICH TEXT CONTAINER */}
                <div className="editor-container">
                  
                  {/* EXPANDED WHITE TOOLBAR */}
                  <div className="toolbar">
                    <select onChange={(e) => formatText("fontSize", e.target.value)} defaultValue="3">
                      <option value="1">Small</option>
                      <option value="3">Normal</option>
                      <option value="5">Large</option>
                      <option value="7">Huge</option>
                    </select>

                    <div className="toolbar-divider"></div>

                    <button onClick={() => formatText("formatBlock", "<h1>")}>H1</button>
                    <button onClick={() => formatText("formatBlock", "<h2>")}>H2</button>
                    <button onClick={() => formatText("formatBlock", "<h3>")}>H3</button>

                    <div className="toolbar-divider"></div>

                    <button onClick={() => formatText("bold")}><b>B</b></button>
                    <button onClick={() => formatText("italic")}><i>I</i></button>
                    <button onClick={() => formatText("underline")}><u>U</u></button>
                    <button onClick={() => formatText("strikeThrough")}><span style={{ textDecoration: "line-through" }}>S</span></button>

                    <div className="toolbar-divider"></div>

                    <button onClick={() => formatText("justifyLeft")}>Left</button>
                    <button onClick={() => formatText("justifyCenter")}>Center</button>
                    <button onClick={() => formatText("justifyRight")}>Right</button>
                    <button onClick={() => formatText("justifyFull")}>Justify</button>

                    <div className="toolbar-divider"></div>

                    <button onClick={() => formatText("insertUnorderedList")}>• List</button>
                    <button onClick={() => formatText("insertOrderedList")}>1. List</button>
                    <button onClick={() => formatText("formatBlock", "<blockquote>")}>“ Quote</button>

                    <div className="toolbar-divider"></div>

                    <button onClick={() => formatText("undo")}>↶</button>
                    <button onClick={() => formatText("redo")}>↷</button>
                  </div>

                  {/* SHEET WRAPPER LAYOUT */}
                  <div className="paper-container">
                    <div
                      ref={editorRef}
                      className="editor-body"
                      contentEditable
                      suppressContentEditableWarning
                      dangerouslySetInnerHTML={{ __html: currentDoc.content }}
                    />
                  </div>

                </div>

                <button onClick={saveDocument}>Save</button>
                <button onClick={() => setCurrentDoc(null)}>
                  Back
                </button>
              </>
            )}
          </>
        )}

      </div>
    </div>
  );
}
