import type { QRL } from "@builder.io/qwik";
import { component$, $, useStyles$ } from "@builder.io/qwik";
import { SwitchFormControl } from "~/components/form-controls/switch";
import { Image } from "@unpic/qwik";
import { WishImage } from "~/components/image/wish";

import cn from "classnames";

import TakeImage from "~/../public/images/taken.png?jsx";
import EthImage from "~/../public/images/ethlogo.png?jsx";
import type { Wish } from "~/models/wish";

import styles from "./index.css?inline";

interface PrivateWishCardProps {
  wish: Wish;
  viewUserProfile: QRL<(userName: string) => void>;
  updateWishLove: QRL<(wish: Wish, bool: boolean) => void>;
  editWish: QRL<(wish: Wish) => void>;
  deleteWish: QRL<(wish: Wish) => void>;
  updateWishPublicStatus: QRL<(wish: Wish, bool: boolean) => void>;
  onCopyPrivateWishLink: QRL<(wish: Wish) => void>;
  showWishDetails: QRL<(wish: Wish) => void>;
  selectMode: boolean;
  selectedWishesIdsArrays: number[];
}

export const PrivateWishCard = component$(
  ({
    wish,
    viewUserProfile,
    updateWishLove,
    editWish,
    deleteWish,
    updateWishPublicStatus,
    onCopyPrivateWishLink,
    showWishDetails,
    selectMode,
    selectedWishesIdsArrays,
  }: PrivateWishCardProps) => {
    useStyles$(styles)
    return (
      <section
        id={"wish-style-card" + wish.id}
        class={cn(
          "card",
        )}
      >
        {!!wish.wish_public &&
          <>
            <div class="multi-button">
              <button>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  xml:space="preserve"
                >
                  <path d="m13.511 5.853 4.005-4.117 2.325 2.381-4.201 4.005h5.909v3.305h-5.937l4.229 4.108-2.325 2.334-5.741-5.769-5.741 5.769-2.325-2.325 4.229-4.108H2V8.122h5.909L3.708 4.117l2.325-2.381 4.005 4.117V0h3.473v5.853zM10.038 16.16h3.473v7.842h-3.473V16.16z"></path>
                </svg>
              </button>
              <button>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                  <path d="M47.6 300.4L228.3 469.1c7.5 7 17.4 10.9 27.7 10.9s20.2-3.9 27.7-10.9L464.4 300.4c30.4-28.3 47.6-68 47.6-109.5v-5.8c0-69.9-50.5-129.5-119.4-141C347 36.5 300.6 51.4 268 84L256 96 244 84c-32.6-32.6-79-47.5-124.6-39.9C50.5 55.6 0 115.2 0 185.1v5.8c0 41.5 17.2 81.2 47.6 109.5z" />
                </svg>
              </button>
              <button>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                  <path d="M352 224c53 0 96-43 96-96s-43-96-96-96s-96 43-96 96c0 4 .2 8 .7 11.9l-94.1 47C145.4 170.2 121.9 160 96 160c-53 0-96 43-96 96s43 96 96 96c25.9 0 49.4-10.2 66.6-26.9l94.1 47c-.5 3.9-.7 7.8-.7 11.9c0 53 43 96 96 96s96-43 96-96s-43-96-96-96c-25.9 0-49.4 10.2-66.6 26.9l-94.1-47c.5-3.9 .7-7.8 .7-11.9s-.2-8-.7-11.9l94.1-47C302.6 213.8 326.1 224 352 224z" />
                </svg>
              </button>
              <button>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                  <path d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512H418.3c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304H178.3z" />
                </svg>
              </button>
            </div>
            <div class="reaction-multi-button">
              <button></button>
              <button></button>
            </div>
          </>
        }
        <section
          class={cn(
            "flex relative w-[363px] flex-col rounded-[20px] border-2 border-[#18181C] bg-[#FBF7F5] px-6 py-4 shadow-[0.25rem_0.25rem_black]",
            wish.wish_pic_name && "min-h-[430px]",
            wish.new && "!border-4 !border-green-500",
            wish.edited && "!border-4 !border-yellow-500",
            selectMode && "cursor-pointer hover:scale-110 duration-75",
            selectedWishesIdsArrays.includes(wish.id) && "bg-primary-400"
          )}>
          {wish.wish_taken_by_user && (
            <article
              onClick$={$(() => viewUserProfile(wish.wish_taken_by_user!))}
              class="absolute left-0 -top-1 cursor-pointer duration-75 hover:scale-110"
            >
              <TakeImage
                style={{ width: "50px", height: "auto" }}
                alt="wish was taken"
              />
            </article>
          )}
          <article class="mb-3 flex w-full items-center gap-3">
            <SwitchFormControl
              label={wish.wish_public ? "Public" : "Private"}
              id={"wish-public-switch" + wish.id}
              name={"wish-public-switch" + wish.id}
              hasNoValidation={true}
              value={Boolean(wish.wish_public)}
              onChangeEvent={$(() =>
                updateWishPublicStatus(wish, !wish.wish_public)
              )}
            />
            {!wish.wish_name &&
              <article class="ml-auto">
                <div class="tooltip" data-tip="Copy private link so only the people who you want to see it can see it">
                  <div
                    onClick$={$(() => onCopyPrivateWishLink(wish))}
                    class="cursor-pointer duration-75 hover:scale-110"
                  >
                    <Image
                      src="/images/copylink.png"
                      width={30}
                      height={34}
                      alt="copy link"
                    />
                  </div>
                </div>
              </article>
            }
          </article>
          {wish.wish_name &&
            <section class="mb-2 flex h-full w-full items-center justify-start gap-2">
              <article class="flex flex-col">
                <p class="max-h-[35px] max-w-[235px] overflow-hidden text-ellipsis text-2xl font-bold">
                  {wish.wish_name}
                </p>
              </article>
              <article class="ml-auto">
                <div class="tooltip" data-tip="Copy private link so only the people who you want to see it can see it">
                  <div
                    onClick$={$(() => onCopyPrivateWishLink(wish))}
                    class="cursor-pointer duration-75 hover:scale-110"
                  >
                    <Image
                      src="/images/copylink.png"
                      width={30}
                      height={34}
                      alt="copy link"
                    />
                  </div>
                </div>
              </article>
            </section>
          }
          {
            Number.isFinite(wish.wish_price) &&
            wish.wish_price !== 0 &&
            !wish.wish_taken_by_user && (
              <>
                <section class="my-5 flex items-center">
                  <article class="flex items-center gap-2">
                    <p class="gap-1 text-lg font-bold leading-5">
                      <span>
                        {wish.wish_contribution}
                        <span class="text-green-700">$</span> out of{" "}
                        {wish.wish_price}
                      </span>
                    </p>
                    {(wish.crypto_symbol === "ETH" ||
                      wish.crypto_symbol === "SEP") && (
                        <EthImage style={{ width: "15px", height: "15px" }} />
                      )}
                  </article>
                </section>
                <article class="mb-2">
                  <progress
                    class="progress progress-success w-full h-5"
                    value={(wish.wish_contribution / wish.wish_price!) * 100}
                    max="100"
                  ></progress>
                </article>
              </>
            )
          }
          {wish.wish_pic_name &&
            <article class="w-full h-full flex flex-1 justify-center items-center">
              <WishImage wishId={wish.id} />
            </article>
          }
          <article class="flex h-full flex-col items-start justify-center my-5">
            <p class="font-nuito max-h-[80px] overflow-hidden text-ellipsis text-lg font-bold">
              {wish.wish_description}
            </p>
          </article>
          <section class="mt-auto flex items-center">
            <article class="flex w-full items-center justify-between">
              <div
                onClick$={$(() => updateWishLove(wish, !wish.liked))}
                class="flex cursor-pointer items-center gap-1 text-sm duration-75 hover:scale-125"
              >
                {wish.liked ? (
                  <Image
                    src="/images/liked.png"
                    width={26}
                    height={26}
                    layout="fixed"
                    alt="love wish"
                  />
                ) : (
                  <Image
                    src="/images/lovewish.png"
                    width={26}
                    height={26}
                    layout="fixed"
                    alt="love wish"
                  />
                )}
                {wish.wish_likes > 0 && (
                  <span
                    class={cn(
                      "flex h-[14px] min-w-[14px] items-center justify-center text-[14px] font-bold"
                    )}
                  >
                    {wish.wish_likes}
                  </span>
                )}
              </div>
              <div
                class="flex cursor-pointer items-center gap-1 text-sm duration-75 hover:scale-125"
                onClick$={$(() => showWishDetails(wish))}
              >
                <Image
                  src="/images/messagewish.png"
                  width={26}
                  height={22}
                  layout="fixed"
                  alt="wish comment box"
                />
                {wish.wish_comments.length > 0 && (
                  <span
                    class={cn(
                      "flex h-[14px] min-w-[14px] items-center justify-center text-[14px] font-bold"
                    )}
                  >
                    {wish.wish_comments.length}
                  </span>
                )}
              </div>
              <div
                onClick$={$(() => editWish(wish))}
                class="cursor-pointer duration-75 hover:scale-110"
              >
                <Image
                  src="/images/editwish.png"
                  layout="constrained"
                  alt="edit wish"
                  width={26}
                  height={26}
                />
              </div>
              <div
                onClick$={$(() => deleteWish(wish))}
                class="h-[20px] w-[18px] cursor-pointer duration-75 hover:scale-110"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                  <path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z" />
                </svg>
              </div>
            </article>
          </section>
        </section>
      </section>
    );
  }
);
