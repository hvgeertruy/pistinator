import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const excludedLifts = `["aerialway" != "station"]["aerialway" != "pylon"][
  "aerialway" != "goods"]`;

export const liftTypeMappings: { [key: string]: string } = {
  cable_car: "Cable car",
  gondola: "Gondola",
  mixed_lift: "Mixed lift",
  chair_lift: "Chairlift",
  drag_lift: "Drag lift",
  "t-bar": "T-bar lift",
  "j-bar": "J-bar lift",
  platter: "Platter lift",
  rope_tow: "Tow lift",
  magic_carpet: "Magic carpet",
  zip_line: "Zip line",
};
