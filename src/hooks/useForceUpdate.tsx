import { useState } from "react";

// creates a random seed to force update the component
// pass the seed as a key to the component
export function useForceUpdate() {
  const [seed, setSeed] = useState(1);
  const reset = () => {
    setSeed(Math.random());
  };

  return { seed, reset };
}
