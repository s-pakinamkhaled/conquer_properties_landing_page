# Conquer Properties Landing Page

Luxury single-page frontend for Conquer Properties.

## Sections

- Hero / Overview with contact box
- CTA banner
- Footer + WhatsApp chat

Features, Residences, Gallery, Location, and the large enquiry section are intentionally omitted.

## Run locally

```bash
npm install
npm run dev
```

## Form emails

Form submissions are sent to the addresses in `FORM_RECIPIENTS` inside `src/config.js`:

- abdelrhmanmammdoh536@gmail.com
- moamenabdelpaqi@gmail.com
- pakinamkhaled10@gmail.com

**Important:** the first time the form is submitted, each inbox may receive a FormSubmit activation email. Open it and confirm once (check spam). After that, every new request goes to all three emails.

## Customize placeholders

Edit `src/config.js` for:

- Project name / developer / location
- Phone, email, office address
- WhatsApp number (`whatsapp` should be country code + number, no `+` or spaces)
