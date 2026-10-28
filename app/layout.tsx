import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { FloatingAiAssistant } from "@/components/ai/floating-ai-assistant";

export const metadata: Metadata = {
  title: "InterviewX — Production-Grade Live Technical Interview Platform",
  description:
    "Live technical interview & assessment platform with isolated code execution, real-time collaboration, deterministic evaluation, and AI-assisted engineering feedback.",
  keywords: [
    "Technical Assessment",
    "Live Coding Interview",
    "Code Execution Sandbox",
    "Judge0",
    "AI Code Review",
    "Monaco Editor",
    "Engineering Hiring",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-background font-sans antialiased flex flex-col">
        <ThemeProvider>
          {children}
          <FloatingAiAssistant />
        </ThemeProvider>
      </body>
    </html>
  );
}
