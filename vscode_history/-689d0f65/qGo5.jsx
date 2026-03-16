import React, { useEffect, useState } from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

export default function Progress() {
  const [value, setValue] = useState(0);

  useEffect(() => {
    setValue(40); 
  }, []);

  return (
    <div style={{ width: "150px", margin: "40px auto", textAlign: "center" }}>
      <CircularProgressbar
        value={value}
        text={`${value}%`}
        styles={buildStyles({
          pathColor: "#3b82f6",
          textColor: "#3b82f6",
          trailColor: "#e5e7eb",
          pathTransitionDuration: 1,
        })}
      />
    </div>
  );
}
