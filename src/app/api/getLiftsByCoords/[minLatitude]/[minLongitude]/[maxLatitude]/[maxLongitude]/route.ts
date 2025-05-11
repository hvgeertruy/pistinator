import { LiftProps } from "@/app/types/lifts";
import { excludedLifts } from "@/lib/utils";
import { NextResponse } from "next/server";

/* Goal of this API:
   Get all lifts from openStreetMap using coords.

  characteristics:
  - coords are a 'square', so it can contain other things in openstreetmap
  - the data does not seem complete. lots of lifts with really limited info
  - it makes sense to filter the lifts a bit, as some lifts are only for goods, stations are unnecessary etc.
  - the attribute names are not consistent. for example, aerialway:capacity and piste:lift:capacity are the same thing.
*/

export async function GET(request: Request, context: any) {
  const debug = process.env.NEXT_PUBLIC_DEBUG;

  const { minLatitude, minLongitude, maxLatitude, maxLongitude } =
    await context.params;

  // Guard: invalid parameter
  if (
    !minLatitude ||
    typeof minLatitude !== "string" ||
    !minLongitude ||
    typeof minLongitude !== "string" ||
    !maxLatitude ||
    typeof maxLatitude !== "string" ||
    !maxLongitude ||
    typeof maxLongitude !== "string"
  ) {
    return NextResponse.json(
      { message: "Got invalid input. Please provide valid coordinates" },
      { status: 400 }
    );
  }

  try {
    const urlPart = `[out:json][timeout:25];(way["aerialway"](${minLatitude},${minLongitude},${maxLatitude},${maxLongitude})${excludedLifts};);out body;>;out skel qt;`;
    const url = `${process.env.URL_LIFTS_BY_COORDS}?data=${encodeURIComponent(
      urlPart
    )}`;
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
    const lifts =
      data.elements.filter((item: LiftProps) => item.type === "way") || [];

    return NextResponse.json(lifts, { status: 200 });
  } catch (error) {
    if (debug) {
      console.error(error);
    }
    return NextResponse.json({ message: error }, { status: 500 });
  }
}
