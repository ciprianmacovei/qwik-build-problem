import { component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { SearchComponent } from "~/components/search";
import { PublicWishCardContainer } from "~/containers/public-wish";
import { Banner } from "~/style/baner";

export default component$(() => {
  return (
    <section class="flex w-full flex-col items-center gap-[5rem]">
      <Banner name="Explore" />
      <SearchComponent/>
      <PublicWishCardContainer />
    </section>
  );
});

export const head: DocumentHead = {
  title: "Wishbox explore page",
  meta: [
    {
      name: "description",
      content:
        "On this page u can interact with others wishes, comment, rize stars, interact or get ur wish come true.",
    },
  ],
};