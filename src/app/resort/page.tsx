"use client";

import Header from "@/components/header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import useApi from "../hooks/useApi/useApi";
import { LiftProps } from "../types/lifts";
import LiftList from "@/components/liftList/liftList";
import { CoordsProps } from "../types/coords";
import MapResort from "@/components/mapResort/mapResort";

export default function Lifts() {
  const debug = process.env.NEXT_PUBLIC_DEBUG;
  const initialCoords = {
    minLongitude: "0",
    minLatitude: "0",
    maxLongitude: "0",
    maxLatitude: "0",
  };
  const [resort, setResort] = useState(localStorage.getItem("resort") || "");
  const [lifts, setLifts] = useState<LiftProps[]>([]);
  const [coords, setCoords] = useState<CoordsProps>(initialCoords);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { fetchData: fetchCoords } = useApi(
    `api/getCoordsByResort/${encodeURIComponent(resort)}`
  );
  const { fetchData: fetchLifts } = useApi(
    `api/getLiftsByCoords/${encodeURIComponent(
      coords.minLatitude
    )}/${encodeURIComponent(coords.minLongitude)}/${encodeURIComponent(
      coords.maxLatitude
    )}/${encodeURIComponent(coords.maxLongitude)}`
  );

  const handleSearchInputChange = (event: { target: HTMLInputElement }) => {
    const value = (event.target as HTMLInputElement).value;
    localStorage.setItem("resort", value);
    setResort(value);
  };

  const handleSearch = async () => {
    setIsLoading(true);

    // get coords
    const coordsResult = await fetchCoords();
    coordsResult && setCoords(coordsResult.data);
    debug && console.info("[DEBUG] coords:", coords);

    setIsLoading(false);
  };

  useEffect(() => {
    // get lifts based on coords
    const getit = async () => {
      const liftsResult = await fetchLifts();
      liftsResult?.data?.map((item: LiftProps) => (item.resort = resort));
      liftsResult && setLifts(liftsResult.data); // TODO; not working as expected?
      debug && console.info("[DEBUG] lifts:", liftsResult);
    };

    getit();
  }, [coords]);

  return (
    <div className="grid grid-cols-2 m-8 gap-8">
      <div className="flex flex-col gap-5">
        <Header type="h1">Search resorts for available ski lifts</Header>
        <div className="flex flex-row gap-3">
          <Input
            id="ski_resort"
            value={resort}
            onChange={handleSearchInputChange}
            name="ski_resort"
            placeholder="Search for ski resort..."
            onBlur={() => handleSearch()}
          />
          <Button onClick={() => handleSearch()}>Search</Button>
        </div>
        {/* <div>
          Val Cenis is a ski resort located in the French Alps, near the Italian
          border in the Savoie region. It is part of the Haute Maurienne Vanoise
          area and combines the villages of Lanslebourg and Lanslevillard. The
          resort offers a blend of traditional Alpine charm and modern
          facilities, with over 125 km of slopes catering to all levels, from
          beginners to advanced skiers. Known for its scenic views of the
          Vanoise National Park, Val Cenis also provides opportunities for
          snowshoeing, cross-country skiing, and family-friendly activities. Its
          high-altitude location ensures reliable snow conditions throughout the
          season.
        </div> */}
        {/* minlat: {coords.minLatitude},
        <br />
        maxlat:{coords.maxLatitude},
        <br />
        minlon:{coords.minLongitude},
        <br />
        maxlon:{coords.maxLongitude} */}
        {coords && <MapResort {...coords} />}
      </div>
      <div>
        {isLoading && <div>Loading...</div>}
        <LiftList lifts={lifts} />
      </div>
    </div>
  );
}
