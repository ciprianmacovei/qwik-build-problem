import type { QRL, Signal } from "@builder.io/qwik";
import { useVisibleTask$, $, useSignal, useTask$ } from "@builder.io/qwik";
import { server$ } from "@builder.io/qwik-city";
import type { UserStorage } from "~/models/user";
import type { Web3UserData } from "~/models/web3";

export type UserDataStorageType = Web3UserData & UserStorage;

type ReturnType<T> = [
  Signal<T | undefined>,
  Signal<T | undefined>,
  QRL<() => void>
];

type ValueType = object | undefined;

type DefaultValueType = { value: ValueType };

const getStorage = $(<T,>
  (
    key: string,
    setValue: Signal<T | undefined>,
    defaultValue: T | undefined,
    storage: Storage
  ) => {
  const jsonValue = storage.getItem(key);
  if (setValue.value) {
    return {
      ...setValue.value,
    };
  }
  if (jsonValue != null) return JSON.parse(jsonValue);
  if (defaultValue) {
    return {
      ...defaultValue,
    };
  }
  return undefined;
}
);

export const useSessionStorage = <T,>(
  key: string,
  defaultValue?: DefaultValueType
): ReturnType<T> => {
  const value = useSignal<T>();
  const setValue = useSignal<T>();

  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(async ({ track }) => {
    track(() => key);
    track(() => setValue.value);
    value.value = await getStorage(key, setValue, defaultValue, sessionStorage);
    if (value.value !== undefined) {
      sessionStorage.setItem(key, JSON.stringify(value.value));
    }
  });

  const remove = $(() => {
    sessionStorage.removeItem(key);
    value.value = undefined;
  });


  return [value, setValue, remove];
};

export const useLocalStorage = <T,>(
  key: string,
  defaultValue?: ValueType
): ReturnType<T> => {
  const value = useSignal<T>();
  const setValue = useSignal<T>();

  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(async ({ track }) => {
    track(() => key);
    track(() => setValue.value);
    value.value = await getStorage(key, setValue, defaultValue, localStorage);
    console.log("FROM PISATUL ASTA DE LOCALSTORAGE", value.value)
    if (value.value) {
      localStorage.setItem(key, JSON.stringify(value.value));
    }
  });

  const remove = $(() => {
    localStorage.removeItem(key);
    value.value = undefined;
  });

  return [value, setValue, remove];
};


export const useServerStorage = <T,>(
  key: string,
): ReturnType<T> => {
  const value = useSignal<T>();
  const setValue = useSignal<T>();

  const getServerStorage = $((
    key: string,
    setValue: Signal<T | undefined>
  ): Promise<T | undefined> => {
    return server$(async function () {
      if (setValue.value) return { ...setValue.value }
      return this.cookie.get(key)?.json();
    })();
  })

  const setServerStorage = $((key: string, value: string | number | Record<string, any>) => {
    server$(async function () {
      this.cookie.set(key, value, { path: "/" });
    })();
  })

  const remove = $(async () => {
    await server$(async function () {
      this.cookie.delete(key, { path: "/" });
    })();
    value.value = undefined;
  })

  useTask$(async ({ track }) => {
    track(() => key);
    track(() => setValue.value);
    value.value = await getServerStorage(key, setValue);
    if (setValue.value) {
      setServerStorage(key, setValue.value)
    }
  });

  return [value, setValue, remove];
};
