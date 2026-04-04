import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { cn } from "@/lib/utils";

const geistSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ResearchVault",
  description:
    "ResearchVault is a Sprint 1 MVP for collecting research links, notes, and categories with Next.js and MongoDB.",
  keywords: [
    "ResearchVault",
    "research links",
    "Next.js",
    "MongoDB",
    "Sprint 1",
  ],
  authors: [{ name: "Thilina Rathnayaka" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "bg-background text-foreground dark relative h-full font-sans antialiased",
          geistSans.variable,
          geistMono.variable
        )}
      >
        <main className="relative flex min-h-screen flex-col">
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <div className="flex-1 grow">{children}</div>
          </ThemeProvider>
        </main>
      </body>
    </html>
  );
}
