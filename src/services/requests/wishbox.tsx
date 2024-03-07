export default class WishboxServerServiceReq {
  private static backendUrl: string = "http://backend:8000/api/wishbox";

  static async createWishbox(
    token: string,
    wishboxName: string,
    wishesIds: number[]
  ): Promise<any> {
    const res = await fetch(this.backendUrl + "/create", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        wishbox_name: wishboxName,
        wishes_ids: wishesIds,
      }),
    });
    if (res.ok) {
      const resData = await res.json();
      return resData;
    } else {
      throw new Error("createWishbox request failed");
    }
  }

  static async deleteWishbox(token: string, wishbox_id: number, wishbox_name: string): Promise<any> {
    const res = await fetch(this.backendUrl + "/delete", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        wishbox_id,
        wishbox_name,
      })
    });
    if (res.ok) {
      const resData = await res.json();
      return resData;
    } else {
      throw new Error("deleteWishbox request failed");
    }
  }

  static async getWishboxes(token: string): Promise<any> {
    const res = await fetch(this.backendUrl + "/", {
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
      throw new Error("getWishboxes request failed");
    }
  }
}
