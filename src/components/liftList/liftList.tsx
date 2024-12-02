import React from "react";
import { LiftProps, Lifts } from "@/app/types/lifts";
import { Button } from "../ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import Image from "next/image";
import LiftDetails from "../liftDetails/liftDetails";

const LiftList: React.FC<Lifts> = ({ lifts }) => {
  return (
    <ul>
      {lifts &&
        lifts.map((lift: LiftProps) => (
          <li key={lift.id}>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost">
                  <Image
                    width="32"
                    height="32"
                    src={`/lift-types/${lift.tags.aerialway}.png`}
                    alt={lift.tags.aerialway}
                  ></Image>
                  {lift.tags?.name}
                </Button>
              </SheetTrigger>
              <SheetContent side="bottom">
                <SheetHeader>
                  <SheetTitle>
                    <div className="flex flex-row">
                      <Image
                        width="32"
                        height="32"
                        src={`/lift-types/${lift.tags.aerialway}.png`}
                        alt={lift.tags.aerialway}
                      ></Image>
                      {lift.tags?.name}
                    </div>
                  </SheetTitle>
                  <SheetDescription></SheetDescription>
                </SheetHeader>
                <LiftDetails {...lift} />
              </SheetContent>
            </Sheet>
          </li>
        ))}
    </ul>
  );
};

export default LiftList;
