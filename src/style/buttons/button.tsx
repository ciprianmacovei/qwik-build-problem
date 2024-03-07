import type { QRL } from "@builder.io/qwik";
import { component$, $ } from "@builder.io/qwik";
import cn from "classnames";

type ButtonSizeType = "sm" | "md" | "lg";

interface ButtonProps {
  background?: string;
  color?: string;
  onClick?: QRL<() => void | any>;
  text?: string;
  w?: string;
  h?: string;
  disabled?: boolean;
  size?: ButtonSizeType;
  buttonClass?: string;
  buttonType?: "button" | "submit" | "reset";
  simpleButton?: boolean;
}

export const Button = component$(
  ({
    background = "#000000",
    color = "black",
    onClick,
    text,
    w = "auto",
    h = "auto",
    disabled,
    size = "lg",
    buttonType = "button",
    buttonClass,
    simpleButton,
  }: ButtonProps) => {
    const myOnClick = $(() => {
      onClick ? onClick() : null;
    });

    return (
      <>
        <button
          type={buttonType}
          disabled={disabled}
          onClick$={myOnClick}
          class={cn(
            disabled
              ? "hover:bg-grey-400 cursor-not-allowed bg-gray-400"
              : `bg-[${background}] hover:bg-[#ff90e8]`,
            size === "lg"
              ? "py-[0.8em] px-[2em]"
              : size === "md"
              ? "py-[0.4em] px-[1em]"
              : "py-[0.2em] px-[0.5em]",
            !simpleButton &&
              "hover:translate-x-[-0.25rem] hover:translate-y-[-0.25rem] hover:text-black hover:shadow-[0.25rem_0.25rem_black]",
            `${buttonClass} w-[${w}] h-[${h}] text-${color} active:translate-0 rounded-[4px] border-[1px] border-solid border-black duration-200 active:shadow-none`
          )}
        >
          {text}
        </button>
      </>
    );
  }
);
