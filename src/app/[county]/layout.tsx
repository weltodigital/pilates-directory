import type { Metadata } from 'next'
import { Inter, Plus_Jakarta_Sans } from 'next/font/google'
import '../globals.css'
import '../minimal.css'
import '../force-styles.css'

const inter = Inter({ subsets: ['latin'] })
const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-jakarta'
})

export default function CountyLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <style dangerouslySetInnerHTML={{__html: `
          * { box-sizing: border-box !important; }
          body, h1, h2, h3, h4, h5, h6, p, ul, ol, li { margin: 0; padding: 0; }
          html, body {
            font-family: 'Inter', sans-serif !important;
            line-height: 1.6 !important;
            color: #1e293b !important;
            background-color: #ffffff !important;
            min-height: 100vh !important;
          }
        `}} />
      </head>
      <body className={`${inter.className} ${plusJakarta.variable}`}>
        {children}
      </body>
    </html>
  );
}