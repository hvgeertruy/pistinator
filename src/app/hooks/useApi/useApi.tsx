import { useState } from "react";

// A simple wrapper to handle fetch requests
function useApi(url: string, headersExt?: any) {
  const debug = process.env.NEXT_PUBLIC_DEBUG;

  const headers = {
    headers: {
      Accept: "application/json",
      method: "GET",
    },
    ...headersExt,
  };

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    if (debug) {
      console.info("[DEBUG] fetching url", url);
    }
    try {
      setIsLoading(true);

      const response = await fetch(url, headers);

      if (response) {
        const data = await response.json();
        return { data, isLoading, error };
      }
    } catch (err) {
      setError(error);
      return { isLoading, error };
    } finally {
      setIsLoading(false);
    }
  };

  return { fetchData };
}

export default useApi;
