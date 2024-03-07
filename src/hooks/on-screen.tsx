import type { Signal } from "@builder.io/qwik";
import { useStore, useTask$ } from "@builder.io/qwik";
import { isServer } from "@builder.io/qwik/build";
import { gsap } from "gsap";
import type { Wish } from "~/models/wish";

export const useOnScreen = (
  signalArray: Signal<Wish[]>,
  rootMargin = "0px"
) => {
  const state = useStore({
    observedWishCards: new Map(),
    firstView: true,
  });

  useTask$(({ track }) => {
    track(() => signalArray.value);
    if (isServer) return;
    state.firstView = true;
    signalArray.value.forEach((element) => {
      const htmlElement = document.getElementById(
        "wish-style-card" + element.id
      );
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting && !state.firstView) {
            gsap.fromTo(
              "#wish-style-card" + element.id,
              {
                position: "relative",
                opacity: 0,
                ...(element.id % 2 === 1 ? { left: 50 } : { right: 50 }),
              },
              {
                position: "relative",
                opacity: 1,
                ...(element.id % 2 === 1 ? { left: 0 } : { right: 0 }),
                duration: 1,
              }
            );
          }
        },
        { rootMargin }
      );

      if (htmlElement && !state.observedWishCards.has(element.id)) {
        observer.observe(htmlElement);
        state.observedWishCards.set(element.id, element);
      }
    });
    setTimeout(() => {
      state.firstView = false;
    }, 200);
  });
};
