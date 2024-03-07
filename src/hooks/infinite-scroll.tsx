import type { Signal } from "@builder.io/qwik";
import { $, useOnWindow, useStore } from "@builder.io/qwik";

interface InfiniteScrollProps {
  page: number;
  perPage: number;
  data: Signal<any[]>;
}

interface InfiniteScrollState {
  page: number;
  perPage: number;
  prevDataLength: number;
}

interface InfiniteScrollPrivateState {
  myTimeout: any;
}

export const useInfiniteScroll = ({
  page,
  perPage,
  data,
}: InfiniteScrollProps) => {
  const triggerPoint: number = 50;
  const pageState = useStore<InfiniteScrollState>({
    page,
    perPage,
    prevDataLength: 0,
  });
  const privateState = useStore<InfiniteScrollPrivateState>({
    myTimeout: typeof setTimeout,
  });

  useOnWindow(
    "scroll",
    $(() => {
      if (privateState.myTimeout) {
        clearTimeout(privateState.myTimeout);
        privateState.myTimeout = null;
      }
      privateState.myTimeout = setTimeout(() => {
        if (
          window.innerHeight + window.scrollY >=
            document.body.scrollHeight - triggerPoint &&
          data.value.length !== 0 &&
          pageState.prevDataLength !== data.value.length
        ) {
          pageState.page = pageState.page + 1;
          pageState.prevDataLength = data.value.length;
        }
      }, 300);
    })
  );

  return pageState;
};
