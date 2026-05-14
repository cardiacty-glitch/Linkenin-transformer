import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "LinkedIn Transformer",
  description: "Transform any text into a polished LinkedIn message",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: "system-ui, sans-serif", background: "#f3f4f6", minHeight: "100vh" }}>
        {children}
      </body>
    </html>
  );
}
