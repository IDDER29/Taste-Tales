import "./globals.css";
import type { Metadata } from "next";
import Providers from "./providers";
import NavBar from "../src/components/NavBar";
import Footer from "../src/components/Footer";

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
    <html lang="en">
      <body>
        <Providers>
          <NavBar />
          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
