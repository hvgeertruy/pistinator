import { useCallback, useEffect, useState } from "react";
import useSearchUrlForLift from "@/app/hooks/useSearchUrlForLift/useSearchUrlForLift";
import useApi from "../useApi/useApi";
import useExtractData from "../useExtractData/useExtractData";
// import useImageFromUrl from "../useImageFromUrl/useImageFromUrl";

// 1. get url that contains information about the lift
// 2. process information. options:
//    a. capture image and let ai process the image (should be cheap and require no manual work)
//       - tradeoff: supply element to get part of page as image or whole page as image (element providing needs manual work - could be optional for opts)
//    b. get page contents and let ai process the text (expensive)
//    c. let scraper process contents and let ai process it into a dataset (needs manual work)
// 3.

// A get ski data and process it
function useSearchSkiResort(resort: string, liftName: string) {
  const debug = process.env.NEXT_PUBLIC_DEBUG;
  const [url, setUrl] = useState<string>("");
  const [resortData, setResortData] = useState<string>("");
  const [liftData, setLiftData] = useState<string>("");

  // Hooks
  const { fetchUrl } = useSearchUrlForLift(resort, liftName);
  const { fetchData: fetchText } = useApi(
    `api/getTextFromUrl/${encodeURIComponent(url)}`
  );
  const { extractData } = useExtractData(resortData);

  // 1. get url using resort, liftname
  const fetchResort = async () => {
    const res = await fetchUrl();
    setUrl(res?.url || "");
  };

  // wait for url being returned
  useEffect(() => {
    fetchData();
  }, [url]);

  // 2. get url contents using url
  const fetchData = useCallback(async () => {
    console.log("fetching data with", url);
    const res = await fetchText();
    setResortData(res?.data || "");
  }, [url]);

  // wait for data being returned
  useEffect(() => {
    extractLiftData();
  }, [resortData]);

  // 3. get lift data using url data
  const extractLiftData = useCallback(() => {
    console.log("extracting lift data with", resortData);
    const res = extractData();
    setLiftData(res || "");
    console.log(res);
  }, [resortData]);

  return { fetchResort };
}

export default useSearchSkiResort;

/*
  const { fetchUrl } = useSearchUrlForLift(resort, liftName);
  // const { fetchImage } = useImageFromUrl(url, ".lift-overview");

  const { extractData } = useExtractData(resortData);
  // const { fetchData: fetchImage } = useApi(
  //   `api/getImageFromUrl/${encodeURIComponent(url)}/.lift-overview`
  // );
  const { fetchData: fetchText } = useApi(
    `api/getTextFromUrl/${encodeURIComponent(url)}`
  );

  // Get url that will contain the data we need
  const fetchResort = async () => {
    if (debug) {
      console.info("[DEBUG] fetching url by resort/liftname", resort, liftName);
    }
    const fetchedUrl = await fetchUrl();
    if (fetchedUrl) {
      console.log("setting something");
      setUrl(fetchedUrl.url);
    }

    // const image = await fetchImage();

    console.log("url", url);
    // console.log("image", image);
    console.log("text", resortData);
  };

  // get text from url
  const getTextFromUrl = useCallback(async () => {
    const text = await fetchText();

    if (text) {
      setResortData(text.data);
    }
  }, [fetchText]);

  // Get actual url data
  useEffect(() => {
    if (debug) {
      console.info("[DEBUG] fetching text by url", url);
    }

    getTextFromUrl();
  }, [url, getTextFromUrl, debug]);

  // get data from text
  const getDataFromText = useCallback(async () => {
    const data = await extractData();

    if (data) {
      setLiftData(data);
    }
  }, [extractData]);

  // Get actual url data
  useEffect(() => {
    if (debug) {
      console.info("[DEBUG] fetching data by text", resortData);
    }

    getDataFromText();
  }, [resortData, getDataFromText, debug]);
  */
