"use client";

import Header from "@/components/header";
import { Button } from "@/components/ui/button";
import useSearchSkiResort from "@/app/hooks/useSearchSkiResort/useSearchSkiResort";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export default function Lifts() {
  // const resort = 'val cenis'
  // const liftName= 'colomba'
  // const resort = "winterberg";
  // const liftName = "poppen";
  const [resort, setResort] = useState(localStorage.getItem("resort") || "");
  const [liftName, setLiftName] = useState(
    localStorage.getItem("liftname") || ""
  );

  const { fetchResort } = useSearchSkiResort(resort, liftName);

  const handleResortInputChange = (event: { target: HTMLInputElement }) => {
    const value = (event.target as HTMLInputElement).value;
    localStorage.setItem("resort", value);

    setResort(value);
  };

  const handleLiftInputChange = (event: { target: HTMLInputElement }) => {
    const value = (event.target as HTMLInputElement).value;
    localStorage.setItem("liftname", value);

    setLiftName(value);
  };

  return (
    <div className="grid grid-cols-2 m-8 gap-8">
      <div className="flex flex-col gap-5">
        <Header type="h1">Search resorts for available ski lifts</Header>
        <div className="flex flex-row gap-3">
          <Input
            id="ski_resort"
            value={resort}
            onChange={handleResortInputChange}
            name="ski_resort"
            placeholder="Ski resort..."
          />
          <Input
            id="lift_name"
            value={liftName}
            onChange={handleLiftInputChange}
            name="lift_name"
            placeholder="Lift name..."
          />
          <Button onClick={() => fetchResort()}>Get lift properties</Button>
        </div>
      </div>
    </div>
  );
}
