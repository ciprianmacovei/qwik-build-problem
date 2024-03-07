import type { QRL } from "@builder.io/qwik";
import { $, useSignal, useStore } from "@builder.io/qwik";

interface BaseFormControlProps {
    focused: boolean | undefined;
    label: string;
}

export const useBaseFormControl = ({ focused, label }: BaseFormControlProps) => {
    const baseFormControlState = useStore({
        focused: focused,
    });
    const baseFormControlRef = useSignal<HTMLInputElement>();

    const onChange = $(async ($event: Event, onChangeEventFunc: QRL<($event: Event) => void> | undefined) => {
        if (onChangeEventFunc) {
            await onChangeEventFunc($event);
        }
    });

    const onFocusIn = $(
        () => {
            if (baseFormControlRef.value) {
                baseFormControlRef.value.setAttribute("placeholder", "");
                baseFormControlState.focused = true;
            }
        });

    const onFocusOut = $(
        () => {
            if (baseFormControlRef.value) {
                baseFormControlState.focused = false;
                baseFormControlRef.value.setAttribute("placeholder", label);
            }
        });

    return {
        onChange,
        onFocusIn,
        onFocusOut,
        baseFormControlRef,
        baseFormControlState,
    }
};