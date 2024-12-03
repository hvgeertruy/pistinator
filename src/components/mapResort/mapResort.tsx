import React from "react";
import { CoordsProps } from "@/app/types/coords";
import { excludedLifts } from "@/lib/utils";
import Header from "../header";

const LiftList: React.FC<CoordsProps> = ({
  minLatitude,
  minLongitude,
  maxLatitude,
  maxLongitude,
}) => {
  return (
    minLatitude !== "0" &&
    maxLatitude !== "0" &&
    minLongitude !== "0" &&
    maxLongitude !== "0" && (
      <div>
        <Header type="h2">Resort map</Header>
        <iframe
          style={{ width: "100%", height: "40vh" }}
          src={`${process.env.NEXT_PUBLIC_MAP_URI}?Q=${encodeURIComponent(
            `[out:json][timeout:25];(way["landuse"="winter_sports"](${minLatitude},${minLongitude},${maxLatitude},${maxLongitude});
          way["aerialway"](${minLatitude},${minLongitude},${maxLatitude},${maxLongitude})${excludedLifts};);out body;>;out skel qt;`
          )}`}
        />
      </div>
    )
  );
};

export default LiftList;
