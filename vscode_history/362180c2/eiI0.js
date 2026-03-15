import React, { useEffect, useState } from "react";
import Timer from "./components/timer";
import Progress from "./components/Progress";

export default function App() {
  const [step, setStep] = useState(1);

  useEffect(() => {
    // après 5 secondes, on passe au deuxième timer
    const timeout = setTimeout(() => {
      setStep(2);
    }, 5000); // ⏱️ 5 secondes

    return () => clearTimeout(timeout);
  }, []);

  return (
    <div>
      {step === 1 && <Timer />}
      {step === 2 && <Progress />}
    </div>
  );
}
