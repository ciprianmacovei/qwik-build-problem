import { component$ } from "@builder.io/qwik";
import Logo from "../../../public/images/logo.png?jsx";
interface BannerProps {
  name: string;
}

export const Banner = component$(({ name }: BannerProps) => {
  return (
    <section class="w-full my-5 bg-secondary-400">
      <article class="flex w-full items-center ml-10">
        <Logo style={{ width: "40px", height: "auto" }} alt="wishbox logo" />
        <span class="text-xl mr-2">-</span>
        <p class="text-xl">{name}</p>
      </article>
    </section>
  );
});
