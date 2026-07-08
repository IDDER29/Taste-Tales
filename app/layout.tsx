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

// Editorial variable serif for display headings — optical sizing gives the
// brand a warm, premium magazine feel that suits a recipe platform.
const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  axes: ["opsz", "SOFT"],
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
