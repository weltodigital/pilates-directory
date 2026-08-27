import { Metadata } from 'next';
import { CONTACT_EMAIL } from '@/lib/site'
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Privacy Policy | Pilates Classes Near',
  description: 'Privacy policy for Pilates Classes Near - how we collect, use, and protect your personal information.',
  alternates: { canonical: '/privacy-policy' },
  robots: {
    index: true,
    follow: true,
  },
};

export default function PrivacyPolicyPage() {
  return (
    <>
      <Header breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Privacy Policy' }]} />
      <main className="shell-narrow py-16 sm:py-20">
        <h1 className="text-display-sm">Privacy Policy</h1>

          <div className="prose-editorial mt-10 max-w-none">
            <p className="mb-6 text-ink-muted">
              <strong>Last updated:</strong> January 2025
            </p>

            <section className="mb-8">
              <h2 className="mb-4 mt-12 font-fraunces text-2xl font-semibold text-ink">1. Introduction</h2>
              <p className="mb-4 leading-relaxed text-ink-muted">
                Welcome to Pilates Classes Near ("we," "our," or "us"). We operate the website pilatesclassesnear.com
                (the "Service"). This Privacy Policy explains how we collect, use, disclose, and safeguard your
                information when you visit our website or use our services.
              </p>
              <p className="mb-4 leading-relaxed text-ink-muted">
                We are committed to protecting your privacy and ensuring you understand how your information is used.
                Please read this Privacy Policy carefully. If you do not agree with the terms of this Privacy Policy,
                please do not access the Service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="mb-4 mt-12 font-fraunces text-2xl font-semibold text-ink">2. Information We Collect</h2>

              <h3 className="mb-3 mt-8 font-fraunces text-xl font-semibold text-ink">2.1 Information You Provide</h3>
              <p className="mb-4 leading-relaxed text-ink-muted">
                We may collect information you provide directly to us, such as:
              </p>
              <ul className="mb-4 list-disc space-y-2 pl-5 text-ink-muted">
                <li>Contact information when you reach out to us</li>
                <li>Feedback or reviews you submit</li>
                <li>Any other information you choose to provide</li>
              </ul>

              <h3 className="mb-3 mt-8 font-fraunces text-xl font-semibold text-ink">2.2 Information Collected Automatically</h3>
              <p className="mb-4 leading-relaxed text-ink-muted">
                When you access our Service, we may automatically collect:
              </p>
              <ul className="mb-4 list-disc space-y-2 pl-5 text-ink-muted">
                <li>Log data (IP address, browser type, pages visited)</li>
                <li>Usage data (how you interact with our Service)</li>
                <li>Device information (device type, operating system)</li>
                <li>Cookies and similar tracking technologies</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="mb-4 mt-12 font-fraunces text-2xl font-semibold text-ink">3. How We Use Your Information</h2>
              <p className="mb-4 leading-relaxed text-ink-muted">
                We use the information we collect to:
              </p>
              <ul className="mb-4 list-disc space-y-2 pl-5 text-ink-muted">
                <li>Provide, maintain, and improve our Service</li>
                <li>Respond to your comments, questions, and requests</li>
                <li>Understand how users interact with our Service</li>
                <li>Develop new features and functionality</li>
                <li>Communicate with you about updates or changes</li>
                <li>Comply with legal obligations</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="mb-4 mt-12 font-fraunces text-2xl font-semibold text-ink">4. Information Sharing and Disclosure</h2>
              <p className="mb-4 leading-relaxed text-ink-muted">
                We do not sell, trade, or otherwise transfer your personal information to third parties without
                your consent, except in the following circumstances:
              </p>
              <ul className="mb-4 list-disc space-y-2 pl-5 text-ink-muted">
                <li><strong>Service Providers:</strong> We may share information with trusted third-party service providers who assist us in operating our website</li>
                <li><strong>Legal Requirements:</strong> We may disclose information if required by law or to protect our rights</li>
                <li><strong>Business Transfers:</strong> Information may be transferred in connection with a merger, acquisition, or sale of assets</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="mb-4 mt-12 font-fraunces text-2xl font-semibold text-ink">5. Data Security</h2>
              <p className="mb-4 leading-relaxed text-ink-muted">
                We implement appropriate technical and organizational security measures to protect your personal
                information against unauthorized access, alteration, disclosure, or destruction. However, no method
                of transmission over the internet or electronic storage is 100% secure.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="mb-4 mt-12 font-fraunces text-2xl font-semibold text-ink">6. Cookies</h2>
              <p className="mb-4 leading-relaxed text-ink-muted">
                Our Service may use "cookies" to enhance your experience. You can choose to disable cookies through
                your browser settings, but this may affect the functionality of our Service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="mb-4 mt-12 font-fraunces text-2xl font-semibold text-ink">7. Third-Party Links</h2>
              <p className="mb-4 leading-relaxed text-ink-muted">
                Our Service may contain links to third-party websites. We are not responsible for the privacy
                practices or content of these third-party sites. We encourage you to review the privacy policies
                of any third-party sites you visit.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="mb-4 mt-12 font-fraunces text-2xl font-semibold text-ink">8. Your Rights</h2>
              <p className="mb-4 leading-relaxed text-ink-muted">
                Depending on your location, you may have certain rights regarding your personal information, including:
              </p>
              <ul className="mb-4 list-disc space-y-2 pl-5 text-ink-muted">
                <li>The right to access your personal information</li>
                <li>The right to rectify inaccurate information</li>
                <li>The right to request deletion of your information</li>
                <li>The right to object to processing</li>
                <li>The right to data portability</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="mb-4 mt-12 font-fraunces text-2xl font-semibold text-ink">9. Children's Privacy</h2>
              <p className="mb-4 leading-relaxed text-ink-muted">
                Our Service is not intended for children under the age of 13. We do not knowingly collect personal
                information from children under 13. If you become aware that a child has provided us with personal
                information, please contact us immediately.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="mb-4 mt-12 font-fraunces text-2xl font-semibold text-ink">10. Changes to This Privacy Policy</h2>
              <p className="mb-4 leading-relaxed text-ink-muted">
                We may update this Privacy Policy from time to time. We will notify you of any changes by posting
                the new Privacy Policy on this page and updating the "Last updated" date. You are advised to review
                this Privacy Policy periodically for any changes.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="mb-4 mt-12 font-fraunces text-2xl font-semibold text-ink">11. Contact Us</h2>
              <p className="mb-4 leading-relaxed text-ink-muted">
                If you have any questions about this Privacy Policy or our privacy practices, please contact us at:
              </p>
              <div className="rounded-md border border-line bg-surface-sunken p-5">
                <p className="leading-relaxed text-ink-muted">
                  <strong>Email:</strong> {CONTACT_EMAIL}<br />
                  <strong>Website:</strong> pilatesclassesnear.com
                </p>
              </div>
            </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
