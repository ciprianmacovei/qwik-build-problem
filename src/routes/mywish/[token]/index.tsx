import { $, component$, useStore } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { useNavigate } from "@builder.io/qwik-city";
import { Button } from "~/style/buttons/button";
import { Modal } from "~/components/modal";
import { PublicWishCardContainer } from "~/containers/public-wish";


export default component$(() => {
  const navigation = useNavigate();
  const state = useStore({
    showModal: {
      value: true,
    },
  });

  const goSelectUser = $(async () => {
    await navigation("/login/");
  });

  const goAnonim = $(() => {
    state.showModal = {
      value: false,
    };
  });

  return (
    <>
      <section class="flex h-full w-full flex-col items-center justify-center">
        <PublicWishCardContainer />
      </section>
      <Modal title="Choice" showModal={state.showModal}>
        <section class="flex flex-col gap-10">
          <article>
            <p>What do u prefer?</p>
          </article>
        </section>
        <article
          class="flex flex-col items-center justify-center gap-4"
          q:slot="body"
        >
          <Button size="lg" text="Anonymouse" onClick={goAnonim} />
          <Button size="lg" text="User" onClick={goSelectUser} />
        </article>
      </Modal>
    </>
  );
});

export const head: DocumentHead = {
  title: "Welcome to Private Wishbox",
  meta: [
    {
      name: "description",
      content:
        "This is the main page where u can create your wishes and share with others.",
    },
  ],
};
