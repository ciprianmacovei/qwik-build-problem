import type { QRL } from "@builder.io/qwik";
import { component$, $ } from "@builder.io/qwik";
import { UserPublicImage } from "~/components/image/user/public";
import { Image } from "@unpic/qwik";
import { WishImage } from "~/components/image/wish";
import ContributeImage from "~/../public/images/contribute.png?jsx";
import BuyImage from "~/../public/images/buy.png?jsx";
import EthImage from "~/../public/images/ethlogo.png?jsx";
import TakeImage from "~/../public/images/taken.png?jsx";

import cn from "classnames";
import type { Wish } from "~/models/wish";

interface PublicWishCardProps {
  wish: Wish;
  updateWishLove: QRL<(wish: Wish, bool: boolean) => void>;
  onTakenWish: QRL<(wish: Wish) => void>;
  showWishDetails: QRL<(wish: Wish) => void>;
  viewUserProfile: QRL<(userName: string) => void>;
  onContributeWish: QRL<(wish: Wish) => Promise<void>>;
}

export const PublicWishCard = component$(
  ({
    wish,
    updateWishLove,
    onTakenWish,
    showWishDetails,
    viewUserProfile,
    onContributeWish,
  }: PublicWishCardProps) => {
    return (
      <section
        id={"wish-style-card" + wish.id}
        class={cn(
          "relative flex w-[363px] flex-col rounded-[20px] border-2 border-[#18181C] bg-[#FBF7F5] px-6 py-4 shadow-[0.25rem_0.25rem_black]",
          wish.wish_pic_name && "min-h-[430px]",
        )}
      >
        {wish.wish_taken_by_user && (
          <article
            onClick$={$(() => viewUserProfile(wish.wish_taken_by_user!))}
            class="absolute right-0 top-0 cursor-pointer duration-75 hover:scale-110"
          >
            <TakeImage
              style={{ width: "50px", height: "auto" }}
              alt="wish was taken"
            />
          </article>
        )}
        <section class="flex h-full w-full flex-col items-start justify-center gap-2">
          <article class="flex flex-col">
            <UserPublicImage userName={wish.user_name} userType={wish.user_type} />
          </article>
          {wish.wish_name &&
            <article>
              <p class="max-h-[35px] max-w-[235px] overflow-hidden text-ellipsis text-2xl font-bold">
                {wish.wish_name}
              </p>
            </article>
          }
        </section>
        {Number.isFinite(wish.wish_price) && wish.wish_price !== 0 && (
          <section class="my-5 flex items-center">
            <article class="flex items-center gap-2">
              <p class="gap-1 text-lg font-bold leading-5">
                {wish.wish_contribution !== 0 && (
                  <span>
                    {wish.wish_contribution}
                    <span class="text-green-700">$</span> out of{" "}
                  </span>
                )}
                <span>
                  {wish.wish_price}
                  <span class="text-green-700">$</span>
                </span>
              </p>
              {(wish.crypto_symbol === "ETH" ||
                wish.crypto_symbol === "SEP") && (
                  <EthImage style={{ width: "15px", height: "15px" }} />
                )}
            </article>
            {!wish.wish_taken_by_user &&
              <article class="ml-auto flex gap-4">
                <ContributeImage
                  class="cursor-pointer hover:scale-125"
                  style={{ width: "27.5px", height: "25px" }}
                  onClick$={$(() => onContributeWish(wish))}
                />
                {wish.wish_contribution === 0 && (
                  <BuyImage
                    class="cursor-pointer hover:scale-125"
                    style={{ width: "14px", height: "25px" }}
                    onClick$={$(() => onTakenWish(wish))}
                  />
                )}
              </article>
            }
          </section>
        )}
        {wish.wish_contribution !== 0 && (
          <article class="mb-2">
            <progress
              class="progress progress-success w-full h-5"
              value={(wish.wish_contribution / wish.wish_price!) * 100}
              max="100"
            ></progress>
          </article>
        )}
        {wish.wish_pic_name &&
          <article class="w-full h-full flex flex-1 justify-center items-center mt-3">
            <WishImage wishId={wish.id} />
          </article>
        }
        <article class="flex h-full flex-col items-start justify-center my-5">
          <p class="font-nuito max-h-[80px] overflow-hidden text-ellipsis text-lg font-bold">
            {wish.wish_description}
          </p>
        </article>
        <article class="mt-auto flex items-center">
          <div class="flex w-full items-center justify-between">
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
              {wish.wish_comments.length > 0 && (
                <span
                  class={cn(
                    "flex h-[14px] min-w-[14px] items-center justify-center text-[14px] font-bold"
                  )}
                >
                  {wish.wish_comments.length}
                </span>
              )}
              <Image
                src="/images/messagewish.png"
                width={26}
                height={22}
                layout="fixed"
                alt="wish comment box"
              />
            </div>
          </div>
        </article>
      </section>
    );
  }
);
