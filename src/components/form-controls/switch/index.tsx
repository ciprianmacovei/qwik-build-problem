import type { QRL } from "@builder.io/qwik";
import { $, component$, useStyles$ } from "@builder.io/qwik";
import cn from "classnames";

import styles from "../index.css?inline";
import { useBaseFormControl } from "~/components/form-controls";

interface FormControlType {
  inputProps?: any;
  id: string;
  label: string;
  name: string;
  onChangeEvent?: QRL<(event: Event) => void>;
  validationError?: boolean;
  validationMessage?: string;
  size?: "sm" | "md" | "lg";
  reset?: QRL<() => void>;
  value?: boolean;
  focused?: boolean;
  disabled?: boolean;
  hasNoValidation?: boolean;
  required?: boolean;
}

export const SwitchFormControl = component$(
  ({
    inputProps,
    id,
    label,
    name,
    size,
    validationError,
    validationMessage,
    onChangeEvent,
    focused,
    disabled,
    hasNoValidation,
    value,
  }: FormControlType) => {
    useStyles$(styles);
    const { onChange, baseFormControlRef, baseFormControlState } =
      useBaseFormControl({ focused, label });
    return (
      <div class="font-nuito relative mb-2 flex items-center">
        <div class="mr-2 text-[11px] font-bold"> {label} </div>
        <input
          {...inputProps}
          disabled={disabled}
          ref={baseFormControlRef}
          onChange$={$(($event: Event) =>
            onChange($event, onChangeEvent)
          )}
          checked={value}
          placeholder={label}
          class={cn(
            "switch-input my-input border-[1px] border-solid placeholder:text-black focus:outline-none ",
            baseFormControlState.focused &&
              "!bg-[#FECE31] !shadow-[0.25rem_0.25rem_black]",
            validationError ? "border-red-500" : "border-black",
            size === "sm" && "!px-[4px] !py-[1px] !font-[11px]",
            "active:translate-0 rounded-[4px] bg-white px-[1em] py-[0.4em] font-[18px] leading-8 duration-200 hover:text-black focus:translate-x-[-0.25rem] focus:translate-y-[-0.25rem] focus:bg-[#FECE31] focus:shadow-[0.25rem_0.25rem_black] active:shadow-none"
          )}
          id={id}
          type="checkbox"
          name={name}
        />
        <label class={"switch-label"} for={id}></label>
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
