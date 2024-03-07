import type { QRL } from "@builder.io/qwik";
import { component$, useStore, $ } from "@builder.io/qwik";
import type { Wish } from "~/models/wish";
import { createPicker } from 'picmo';

import cn from "classnames";

interface SencWishCommentProps {
  wish: Wish | undefined;
  sendWishComment: QRL<(wish: Wish, text: string) => void>;
}

export const SendWishComment = component$(
  ({ wish, sendWishComment }: SencWishCommentProps) => {
    const state = useStore<any>({
      commentText: "",
      openEmojiPicker: false,
      picker: undefined,
    });

    const getComment = $(($event: any) => {
      state.commentText = $event.target.value;
    });

    const sendWishCommentFct = $((wish: Wish | undefined) => {
      if (state.commentText && wish) {
        sendWishComment(wish, state.commentText);
        state.commentText = "";
        state.openEmojiPicker = false;
      }
    });

    const openPicmo = $(() => {
      if (!state.picker) {
        const rootElement: HTMLElement | null = document.querySelector('#pickerContainer');
        if (rootElement) {
          state.picker = createPicker({
            rootElement,
            animate: true,
            showRecents: false,
            showCategoryTabs: true,
            showPreview: false,
            className: "h-60",
          });
          state.picker.addEventListener('emoji:select', (event: any) => {
            state.commentText = state.commentText + event.emoji;
          });
        }
      }
      state.openEmojiPicker = !state.openEmojiPicker;
    })

    return (
      <div class="relative w-full font-nuito rounded-b-lg bg-gray-50 dark:border-gray-600 dark:bg-gray-700">
        <div class="flex w-full items-center rounded-t-lg bg-white px-4 py-2 dark:bg-gray-800">
          <label for="comment" class="sr-only">
            Your comment
          </label>
          <div
            id="pickerContainer"
            class={cn(
              "absolute bottom-[67px] right-0 w-full flex",
              !state.openEmojiPicker && "hidden"
            )}
          ></div>
          <div
            class="cursor-pointer mr-2"
            onClick$={openPicmo}>
            😊
          </div>
          <textarea
            class="w-full resize-none outline-none border-0 bg-white px-0 text-sm text-gray-900 focus:ring-0 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400"
            onClick$={$(() => state.openEmojiPicker = false)}
            value={state.commentText}
            onChange$={getComment}
            id="comment"
            rows={1}
            placeholder="Write a comment..."
            required
          ></textarea>
          <button
            class="inline-flex items-center rounded-lg bg-blue-700 px-4 py-2.5 text-center text-xs font-medium text-white hover:bg-blue-800 focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-900 ml-2"
            onClick$={$(() => sendWishCommentFct(wish))}
          >
            Send
          </button>
        </div>
      </div>
    );
  }
);
