import { NextResponse } from "next/server";

/* Goal of this API:
   Get coordinates of a given ski resort. We can use these coords to gather more information about a ski resort in openstreetmap

  characteristics:
  - coords order is a bit different than how openstreetmap consumes them. you probably want to switch 2nd and 3rd value
*/

export async function GET(request: Request, context: any) {
  const debug = process.env.NEXT_PUBLIC_DEBUG === "true";

  const { resort } = await context.params;

  // Guard: invalid parameter
  if (!resort || typeof resort !== "string") {
    return NextResponse.json(
      { message: "Got invalid input. Please provide a valid resort value" },
      { status: 400 }
    );
  }

  try {
    const url = `${process.env.URL_RESORT_COORDS}${encodeURIComponent(resort)}`;
    if (debug) {
      console.info(`[DEBUG] fetching ${url}`);
    }
    const response = await fetch(url);

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
    const coords = {
      minLatitude: data[0].boundingbox[0] || 0,
      maxLatitude: data[0].boundingbox[1] || 0,
      minLongitude: data[0].boundingbox[2] || 0,
      maxLongitude: data[0].boundingbox[3] || 0,
    };

    // API can yield multiple results, any one should suffice
    return NextResponse.json(coords, { status: 200 });
  } catch (error) {
    if (debug) {
      console.error(error);
    }
    return NextResponse.json({ message: error }, { status: 500 });
  }
}
