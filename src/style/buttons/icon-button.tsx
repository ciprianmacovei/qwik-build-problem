import type { QRL } from "@builder.io/qwik";
import { component$, $ } from "@builder.io/qwik";
import cn from "classnames";
import { Image } from "@unpic/qwik";

interface ButtonProps {
  background?: string;
  onClick?: QRL<() => void | any>;
  w?: string;
  h?: string;
  disabled?: boolean;
  buttonClass?: string;
  simpleButton?: boolean;
  imgPath?: string;
  svgString?: string;
  text?: string;
  size?: "lg" | "md" | "sm";
  alt?: string;
  imgWidth?: string;
  imgHeight?: string;
}

export const IconButton = component$(
  ({
    size = "lg",
    background = "#ff748c",
    onClick,
    w = "auto",
    h = "auto",
    imgHeight = "auto",
    imgWidth = "auto",
    disabled,
    buttonClass,
    simpleButton,
    imgPath,
    svgString,
    text,
    alt
  }: ButtonProps) => {
    const myOnClick = $(() => {
      onClick ? onClick() : null;
    });

    return (
      <>
        <button
          disabled={disabled}
          onClick$={myOnClick}
          class={cn(
            disabled
              ? "hover:bg-grey-400 cursor-not-allowed bg-gray-400"
              : `bg-[${background}] hover:bg-[#ff90e8]`,
            !simpleButton &&
            "hover:translate-x-[-0.25rem] hover:translate-y-[-0.25rem] hover:shadow-[0.25rem_0.25rem_black]",
            `${buttonClass} w-[${w}] h-[${h}] text-black gap-2 p-2 flex justify-center items-center active:translate-0 rounded-full border-[1px] border-solid border-black duration-200 active:shadow-none`
          )}
        >
          {text && <p>{text}</p>}
          {imgPath &&
            <div class={cn(size === "lg" ? "h-16 w-16" : size === "md" ? "h-10 w-10" : "h-5 w-5")}>
              <Image
                layout="fullWidth"
                width={imgWidth}
                height={imgHeight}
                src={imgPath}
                alt={alt ?? "default button image"}
              />
            </div>
          }
          {
            svgString && <figure class="w-6 h-6" dangerouslySetInnerHTML={svgString} />
          }
        </button>
      </>
    );
  }
);
