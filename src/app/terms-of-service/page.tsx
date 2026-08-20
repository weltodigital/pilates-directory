import { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Terms of Service | Pilates Classes Near',
  description: 'Terms of service for Pilates Classes Near - the terms and conditions for using our pilates studio directory.',
  robots: {
    index: true,
    follow: true,
  },
};

export default function TermsOfServicePage() {
  return (
    <>
      <Header breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Terms of Service' }]} />
      <main className="shell-narrow py-16 sm:py-20">
        <h1 className="text-display-sm">Terms of Service</h1>

          <div className="prose-editorial mt-10 max-w-none">
            <p className="mb-6 text-ink-muted">
              <strong>Last updated:</strong> January 2025
            </p>

            <section className="mb-8">
              <h2 className="mb-4 mt-12 font-fraunces text-2xl font-semibold text-ink">1. Acceptance of Terms</h2>
              <p className="mb-4 leading-relaxed text-ink-muted">
                Welcome to Pilates Classes Near ("we," "our," or "us"). These Terms of Service ("Terms") govern
                your use of our website pilatesclassesnear.com (the "Service") operated by Pilates Classes Near.
              </p>
              <p className="mb-4 leading-relaxed text-ink-muted">
                By accessing or using our Service, you agree to be bound by these Terms. If you disagree with any
                part of these terms, then you may not access the Service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="mb-4 mt-12 font-fraunces text-2xl font-semibold text-ink">2. Description of Service</h2>
              <p className="mb-4 leading-relaxed text-ink-muted">
                Pilates Classes Near is a directory service that helps users find pilates studios and classes
                across the United Kingdom. We provide information about pilates studios, including contact details,
                locations, class types, and other relevant information.
              </p>
              <p className="mb-4 leading-relaxed text-ink-muted">
                We do not operate pilates studios or provide pilates instruction. We are solely a directory and
                information service connecting users with pilates studios.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="mb-4 mt-12 font-fraunces text-2xl font-semibold text-ink">3. Use License</h2>
              <p className="mb-4 leading-relaxed text-ink-muted">
                Permission is granted to temporarily use the materials on Pilates Classes Near's website for
                personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer
                of title, and under this license you may not:
              </p>
              <ul className="mb-4 list-disc space-y-2 pl-5 text-ink-muted">
                <li>Modify or copy the materials</li>
                <li>Use the materials for any commercial purpose or for any public display</li>
                <li>Attempt to reverse engineer any software contained on the website</li>
                <li>Remove any copyright or other proprietary notations from the materials</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="mb-4 mt-12 font-fraunces text-2xl font-semibold text-ink">4. User Accounts</h2>
              <p className="mb-4 leading-relaxed text-ink-muted">
                Currently, our Service does not require user accounts for basic browsing. If we implement user
                accounts in the future, users will be responsible for safeguarding their account information
                and all activities that occur under their account.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="mb-4 mt-12 font-fraunces text-2xl font-semibold text-ink">5. Prohibited Uses</h2>
              <p className="mb-4 leading-relaxed text-ink-muted">
                You may not use our Service:
              </p>
              <ul className="mb-4 list-disc space-y-2 pl-5 text-ink-muted">
                <li>For any unlawful purpose or to solicit others to perform unlawful acts</li>
                <li>To violate any international, federal, provincial, or state regulations, rules, laws, or local ordinances</li>
                <li>To infringe upon or violate our intellectual property rights or the intellectual property rights of others</li>
                <li>To harass, abuse, insult, harm, defame, slander, disparage, intimidate, or discriminate</li>
                <li>To submit false or misleading information</li>
                <li>To upload or transmit viruses or any other type of malicious code</li>
                <li>To spam, phish, pharm, pretext, spider, crawl, or scrape</li>
                <li>For any obscene or immoral purpose</li>
                <li>To interfere with or circumvent the security features of the Service</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="mb-4 mt-12 font-fraunces text-2xl font-semibold text-ink">6. Content Accuracy</h2>
              <p className="mb-4 leading-relaxed text-ink-muted">
                We strive to provide accurate and up-to-date information about pilates studios. However, we do not
                guarantee the accuracy, completeness, or reliability of any information displayed on our Service.
                Studio information, including contact details, class schedules, and pricing, may change without notice.
              </p>
              <p className="mb-4 leading-relaxed text-ink-muted">
                Users are encouraged to contact studios directly to verify current information before making any
                commitments or travel arrangements.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="mb-4 mt-12 font-fraunces text-2xl font-semibold text-ink">7. Third-Party Links</h2>
              <p className="mb-4 leading-relaxed text-ink-muted">
                Our Service may contain links to third-party websites or services that are not owned or controlled
                by Pilates Classes Near. We have no control over, and assume no responsibility for, the content,
                privacy policies, or practices of any third-party websites or services.
              </p>
              <p className="mb-4 leading-relaxed text-ink-muted">
                You acknowledge and agree that we shall not be responsible or liable for any damage or loss caused
                by or in connection with use of any such content, goods, or services available on third-party websites.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="mb-4 mt-12 font-fraunces text-2xl font-semibold text-ink">8. Disclaimer</h2>
              <p className="mb-4 leading-relaxed text-ink-muted">
                The materials on Pilates Classes Near's website are provided on an 'as is' basis. Pilates Classes Near
                makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties
                including without limitation, implied warranties or conditions of merchantability, fitness for a
                particular purpose, or non-infringement of intellectual property or other violation of rights.
              </p>
              <p className="mb-4 leading-relaxed text-ink-muted">
                Further, Pilates Classes Near does not warrant or make any representations concerning the accuracy,
                likely results, or reliability of the use of the materials on its website or otherwise relating to
                such materials or on any sites linked to this site.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="mb-4 mt-12 font-fraunces text-2xl font-semibold text-ink">9. Limitations</h2>
              <p className="mb-4 leading-relaxed text-ink-muted">
                In no event shall Pilates Classes Near or its suppliers be liable for any damages (including, without
                limitation, damages for loss of data or profit, or due to business interruption) arising out of the
                use or inability to use the materials on Pilates Classes Near's website, even if Pilates Classes Near
                or its authorized representative has been notified orally or in writing of the possibility of such damage.
                Because some jurisdictions do not allow limitations on implied warranties, or limitations of liability
                for consequential or incidental damages, these limitations may not apply to you.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="mb-4 mt-12 font-fraunces text-2xl font-semibold text-ink">10. Studio Relationships</h2>
              <p className="mb-4 leading-relaxed text-ink-muted">
                Pilates Classes Near is not affiliated with, endorsed by, or connected to any of the pilates studios
                listed in our directory unless explicitly stated. We do not guarantee the quality of services provided
                by any studio and are not responsible for any interactions, transactions, or relationships between
                users and studios.
              </p>
              <p className="mb-4 leading-relaxed text-ink-muted">
                Any bookings, payments, or agreements made with pilates studios are solely between the user and the
                studio. We are not party to these transactions and accept no liability for any issues that may arise.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="mb-4 mt-12 font-fraunces text-2xl font-semibold text-ink">11. Modifications</h2>
              <p className="mb-4 leading-relaxed text-ink-muted">
                We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a
                revision is material, we will try to provide at least 30 days notice prior to any new terms taking
                effect. What constitutes a material change will be determined at our sole discretion.
              </p>
              <p className="mb-4 leading-relaxed text-ink-muted">
                By continuing to access or use our Service after those revisions become effective, you agree to be
                bound by the revised terms.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="mb-4 mt-12 font-fraunces text-2xl font-semibold text-ink">12. Termination</h2>
              <p className="mb-4 leading-relaxed text-ink-muted">
                We may terminate or suspend your access immediately, without prior notice or liability, for any reason
                whatsoever, including without limitation if you breach the Terms. Upon termination, your right to use
                the Service will cease immediately.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="mb-4 mt-12 font-fraunces text-2xl font-semibold text-ink">13. Governing Law</h2>
              <p className="mb-4 leading-relaxed text-ink-muted">
                These Terms shall be interpreted and governed by the laws of England and Wales, without regard to its
                conflict of law provisions. Our failure to enforce any right or provision of these Terms will not be
                considered a waiver of those rights.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="mb-4 mt-12 font-fraunces text-2xl font-semibold text-ink">14. Contact Information</h2>
              <p className="mb-4 leading-relaxed text-ink-muted">
                If you have any questions about these Terms of Service, please contact us at:
              </p>
              <div className="rounded-md border border-line bg-surface-sunken p-5">
                <p className="leading-relaxed text-ink-muted">
                  <strong>Email:</strong> pilatesclassesnear@weltodigital.com<br />
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
