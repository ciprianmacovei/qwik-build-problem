import type { QRL, Signal } from "@builder.io/qwik";
import { component$, $ } from "@builder.io/qwik";

interface CustomInputProps {
    inputProps?: any;
    inputValue?: any;
    label: string;
    name: string;
    value?: Signal<string | undefined>;
    onChange?: QRL<($event: Event, input: HTMLInputElement) => void>;
    invalid?: boolean;
    errorMessage?: string;
    validMessage?: string;
}

export const CheckboxInput = component$(({ label, name, onChange, inputProps, inputValue }: CustomInputProps) => {
    const onChangeCallback = $(async (event: Event, input: HTMLInputElement) => {
        if (onChange) {
            await onChange(event, input);
        }
    });
    return <div class="form-control">
        <label class="label cursor-pointer">
            <span class="label-text">{label}</span>
            <input {...inputProps} name={name} type="checkbox" onChange$={onChangeCallback} checked={inputValue} class="checkbox" />
            <input ></input>
        </label>
    </div>
})



