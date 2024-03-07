export class NotificationsServerServiceReq {
  private static url: string = "http://backend:8000/api/notif";

  static async seeNotifications(token: string, ids: number[]): Promise<any> {
    const bodyData = {
      notifications_id: ids,
    }
    const res = await fetch(this.url + `/seen`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(bodyData)
    });
    if (res.ok) {
      const resData = await res.json();
      return resData;
    } else {
      throw new Error("seeNotifications request failed");
    }
  }

  static async getNotifications(
    token: string,
    page: number,
    perPage: number
  ): Promise<any> {
    const res = await fetch(this.url + `/${page}/${perPage}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (res.ok) {
      const resData = await res.json();
      return resData;
    } else {
      throw new Error("getNotifications request failed");
    }
  }

  static async getUnseenNotificationsNumber(
    token: string,
  ): Promise<any> {
    const res = await fetch(this.url + `/unseen/number`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (res.ok) {
      const resData = await res.json();
      return resData;
    } else {
      throw new Error("getUnseenNotificationsNumber request failed");
    }
  }
}
