import { component$, useContext, $ } from "@builder.io/qwik";
import type { DocumentHead, StaticGenerateHandler } from "@builder.io/qwik-city";
import { useNavigate } from "@builder.io/qwik-city";
import { Button } from "~/style/buttons/button";
import { UserServiceContext } from "~/services/user.service";
import FirstWishImage from "~/../public/images/rightpicturelanding.webp?jsx";
import SecondWishImage from "~/../public/images/leftpicturelanding.webp?jsx";
import ThirdWishImage from "~/../public/images/rightpicturelanding.webp?jsx";
import QuestionMarkImage from "~/../public/images/question.png?jsx";

export default component$(() => {
  const userService = useContext(UserServiceContext);
  const navigation = useNavigate();

  const createWishbox = $(async () => {
    if (userService.state.user.isLoggedIn) {
      await navigation("/profile/");
    } else {
      await navigation("/login/");
    }
  });

  return (
    <section class="mt-[20vh] flex flex-col max-sm:gap-5 max-sm:px-2">
      <section class="bg-[url('/images/landingpage.webp')] flex bg-cover max-sm:flex-col">
        <section class="flex w-1/2 items-center justify-center max-sm:w-full">
          <article class="flex w-8/12 flex-col gap-[30px]">
            <h1 class="text-[40px]">
              Wish. Click. Smile.
            </h1>
            <p class="lending-4 font-nuito text-[14px]">
              Create a wishlist and share it with your friends and family or
              people around the world, so they can see what items would be
              useful to you.
            </p>
            <Button text="Create your first wish >>" onClick={createWishbox} />
          </article>
        </section>
        <section class="flex w-1/2 justify-center max-sm:w-full">
          <article class="w-8/12 max-sm:w-full max-sm:p-12">
            <FirstWishImage
              style={{ width: "100%", height: "auto" }}
              alt="wishbox love and carring"
            />
          </article>
        </section>
      </section>

      <section class="flex bg-primary-400">
        <article class="flex flex-col justify-center p-20">
          <article class="flex max-sm:flex-col">
            <article class="flex w-1/2 max-sm:w-full flex-col items-center justify-center">
              <article class="flex w-8/12 max-sm:w-full items-center gap-1">
                <QuestionMarkImage
                  style={{ width: "40px", height: "40px" }}
                  alt="question"
                />
                <h1 class="text-[31px]">Why we created Wishblaze?</h1>
              </article>
              <p class="font-nuito w-8/12 max-sm:w-full">
                WishBox a luat nastere din nevoia de a avea un loc unde sa putem
                adauga produse de care chiar avem nevoie. Multi dintre noi am
                experimentat situatia in care am primit prea multe căni de
                Crăciun, prea multe jucării pentru cei mici sau prea multa
                veselă la nuntă. Așa am realizat ca ar fi mult mai eficient daca
                ar exista o modalitate de a spune oamenilor exact ce ne dorim,
                astfel incat sa primim cadouri care sa ne bucure cu adevarat.
              </p>
            </article>
            <article class="flex w-1/2 max-sm:w-full items-center justify-center">
              <p class="font-nuito w-8/12 max-sm:w-full">
                Acesta este motivul pentru care am creat WishBox. Aici, puteti
                crea o lista cu dorintele dvs. si o puteti partaja cu prietenii
                si familia, astfel incat sa poata vedea ce produse v-ar fi de
                folos si sa poata alege un cadou care sa fie exact ce trebuie.
                Indiferent de ocazie, WishBox va poate ajuta sa primiti cadoul
                perfect.
              </p>
            </article>
          </article>
        </article>
      </section>

      <section class="flex max-sm:flex-col items-center justify-center p-20 max-sm:p-12">
        <article class="flex w-1/2 max-sm:w-full items-center justify-center gap-1">
          <div class="w-8/12 max-sm:w-full">
            <SecondWishImage
              style={{ width: "100%", height: "auto" }}
              alt="wishbox love and carring"
            />
          </div>
        </article>
        <article class="flex w-1/2 max-sm:w-full flex-col">
          <article class="flex w-8/12 max-sm:w-full flex-col gap-2">
            <h1 class="text-[31px]">
              Crează prima ta lista de dorințe in doar cateva minute
            </h1>
            <p class="font-nuito">
              Vrei sa primesti cadouri care sa iti placa si sa fie de folos?
              Atunci, creaza-ti acum propria lista de dorinte cu ajutorul
              aplicatiei noastre! In doar cateva minute, iti poti crea un cont
              cu ajutorul adresei tale de email, denumi lista si adauga
              produsele de care ai nevoie. Procesul este foarte simplu, dupa ce
              ai creat lista, copiaza linkul cu ajutorul butonului dedicat si
              trimite-l mai departe catre prietenii si familia ta. Astfel, cand
              cineva va bifa un cadou de pe lista ta, vei primi o notificare pe
              email. Nu mai pierde timpul si energia cu cadouri inutile,
              creaza-ti acum lista ta de dorinte si incearca sa primesti cadoul
              perfect cu ajutorul aplicatiei noastre!
            </p>
            <Button
              text="Crează lista ta de dorinte >>"
              onClick={createWishbox}
            />
          </article>
        </article>
      </section>

      <section class="flex w-full bg-primary-400">
        <article class="flex w-full flex-col justify-center p-20">
          <article class="flex items-center justify-center">
            <p class="text-[31px]">Testimoniale de la userii nostri</p>
          </article>
          <section class="mt-4 flex max-sm:flex-col items-center justify-center gap-10">
            <article class="h-[260px] w-[300px]">
              <div class="flex flex-col items-center gap-1">
                <p class="font-nuito text-center">
                  “A testimonial describing what the person thinks about this
                  service, product or startup in general.”
                </p>
                <div class="h-[100px] w-[100px] rounded-full bg-black"></div>
                <div class="font-nuito">Name</div>
                <div class="font-nuito">Description</div>
              </div>
            </article>
            <article class="h-[260px] w-[300px]">
              <div class="gap-s flex flex-col items-center">
                <p class="font-nuito text-center">
                  “A testimonial describing what the person thinks about this
                  service, product or startup in general.”
                </p>
                <div class="h-[100px] w-[100px] rounded-full bg-black"></div>
                <div class="font-nuito">Name</div>
                <div class="font-nuito">Description</div>
              </div>
            </article>
            <article class="h-[260px] w-[300px]">
              <div class="gap-s flex flex-col items-center">
                <p class="font-nuito text-center">
                  “A testimonial describing what the person thinks about this
                  service, product or startup in general.”
                </p>
                <div class="h-[100px] w-[100px] rounded-full bg-black"></div>
                <div class="font-nuito">Name</div>
                <div class="font-nuito">Description</div>
              </div>
            </article>
          </section>
        </article>
      </section>

      <section class="flex max-sm:flex-col items-center justify-center p-20 max-sm:p-12">
        <article class="flex w-8/12 max-sm:w-full flex-col items-center">
          <article class="flex w-8/12 max-sm:w-full flex-col justify-center">
            <h1 class="text-center text-[48px]">
              Vine ziua ta? Pregateste-ti lista de dorinte cu Wishbox!
            </h1>
            <Button text="Create your wishbox >>" onClick={createWishbox} />
          </article>
        </article>
        <article class="flex w-4/12 max-sm:w-full items-center justify-center gap-1">
          <div class="w-8/12 max-sm:w-full">
            <ThirdWishImage
              style={{ width: "100%", height: "auto" }}
              alt="wishbox love and carring"
            />
          </div>
        </article>
      </section>
    </section>
  );
});

export const onStaticGenerate: StaticGenerateHandler = async () => {
  return {
    params: [{ id: "/" }]
  };
};

export const head: DocumentHead = {
  title: "Welcome to WishBox",
  meta: [
    {
      name: "description",
      content: "Wishbox is a simple website that brings your wishes to life",
    },
  ],
};
