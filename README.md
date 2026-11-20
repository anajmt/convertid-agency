# ConvertID website

This repo mirrors the live ConvertID project in Claude (artifact "ConvertID Website", https://claude.ai/artifact/SCLq7tqtrXkPrjAfixqELa). It is a static, multi-page site:

- `index.html`: home page (hero, goal, services, tools, six projects, copywriting table, 90-day process, pricing, audit, measurement, founder, FAQ, scorecard form).
- `work/*/index.html`: six client project pages, each with real email screenshots.
- `privacy/index.html`: privacy policy (draft).
- `assets/css/style.css`, `assets/js/main.js`: styles and menu, scorecard form handling.
- `assets/img/`: logo, founder photo, and 24 real email screenshots (JPG and WebP).

## Before going live

1. **Scorecard form.** The form posts to Netlify Forms, so it works once the site is deployed on Netlify. Submissions appear under Forms in Netlify. For Klaviyo instead, replace the form with the Klaviyo embed (the code comment in `index.html` says where).
2. **Privacy policy.** Fill in the bracketed items: business name, ABN, hosting provider, analytics (if used). It is marked as a draft for review against the Australian Privacy Principles.
3. **Results.** Each project page has a `RESULTS` comment. Add real results only with the client's written approval. None are published now.
4. **Decisions to confirm.** The live copy states the goal "double your newsletter revenue in 6 months", with a 3% performance fee from month 7 above the 2x target. Both come from the business plan. Confirm they are approved before publishing. The live headline also differs from the brief's headline ("Turn Your Email List Into a More Reliable Revenue Channel."); the choice is yours.

## Deploy

Netlify: publish this folder (no build step). The canonical URL in the pages is `https://convertid.netlify.app/`.

## Content rules

- Do not describe the $750 audit as free.
- Do not publish client results, testimonials or logos without written approval.
- Do not publish an unverified founder location.
- Client website screenshots in Drive are not used here.
