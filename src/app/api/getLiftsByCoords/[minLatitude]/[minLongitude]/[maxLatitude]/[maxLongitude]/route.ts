import { LiftProps } from "@/app/types/lifts";
import { excludedLifts } from "@/lib/utils";
import { NextResponse } from "next/server";

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
    debug && console.info(`[DEBUG] fetching ${url}`);

    const response = await fetch(url);

    // Guard: request failed
    if (!response.ok) {
      debug && console.error(response);
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
    debug && console.error(error);
    return NextResponse.json({ message: error }, { status: 500 });
  }
}
