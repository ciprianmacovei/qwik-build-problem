import {
  $,
  component$,
  Slot,
  useOn,
  useSignal,
  useStore,
  useStyles$,
  useTask$,
} from "@builder.io/qwik";
import { Image } from "@unpic/qwik";
import cn from "classnames";

import style from "./index.css?inline";

interface ModalProps {
  showModal: {
    value: boolean;
  };
  title?: string;
  cardType?: boolean;
  preventForcus?: boolean;
}

export const Modal = component$(({ title, showModal, cardType, preventForcus }: ModalProps) => {
  useStyles$(style);
  const dialogRef = useSignal<HTMLDialogElement>();
  const state = useStore({
    afterInit: false,
  });

  const closeModal = $(() => {
    dialogRef.value?.classList.add("hide")
    dialogRef.value?.addEventListener("animationend", () => {
      if (dialogRef.value?.classList.contains("hide")) {
        dialogRef.value.classList.remove("hide")
        dialogRef.value.close();
      }
    })
  });

  const openModal = $(() => {
    if (preventForcus) dialogRef.value!.inert = true;
    dialogRef.value!.showModal();
    if (preventForcus) dialogRef.value!.inert = false;
  });

  useOn(
    "keydown",
    $(async (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        if (dialogRef.value?.open) {
          await closeModal();
        }
      }
    })
  );

  useOn(
    "click",
    $(async (event: MouseEvent) => {
      if (dialogRef.value && dialogRef.value.open) {
        const rect = dialogRef.value.getBoundingClientRect();
        const isInDialog = (rect.top <= event.clientY && event.clientY <= rect.top + rect.height &&
          rect.left <= event.clientX && event.clientX <= rect.left + rect.width);
        if (!isInDialog) {
          await closeModal();
        }
      }
    })
  );

  useTask$(async ({ track }) => {
    track(() => showModal);
    if (!dialogRef.value) return;
    if (state.afterInit || showModal.value === true) {
      if (showModal.value) {
        await openModal()
      } else {
        await closeModal();
      }
    }
    state.afterInit = true;
  });

  return (
    <dialog
      class={cn(
        "items-center gap-2 rounded-[25px] border-[2px] border-solid border-black bg-white md:w-[400px] shadow-[0.25rem_0.25rem_black]",
        !cardType && "p-5"
      )}
      ref={dialogRef}
    >
      <article class={cn("flex w-full items-center justify-between", !cardType && "mb-2")}>
        <div class={cn(!cardType && "w-[30%]")}>
          <Slot name="header-left" />
        </div>
        <div class={cn("w-[30%] gap-3 flex items-center", cardType && "pt-3 pr-3")}>
          <Slot name="header-right" />
          <Image
            class="ml-auto h-[26px] w-[26px] cursor-pointer duration-100 hover:scale-125"
            onClick$={closeModal}
            layout="fixed"
            width={26}
            height={26}
            src="/images/closemodal.png"
            alt="close"
          />
        </div>
      </article>
      <article class="flex w-full items-center justify-center text-[20px] font-bold max-h-[100px] overflow-y-auto">
        {title}
      </article>
      <Slot name="body" />
      <Slot name="footer" />
    </dialog>

  );
});
