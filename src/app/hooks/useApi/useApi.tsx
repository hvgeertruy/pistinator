import { useState } from "react";

function useApi(url: string, options?: any) {
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
