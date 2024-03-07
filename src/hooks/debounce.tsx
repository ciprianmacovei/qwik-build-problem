import type { Signal } from "@builder.io/qwik";
import { useSignal, useTask$ } from "@builder.io/qwik";
import { isServer } from "@builder.io/qwik/build";

interface UseDebounceProps<T> {
  signal: Signal<T | undefined>
  milliseconds: number;
}

export const useDebounce = <T,>({ signal, milliseconds }: UseDebounceProps<T>)
  : { deboucedSignal: Signal<T | undefined> } => {
  const deboucedSignal = useSignal<T | undefined>(signal.value);
  const timeoutId = useSignal<any>();
  useTask$(({ track, cleanup }) => {
    track(() => signal.value);
    if (isServer) return;
    if (timeoutId.value) {
      clearTimeout(timeoutId.value);
    }
    timeoutId.value = setTimeout(() => {
      deboucedSignal.value = signal.value;
    }, milliseconds);
    cleanup(() => clearTimeout(timeoutId.value));
  })

  return { deboucedSignal }
};
