import { useEffect } from "react";
import PureCounter from "@srexi/purecounterjs";

export default function usePureCounter() {
  useEffect(() => {
    new PureCounter();
  }, []);
}