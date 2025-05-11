import { NextResponse } from "next/server";

/* Goal of this API:
   Get a skiresort url that describes the lift. provide resort and liftName. Will return the closest result.

  characteristics:
  - using brave search api for getting results. 
  - Also tried google search API but gave pretty inaccurate results
  - i'm only interested in the first, hopefully correct result.
*/

// example search requests:
// https://api.search.brave.com/res/v1/web/search?count=1&result_filter=web&q=details%20val%20cenis%20poppen
// https://api.search.brave.com/res/v1/web/search?q=site:skiresort.info+skilift+details+winterberg+poppen&count=1&offset=0&result_filter=web

// example result:
// https://www.skiresort.info/ski-resort/val-cenis-lanslevillardlanslebourgtermignon/ski-lifts/l91126/
// https://www.skiresort.info/ski-resort/winterberg-skiliftkarussell/ski-lifts/l102855/

export async function GET(request: Request, context: any) {
  const debug = process.env.NEXT_PUBLIC_DEBUG;
  const { resort, liftName } = await context.params;
  const searchOptions = {
    count: 1, // the first result should be enough
    result_filter: "web", // we only want web results
  };
  const headers = {
    headers: {
      Accept: "application/json",
      "X-subscription-token": process.env.BRAVE_SEARCH_API_KEY || "",
      "Accept-Encoding": "gzip",
      method: "GET",
    },
  };

  // Guard: invalid parameter
  if (!resort || !liftName) {
    return NextResponse.json(
      { message: "Got invalid input. Please provide a resort and lift name" },
      { status: 400 }
    );
  }

  // encode searchOptions so that we can use them as a querystring
  const queryString = Object.entries(searchOptions)
    .map(
      ([key, value]) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
    )
    .join("&");

  try {
    const url = `${
      process.env.URL_SEARCH_API
    }?q=site:skiresort.info%20details%20${encodeURIComponent(
      resort
    )}%20${encodeURIComponent(liftName)}&${queryString}`;

    if (debug) {
      console.info(`[DEBUG] fetching ${url}`);
    }

    const response = await fetch(url, headers);

    // Guard: request failed
    if (!response.ok) {
      if (debug) {
        console.error(response);
      }
      return NextResponse.json(
        { message: response.statusText },
        { status: 500 }
      );
    }

    const data = await response.json();

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    if (debug) {
      console.error(error);
    }
    return NextResponse.json({ message: error }, { status: 500 });
  }
}
