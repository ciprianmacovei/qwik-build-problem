import { component$, useContext, useTask$ } from "@builder.io/qwik";
import { NotificationsContainer } from "~/containers/notifications";
import { NotificationServiceContext } from "~/services/notif.service";
import { Banner } from "~/style/baner";

export default component$(() => {
  const notificationsService = useContext(NotificationServiceContext);

  useTask$(async () => {
    await notificationsService.clearNotificationNavBarSpecificSection("notifications");
  });

  return (
    <section class="flex flex-col items-center justify-start gap-5">
      <Banner name="Notifications" />
      <section class="flex flex-col w-full items-center justify-center gap-3 px-10">
        <NotificationsContainer />
      </section>
    </section>
  );
});
