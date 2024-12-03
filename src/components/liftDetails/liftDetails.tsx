import React, { useEffect, useState } from "react";
import { LiftProps } from "@/app/types/lifts";
import { liftTypeMappings } from "@/lib/utils";
import useApi from "@/app/hooks/useApi/useApi";

type LiftDetailsProps = {
  name: string;
  type: string;
  manufacturer: string;
  operator: string;
  hasHeating: boolean;
  hasBubble: boolean;
  capacity: number;
  duration_in_mins: number;
  occupancy: number;
  construction: number;
  elevation: number;
  distance: number;
  resort: string;
  sources: string[];
};

const liftDetailsProps = {
  name: "string",
  type: "string",
  manufacturer: "string",
  operator: "string",
  hasHeating: false,
  hasBubble: false,
  capacity: 0,
  duration_in_mins: 0,
  occupancy: 0,
  construction: 0,
  elevation: 0,
  distance: 0,
  resort: "string",
  sources: [],
};

const LiftDetails: React.FC<LiftProps> = ({ resort, id, tags }) => {
  const debug = process.env.NEXT_PUBLIC_DEBUG;

  const [liftDetails, setLiftDetails] =
    useState<LiftDetailsProps>(liftDetailsProps);
  const { fetchData: fetchLiftByAI } = useApi(
    `api/getLiftDetailsByAI/${resort}/${tags?.name}`
  );

  useEffect(() => {
    const fetchDetails = async () => {
      const liftDetails = await fetchLiftByAI();
      liftDetails && setLiftDetails(JSON.parse(liftDetails.data));
      debug && console.info("[DEBUG] lift details:", liftDetails);
    };

    fetchDetails().catch(console.error);
  }, []);

  return (
    <div>
      <div className="flex flex-row flex-wrap w-full my-4">
        {(tags?.aerialway || liftDetails.type) && (
          <div className="flex w-6/12">
            <div className="w-6/12">Lift type</div>
            <div className="w-6/12">
              {liftTypeMappings[tags?.aerialway]}{" "}
              <span style={{ color: "#666" }}>({liftDetails.type})</span>
            </div>
          </div>
        )}
        {(tags?.operator || liftDetails.operator) && (
          <div className="flex w-6/12">
            <div className="w-6/12">Operator</div>
            <div className="w-6/12">
              {tags?.operator}{" "}
              <span style={{ color: "#666" }}>({liftDetails.operator})</span>
            </div>
          </div>
        )}
        {(tags?.["aerialway:capacity"] || liftDetails.capacity) && (
          <div className="flex w-6/12">
            <div className="w-6/12">Capacity</div>
            <div className="w-6/12">
              {tags?.["aerialway:capacity"]}{" "}
              <span style={{ color: "#666" }}>({liftDetails.capacity})</span>
              &nbsp;p/hr
            </div>
          </div>
        )}
        {(tags?.manufacturer || liftDetails.manufacturer) && (
          <div className="flex w-6/12">
            <div className="w-6/12">Manufacturer</div>
            <div className="w-6/12">
              {tags?.manufacturer}{" "}
              <span style={{ color: "#666" }}>
                ({liftDetails.manufacturer})
              </span>
            </div>
          </div>
        )}
        {(tags?.["aerialway:duration"] || liftDetails.duration_in_mins) && (
          <div className="flex w-6/12">
            <div
              className="w-6/12"
              title="Duration of the ski lift from start to end"
            >
              Duration
            </div>
            <div className="w-6/12">
              {tags?.["aerialway:duration"]}{" "}
              <span style={{ color: "#666" }}>
                ({liftDetails.duration_in_mins})
              </span>
              &nbsp;mins
            </div>
          </div>
        )}
        {(tags?.year_of_construction || liftDetails.construction) && (
          <div className="flex w-6/12">
            <div className="w-6/12">Year of Construction</div>
            <div className="w-6/12">
              {tags?.year_of_construction}{" "}
              <span style={{ color: "#666" }}>
                ({liftDetails.construction})
              </span>
            </div>
          </div>
        )}
        {(tags?.["aerialway:occupancy"] || liftDetails.occupancy) && (
          <div className="flex w-6/12">
            <div className="w-6/12">Occupancy</div>
            <div className="w-6/12">
              {tags?.["aerialway:occupancy"]}{" "}
              <span style={{ color: "#666" }}>({liftDetails.occupancy})</span>
              &nbsp;p
            </div>
          </div>
        )}
        {tags?.note && (
          <div className="flex w-6/12">
            <div className="w-6/12">Note</div>
            <div className="w-6/12">{tags?.note}</div>
          </div>
        )}
        {(tags?.["aerialway:bubble"] || liftDetails.hasBubble) && (
          <div className="flex w-6/12">
            <div className="w-6/12">Has bubble</div>
            <div className="w-6/12">
              {tags?.["aerialway:bubble"]}{" "}
              <span style={{ color: "#666" }}>
                ({liftDetails.hasBubble ? "yes" : "no"})
              </span>
            </div>
          </div>
        )}
        {(tags?.ele || liftDetails.elevation) && (
          <div className="flex w-6/12">
            <div className="w-6/12">Lift elevation</div>
            <div className="w-6/12">
              {tags?.ele}{" "}
              <span style={{ color: "#666" }}>({liftDetails.elevation})</span>
              &nbsp;m
            </div>
          </div>
        )}
        {(tags?.["aerialway:heating"] || liftDetails.hasHeating) && (
          <div className="flex w-6/12">
            <div className="w-6/12">Has heating</div>
            <div className="w-6/12">
              {tags?.["aerialway:heating"]}{" "}
              <span style={{ color: "#666" }}>
                ({liftDetails.hasHeating ? "yes" : "no"})
              </span>
            </div>
          </div>
        )}
        {tags?.oneway && (
          <div className="flex w-6/12">
            <div className="w-6/12">Is one way</div>
            <div className="w-6/12">{tags?.oneway}</div>
          </div>
        )}
        {liftDetails.distance && (
          <div className="flex w-6/12">
            <div className="w-6/12">Lift distance</div>
            <div className="w-6/12">
              <span style={{ color: "#666" }}>({liftDetails.distance})</span>
              &nbsp;m
            </div>
          </div>
        )}
        {liftDetails.resort && (
          <div className="flex w-6/12">
            <div className="w-6/12">Resort</div>
            <div className="w-6/12">
              <span style={{ color: "#666" }}>({liftDetails.resort})</span>
            </div>
          </div>
        )}
        {liftDetails.sources && (
          <div className="flex w-6/12">
            <div className="w-6/12">Sources</div>
            <div className="w-6/12">
              <span style={{ color: "#666" }}>
                {liftDetails.sources.map((source: string) => (
                  <a
                    key={source}
                    className="block"
                    target="_blank"
                    href={source}
                  >
                    {source}
                  </a>
                ))}
              </span>
            </div>
          </div>
        )}
      </div>
      <iframe
        className="-mx-6"
        style={{ width: "100vw", height: "40vh" }}
        src={`${process.env.NEXT_PUBLIC_MAP_URI}?Q=${encodeURIComponent(
          `[out:json][timeout:25];way(${id});out body;>;out skel qt;`
        )}`}
      />
    </div>
  );
};

export default LiftDetails;
