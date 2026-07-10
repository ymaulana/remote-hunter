import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="min-h-screen bg-white">{children}</main>
      <Footer />
    </div>
  );
}
