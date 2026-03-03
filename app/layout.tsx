import type { Metadata } from "next";
import "./globals.css";
import { ErrorObserver } from "@/components/error-observer";

export const metadata: Metadata = {
  title: "HowToRise Platform",
  description: "Fast bilingual tutorial platform with admin and analytics."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>
        <ErrorObserver />
        {children}
      </body>
    </html>
  );
}
