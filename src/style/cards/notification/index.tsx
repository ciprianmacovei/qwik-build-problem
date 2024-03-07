import { component$ } from "@builder.io/qwik";
import { Image } from "@unpic/qwik";

import cn from "classnames";
import type { Notifications } from "~/services/notif.service";

interface NotificationCardProps {
  notification: Notifications
}

export const NotificationCard = component$(
  ({ notification }: NotificationCardProps) => {
    return (
      <section
        class={cn(
          "flex flex-col gap-2 rounded-lg p-2 shadow-[0.25rem_0.25rem_black] w-full",
          notification.seen ? "bg-pink-300" : "bg-[#F9A11D]"
        )}
      >
        <section class="flex items-center">
          <p class="text-2xl font-bold">{notification.created_at}</p>
          <Image
            class="ml-auto"
            src="/images/close.png"
            alt="close notification"
            layout="constrained"
            width={20}
            height={20}
          />
        </section>
        <article class="rounded-lg bg-white p-2">
          <div class="font-nuito notif-no-action flex flex-col gap-2 text-black">
            <p>{notification.content}</p>
          </div>
        </article>
      </section>
    );
  }
);
