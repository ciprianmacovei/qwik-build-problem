import type { QRL, Signal } from "@builder.io/qwik";
import { component$, $ } from "@builder.io/qwik";

interface CustomInputProps {
    inputProps?: any;
    inputValue?: any;
    placeholder: string;
    label: string;
    name: string;
    value?: Signal<string | undefined>;
    onChange?: QRL<($event: Event, input: HTMLInputElement) => void>;
    invalid?: boolean;
    errorMessage?: string;
    validMessage?: string;
}

export const CustomInput = component$(({ placeholder, label, name, onChange, invalid, errorMessage, validMessage, value, inputProps, inputValue }: CustomInputProps) => {
    const onChangeCallback = $(async (event: Event, input: HTMLInputElement) => {
        if (onChange) {
            await onChange(event, input);
        }
        console.log(input.value, "din custom input");
    });
    return <div class="flex flex-col gap-1">
        <label for={name} class="block text-sm font-medium leading-6 text-gray-900">{label}</label>
        <div class="relative mt-2 rounded-md shadow-sm">
            {value ?
                <input {...inputProps} bind:value={value} class="block w-full rounded-md border-0 py-1.5 pl-7 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" onKeyDown$={onChangeCallback} type="text" name={name} placeholder={placeholder} /> :
                <input {...inputProps} value={inputValue} class="block w-full rounded-md border-0 py-1.5 pl-7 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" onKeyDown$={onChangeCallback} type="text" name={name} placeholder={placeholder} />
            }
        </div>
        {(errorMessage && invalid) && <p class="text-red-600 text-xs">{errorMessage}</p>}
        {(validMessage && !invalid && value?.value && value.value.length > 0) &&
            <p class=" text-green-400 text-xs">{validMessage}</p>
        }
    </div>
})