import type { QRL } from "@builder.io/qwik";
import { component$, useStyles$ } from "@builder.io/qwik";
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
  reset?: QRL<() => void>;
  value?: any;
  focused?: boolean;
  disabled?: boolean;
  hasNoValidation?: boolean;
  required?: boolean;
}

export const FormTextAreaControl = component$(
  ({
    inputProps,
    id,
    label,
    name,
    validationError,
    validationMessage,
    value,
    focused,
    hasNoValidation,
    required,
  }: FormControlType) => {
    useStyles$(styles);
    const { onFocusIn, onFocusOut, baseFormControlState, baseFormControlRef } =
      useBaseFormControl({ focused, label });

    return (
      <div class="font-nuito relative my-2 flex flex-col">
        {required && (
          <div class="absolute !bottom-[120px] left-0 font-bold text-red-600">
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
        <textarea
          {...inputProps}
          rows={3}
          id={id}
          value={value}
          name={name}
          ref={baseFormControlRef}
          placeholder={label}
          onFocusin$={onFocusIn}
          onFocusout$={onFocusOut}
          wrap="soft"
          class={cn(
            baseFormControlState.focused &&
              "!bg-[#FECE31] !shadow-[0.25rem_0.25rem_black]",
            validationError ? "border-red-500" : "border-black",
            "border-[1px] border-solid placeholder:text-black focus:outline-none",
            "active:translate-0 rounded-[4px] bg-white py-[0.4em] px-[1em] font-[18px] leading-8 duration-200 hover:text-black focus:translate-x-[-0.25rem] focus:translate-y-[-0.25rem] focus:bg-[#FECE31] focus:shadow-[0.25rem_0.25rem_black] active:shadow-none"
          )}
        ></textarea>
        <div
          class={cn(
            value?.length > 200 && "!bg-red-600",
            value?.length > 99 && "!h-[25px] !w-[25px]",
            "absolute bottom-5 right-3 flex h-[20px] w-[20px] items-center justify-center rounded-full bg-gray-400 text-[11px]"
          )}
        >
          {value?.length}
        </div>

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
