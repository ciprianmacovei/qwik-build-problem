import type { QRL } from "@builder.io/qwik";
import { component$, $ } from "@builder.io/qwik";

import cn from "classnames";
import type { Wishbox } from "~/models/wishbox";

interface WishBoxStyleProps {
  selectMode: boolean;
  wishbox: Wishbox;
  selectWishBoxAction: QRL<(index: number, wishbox: Wishbox, refresh: boolean) => void>;
  deleteWishbox: QRL<(wishbox_id: number, wishbox_name: string) => void>;
  wishBoxSelectedIndex: number;
  index: number;
  key: string;
}

export const WishBoxStyle = component$(
  ({
    selectMode,
    wishbox,
    selectWishBoxAction,
    deleteWishbox,
    wishBoxSelectedIndex,
    index,
    key,
  }: WishBoxStyleProps) => {
    return (
      <li
        key={key}
        onClick$={$(() => selectWishBoxAction(index, wishbox, true))}
        class={cn("inline-flex border-2 border-solid border-black cursor-pointer items-center justify-center rounded-full bg-secondary-400 px-2.5 py-0.5 text-black hover:translate-x-[-0.25rem] hover:translate-y-[-0.25rem] hover:shadow-[0.25rem_0.25rem_black]",
          index === wishBoxSelectedIndex && "!bg-yellow-400",
          index > 0 && selectMode && "bg-gray-600 text-white")}
      >
        <p class="whitespace-nowrap text-sm">{wishbox.wishbox_name}</p>

        {wishbox.wishbox_name !== "all" &&
          <button
            onClick$={$(() =>
              deleteWishbox(wishbox.id, wishbox.wishbox_name)
            )}
            class="-me-1 ms-1.5 inline-block rounded-full bg-black p-0.5 text-primary-400 transition hover:bg-purple-300"
          >
            <span class="sr-only">Remove badge</span>

            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="h-3 w-3"
            >
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        }
      </li>


    );
  }
);
