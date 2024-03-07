import { component$, $ } from "@builder.io/qwik";
import BigLogo from "../../../public/images/bigLogo.webp?jsx";
import { siTwitter, siFacebook, siInstagram } from "simple-icons"

export const Footer = component$(() => {
  return (
    <section class="w-full bg-gray-900 pt-2 pl-8 pr-8 flex flex-col justify-center items-center">
      <section class="flex w-full items-center justify-center gap-10 text-white">
        <BigLogo class="w-56 max-sm:w-40 h-auto max-sm:hidden" alt="big logo" />
        <article class="flex flex-col">
          <p class="font-nuito font-bold">Socials</p>
          <article class="flex gap-2 justify-center items-center">
            <figure
              class={"w-5 h-5 cursor-pointer hover:scale-105 duration-75 fill-white"}
              onClick$={$(() =>
                window.open("https://x.com/wish_blaze")
              )}
              dangerouslySetInnerHTML={siTwitter.svg}
            />
            <figure
              class={"w-5 h-5 cursor-pointer hover:scale-105 duration-75 fill-white"}
              onClick$={$(() =>
                window.open("https://instagram.com/wish_blaze")
              )}
              dangerouslySetInnerHTML={siInstagram.svg}
            />
            <figure
              class={"w-5 h-5 cursor-pointer hover:scale-105 duration-75 fill-white"}
              onClick$={$(() =>
                window.open("https://facebook.com/wish_blaze")
              )}
              dangerouslySetInnerHTML={siFacebook.svg}
            />
          </article>
        </article>
        <article class="flex flex-col items-start">
          <p class="font-nuito font-bold">Support</p>
          <a class="link" href="mailto:help@wishblaze.com">Send email</a>
        </article>
      </section>
      <p class="text-white text-xs font-nuito mt-6 mb-2">Created with ♥️ by WishBlaze</p>
    </section>
  );
});
