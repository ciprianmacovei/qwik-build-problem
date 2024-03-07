import type { QRL } from '@builder.io/qwik';
import { Slot, component$, createContextId, useStore, useTask$, $, useContextProvider } from '@builder.io/qwik';
import { isServer } from '@builder.io/qwik/build';
import { useLocalStorage } from '~/storage';

export type ThemeType = "dark" | "light";

export const ThemeService = createContextId<UseThemeStore>("theme-context");

interface UseThemeStore {
    theme: { value: ThemeType };
    setTheme: QRL<(theme: ThemeType) => void>;
}

export const ThemeProvider = component$(() => {
    const [localTheme, setLocalTheme] = useLocalStorage<{ value: ThemeType }>("theme", { value: "light" });
    const themeState = useStore<UseThemeStore>({
        theme: { value: "light" },
        setTheme: $((theme: ThemeType) => {
            setLocalTheme.value = {
                value: theme
            };
        })
    })

    useTask$(({ track }) => {
        track(() => localTheme.value);
        if (isServer) return;
        if (localTheme.value?.value) {
            document.querySelector('body')?.setAttribute('data-theme', localTheme.value.value);
            themeState.theme = {
                value: localTheme.value.value
            };
        }
    });

    useContextProvider(ThemeService, themeState)

    return <Slot />
});