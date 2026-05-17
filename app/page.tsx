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

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error ?? `Request failed (${res.status})`);
      }

      setOutput(data.result ?? "");
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
      <style>{`
        .lg-btn {
          position: relative;
          background: linear-gradient(160deg, rgba(96,165,250,0.72) 0%, rgba(37,99,235,0.62) 100%);
          backdrop-filter: blur(20px) saturate(180%);
          -webkit-backdrop-filter: blur(20px) saturate(180%);
          color: #fff;
          border: 1px solid rgba(255,255,255,0.48);
          border-radius: 14px;
          padding: 12px 28px;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          align-self: flex-start;
          box-shadow:
            0 8px 24px rgba(37,99,235,0.22),
            inset 0 1px 0 rgba(255,255,255,0.55),
            inset 0 -1px 0 rgba(0,0,0,0.12);
          transition: transform 0.18s ease, box-shadow 0.18s ease, background 0.18s ease;
          overflow: hidden;
          font-family: inherit;
        }
        .lg-btn::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 52%;
          background: linear-gradient(180deg, rgba(255,255,255,0.28) 0%, rgba(255,255,255,0) 100%);
          border-radius: 14px 14px 60% 60%;
          pointer-events: none;
        }
        .lg-btn:hover:not(:disabled) {
          background: linear-gradient(160deg, rgba(96,165,250,0.88) 0%, rgba(37,99,235,0.78) 100%);
          box-shadow:
            0 12px 32px rgba(37,99,235,0.32),
            inset 0 1px 0 rgba(255,255,255,0.65),
            inset 0 -1px 0 rgba(0,0,0,0.12);
          transform: translateY(-1px);
        }
        .lg-btn:active:not(:disabled) {
          transform: translateY(0);
          box-shadow:
            0 4px 12px rgba(37,99,235,0.18),
            inset 0 1px 0 rgba(255,255,255,0.4),
            inset 0 2px 5px rgba(0,0,0,0.12);
        }
        .lg-btn:disabled {
          background: linear-gradient(160deg, rgba(147,197,253,0.5) 0%, rgba(147,197,253,0.4) 100%);
          cursor: not-allowed;
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.3);
          transform: none;
        }

        .lg-btn-copy {
          position: relative;
          backdrop-filter: blur(16px) saturate(160%);
          -webkit-backdrop-filter: blur(16px) saturate(160%);
          border-radius: 9px;
          padding: 6px 14px;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          overflow: hidden;
          transition: transform 0.15s ease, box-shadow 0.15s ease, background 0.15s ease;
          font-family: inherit;
        }
        .lg-btn-copy::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 50%;
          background: linear-gradient(180deg, rgba(255,255,255,0.45) 0%, rgba(255,255,255,0) 100%);
          border-radius: 9px 9px 60% 60%;
          pointer-events: none;
        }
        .lg-btn-copy-default {
          background: rgba(255,255,255,0.52);
          color: #374151;
          border: 1px solid rgba(255,255,255,0.72);
          box-shadow:
            0 4px 12px rgba(0,0,0,0.07),
            inset 0 1px 0 rgba(255,255,255,0.8);
        }
        .lg-btn-copy-default:hover {
          background: rgba(255,255,255,0.72);
          box-shadow:
            0 6px 18px rgba(0,0,0,0.1),
            inset 0 1px 0 rgba(255,255,255,0.9);
          transform: translateY(-1px);
        }
        .lg-btn-copy-copied {
          background: rgba(209,250,229,0.65);
          color: #065f46;
          border: 1px solid rgba(110,231,183,0.6);
          box-shadow:
            0 4px 12px rgba(16,185,129,0.12),
            inset 0 1px 0 rgba(255,255,255,0.7);
        }
      `}</style>

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
          className="lg-btn"
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
                  className={`lg-btn-copy ${copied ? "lg-btn-copy-copied" : "lg-btn-copy-default"}`}
                >
                  {copied ? "Copied!" : "Copy"}
                </button>
              )}
            </div>
            {loading && !output ? (
              <div style={{ background: "#fff", border: "1.5px solid #d1d5db", borderRadius: 10, padding: "16px 18px", fontSize: 15, color: "#9ca3af", minHeight: 120 }}>
                Generating...
              </div>
            ) : (
              <textarea
                value={output}
                onChange={(e) => setOutput(e.target.value)}
                rows={8}
                style={{
                  width: "100%",
                  padding: "16px 18px",
                  borderRadius: 10,
                  border: "1.5px solid #d1d5db",
                  fontSize: 15,
                  lineHeight: 1.7,
                  color: "#111827",
                  background: "#fff",
                  resize: "vertical",
                  boxSizing: "border-box",
                  outline: "none",
                  fontFamily: "inherit",
                }}
                onFocus={(e) => (e.target.style.borderColor = "#2563eb")}
                onBlur={(e) => (e.target.style.borderColor = "#d1d5db")}
              />
            )}
          </div>
        )}
      </div>
    </main>
  );
}
