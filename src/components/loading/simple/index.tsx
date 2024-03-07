import { component$, useContext, useStyles$ } from "@builder.io/qwik";
import style from "./index.css?inline";
import { LoadingServiceContext } from "~/services/loading.service";
import cn from "classnames";

export const SimpleLoading = component$(() => {
  useStyles$(style);
  const loadingState = useContext(LoadingServiceContext);
  return (
    <>
      {loadingState.simpleLoading && (
        <div
          class={cn(
            "font-nuito fixed top-0 z-50 flex h-[100vh] items-center justify-center w-[57%]",
          )}
        >
          <div class="contain">
            <svg
              class="my-loading-svg"
              height="80"
              viewBox="-30 0 255 80"
              width="255"
            >
              <ellipse cx="25" cy="20" fill="none" rx="10" ry="10"></ellipse>
            </svg>
            <svg
              class="my-loading-svg"
              height="80"
              viewBox="-30 0 255 80"
              width="255"
            >
              <ellipse cx="25" cy="20" fill="none" rx="10" ry="10"></ellipse>
            </svg>
            <svg
              class="my-loading-svg"
              height="80"
              viewBox="-30 0 255 80"
              width="255"
            >
              <ellipse cx="25" cy="20" fill="none" rx="10" ry="10"></ellipse>
            </svg>
            <svg
              class="my-loading-svg"
              height="80"
              viewBox="-30 0 255 80"
              width="255"
            >
              <ellipse cx="25" cy="20" fill="none" rx="10" ry="10"></ellipse>
            </svg>
            <svg
              class="my-loading-svg"
              height="80"
              viewBox="-30 0 255 80"
              width="255"
            >
              <ellipse cx="25" cy="20" fill="none" rx="10" ry="10"></ellipse>
            </svg>
            <svg
              class="my-loading-svg"
              height="80"
              viewBox="-30 0 255 80"
              width="255"
            >
              <ellipse cx="25" cy="20" fill="none" rx="10" ry="10"></ellipse>
            </svg>
            <svg
              class="my-loading-svg"
              height="80"
              viewBox="-30 0 255 80"
              width="255"
            >
              <ellipse cx="25" cy="20" fill="none" rx="10" ry="10"></ellipse>
            </svg>
            <svg
              class="my-loading-svg"
              height="80"
              viewBox="-30 0 255 80"
              width="255"
            >
              <ellipse cx="25" cy="20" fill="none" rx="10" ry="10"></ellipse>
            </svg>
            <svg
              class="my-loading-svg"
              height="80"
              viewBox="-30 0 255 80"
              width="255"
            >
              <ellipse cx="25" cy="20" fill="none" rx="10" ry="10"></ellipse>
            </svg>
            <svg
              class="my-loading-svg"
              height="80"
              viewBox="-30 0 255 80"
              width="255"
            >
              <ellipse cx="25" cy="20" fill="none" rx="10" ry="10"></ellipse>
            </svg>
          </div>
        </div>
      )}
    </>
  );
});
