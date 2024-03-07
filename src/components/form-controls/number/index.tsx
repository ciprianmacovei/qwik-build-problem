import type { QRL } from "@builder.io/qwik";
import { $, component$, useStyles$, } from "@builder.io/qwik";
import { useBaseFormControl } from "~/components/form-controls";

import cn from "classnames";
import styles from "../index.css?inline";

interface FormControlType {
    inputProps?: any;
    id: string;
    label: string;
    name: string;
    value?: any;
    onChangeEvent?: QRL<(event: Event) => void>;
    validationError?: boolean;
    validationMessage?: string;
    size?: "sm" | "md" | "lg";
    reset?: QRL<() => void>;
    focused?: boolean;
    disabled?: boolean;
    hasNoValidation?: boolean;
    required?: boolean;
}

export const NumberFormControl = component$(
    ({
         inputProps,
         id,
         label,
         name,
         size,
         validationError,
         validationMessage,
         onChangeEvent,
         value,
         focused,
         disabled,
         hasNoValidation,
         required,
     }: FormControlType) => {
        useStyles$(styles);
        const {
            onFocusIn,
            onFocusOut,
            baseFormControlState,
            baseFormControlRef,
            onChange
        } = useBaseFormControl({ focused, label });

        return (
            <div class="font-nuito relative my-2 flex flex-col">
                {required && (
                    <div
                        class={cn(
                            "absolute left-0 font-bold text-red-600",
                            size === "lg" && "bottom-[56px]",
                            size === "sm" && "bottom-[44px]"
                        )}
                    >
                        *
                    </div>
                )}
                {(baseFormControlState.focused ||
                    (baseFormControlRef.value?.value.length ?? 0) > 0) && (
                    <label
                        class={
                            "absolute -top-6 left-2 z-10 animate-[label_0.2s_linear] text-[14px] font-bold"
                        }
                        for={id}
                    >
                        {label}
                    </label>
                )}
                <input
                    {...inputProps}
                    id={id}
                    value={value}
                    ref={baseFormControlRef}
                    placeholder={label}
                    class={cn(
                        "active:translate-0 rounded-[4px] border-[1px] border-solid bg-white py-[0.4em] px-4 font-[18px] leading-8 duration-200 placeholder:text-black hover:text-black focus:translate-x-[-0.25rem] focus:translate-y-[-0.25rem] focus:bg-[#FECE31] focus:shadow-[0.25rem_0.25rem_black] focus:outline-none active:shadow-none",
                        baseFormControlState.focused && "!bg-[#FECE31] !shadow-[0.25rem_0.25rem_black]",
                        validationError ? "border-red-500" : "border-black",
                        size === "sm" && "!py-0 !text-[13px]",
                        size === "md" && "!py-[2px] !text-[15px]",
                        size === "lg" && "!py-[4px] !text-[17px]"
                    )}
                    type="number"
                    name={name}
                    onFocusin$={onFocusIn}
                    onFocusout$={onFocusOut}
                    onChange$={$(async ($event: Event) => await onChange($event, onChangeEvent))}
                    disabled={disabled}
                />
                {!hasNoValidation && (
                    <section class="h-[11px]">
                        {validationMessage && (
                            <article>
                                <p class="text-[11px] text-red-500">{validationMessage}</p>
                            </article>
                        )}
                    </section>
                )}
            </div>
        );
    }
);
