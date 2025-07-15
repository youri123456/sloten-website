# SmartLock Store

Een moderne webshop voor smart locks gebouwd met Next.js 15, TypeScript, en Tailwind CSS.

## Features

- 🛒 **Winkelwagen functionaliteit** - Voeg producten toe en beheer je winkelwagen
- 💳 **Stripe integratie** - Veilige betalingen met iDEAL en creditcard
- 📱 **Responsive design** - Werkt perfect op alle apparaten
- 🔐 **Admin panel** - Beheer producten, bestellingen en contact berichten
- 📊 **Analytics** - Track website bezoeken en statistieken
- 🎨 **Modern UI** - Mooie, gebruiksvriendelijke interface

## Technologieën

- **Next.js 15** - React framework met App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Stripe** - Betalingsverwerking
- **Statische data** - In-memory database voor Vercel deployment
- **Vercel** - Deployment platform

## Deployment Status

✅ **Laatste update**: 14 juli 2025 - Volledig Vercel-compatibele versie met statische database

## Installatie

```bash
npm install
npm run dev
```

## Environment Variables

Maak een `.env.local` bestand aan met:

```
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
JWT_SECRET=your-secret-key
```

## Deployment

De website wordt automatisch gedeployed op Vercel bij elke push naar de main branch.
