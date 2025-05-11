import { NextResponse } from "next/server";

/* Goal of this API:
   Use chatGPT to look up data (from the internet) and return this in a consumable json object.
   this data should be accurate and as complete as possible

  characteristics:
  - chatGPT API can not do it's own searches on the internet (contrary to the chatGPT chat interface)
  - chatGPT chat can search web, chatGPT API can not. 
  - You can feed it data, but this will take tokens
  - you will need to finetune the input, chop it into parts for better results 
  - it will not necessarily provide the same answers as the chatGPT chat interface
*/

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
        Use the website skiresort.info as the only source of this information.
        He will ask you to provide details about a ski lift. 
        You will find these details for him: name, lift type, manufacturer, operator, hasHeating, hasBubble, capacity in people/hour, duration in mins, occupancy in persons, year of construction, lift elevation distance in meters, lift distance in meters, ski resort the lift is in, source urls (working urls where you found the information). 
        Provide only the data in json a json object without markdown formatting, use this naming: name, type, manufacturer, operator, hasHeating, hasBubble, capacity, duration_in_mins, occupancy, construction, elevation, distance, resort, sources (array of urls). If unsure, only share verified information or let me know that it’s unavailable.`,
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
    if (debug) {
      console.info(
        `[DEBUG] fetching ${url} with parameters ${resort} and ${liftName}`
      );
    }
    const response = await fetch(url, {
      method: "POST",
      headers,
      body,
    });

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

    console.log("getting ai resultwith", body);
    const data = await response.json();
    console.log(">>>", data);
    const result = data.choices[0].message.content;

    // API can yield multiple results, any one should suffice
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    if (debug) {
      console.error(error);
    }
    return NextResponse.json({ message: error }, { status: 500 });
  }
}
