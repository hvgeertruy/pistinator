import React from "react";
import { CoordsProps } from "@/app/types/coords";
import { excludedLifts } from "@/lib/utils";

const LiftList: React.FC<CoordsProps> = ({
  minLatitude,
  minLongitude,
  maxLatitude,
  maxLongitude,
}) => {
  return (
    <iframe
      style={{ width: "100%", height: "40vh" }}
      src={`${process.env.NEXT_PUBLIC_MAP_URI}?Q=${encodeURIComponent(
        `[out:json][timeout:25];(way["landuse"="winter_sports"](${minLatitude},${minLongitude},${maxLatitude},${maxLongitude});
    way["aerialway"](${minLatitude},${minLongitude},${maxLatitude},${maxLongitude})${excludedLifts};);out body;>;out skel qt;`
      )}`}
    />
  );
};

export default LiftList;
