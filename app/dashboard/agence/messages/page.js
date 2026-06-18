"use client";
import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";

export default function MessagesAgencePage() {
  const [conversations, setConversations] = useState([]);
  const [selectedConv, setSelectedConv] = useState(null);
  const [messages, setMessages] = useState([]);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [attachment, setAttachment] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [myAgenceId, setMyAgenceId] = useState(null);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const listRef = useRef(null);
  const fileInputRef = useRef(null);
  const searchParams = useSearchParams();

  useEffect(() => {
    fetch("/api/auth/session").then(r => r.json()).then(s => setMyAgenceId(s?.user?.agenceId));
    const checkMobile = () => setIsMobile(window.innerWidth <= 1024);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => { loadConversations(); }, []);

  useEffect(() => {
    if (selectedConv && isMobile) {
      window.dispatchEvent(new Event("msg-chat-open"));
    } else if (!selectedConv && isMobile) {
      window.dispatchEvent(new Event("msg-chat-close"));
    }
    if (selectedConv) {
      loadMessages(selectedConv.id);
      const interval = setInterval(() => loadMessages(selectedConv.id), 5000);
      return () => clearInterval(interval);
    }
  }, [selectedConv, isMobile]);

  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [messages]);

  async function loadConversations() {
    const res = await fetch("/api/messages");
    const data = await res.json();
    setConversations(data);
    const convId = searchParams.get("conv");
    const mobile = window.innerWidth <= 1024;
    if (convId) {
      const found = data.find(c => c.id === convId);
      if (found) setSelectedConv(found);
      else if (data.length > 0 && !mobile) setSelectedConv(data[0]);
    } else if (data.length > 0 && !mobile) {
      setSelectedConv(data[0]);
    }
  }

  async function loadMessages(convId) {
    const res = await fetch(`/api/messages?conversationId=${convId}`);
    const data = await res.json();
    setMessages(data);
  }

  // L'autre agence dans la conversation = celle qui n'est pas moi
  function getOtherAgence(conv) {
    if (!conv || !myAgenceId) return null;
    return conv.agenceA?.id === myAgenceId ? conv.agenceB : conv.agenceA;
  }

  async function handleFileChange(e) {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("/api/messages/upload", { method: "POST", body: formData });
    const data = await res.json();
    setUploading(false);
    if (res.ok) setAttachment({ url: data.url, name: data.name });
  }

  async function handleSend(e) {
    e.preventDefault();
    if ((!content.trim() && !attachment) || !selectedConv) return;
    setLoading(true);
    const res = await fetch("/api/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        conversationId: selectedConv.id,
        content: content.trim(),
        attachmentUrl: attachment?.url || null,
        attachmentName: attachment?.name || null,
      }),
    });
    const msg = await res.json();
    setMessages(prev => [...prev, msg]);
    setContent("");
    setAttachment(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    setLoading(false);
    loadConversations();
  }

  function handleBack() {
    setSelectedConv(null);
    window.dispatchEvent(new Event("msg-chat-close"));
    setTimeout(() => {
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: "instant" });
        if (listRef.current) listRef.current.scrollTop = 0;
        const main = document.querySelector(".agence-main");
        if (main) main.scrollTop = 0;
        document.documentElement.scrollTop = 0;
      }, 50);
    }, 10);
  }

  const formatDate = (d) => new Date(d).toLocaleDateString("fr-BE", { day: "numeric", month: "short" });
  const formatTime = (d) => new Date(d).toLocaleTimeString("fr-BE", { hour: "2-digit", minute: "2-digit" });
  const isImg = (url) => url && /\.(jpg|jpeg|png|gif|webp)$/i.test(url);

  const sortedMessages = [...messages].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  const showList = !isMobile || !selectedConv;
  const showChat = !isMobile || !!selectedConv;

  return (
    <div style={{ height: "100vh", background: "#F4F6F8", display: "flex", flexDirection: "column", overflow: "hidden", margin: "-36px -40px" }}>
      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @media (max-width: 1024px) {
          .agence-msg-wrap { margin: -20px -16px -90px !important; }
        }
      `}</style>

      <div className="agence-msg-wrap" style={{ flex: 1, display: "grid", gridTemplateColumns: isMobile ? "1fr" : "320px 1fr", minHeight: 0, overflow: "hidden" }}>

        {/* LISTE CONVERSATIONS */}
        {showList && (
          <div ref={listRef} style={{ borderRight: isMobile ? "none" : "1px solid #E8EDF2", background: "#fff", overflowY: "auto", display: "flex", flexDirection: "column" }}>
            <div style={{ padding: "18px 20px", borderBottom: "1px solid #E8EDF2", flexShrink: 0 }}>
              <h1 style={{ fontSize: 18, fontWeight: 700, color: "#002B54", margin: 0, letterSpacing: "-0.01em" }}>Messages</h1>
              <p style={{ fontSize: 12, color: "#9CA3AF", margin: "2px 0 0" }}>
                {conversations.length} conversation{conversations.length > 1 ? "s" : ""}
              </p>
            </div>

            <div style={{ flex: 1, overflowY: "auto" }}>
              {conversations.length === 0 ? (
                <div style={{ padding: "40px 20px", textAlign: "center" }}>
                  <div style={{ width: 48, height: 48, borderRadius: 12, background: "rgba(255,149,0,0.08)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px", color: "#FF9500" }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
                  </div>
                  <p style={{ fontSize: 13, color: "#5A6B7D", margin: 0, fontWeight: 600 }}>Aucune conversation</p>
                  <p style={{ fontSize: 12, color: "#9CA3AF", margin: "4px 0 0", lineHeight: 1.5 }}>
                    Contactez une agence depuis un bien du catalogue pour démarrer.
                  </p>
                </div>
              ) : conversations.map(conv => {
                const isSelected = selectedConv?.id === conv.id;
                const unread = conv._count?.messages || 0;
                const lastMsg = conv.messages?.[0];
                const otherAgence = conv.agenceA?.id === myAgenceId ? conv.agenceB : conv.agenceA;
                return (
                  <div key={conv.id} onClick={() => setSelectedConv(conv)}
                    style={{
                      padding: "14px 18px",
                      cursor: "pointer",
                      borderBottom: "1px solid #F4F6F8",
                      background: isSelected ? "rgba(255,149,0,0.06)" : unread > 0 ? "#FAFDFD" : "#fff",
                      borderLeft: `3px solid ${isSelected ? "#FF9500" : unread > 0 ? "#FF9500" : "transparent"}`,
                      transition: "background 0.15s ease",
                    }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <div style={{ width: 42, height: 42, borderRadius: 11, background: "linear-gradient(135deg, #002B54, #001B38)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, color: "#fff", fontSize: 15, fontWeight: 700 }}>
                        {(otherAgence?.nom || "?")[0].toUpperCase()}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 3 }}>
                          <p style={{ fontSize: 13.5, fontWeight: unread > 0 ? 700 : 600, color: "#002B54", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                            {otherAgence?.nom || "Agence inconnue"}
                          </p>
                          <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0, marginLeft: 8 }}>
                            {unread > 0 && (
                              <span style={{ minWidth: 18, height: 18, padding: "0 6px", borderRadius: 20, background: "#FF9500", color: "#fff", fontSize: 10, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>
                                {unread}
                              </span>
                            )}
                            {lastMsg && <span style={{ fontSize: 11, color: "#9CA3AF" }}>{formatDate(lastMsg.createdAt)}</span>}
                          </div>
                        </div>
                        {lastMsg ? (
                          <p style={{ fontSize: 12, color: unread > 0 ? "#374151" : "#9CA3AF", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontWeight: unread > 0 ? 500 : 400 }}>
                            {lastMsg.senderId === myAgenceId && "Vous : "}
                            {lastMsg.attachmentName ? `📎 ${lastMsg.attachmentName}` : lastMsg.content}
                          </p>
                        ) : (
                          <p style={{ fontSize: 12, color: "#9CA3AF", margin: 0, fontStyle: "italic" }}>
                            Démarrer la conversation
                          </p>
                        )}
                      </div>
                      {isMobile && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" style={{ flexShrink: 0 }}><path d="M9 18l6-6-6-6"/></svg>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ZONE CHAT */}
        {showChat && (
          selectedConv ? (
            <div style={{
              display: "flex", flexDirection: "column", background: "#F4F6F8", overflow: "hidden",
              ...(isMobile ? { position: "fixed", top: 0, left: 0, right: 0, bottom: 0, zIndex: 50 } : { height: "100%" }),
            }}>
              {/* Header desktop */}
              {!isMobile && (
                <div style={{ background: "#fff", borderBottom: "1px solid #E8EDF2", padding: "14px 22px", display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 11, background: "linear-gradient(135deg, #002B54, #001B38)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: 14, flexShrink: 0 }}>
                    {(getOtherAgence(selectedConv)?.nom || "?")[0].toUpperCase()}
                  </div>
                  <div>
                    <p style={{ fontSize: 14, fontWeight: 700, color: "#002B54", margin: 0 }}>
                      {getOtherAgence(selectedConv)?.nom || "Agence inconnue"}
                    </p>
                    <p style={{ fontSize: 11, color: "#9CA3AF", margin: 0 }}>
                      Conversation entre agences
                    </p>
                  </div>
                </div>
              )}

              {/* Messages */}
              <div ref={messagesContainerRef} style={{ flex: 1, overflowY: "auto", padding: "20px", display: "flex", flexDirection: "column", gap: 10, minHeight: 0, height: 0 }}>
                <div style={{ display: "flex", flexDirection: "column", gap: 10, justifyContent: "flex-end", minHeight: "100%" }}>
                  {sortedMessages.length === 0 && (
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", flex: 1, textAlign: "center" }}>
                      <div style={{ width: 56, height: 56, borderRadius: 14, background: "rgba(255,149,0,0.08)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14, color: "#FF9500" }}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
                      </div>
                      <p style={{ fontSize: 14, fontWeight: 700, color: "#002B54", margin: "0 0 6px" }}>Démarrez la conversation</p>
                      <p style={{ fontSize: 13, color: "#9CA3AF", margin: 0 }}>Envoyez votre premier message à {getOtherAgence(selectedConv)?.nom || "cette agence"}.</p>
                    </div>
                  )}
                  {sortedMessages.map(msg => {
                    const isMine = msg.senderId === myAgenceId;
                    return (
                      <div key={msg.id} style={{ display: "flex", justifyContent: isMine ? "flex-end" : "flex-start" }}>
                        <div style={{
                          maxWidth: "75%",
                          padding: "10px 14px",
                          borderRadius: isMine ? "14px 14px 4px 14px" : "14px 14px 14px 4px",
                          background: isMine ? "#FF9500" : "#fff",
                          color: isMine ? "#fff" : "#002B54",
                          boxShadow: "0 1px 4px rgba(0,43,84,0.06)",
                          wordBreak: "break-word",
                        }}>
                          {msg.content && <p style={{ fontSize: 14, margin: "0 0 4px", lineHeight: 1.5 }}>{msg.content}</p>}
                          {msg.attachmentUrl && (
                            isImg(msg.attachmentUrl) ? (
                              <a href={msg.attachmentUrl} target="_blank" rel="noopener noreferrer">
                                <img src={msg.attachmentUrl} alt={msg.attachmentName} style={{ maxWidth: "100%", borderRadius: 8, display: "block" }} />
                              </a>
                            ) : (
                              <a href={msg.attachmentUrl} target="_blank" rel="noopener noreferrer"
                                style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 10px", borderRadius: 8, background: isMine ? "rgba(255,255,255,0.18)" : "rgba(0,43,84,0.06)", textDecoration: "none", color: "inherit" }}>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48"/></svg>
                                <span style={{ fontSize: 12, fontWeight: 600 }}>{msg.attachmentName}</span>
                              </a>
                            )
                          )}
                          <p style={{ fontSize: 10, margin: "4px 0 0", opacity: 0.6, textAlign: "right" }}>{formatTime(msg.createdAt)}</p>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>
              </div>

              {/* Pièce jointe en préparation */}
              {attachment && (
                <div style={{ padding: "8px 16px", borderTop: "1px solid #E8EDF2", display: "flex", alignItems: "center", gap: 8, background: "#fff", flexShrink: 0 }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#FF9500" strokeWidth="2"><path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48"/></svg>
                  <span style={{ fontSize: 12, color: "#002B54", fontWeight: 600, flex: 1 }}>{attachment.name}</span>
                  <button onClick={() => { setAttachment(null); if (fileInputRef.current) fileInputRef.current.value = ""; }}
                    style={{ background: "none", border: "none", cursor: "pointer", color: "#9CA3AF", fontSize: 18, padding: 0 }}>×</button>
                </div>
              )}

              {/* Barre d'envoi */}
              <div style={{ background: "#fff", borderTop: "1px solid #E8EDF2", flexShrink: 0 }}>
                <div style={{ padding: "12px 16px", display: "flex", gap: 10, alignItems: "center" }}>
                  <input ref={fileInputRef} type="file" onChange={handleFileChange} style={{ display: "none" }} />
                  <button type="button" onClick={() => fileInputRef.current?.click()} disabled={uploading}
                    style={{ width: 40, height: 40, borderRadius: 11, border: "1.5px solid #E8EDF2", background: "#FAFDFD", cursor: uploading ? "wait" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, color: uploading ? "#FF9500" : "#5A6B7D", transition: "all 0.15s ease" }}>
                    {uploading
                      ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ animation: "spin 1s linear infinite" }}><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>
                      : <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48"/></svg>}
                  </button>
                  <input value={content} onChange={e => setContent(e.target.value)} placeholder="Écrire un message..."
                    onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(e); } }}
                    style={{ flex: 1, border: "1.5px solid #E8EDF2", borderRadius: 11, padding: "11px 16px", fontSize: 14, outline: "none", minWidth: 0, color: "#002B54", transition: "border-color 0.15s ease" }}
                    onFocus={e => e.target.style.borderColor = "#FF9500"}
                    onBlur={e => e.target.style.borderColor = "#E8EDF2"} />
                  <button onClick={handleSend} disabled={loading || uploading || (!content.trim() && !attachment)}
                    style={{
                      background: loading || (!content.trim() && !attachment) ? "#E8EDF2" : "#FF9500",
                      color: loading || (!content.trim() && !attachment) ? "#9CA3AF" : "#fff",
                      border: "none",
                      borderRadius: 11,
                      width: 40,
                      height: 40,
                      cursor: loading || (!content.trim() && !attachment) ? "not-allowed" : "pointer",
                      flexShrink: 0,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: loading || (!content.trim() && !attachment) ? "none" : "0 4px 14px rgba(255,149,0,0.3)",
                      transition: "all 0.15s ease",
                    }}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
                  </button>
                </div>

                {/* Barre mobile en bas avec retour */}
                {isMobile && (
                  <div style={{ padding: "8px 16px 14px", display: "flex", alignItems: "center", gap: 10, borderTop: "1px solid #E8EDF2" }}>
                    <button onClick={handleBack}
                      style={{ background: "#F4F6F8", border: "none", cursor: "pointer", padding: 8, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", color: "#002B54", flexShrink: 0 }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
                    </button>
                    <div style={{ width: 32, height: 32, borderRadius: 9, background: "linear-gradient(135deg, #002B54, #001B38)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: 13, flexShrink: 0 }}>
                      {(getOtherAgence(selectedConv)?.nom || "?")[0].toUpperCase()}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: 13, fontWeight: 700, color: "#002B54", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {getOtherAgence(selectedConv)?.nom || "Agence inconnue"}
                      </p>
                      <p style={{ fontSize: 10, color: "#9CA3AF", margin: 0 }}>Conversation entre agences</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            !isMobile && (
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", background: "#F4F6F8", height: "100%" }}>
                <div style={{ textAlign: "center" }}>
                  <div style={{ width: 56, height: 56, borderRadius: 14, background: "#fff", border: "1px solid #E8EDF2", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px", color: "#9CA3AF" }}>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
                  </div>
                  <p style={{ fontSize: 14, color: "#5A6B7D", margin: 0, fontWeight: 600 }}>Sélectionnez une conversation</p>
                  <p style={{ fontSize: 13, color: "#9CA3AF", margin: "4px 0 0" }}>ou contactez une agence depuis un bien</p>
                </div>
              </div>
            )
          )
        )}
      </div>
    </div>
  );
}