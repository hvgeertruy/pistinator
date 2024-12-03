# Pistinator

This is a hobby project where I use available APIs to get more information about ski lifts in resorts.
I built this to get more insight into working with react/nextJS, along with tailwind and shadcn/ui.
It helped me getting insight in how this works together and how to structure the application effectively.

You can provide the name of a ski resort. It will return the resort location and all lifts that are part of the resort.
You can click a ski lift for more details about the lift.

Data sources:
I use the following data sources:

- openstreetmap API for resort and ski lift data
- chatGPT to get ski lift details

You will quickly notice that the data in the API's is not very complete or accurate. Also, the chatGPT data is questionable at best. But hey, it was fun building it :)

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, rename `env-template` to `.env`
then open the .env file and add your chatGPT API key. You can also update source urls or toggle debugging mode if you want to

Then, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
