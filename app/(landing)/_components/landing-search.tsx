import { DatePickerWithRange } from "@/components/datepicker-with-range";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import React from "react";

const LandingSearch = () => {
  return (
    <div className="flex flex-row justify center p-10 gap-3">
      <Input
        placeholder={"Enter your desired location or dream vehicle ..."}
      ></Input>
      {/* <DatePickerWithRange /> */}
      <Button>
        <Search />
      </Button>
    </div>
  );
};

export default LandingSearch;
