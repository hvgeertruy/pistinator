import { NextResponse } from "next/server";

export async function GET(request: Request, context: any) {
  const debug = process.env.NEXT_PUBLIC_DEBUG;
  const { resort, liftName } = await context.params;
  const prompt = `can you give me details about this ski lift: ${liftName} in resort: ${resort}`;
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${process.env.CHATGPT_API_KEY}`,
  };

  const body = JSON.stringify({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: `You are a helpful assistant. 
        You will give the user accurate information about his query. 
        He will ask you to provide details about a ski lift. 
        You will find these details for him: name, lift type, manufacturer, operator, hasHeating, hasBubble, capacity in people/hour, duration in mins, occupancy in persons, year of construction, lift elevation distance in meters, lift distance in meters, ski resort the lift is in, source urls. 
        Provide only the data in json a json object without markdown formatting, use this naming: name, type, manufacturer, operator, hasHeating, hasBubble, capacity, duration_in_mins, occupancy, construction, elevation, distance, resort, sources (array of urls)`,
      },
      { role: "user", content: prompt },
    ],
  });

  // Guard: invalid parameter
  if (!liftName || typeof liftName !== "string") {
    return NextResponse.json(
      { message: "Got invalid input. Please provide a valid lift name" },
      { status: 400 }
    );
  }

  try {
    const url = `${process.env.URL_LIFT_BY_AI}`;
    debug &&
      console.info(
        `[DEBUG] fetching ${url} with parameters ${resort} and ${liftName}`
      );

    const response = await fetch(url, {
      method: "POST",
      headers,
      body,
    });

    // Guard: request failed
    if (!response.ok) {
      debug && console.error(response);
      return NextResponse.json(
        { message: response.statusText },
        { status: 500 }
      );
    }

    const data = await response.json();
    const result = data.choices[0].message.content;
    console.log(">>", result);

    // API can yield multiple results, any one should suffice
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    debug && console.error(error);
    return NextResponse.json({ message: error }, { status: 500 });
  }
}
