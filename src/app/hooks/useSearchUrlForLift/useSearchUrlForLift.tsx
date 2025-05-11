import { useState } from "react";

// A get ski data and process it
// function useSearchUrlForLift(resort: string, liftName: string) {
//   const debug = process.env.NEXT_PUBLIC_DEBUG;
//   const [error, setError] = useState(null);
//   const [url, setUrl] = useState("");
//   const apiUrl = `api/getUrlForLift/${encodeURIComponent(
//     resort
//   )}/${encodeURIComponent(liftName)}`;

//   const headers = {
//     headers: {
//       Accept: "application/json",
//       method: "GET",
//     },
//   };

//   const fetchUrl = async () => {
//     if (debug) {
//       console.info("[DEBUG] fetching url", apiUrl);
//     }
//     try {
//       const response = await fetch(apiUrl, headers);

//       if (response) {
//         const data = await response.json();

//         // decide what we want to return - for now i am only interested in the url
//         setUrl(data.web.results[0].url);
//       }
//     } catch (err) {
//       setError(err);
//       return { error };
//     } finally {
//     }
//   };

//   fetchUrl();

//   return url;
// }

function useSearchUrlForLift(resort: string, liftName: string) {
  const debug = process.env.NEXT_PUBLIC_DEBUG;
  const [error, setError] = useState(null);
  const [url, setUrl] = useState(null);
  const apiUrl = `api/getUrlForLift/${encodeURIComponent(
    resort
  )}/${encodeURIComponent(liftName)}`;

  const headers = {
    headers: {
      Accept: "application/json",
      method: "GET",
    },
  };

  const fetchUrl = async () => {
    if (debug) {
      console.info("[DEBUG] fetching url", apiUrl);
    }
    try {
      // use cached data
      if (url !== null) {
        return { url, error };
      }

      const response = await fetch(apiUrl, headers);

      if (response) {
        const data = await response.json();
        // decide what we want to return - for now i am only interested in the url
        const url = data.web.results[0].url;
        setUrl(url);

        return { url, error };
      }
    } catch (err) {
      setError(err);
      return { error };
    } finally {
    }
  };

  return { fetchUrl };
}

export default useSearchUrlForLift;
