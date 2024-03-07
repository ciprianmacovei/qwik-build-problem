import { component$, useStyles$, } from "@builder.io/qwik";
import cn from "classnames";

import styles from "../index.css?inline";
import { useBaseFormControl } from "~/components/form-controls";

interface FormControlType {
    inputProps?: any;
    id: string;
    label: string;
    name: string;
    validationError?: boolean;
    validationMessage?: string;
    size?: "sm" | "md" | "lg";
    value?: any;
    focused?: boolean;
    hasNoValidation?: boolean;
    required?: boolean;
}

export const DateFormControl = component$(
    ({
         inputProps,
         id,
         label,
         name,
         size = 'sm',
         validationError,
         validationMessage,
         value,
         focused,
         hasNoValidation,
         required,
     }: FormControlType) => {
        useStyles$(styles);
        const {
            onFocusIn,
            onFocusOut,
            baseFormControlState,
            baseFormControlRef,
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
                <input
                    {...inputProps}
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
                    id={id}
                    type="date"
                    name={name}
                    onFocusin$={onFocusIn}
                    onFocusout$={onFocusOut}
                    min={"2023-01-01"}
                    max={"2025-01-01"}
                    value={value ? value : new Intl.DateTimeFormat("en-US").format(new Date())}
                />
                {(baseFormControlState.focused &&
                    <label
                        class={
                            "absolute -top-6 left-2 z-10 animate-[label_0.2s_linear] text-[13px] font-bold"
                        }
                        for={id}
                    >
                        {label}
                    </label>
                )}
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
