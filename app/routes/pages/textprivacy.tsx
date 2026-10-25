// textprivacy.tsx — the text-message (Textedly) privacy terms (Ghost
// page-textprivacy.hbs).

import type * as React from "react";
import { PageHero } from "../../components/page-parts";
import { pageTitle } from "../../lib/meta";

export const meta = () => pageTitle("Text Message Privacy Terms");

export default function TextPrivacy(): React.ReactNode {
  return (
    <article className="page legal-page">
      <PageHero
        eyebrow="SMS · Textedly"
        title="📱 Text Message Privacy Terms"
        lede="Last updated: date to be confirmed by the team."
      />

      <div className="page-body">
        <div className="container">
          <section className="prose" style={{ marginLeft: "auto", marginRight: "auto" }}>
            <p>By subscribing to our text message list, you agree to the following terms:</p>

            <h2>1. What you&apos;re signing up for</h2>
            <p>
              When you opt in, you&apos;ll receive occasional SMS alerts from us via{" "}
              <strong>Textedly</strong>, including:
            </p>
            <ul>
              <li>
                New content alerts (podcasts, YouTube shows, livestreams, meet-ups, support drives)
              </li>
              <li>Important updates or announcements</li>
              <li>Exclusive offers or behind-the-scenes info</li>
            </ul>
            <p>We promise not to spam you, and we&apos;ll keep it relevant and respectful.</p>

            <h2>2. What data we collect</h2>
            <p>We only collect:</p>
            <ul>
              <li>Your mobile phone number</li>
              <li>(Optional) Your name, if you provide it</li>
            </ul>
            <p>We do not collect or share any other personal data through this service.</p>

            <h2>3. How we use your info</h2>
            <p>
              Your number is used only to send you messages you&apos;ve opted in to receive. Your
              data is securely stored and handled through <strong>Textedly</strong>, our SMS
              platform provider, and{" "}
              <strong>will never be sold or shared with third parties for marketing</strong>.
            </p>

            <h2>4. Your consent</h2>
            <p>By subscribing, you:</p>
            <ul>
              <li>Confirm that you are at least 13 years old</li>
              <li>
                Consent to receive automated marketing and informational texts from us via Textedly
              </li>
              <li>
                Understand that message and data rates may apply, depending on your mobile carrier
              </li>
            </ul>

            <h2>5. How to unsubscribe</h2>
            <p>
              You can opt out anytime by replying <strong>STOP</strong> to any message. You can also
              reply <strong>HELP</strong> for support.
            </p>

            <h2>6. Third-party compliance</h2>
            <p>
              We use Textedly to deliver these messages, which complies with relevant U.S. SMS
              regulations including the Telephone Consumer Protection Act (TCPA) and CTIA
              guidelines. See{" "}
              <a href="https://www.textedly.com/privacy-policy" target="_blank" rel="noopener">
                Textedly&apos;s privacy policy
              </a>{" "}
              for their own terms.
            </p>

            <p
              style={{
                marginTop: "var(--space-7)",
                paddingTop: "var(--space-4)",
                borderTop: "1px solid var(--line)",
                color: "var(--fg-tertiary)",
                fontSize: "0.9rem",
              }}
            >
              Questions?{" "}
              <a href="mailto:canarycryradio@protonmail.com">canarycryradio@protonmail.com</a>.
            </p>
          </section>
        </div>
      </div>
    </article>
  );
}
