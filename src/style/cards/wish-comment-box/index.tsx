import { component$ } from "@builder.io/qwik";
import { UserPublicImage } from "~/components/image/user/public";

import cn from "classnames";
import type { WishComments } from "~/models/wish";

interface WishComentProps {
  comment: WishComments;
  index: number;
}

export const CommentWishBox = component$(
  ({ comment, index }: WishComentProps) => {
    return (
      <>
        <section class={cn("chat font-nuito", index % 2 === 0 ? "chat-start" : "chat-end")}>
          <div class="chat-image">
            <div class="w-10 rounded-full">
              <UserPublicImage
                userName={comment.user_name}
                userType={comment.user_type}
                notDisplayName={true}
              />
            </div>
          </div>
          <div class="chat-header">
            {comment.user_name}
          </div>
          <div class="chat-bubble max-w-full">
            {comment.comment_text}
          </div>
          <div class="chat-footer opacity-50">
            <time class="text-xs opacity-50">{comment.comment_date}</time>
          </div>
        </section>
      </>
    );
  }
);
