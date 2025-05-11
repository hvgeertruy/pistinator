function useExtractData(liftData: any) {
  const debug = process.env.NEXT_PUBLIC_DEBUG;

  /* The patterns help us identify where the data is in the document.
   * - we are interested in the first and the last part. Then we can extract anything in between. This should give us all data we need.
   * - make sure that the patterns are unique; any potential false positive will make our data context bigger & less accurate
   */

  const patterns = {
    name: /lift[ ]?name/i,
    manufacturer: /manufa[a-z]*/i,
    construction: /(year\s+of\s+construction|construction)/i,
    distance: /(height|length|distance)/i,
    duration: /(duration|(transit\s*)?time)/i,
    capacity: /(carrying\s*)?capacity/i,
    replaced: /replaced[ ]?lift/i,
    speed: /speed/i,
    // type: /type/i, // too unsafe, will return false matches
    // resort: /(ski\s*)?resort/i, // too unsafe, will return false matches
  };

  const extractData = () => {
    if (debug) {
      console.info("[DEBUG] extracting data...");
    }

    const matchIndexes = [];

    // Extract details using patterns
    for (const pattern of Object.entries(patterns)) {
      const match = liftData.match(pattern[1]);
      if (match) {
        matchIndexes.push(match["index"]);
      } else {
        // matchIndexes.push(null);
      }
    }

    return liftData.substring(
      Math.min(...matchIndexes),
      Math.max(...matchIndexes)
    );
  };

  return { extractData };
}

export default useExtractData;
