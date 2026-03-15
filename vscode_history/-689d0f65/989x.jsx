import React, { useState } from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

export default function Progress() {
  const [value, setValue] = useState(0);

  const handleClick = () => {
    setValue(40);
  };

  return (
    <div style={{ width: "150px", margin: "40px auto", textAlign: "center" }}>
      <CircularProgressbar
        value={value}
        text={`${value}%`}
        styles={buildStyles({
          pathColor: "#3b82f6",
          textColor: "#111",
          trailColor: "#e5e7eb",
        })}
      />

      <button
        onClick={handleClick}
        style={{
          marginTop: "20px",
          padding: "8px 16px",
          cursor: "pointer",
        }}
      >
        Start Progress
      </button>
    </div>
  );
}
