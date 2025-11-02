import React from 'react';
import './CookiePolicy.css';

const CookiePolicy = () => {
  return (
    <div className="legal-page">
      <div className="legal-content">
        <h1>Cookie Policy</h1>
        <p className="last-updated">Last Updated: October 30, 2025</p>
        <p>
          This Cookie Policy explains how Xcoinpay.org ("Xcoinpay," "we," "our," or "us") uses cookies 
          and similar tracking technologies when you visit our website or use our online services (collectively, the "Services").
        </p>
        <p>By continuing to browse or use our site, you agree to the use of cookies as described in this policy.</p>

        <hr />

        <section>
          <h2>1. What Are Cookies?</h2>
          <p>
            Cookies are small text files that are stored on your device (computer, tablet, or smartphone) when you visit a website.
          </p>
          <p>They help us recognize your device, remember your preferences, and improve your overall experience.</p>
          
          <p>Cookies can be:</p>
          <ul>
            <li><strong>Session Cookies:</strong> Temporary and deleted once you close your browser.</li>
            <li><strong>Persistent Cookies:</strong> Remain on your device for a set period or until you delete them.</li>
            <li><strong>First-party Cookies:</strong> Set by Xcoinpay.</li>
            <li><strong>Third-party Cookies:</strong> Set by other websites or services we use (e.g., analytics or advertising).</li>
          </ul>
        </section>

        <hr />

        <section>
          <h2>2. How We Use Cookies</h2>
          <p>We use cookies to:</p>

          <h3>A. Essential Cookies</h3>
          <p>
            These cookies are necessary for our website to function properly. They enable core features such as account 
            login, secure transactions, and page navigation. Without these cookies, certain parts of our website may not work.
          </p>

          <h3>B. Performance and Analytics Cookies</h3>
          <p>
            These cookies collect information about how visitors use our site (e.g., pages visited, time spent, and errors encountered).
            They help us improve functionality and user experience.
          </p>

          <h3>C. Functional Cookies</h3>
          <p>
            These cookies allow us to remember your preferences (such as language, region, and settings) to provide a 
            more personalized experience.
          </p>

          <h3>D. Marketing and Advertising Cookies</h3>
          <p>
            We may use these cookies to display relevant ads or promotions and measure the effectiveness of our campaigns.
            These cookies may be set by third-party advertising partners.
          </p>
        </section>

        <hr />

        <section>
          <h2>3. Third-Party Cookies</h2>
          <p>Some cookies on our website are placed by trusted third-party partners, including:</p>
          <ul>
            <li><strong>Google Analytics</strong> (for website traffic and behavior analysis)</li>
            <li><strong>Cloudflare</strong> (for security and performance optimization)</li>
            <li><strong>Payment or Wallet APIs</strong> (for transaction verification and crypto interactions)</li>
          </ul>
          <p>These third parties may use cookies in accordance with their own privacy policies.</p>
        </section>

        <hr />

        <section>
          <h2>4. Managing and Disabling Cookies</h2>
          <p>You can manage or delete cookies through your browser settings.</p>
          <p>Most browsers allow you to:</p>
          <ul>
            <li>View which cookies are stored on your device.</li>
            <li>Delete existing cookies.</li>
            <li>Block cookies from being placed.</li>
            <li>Receive a warning before cookies are stored.</li>
          </ul>
          <p><strong>Please note:</strong> Disabling certain cookies may affect website functionality and limit your experience.</p>
          
          <p>For more information on how to manage cookies, visit:</p>
          <ul>
            <li><a href="https://www.allaboutcookies.org" target="_blank" rel="noopener noreferrer">AllAboutCookies.org</a></li>
            <li><a href="https://www.youronlinechoices.eu" target="_blank" rel="noopener noreferrer">YourOnlineChoices.eu</a></li>
          </ul>
        </section>

        <hr />

        <section>
          <h2>5. Updates to This Policy</h2>
          <p>
            We may update this Cookie Policy periodically to reflect changes in technology, law, or our business practices.
            Any updates will be posted on this page with an updated "Last Updated" date.
          </p>
        </section>

        <hr />

        <section>
          <h2>6. Contact Us</h2>
          <p>If you have any questions or concerns about our use of cookies, please contact us at:</p>
          <p>
            📧 <a href="mailto:privacy@xcoinpay.org">privacy@xcoinpay.org</a><br />
            🌐 <a href="https://xcoinpay.org">www.xcoinpay.org</a>
          </p>
        </section>
      </div>
    </div>
  );
};

export default CookiePolicy;