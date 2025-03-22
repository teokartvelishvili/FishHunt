"use client";

import { useState } from "react";
import GoogleMapWithKML from "./GoogleMapWithKML";

const rivers: string[] = ["მტკვარი", "რიონი"];

const RiverList: React.FC = () => {
  const [selectedRiver, setSelectedRiver] = useState<string>("მტკვარი");

  return (
    <div>
      <h2>მდინარეების სია</h2>
      <ul>
        {rivers.map((river) => (
          <li key={river}>
            <button onClick={() => setSelectedRiver(river)}>{river}</button>
          </li>
        ))}
      </ul>

      <GoogleMapWithKML river={selectedRiver} />
    </div>
  );
};

export default RiverList;
