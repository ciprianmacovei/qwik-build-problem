import type { QRL } from "@builder.io/qwik";
import {
  component$,
  $,
} from "@builder.io/qwik";
import { Image } from "@unpic/qwik";

import { Modal } from "~/components/modal";
import { CommentWishBox } from "../wish-comment-box";
import { WishImage } from "~/components/image/wish";
import { SendWishComment } from "../wish-send-comment";

import ContributeImage from "/public/images/contribute.png?jsx"
import BuyImage from "/public/images/buy.png?jsx";

import cn from "classnames";
import type { Wish } from "~/models/wish";

interface WishCardDetailsProps {
  wish: Wish;
  sendWishComment: QRL<(wish: Wish, text: string) => void>;
  updateWishLove: QRL<(wish: Wish, love: boolean) => void>;
  takeWish: QRL<(wish: Wish) => void>;
  showModal: {
    value: boolean;
  };
}

export const WishPublicCardDetails = component$(
  ({ wish, showModal, updateWishLove, sendWishComment, takeWish }: WishCardDetailsProps) => {
    return (
      <Modal showModal={showModal} cardType={true} preventForcus={true}>
        <section class="flex h-full w-full flex-col items-center pb-4 pl-4 pr-4 overflow-y-scroll"
          q:slot="body"
        >
          <section class="flex h-full flex-col items-center w-full">
            <article class="flex h-full w-full flex-col items-center gap-2">
              {wish.wish_name &&
                <p class="self-center font-special text-[30px] max-h-[40px] max-w-[235px] overflow-hidden text-ellipsis">
                  {wish.wish_name}
                </p>
              }
              {Number.isFinite(wish.wish_price) &&
                wish.wish_price !== 0 && (
                  <section class="font-nuito my-5 flex items-center justify-between w-full">
                    <article>
                      <p class="text-lg font-bold leading-5">
                        {wish.wish_price}{" "}
                        <span class="text-green-700">$</span>
                      </p>
                    </article>
                    <article class="ml-auto flex gap-4">
                      <ContributeImage
                        class="cursor-pointer hover:scale-125"
                        style={{ width: "27.5px", height: "25px" }}
                      />
                      <BuyImage
                        class="cursor-pointer hover:scale-125"
                        style={{ width: "14px", height: "25px" }}
                        onClick$={$(() => takeWish(wish))}
                      />
                    </article>
                  </section>
                )}
              {wish.wish_pic_name &&
                <WishImage wishId={wish.id} />
              }
            </article>
            <article class="flex w-full items-center my-5">
              <p class="text-left font-nuito my-2 mb-auto max-h-[80px] overflow-hidden text-ellipsis text-lg font-bold">
                {wish.wish_description}
              </p>
            </article>
          </section>
          <section class="my-2 flex w-full">
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
          </section>
          <section class="flex w-full flex-col gap-2">
            {wish.wish_comments.map((comment, index) => (
              <div
                class={cn(
                  "mt-5 flex",
                  index % 2 === 0 ? "justify-start" : "justify-end"
                )}
                key={"comment_box" + comment.id + index}
              >
                <CommentWishBox comment={comment} index={index} />
              </div>
            ))}
          </section>
        </section>
        <section class="flex h-full w-full flex-col items-center justify-center"
          q:slot="footer">
          <section class="w-full">
            <SendWishComment
              sendWishComment={sendWishComment}
              wish={wish}
            />
          </section>
        </section>
      </Modal>
    );
  }
);
