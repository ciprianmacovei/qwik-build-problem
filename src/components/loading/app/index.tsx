import { component$, useContext, useStyles$ } from "@builder.io/qwik";
import styles from "./index.css?inline";

import cn from "classnames";
import { LoadingServiceContext } from "~/services/loading.service";

export const AppLoading = component$(() => {
  useStyles$(styles);
  const loadingService = useContext(LoadingServiceContext);
  return (
    <>
      {(loadingService.appLoading || loadingService.appLoadingTransparent) && (
        <div
          class={cn(
            "font-nuito fixed top-0 z-50 flex h-[100vh] items-center justify-center left-[25%] w-[57%] max-sm:w-[100vw]",
            loadingService.appLoadingTransparent && "bg-[#FE98CF]/80",
            loadingService.appLoading && "!bg-[#FE98CF]"
          )}
        >
          <div class="loader flex space-x-3 rounded-full bg-white p-5">
            <div class="h-5 w-5 animate-bounce rounded-full bg-gray-800"></div>
            <div class="h-5 w-5 animate-bounce rounded-full bg-gray-800"></div>
            <div class="h-5 w-5 animate-bounce rounded-full bg-gray-800"></div>
          </div>
        </div>
      )}
    </>
  );
});
