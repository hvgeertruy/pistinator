import { NextResponse } from "next/server";
import puppeteer from "puppeteer";

/* Goal of this API:
   Use puppeteer to generate an image from a given url.
   You can provide an element to get an image from this context.
   The image will be returned as a low quality base64 image, which you can process with AI or something else.

  characteristics:
  - processing low quality images should be relatively cheap (85 tokens). high quality images get expensive fast
  - it's a relatively slow operation to generate the image and process it in AI
  - you can finetune the image context by providing an element / clipping...
  - ..but you will need to be context aware to keep the costs low; no grepping full pages
*/

export async function GET(request: Request, context: any) {
  const debug = process.env.NEXT_PUBLIC_DEBUG;
  const { url, element } = await context.params;

  // Guard: invalid parameter
  if (!url) {
    return NextResponse.json(
      { message: "Got invalid input. Please provide a valid url" },
      { status: 400 }
    );
  }

  try {
    if (debug) {
      console.info(`[DEBUG] fetching image from ${url}`);
    }
    const browser = await puppeteer.launch();

    const page = await browser.newPage();

    // set viewport to mobile size. Mobile views should give us the most content per pixel
    await page.setViewport({
      width: 320,
      height: 1000,
      deviceScaleFactor: 1,
    });
    await page.goto(url);

    // API Consumer can provide an element to give us a smaller context to work with
    const selector = element || "body";
    await page.waitForSelector(selector);
    const ctx = await page.$(selector);

    if (ctx) {
      const screenshot = await ctx.screenshot({
        encoding: "base64",
        type: "jpeg",
        quality: 70, // should not be below 70 for OCR (optical character recognition)
      });

      await browser.close();

      return NextResponse.json(screenshot, { status: 200 });
    }
  } catch (error) {
    if (debug) {
      console.error(error);
    }
    return NextResponse.json({ message: error }, { status: 500 });
  }
}
