import { useEffect, useRef } from "react";
import { registerVisit } from "../utils/visit-counter";


function useVisitCounter() {

  const executed = useRef(false);


  useEffect(() => {

    if (executed.current) return;

    executed.current = true;

    registerVisit();

  }, []);

}


export default useVisitCounter;