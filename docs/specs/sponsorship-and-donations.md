# Sponsorship and Donation Options: Evaluation and Recommendations

Comparative review and architectural recommendations for project sponsorship and donation options.

---

## Context and Background
Verkeersregels Quiz is a free, open-source Progressive Web Application.
The application operates without advertisements, subscriptions, or paid paywalls.
To support ongoing maintenance and developer efforts, users can voluntarily sponsor development.
This document synthesizes findings from earlier investigations across the project family tree.

---

## Provider Comparison
We evaluated multiple developer funding and donation mechanisms.

| Provider | Platform Fee | Processing Fees (EU / US) | Key Benefits | Trade-offs |
| :--- | :--- | :--- | :--- | :--- |
| **GitHub Sponsors** | 0.0% | 0.0% (individual sponsors) | High trust in developer community; 100% net margin | Requires donor GitHub account |
| **Stripe Payment Links** | 0.0% | 1.5% + €0.25 (EU) / 2.9% + $0.30 (US) | Bancontact, iDEAL, SEPA, Apple Pay; no account needed | Requires merchant setup |
| **Ko-fi** | 0.0% (tips) | Standard processor fees | Low barrier; familiar tipping metaphor | External brand presence |
| **Buy Me a Coffee** | 5.0% | Standard processor fees + 0.5% payout fee | Recognizable branding | High fee load on small amounts |
| **Merchant of Record** | 5.0% + $0.50 | Included in platform fee | Automated tax and VAT compliance | Inefficient for micro-donations |

---

## Recommendations

### **[Decided]** Dual-Rail External Model
1. **GitHub Sponsors**:
   Provide a direct link to `https://github.com/sponsors/gpellicciotta`.
   Offers zero platform and transaction fees for individual community contributors.
2. **Direct Donation Option**:
   Provide a direct link to `https://paypal.me/gpellicciotta` for supporters without a GitHub profile.

### **[Decided]** Zero-Footprint Client Integration
- Keep all payment processing external via secure hosted pages.
- Avoid collecting payment card details or storing financial credentials locally.
- Render discrete, accessible links in the dedicated About view.
- Support all five localized languages (NL, EN, FR, DE, IT).
