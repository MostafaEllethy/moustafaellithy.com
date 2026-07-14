import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/Header";
import { PageContainer } from "@/components/PageContainer";
import { fontMono, fontSans } from "@/lib/fonts";
import { SITE_NAME, SITE_URL } from "@/lib/site";

const themeScript = `(function(){try{var t=localStorage.getItem("theme");if(t!=="light"&&t!=="dark"){t=matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"}document.documentElement.setAttribute("data-theme",t)}catch(e){}})()`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  description: "Personal site and writing.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${fontSans.variable} ${fontMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="flex min-h-screen flex-col bg-surface font-sans text-foreground antialiased">
        <Header />
        <main id="main" className="flex-1">
          <PageContainer>{children}</PageContainer>
        </main>
      </body>
    </html>
  );
}
