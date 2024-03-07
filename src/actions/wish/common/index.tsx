import type { QRL, Signal } from "@builder.io/qwik";
import { $, useContext } from "@builder.io/qwik";
import { WishServiceContext } from "~/services/wish.service";
import { UserServiceContext } from "~/services/user.service";
import type { Wish } from "~/models/wish";

interface UseBaseWishActionReturnType {
  loveWishAction: QRL<
    (wish: Wish, data: Signal<Wish[]>, love: boolean) => void
  >;
  wishCommentAction: QRL<
    (wish: Wish, data: Signal<Wish[]>, text: string) => void
  >;
}

export const useCommonWishActions = (): UseBaseWishActionReturnType => {
  const userService = useContext(UserServiceContext);
  const wishService = useContext(WishServiceContext);

  const loveWishAction = $(
    async (wish: Wish, data: Signal<Wish[]>, love: boolean) => {
      try {
        data.value = data.value.map((dataWish: Wish) => {
          if (dataWish.id === wish.id) {
            return {
              ...dataWish,
              wish_likes: love
                ? dataWish.wish_likes + 1
                : dataWish.wish_likes - 1,
              liked: love,
            };
          }
          return dataWish;
        });
        await wishService.updateWishLoves(wish.id, love);
      } catch (_) {
        data.value = data.value.map((dataWish: Wish) => {
          if (dataWish.id === wish.id) {
            return {
              ...dataWish,
              wish_likes: love
                ? dataWish.wish_likes - 1
                : dataWish.wish_likes + 1,
              liked: !love,
            };
          }
          return dataWish;
        });
      }
    }
  );

  const wishCommentAction = $(
    async (wish: Wish, data: Signal<Wish[]>, text: string) => {
      try {
        data.value = data.value.map((dataWish: Wish) => {
          if (dataWish.id === wish.id) {
            const wish_comment_id: number | undefined =
              dataWish.wish_comments[dataWish.wish_comments.length - 1]?.id;
            return {
              ...dataWish,
              wish_comments: [
                ...dataWish.wish_comments,
                {
                  id: wish_comment_id ? wish_comment_id + 1 : 0,
                  comment_text: text,
                  user_name: userService.state.user.user_name!,
                  user_type: userService.state.user.user_type!,
                  comment_date: new Date().toLocaleDateString(),
                  likes: 0,
                  user_id: dataWish.user_id,
                  wish_id: dataWish.id,
                },
              ],
            };
          }
          return dataWish;
        });
        await wishService.sendWishComment(wish.id, text);
      } catch (_) {
        data.value = data.value.map((dataWish: Wish) => {
          if (dataWish.id === wish.id) {
            dataWish.wish_comments.pop();
            return {
              ...dataWish,
            };
          }
          return dataWish;
        });
      }
    }
  );

  return {
    loveWishAction,
    wishCommentAction,
  };
};
