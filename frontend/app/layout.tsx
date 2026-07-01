import "./globals.css";

export const metadata = {
  title: "Quanta - AI File Search",
  description: "Semantic local document search with summaries, tags, and related topics.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
