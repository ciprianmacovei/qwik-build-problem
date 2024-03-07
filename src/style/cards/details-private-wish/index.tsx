import type { QRL } from "@builder.io/qwik";
import {
  component$,
  $,
} from "@builder.io/qwik";
import { Image } from "@unpic/qwik";

import cn from "classnames";
import { CommentWishBox } from "../wish-comment-box";
import { WishImage } from "~/components/image/wish";
import { SendWishComment } from "../wish-send-comment";

import { Modal } from "~/components/modal";
import { SwitchFormControl } from "~/components/form-controls/switch";
import type { Wish } from "~/models/wish";

interface WishCardDetailsProps {
  wish: Wish;
  deleteWish: QRL<(wish: Wish) => void>;
  editWish: QRL<(wish: Wish) => void>;
  updateWishLove: QRL<(wish: Wish, love: boolean) => void>;
  updateWishPublicStatus: QRL<(wish: Wish, state: boolean) => void>;
  sendWishComment: QRL<(wish: Wish, text: string) => void>;
  showModal: {
    value: boolean;
  };
}

export const WishPrivateCardDetails = component$(
  ({
    wish,
    showModal,
    deleteWish,
    editWish,
    updateWishLove,
    updateWishPublicStatus,
    sendWishComment,
  }: WishCardDetailsProps) => {

    const onCopyPrivateWishLink = $(async (wish: Wish) => {
      if (wish.wish_find_link) {
        await navigator.clipboard.writeText(wish.wish_find_link);
      }
    });

    return (
      <Modal showModal={showModal} cardType={true} preventForcus={true}>
        <section class="flex pl-3 pt-3 w-full gap-3 items-center" q:slot="header-left">
          <SwitchFormControl
            label={wish.wish_public ? "Private" : "Public"}
            id={"wish-public-details-switch" + wish.id}
            name={"wish-public-details-switch" + wish.id}
            hasNoValidation={true}
            value={Boolean(wish.wish_public)}
            onChangeEvent={$(() =>
              updateWishPublicStatus(wish, !wish.wish_public)
            )}
          />

        </section>
        {!wish.wish_name && <section
          class="flex items-center cursor-pointer duration-75 hover:scale-110 ml-auto"
          q:slot="header-right"
          onClick$={$(() => onCopyPrivateWishLink(wish))}
        >
          <Image
            src="/images/copylink.png"
            width={30}
            height={34}
            alt="copy link"
          />
        </section>}
        <section
          class="flex h-full w-full flex-col items-center overflow-y-scroll md:pt-0 pt-4"
          q:slot="body"
        >
          <section class="flex h-full w-full  flex-col items-center pl-4 pr-4 pb-4">
            <section class="flex h-full flex-col items-center w-full">
              <section class="flex h-full w-full flex-col items-center gap-2">
                {wish.wish_name &&
                  <article class="flex w-full">
                    <p class="font-special text-[30px] max-h-[40px] max-w-[235px] overflow-hidden text-ellipsis">
                      {wish.wish_name}
                    </p>
                    <div
                      onClick$={$(() => onCopyPrivateWishLink(wish))}
                      class="flex items-center cursor-pointer duration-75 hover:scale-110 ml-auto"
                    >
                      <Image
                        src="/images/copylink.png"
                        width={30}
                        height={34}
                        alt="copy link"
                      />
                    </div>
                  </article>
                }
                {wish.wish_pic_name &&
                  <WishImage wishId={wish.id} />
                }
              </section>
              <article class="flex w-full items-center my-5">
                <p class="text-left font-nuito my-2 mb-auto max-h-[80px] overflow-hidden text-ellipsis text-lg font-bold">
                  {wish.wish_description}
                </p>
              </article>
            </section>
            <section class="my-2 flex w-full">
              <div class="flex w-full items-center justify-between">
                {Number.isFinite(wish.wish_price) &&
                  wish.wish_price !== 0 && (
                    <div class="self-end">
                      <p class="text-lg font-bold leading-5">
                        {wish.wish_price}{" "}
                        <span class="text-green-700">$</span>
                      </p>
                    </div>
                  )}
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
                <div class="flex cursor-pointer items-center gap-1 text-sm duration-75 hover:scale-125">
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
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 448 512"
                  >
                    <path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z" />
                  </svg>
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
        </section>
        <section
          class="flex h-full w-full flex-col items-center justify-center"
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
