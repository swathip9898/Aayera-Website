import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { getSiteConfig } from "@/lib/db/repository";

export async function generateMetadata(): Promise<Metadata> {
  try {
    const config = await getSiteConfig();
    return {
      title: `${config.eventName} | ${config.shortName}`,
      description: config.tagline,
    };
  } catch {
    return {
      title: "Global Innovation & Partnering Summit",
      description: "Flagship executive summit website and dynamic MongoDB CMS.",
    };
  }
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let defaultTheme: "dark" | "light" = "dark";
  try {
    const config = await getSiteConfig();
    defaultTheme = config.defaultTheme || "dark";
  } catch {
    defaultTheme = "dark";
  }

  return (
    <html lang="en" data-theme={defaultTheme} suppressHydrationWarning>
      <body className="antialiased selection:bg-cyan-400/30 selection:text-cyan-200">
        <ThemeProvider defaultTheme={defaultTheme}>{children}</ThemeProvider>
      </body>
    </html>
  );
}
