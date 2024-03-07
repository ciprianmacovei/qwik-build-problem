import type { CreateWishReqData } from "~/models/requests/wish";

export class WishServerServiceReq {
  private static url: string = "http://backend:8000/api/wish";
  private static guardUrl: string = "http://backend:8000/api/guard";
  static async getMyWishes(
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
      throw new Error("getMyWishes request failed");
    }
  }

  static async getPublicWishes(
    token: string,
    page: number,
    perPage: number
  ): Promise<any> {
    const res = await fetch(this.url + `/public/${page}/${perPage}`, {
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
      throw new Error("getPublicWishes request failed");
    }
  }

  static async getUserWishes(
    token: string,
    username: string,
    page: number,
    perPage: number
  ): Promise<any> {
    const res = await fetch(this.url + `/${username}/${page}/${perPage}`, {
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
      throw new Error("getUserWishes request failed");
    }
  }

  static async getUserPrivateWish(tokenParam: string): Promise<any> {
    const res = await fetch(this.url + "/" + tokenParam, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (res.ok) {
      const resData = await res.json();
      return resData;
    } else {
      throw new Error("getUserPrivateWish request failed");
    }
  }

  static async createWish(
    bodyData: CreateWishReqData,
    edit: boolean = false,
    token: string
  ): Promise<any> {
    const formData = new FormData();
    formData.append("wish_description", String(bodyData.wishDescription));
    if (bodyData.wishName) {
      formData.append("wish_name", String(bodyData.wishName));
    }
    if (bodyData.wishPhoto) {
      formData.append("wish_photo", bodyData.wishPhoto);
    }
    if (bodyData.wishPhotoName) {
      formData.append("wish_photo_name", bodyData.wishPhotoName);
    }
    if (bodyData.wishPhotoType) {
      formData.append("wish_photo_type", bodyData.wishPhotoType);
    }
    if (bodyData.wishEndDate) {
      formData.append("wish_end_date", bodyData.wishEndDate.toUTCString());
    }
    if (bodyData.wishPrice) {
      formData.append("wish_price", String(bodyData.wishPrice));
    }
    if (bodyData.wishId) {
      formData.append("wish_id", String(bodyData.wishId));
    }
    const res = await fetch(this.url + (!edit ? "/create" : "/edit"), {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      method: !edit ? "POST" : "PUT",
      body: formData,
    })
    const resData = await res.json();
    return resData;
  }

  static async takeWish(token: string, wishId: number): Promise<any> {
    const bodyData = {
      id: wishId,
    };
    const res = await fetch(this.url + "/take", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(bodyData),
    });
    if (res.ok) {
      const resData = await res.json();
      return resData;
    } else {
      throw new Error("takeWish request failed");
    }
  }

  static async deleteWish(token: string, wishId: number): Promise<any> {
    const bodyData = {
      id: wishId,
    };
    const res = await fetch(this.url + "/delete", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(bodyData),
    });
    const resData = await res.json();
    if (res.ok) {
      return resData;
    } else {
      const { message } = resData;
      throw new Error(message);
    }
  }

  static async updateWishPublic(
    token: string,
    wishId: number,
    state: boolean
  ): Promise<any> {
    const bodyData = {
      id: wishId,
      state,
    };
    const res = await fetch(this.url + "/update/public", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(bodyData),
    });
    if (res.ok) {
      const resData = await res.json();
      return resData;
    } else {
      throw new Error("updateWishPublic request failed");
    }
  }

  static async updateWishLoves(
    token: string,
    wishId: number,
    love: boolean
  ): Promise<any> {
    const bodyData = {
      wish_id: wishId,
      love,
    };
    const res = await fetch(this.url + "/update/loves", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(bodyData),
    });
    const resData = await res.json();
    if (res.ok) {
      return resData;
    } else {
      const { message } = resData;
      throw new Error(message);
    }
  }

  static async sendWishComment(
    token: string,
    wishId: number,
    text: string
  ): Promise<any> {
    const bodyData = {
      id: wishId,
      text,
    };
    const res = await fetch(this.url + "/send/comment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(bodyData),
    });
    const resData = await res.json();
    if (res.ok) {
      return resData;
    } else {
      const { message } = resData;
      throw new Error(message);
    }
  }

  static async setGuardContribute(
    token: string,
    wishId: number,
    contribute: number,
  ): Promise<any> {
    const bodyData = {
      wish_id: wishId,
      user_contribution: contribute,
    };
    const res = await fetch(this.guardUrl + "/set/contribution", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(bodyData),
    });
    if (res.ok) {
      const resData = await res.json();
      return resData;
    } else {
      throw new Error("setGuardContribute request failed");
    }
  }

  static async setGuardTaken(
    token: string,
    wishId: number,
  ): Promise<any> {
    const bodyData = {
      wish_id: wishId,
    };
    const res = await fetch(this.guardUrl + "/set/taken", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(bodyData),
    });
    if (res.ok) {
      const resData = await res.json();
      return resData;
    } else {
      throw new Error("setGuardTaken request failed");
    }
  }

  static async removeGuardContribute(
    token: string,
    wishId: number,
  ): Promise<any> {
    const res = await fetch(this.guardUrl + `/remove/contribution/${wishId}`, {
      method: "DELTE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (res.ok) {
      const resData = await res.json();
      return resData;
    } else {
      throw new Error("removeGuardContribute request failed");
    }
  }

  static async removeGuardTaken(
    token: string,
    wishId: number,
  ): Promise<any> {
    const res = await fetch(this.guardUrl + `/remove/taken/${wishId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (res.ok) {
      const resData = await res.json();
      return resData;
    } else {
      throw new Error("removeGuardTaken request failed");
    }
  }
}
