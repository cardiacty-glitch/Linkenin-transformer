"use client";

import { useState } from "react";

export default function Home() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  async function transform() {
    if (!input.trim()) return;
    setLoading(true);
    setError("");
    setOutput("");
    setCopied(false);

    try {
      const res = await fetch("/api/transform", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: input }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Something went wrong");
      }

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      if (!reader) throw new Error("No response body");

      let result = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        result += decoder.decode(value, { stream: true });
        setOutput(result);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  async function copy() {
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <main style={{ maxWidth: 760, margin: "0 auto", padding: "48px 24px" }}>
      <h1 style={{ fontSize: 28, fontWeight: 700, color: "#111827", marginBottom: 4 }}>
        LinkedIn Transformer
      </h1>
      <p style={{ color: "#6b7280", marginBottom: 32, marginTop: 0 }}>
        Paste anything — an email, a rough idea, bullet points — and get a polished LinkedIn message back.
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        {/* Input */}
        <div>
          <label style={{ display: "block", fontWeight: 600, color: "#374151", marginBottom: 8 }}>
            Your text
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Paste your email, notes, bullet points, or rough draft here..."
            rows={10}
            style={{
              width: "100%",
              padding: "12px 14px",
              borderRadius: 10,
              border: "1.5px solid #d1d5db",
              fontSize: 15,
              lineHeight: 1.6,
              resize: "vertical",
              boxSizing: "border-box",
              outline: "none",
              background: "#fff",
              color: "#111827",
            }}
            onFocus={(e) => (e.target.style.borderColor = "#2563eb")}
            onBlur={(e) => (e.target.style.borderColor = "#d1d5db")}
          />
        </div>

        <button
          onClick={transform}
          disabled={loading || !input.trim()}
          style={{
            background: loading || !input.trim() ? "#93c5fd" : "#2563eb",
            color: "#fff",
            border: "none",
            borderRadius: 8,
            padding: "12px 24px",
            fontSize: 15,
            fontWeight: 600,
            cursor: loading || !input.trim() ? "not-allowed" : "pointer",
            alignSelf: "flex-start",
            transition: "background 0.15s",
          }}
        >
          {loading ? "Transforming..." : "Transform"}
        </button>

        {error && (
          <div style={{ background: "#fef2f2", border: "1px solid #fca5a5", borderRadius: 8, padding: "12px 14px", color: "#b91c1c", fontSize: 14 }}>
            {error}
          </div>
        )}

        {/* Output */}
        {(output || loading) && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <label style={{ fontWeight: 600, color: "#374151" }}>LinkedIn message</label>
              {output && (
                <button
                  onClick={copy}
                  style={{
                    background: copied ? "#d1fae5" : "#f3f4f6",
                    color: copied ? "#065f46" : "#374151",
                    border: "1px solid",
                    borderColor: copied ? "#6ee7b7" : "#d1d5db",
                    borderRadius: 6,
                    padding: "6px 14px",
                    fontSize: 13,
                    fontWeight: 500,
                    cursor: "pointer",
                  }}
                >
                  {copied ? "Copied!" : "Copy"}
                </button>
              )}
            </div>
            <div
              style={{
                background: "#fff",
                border: "1.5px solid #d1d5db",
                borderRadius: 10,
                padding: "16px 18px",
                fontSize: 15,
                lineHeight: 1.7,
                color: "#111827",
                minHeight: 120,
                whiteSpace: "pre-wrap",
              }}
            >
              {output || <span style={{ color: "#9ca3af" }}>Generating...</span>}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
