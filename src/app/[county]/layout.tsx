import '../globals.css'
import Footer from '@/components/Footer'

export default function CountyLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      {children}
      <Footer />
    </>
  );
}
