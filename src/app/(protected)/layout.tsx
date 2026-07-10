import Footer from "../../components/layout/Footer";
import Navbar from "../../components/layout/Navbar";

export default function ProfileLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="bg-background min-h-screen">
      <Navbar />
      {children}
      <Footer />
    </main>
  );
}
