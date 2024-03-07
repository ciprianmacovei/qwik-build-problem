import type { QRL } from "@builder.io/qwik";
import {
  createContextId,
  $,
  useContextProvider,
  useStore,
} from "@builder.io/qwik";
import { server$ } from "@builder.io/qwik-city";
import { NotificationsServerServiceReq } from "./requests/notifications";
import { useAlerts } from "~/hooks/alerts";

export type SectionType = "profile" | "settings" | "notifications";

interface NavbarNotification {
  section: SectionType;
  newlyCreated: boolean;
}

export type Notifications = {
  id: number;
  content: string;
  created_at: string;
  seen: boolean;
}

interface NotificationService {
  getNotifications: QRL<(page: number, perPage: number) => Promise<any> | undefined>;
  getUnseenNotificationsNumber: QRL<() => Promise<any>>;
  seeNotifications: QRL<(ids: number[]) => Promise<any>>;
  setNotificationNavBarArray: QRL<(notificationsArray: NavbarNotification[]) => void>;
  clearNotificationNavBarSpecificSection: QRL<(section: SectionType) => void>;
  clearAllNotificationNavBar: QRL<() => void>;
  getNotificationNavBarSpecificSection: QRL<(section: SectionType) => NavbarNotification[]>;
  state: NotificationServiceState;
}

interface NotificationServiceState {
  navBarNotificationsArray: NavbarNotification[];
}

export const NotificationServiceContext = createContextId<NotificationService>(
  "notif-service-context"
);

export const useNotificationService = () => {
  const state = useStore<NotificationServiceState>({
    navBarNotificationsArray: [],
  });
  const { errorAlert } = useAlerts();

  const getNotifications = $((page: number, perPage: number) => {
    try {
      return server$(async function (page, perPage) {
        try {
          const cookie: { token: string } | undefined = this.cookie
            .get("user")
            ?.json<{ token: string }>();
          if (cookie?.token) {
            const resData = await NotificationsServerServiceReq.getNotifications(
              cookie.token,
              page,
              perPage
            );
            return resData;
          } else {
            throw new Error("User is not logged in.");
          }
        } catch (err: unknown) {
          if (err) {
            throw new Error(err.toString());
          }
          console.log("Error getNotifications", err);
        }
      })(page, perPage);
    } catch (err) {
      errorAlert(
        "Getting public wishes failed!",
        "Please try again or contact support."
      );
    }
  })

  const getUnseenNotificationsNumber = $(() => {
    try {
      return server$(async function () {
        try {
          const cookie: { token: string } | undefined = this.cookie
            .get("user")
            ?.json<{ token: string }>();
          if (cookie?.token) {
            const resData = await NotificationsServerServiceReq.getUnseenNotificationsNumber(
              cookie.token,
            );
            return resData;
          } else {
            throw new Error("User is not logged in.");
          }
        } catch (err: unknown) {
          if (err) {
            throw new Error(err.toString());
          }
          console.log("Error getNotifications", err);
        }
      })();
    } catch (err) {
      errorAlert(
        "Getting unseen notifications!",
        "Please try again or contact support."
      );
    }
  })

  const seeNotifications = $((ids: number[]) => {
    try {
      return server$(async function (ids: number[]) {
        try {
          const cookie: { token: string } | undefined = this.cookie
            .get("user")
            ?.json<{ token: string }>();
          if (cookie?.token) {
            const resData = await NotificationsServerServiceReq.seeNotifications(
              cookie.token,
              ids
            );
            return resData;
          } else {
            throw new Error("User is not logged in.");
          }
        } catch (err: unknown) {
          if (err) {
            throw new Error(err.toString());
          }
          console.log("Error getNotifications", err);
        }
      })(ids);
    } catch (err) {
      errorAlert(
        "Seeing notifications faild!",
        "Please try again or contact support."
      );
    }
  })

  const setNotificationNavBarArray = $((notificationsArray: NavbarNotification[]) => {
    state.navBarNotificationsArray = [...state.navBarNotificationsArray, ...notificationsArray];
  });

  const getNotificationNavBarSpecificSection = $((section: SectionType) => {
    return state.navBarNotificationsArray.filter(
      (notif: NavbarNotification) => notif.section === section
    );
  });

  const clearNotificationNavBarSpecificSection = $((section: SectionType) => {
    state.navBarNotificationsArray = state.navBarNotificationsArray.filter(
      (notif: NavbarNotification) => notif.section !== section
    );
  });
  
  const clearAllNotificationNavBar = $(() => {
    state.navBarNotificationsArray = [];
  })

  const service = {
    getNotifications,
    getUnseenNotificationsNumber,
    seeNotifications,
    setNotificationNavBarArray,
    getNotificationNavBarSpecificSection,
    clearNotificationNavBarSpecificSection,
    clearAllNotificationNavBar,
    state,
  };
  useContextProvider(NotificationServiceContext, service);
};
