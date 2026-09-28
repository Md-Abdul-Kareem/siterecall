import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SiteRecall | Autonomous SRE War Room & Memory Engine",
  description: "Next-generation Incident Response Agent powered by Hindsight Graph Memory and Gemini 3.8 Flash.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#090a0f] text-gray-100 min-h-screen antialiased selection:bg-cyan-500 selection:text-black">
        {children}
      </body>
    </html>
  );
}
