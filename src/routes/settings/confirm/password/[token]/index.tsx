import { component$, $ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { routeLoader$, useNavigate } from "@builder.io/qwik-city";
import { Button } from "~/style/buttons/button";

import ImgRightsidelastsection from "~/../public/images/rightpicturelanding.webp?jsx";
export const usePasswordConfirm = routeLoader$(async (requestEvent) => {
  // This code runs only on the server, after every navigation
  try {
    const res = await fetch(
      `http://backend:8000/api/user/change/password/${requestEvent.params.token}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const resData = await res.json();
    return resData;
  } catch (e) {
    console.log(e);
  }
});

export default component$(() => {
  const navigation = useNavigate();
  const passwordConfirmSignal = usePasswordConfirm();

  const moveToLogin = $(async () => {
    await navigation("/login/");
  });

  return (
    <>
      {passwordConfirmSignal.value.status === 200 && (
        <section class="flex h-[100vh] w-[100vw] flex-col items-center justify-center bg-[url('/images/landingpage.webp')] bg-cover">
          <article class="flex h-1/3 w-1/3 flex-col items-center justify-center">
            <p class="text-[31px]">Password changed successfully</p>
            <ImgRightsidelastsection alt="register success" />
            <Button text="Login to you account" onClick={moveToLogin} />
          </article>
        </section>
      )}
      {passwordConfirmSignal.value.status === 400 && (
        <section class="flex h-[100vh] w-[100vw] flex-col items-center justify-center bg-[url('/images/landingpage.webp')] bg-cover">
          <article class="flex h-1/3 w-1/3 flex-col items-center justify-center">
            <p class="text-[31px]">Error</p>
            <ImgRightsidelastsection alt="register error" />
            <p class="text-[20px]">
              Please refresh the page, and if that doesn't help, please contact
              us.
            </p>
            <a
              class="text-blue-400 underline"
              href="mailto:macoveiciprian91@gmail.com"
              target="_blank"
            >
              Trimite un email
            </a>
          </article>
        </section>
      )}
    </>
  );
});

export const head: DocumentHead = {
  title: "Welcome to Wisher Confirm Registration",
  meta: [
    {
      name: "description",
      content: "This page is used for users to confirm their registration",
    },
  ],
};
