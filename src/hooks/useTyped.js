import { useEffect } from "react";
import Typed from "typed.js";

export default function useTyped() {
  useEffect(() => {
    const element = document.querySelector(".typed");

    if (!element) return;

    const typedItems = element.getAttribute("data-typed-items");

    const typedStrings = typedItems.split(",");

    const typed = new Typed(element, {
      strings: typedStrings,
      loop: true,
      typeSpeed: 100,
      backSpeed: 50,
      backDelay: 2000,
    });

    return () => {
      typed.destroy();
    };
  }, []);
}