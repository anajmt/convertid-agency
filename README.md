# ConvertID website

Static, single-page website for ConvertID, an email and lifecycle marketing agency for independent fashion and ecommerce brands.

## Files

- `index.html`: all page content and sections.
- `assets/css/styles.css`: styles (cream and charcoal palette, responsive layout, reduced-motion support).
- `assets/js/main.js`: revenue calculator, measurement dashboard, animated counters, contact form handling.
- `assets/js/config.js`: site configuration, including the form endpoint.

## Before going live

1. **Connect the contact form.** Create a form endpoint (for example, Formspree) and set it in `assets/js/config.js`:
   ```js
   formEndpoint: "https://formspree.io/f/your-form-id"
   ```
   Until this is set, the form does not send anything. It shows a message asking people to email `support.convertid@gmail.com` or book a call. Test a real submission before you say the form works.
2. **Add real screenshots** of client email designs to the six portfolio cards, only with client permission. Replace the `.shot` placeholders with `<img>` tags.
3. **Confirm project categories** for each portfolio brand. They currently read "Category: TBC".
4. **Add campaign imagery** to the hero mock-up if you have licensed or owned photography.
5. **Review the founder copy** with Ana before publishing.

## Content rules

- All revenue figures on the dashboards and the case study are fictional and labelled as illustrative. Do not present them as client results.
- Do not add testimonials, client logos, or performance statistics that have not been verified and approved.
- Do not describe the $750 full audit as free. The free offer is the initial review, which is limited to a 30-minute call.
- Do not publish an unverified founder location.
- Do not add discounts or pricing that aren't approved.

## Preview locally

Open `index.html` in a browser, or run a simple local server:

```bash
python3 -m http.server 8000
```

Then visit http://localhost:8000.
