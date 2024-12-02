export type Lifts = {
  lifts: LiftProps[];
};

export type LiftProps = {
  resort: string;
  type: string;
  id: number;
  nodes: number[];
  tags: LiftElementTagProps;
};

export type LiftElementTagProps = {
  name: string;
  aerialway: string; // carriage type
  "aerialway:capacity"?: string; // people per hour
  "aerialway:duration"?: string; // ride duration in minutes
  "aerialway:occupancy"?: string; // people in each carriage
  "aerialway:detachable"?: string; // whether chairlift has detachable grip
  "aerialway:heating"?: string; // whether carriage has heating
  "aerialway:bubble"?: string; // whether carriage has transparent cover
  "aerialway:bicycle"?: string; // whether bicycles are allowed (yes/no/summer)
  "aerialway:access"?: string; // whether you can board the carriage (entry/exit/both/no)
  manufacturer?: string; // manufacturer of the carriage
  operator?: string; // operator of the carriage
  year_of_construction?: string; // year of construction of the carriage
  note?: string; // notes on the carriage
  ele?: string; // elevation of the carriage (?)
  oneway?: string; // whether carriage is one way
  [key: string]: string | undefined; // To accommodate any other dynamic keys in tags
};

//TODO
// aerialway: "gondola",
// aerialway:duration: "14",
// aerialway:occupancy: "6",
// fee: "yes",
// name: "Kanzelwandbahn",
// piste:lift:capacity: "1500",
// piste:lift:occupancy: "6",
// ref: "30",
// website: "https://www.ok-bergbahnen.com/bergbahnen/kanzelwandbahn/",
// wikidata: "Q1417211",
// wikipedia: "de:Kanzelwandbahn"

/** Based on https://wiki.openstreetmap.org/wiki/Key:aerialway */
export type LiftTypes =
  | "cable_car"
  | "gondola"
  | "mixed_lift"
  | "chair_lift"
  | "drag_lift"
  | "t-bar"
  | "j-bar"
  | "platter"
  | "rope_tow"
  | "magic_carpet"
  | "zip_line";
