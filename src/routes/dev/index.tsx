import { component$, $ } from '@builder.io/qwik';

import type { QRL } from "@builder.io/qwik";

interface CustomInputProps {
  placeholder: string;
  label: string;
  name: string;
  onChange?: QRL<($event: Event, input: HTMLInputElement) => void>;
  invalid?: boolean;
  errorMessage?: string;
}

const CustomInput = component$(({ placeholder, label, name, onChange, invalid, errorMessage }: CustomInputProps) => {
  return <div class="flex flex-col gap-1">
    <label for={name} class="block text-sm font-medium leading-6 text-gray-900">{label}</label>
    <div class="relative mt-2 rounded-md shadow-sm">
      <input onKeyDown$={onChange} type="text" name={name} class="block w-full rounded-md border-0 py-1.5 pl-7 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" placeholder={placeholder} />
    </div>
    {invalid && <span class="text-red-600 text-xs">{errorMessage}</span>}
  </div>
})

export default component$(() => {
  const onChange = $((event: Event, input: HTMLInputElement) => {
    console.log(input.value, "INPUT VALUE");
  })
  return <CustomInput
    placeholder='User name'
    label='User name'
    name='user_name'
    onChange={onChange}
  />
});
