import "./globals.css";
import type { Metadata } from "next";
import { Inter, Fraunces } from "next/font/google";
import Providers from "./providers";
import NavBar from "../src/components/NavBar";
import Footer from "../src/components/Footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

// Editorial serif for display headings — gives the brand a warm, premium
// magazine feel that suits a recipe platform. A small set of static weights
// (rather than the full variable range) keeps the font payload lean and the
// build's font fetch reliable.
const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "Taste-Tales — Where Every Flavor Tells a Story",
  description:
    "A community recipe blog: browse, create, and share structured recipes — search by ingredient, save favorites, and cook from what you have.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${fraunces.variable}`}>
      <body className="min-h-screen bg-[rgb(var(--surface))] antialiased">
        <Providers>
          <div className="flex min-h-screen flex-col">
            <NavBar />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
