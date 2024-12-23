import { useState } from "react";

// A simple wrapper to handle fetch requests
function useApi(url: string, options?: any) {
  const debug = process.env.NEXT_PUBLIC_DEBUG;

  const opts = {
    headers: {
      Accept: "application/json",
      method: "GET",
    },
    ...options,
  };

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    debug && console.info("[DEBUG] fetching url", url);
    try {
      setIsLoading(true);

      const response = await fetch(url, opts);

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
