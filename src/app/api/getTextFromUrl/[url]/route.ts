import { NextResponse } from "next/server";
import * as cheerio from "cheerio";

/* Goal of this API:
   Use cheerio to extract data from a given url.

  characteristics:
  - The size will drastically drop when all styles, scripts, and html tags are removed
  - it is generally fast
  - relatively easy to extract text nodes
*/

export async function GET(request: Request, context: any) {
  const debug = process.env.NEXT_PUBLIC_DEBUG;
  const { url } = await context.params;

  // Guard: invalid parameter
  if (!url) {
    return NextResponse.json(
      { message: "Got invalid input. Please provide a valid url" },
      { status: 400 }
    );
  }

  try {
    if (debug) {
      console.info(`[DEBUG] fetching text from ${url}`);
    }

    const $ = await cheerio.fromURL(url);

    // remove scripts, styles
    $("script, style").remove();
    const text = $("body").text();
    const result = text.replace(/\s+/g, " ").trim();

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    if (debug) {
      console.error(error);
    }
    return NextResponse.json({ message: error }, { status: 500 });
  }
}
