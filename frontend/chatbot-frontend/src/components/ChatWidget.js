import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SendIcon from "@mui/icons-material/Send";
import MessageIcon from "@mui/icons-material/Message";

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hello! How can I help you today?" },
  ]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);

    const userInput = input;
    setInput("");

    try {
      const response = await fetch("http://127.0.0.1:8000/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: userInput }), // <-- Must be "question"
      });

      const data = await response.json();
      // Backend returns { user: ..., answer: ... }
      const botMessage = { sender: "bot", text: data.answer };
      setMessages((prev) => [...prev, botMessage]);

      
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Error: Unable to connect to server." },
      ]);
    }
  };

  return (
    <div style={{ position: "fixed", bottom: 20, right: 20, zIndex: 9999 }}>
      {!open && (
        <button
          onClick={() => setOpen(true)}
          style={{
            backgroundColor: "#e3dd2eff",
            color: "black",
            padding: 16,
            borderRadius: "50%",
            boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
            cursor: "pointer",
            border: "none",
            outline: "none",
            transition: "transform 0.2s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
          onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
        >
          <MessageIcon style={{ fontSize: 28 }} />
        </button>
      )}

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            style={{
              width: 320,
              height: 380,
              backgroundColor: "white",
              boxShadow: "0 8px 20px rgba(0,0,0,0.2)",
              borderRadius: 24,
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
              border: "1px solid #ddd",
            }}
          >
            <div
              style={{
                backgroundColor: "#e6d735ff",
                color: "white",
                padding: "12px 16px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <h2 style={{ fontSize: 16, fontWeight: 600 ,color:"#000000ff"}}>Chat Bot</h2>
              <button
                onClick={() => setOpen(false)}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "white",
                  fontSize: 16,
                  cursor: "pointer",
                }}
              >
                ✖
              </button>
            </div>

            <div
              style={{
                flex: 1,
                padding: 12,
                overflowY: "auto",
                display: "flex",
                flexDirection: "column",
                gap: 8,
                backgroundColor: "#F3F4F6",
              }}
            >
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  style={{
                    maxWidth: "75%",
                    padding: 8,
                    borderRadius: 12,
                    fontSize: 14,
                    boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
                    alignSelf: msg.sender === "user" ? "flex-end" : "flex-start",
                    backgroundColor: msg.sender === "user" ? "#f5ed58ff" : "#E5E7EB",
                    color: msg.sender === "user" ? "black" : "black",
                  }}
                >
                  {msg.text}
                </div>
              ))}
            </div>

            <div
              style={{
                padding: 12,
                borderTop: "1px solid #ddd",
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Type a message..."
                style={{
                  flex: 1,
                  padding: "8px 12px",
                  borderRadius: 12,
                  border: "1px solid #ccc",
                  fontSize: 14,
                  outline: "none",
                }}
              />
              <button
                onClick={handleSend}
                style={{
                  backgroundColor: "#000000ff",
                  color: "white",
                  padding: 8,
                  borderRadius: 12,
                  border: "none",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "transform 0.2s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
                onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
              >
                <SendIcon style={{ fontSize: 18 }} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
