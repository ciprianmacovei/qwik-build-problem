import {
  component$,
  useContext,
  useTask$,
  useSignal,
} from "@builder.io/qwik";
import type { Notifications } from "~/services/notif.service";
import { NotificationServiceContext } from "~/services/notif.service";
import { useInfiniteScroll } from "~/hooks/infinite-scroll";
import { NotificationCard } from "~/style/cards/notification";


export const NotificationsContainer = component$(() => {
  const notificationService = useContext(NotificationServiceContext);
  const data = useSignal<Notifications[]>([]);
  const unseenNotificationsIds = useSignal<number[]>([]);
  const pageState = useInfiniteScroll({
    page: 1,
    perPage: 10,
    data: data,
  });

  useTask$(async ({ track }) => {
    track(() => pageState.page)
    try {
      const resData = await notificationService.getNotifications(pageState.page, pageState.perPage);
      if (resData.data.length > 0) {
        data.value = [...data.value, ...resData.data];
      }
      unseenNotificationsIds.value = data.value
        .filter((x: Notifications) => !x.seen)
        .map((x: Notifications) => x.id);
    } catch (err) {
      console.log("wishbox Error ", err);
    }
  });

  useTask$(async ({ track }) => {
    track(() => unseenNotificationsIds.value);
    if (unseenNotificationsIds.value.length) {
      await notificationService.seeNotifications(unseenNotificationsIds.value)
    }
  })

  return (
    <ul class="my-[10vh] flex w-full flex-col gap-3">
      {data.value.map(
        (notification: Notifications) => (
          <li key={"notification" + notification.id}>
            <NotificationCard
              notification={notification}
            />
          </li>
        )
      )}
    </ul>
  );
});
