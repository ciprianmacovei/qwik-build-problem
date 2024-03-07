import type { SetUserProfileReqData } from "~/models/requests/user";
import type { SocialPlatformType } from "~/models/types/types";

export default class UserServerServiceReq {
  private static url: string = "http://backend:8000/api/user";
  private static authUrl: string = "http://backend:8000/api/auth";

  static async register(
    username: string,
    email: string,
    password: string
  ) {
    const bodyData = {
      username,
      email,
      password,
    };
    const res = await fetch(this.authUrl + "/register", {
      method: "POST",
      body: JSON.stringify(bodyData),
      headers: { "Content-Type": "application/json" },
    });
    const resData = await res.json();
    if (res.ok) {
      return resData;
    } else {
      const { message } = resData;
      throw new Error(message);
    }
  }

  static async login(
    login_auth: string,
    login_password: string
  ) {
    const bodyData = {
      login_auth,
      login_password,
    };
    const res = await fetch(this.authUrl + "/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
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

  static async loginWallet(
    walletData: {
      wallet: string;
      ens?: string | null;
      crypto_symbol?: string | null;
    }
  ) {
    const res = await fetch(this.authUrl + "/login-with-wallet", {
      method: "POST",
      body: JSON.stringify(walletData),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const resData = await res.json();
    if (res.ok) {
      return resData;
    } else {
      const { message } = resData;
      throw new Error(message);
    }
  }

  static async loginGoogle(email: string, username: string, token: string) {
    const bodyData = {
      email,
      username,
      token,
    };
    const res = await fetch(this.authUrl + "/login-with-google", {
      method: "POST",
      body: JSON.stringify(bodyData),
      headers: { "Content-Type": "application/json" },
    });
    const resData = await res.json();
    if (res.ok) {
      return resData;
    } else {
      const { message } = resData;
      throw new Error(message);
    }
  }

  static async getUserProfile(token: string): Promise<any> {
    const res = await fetch(this.url + `/get/profile/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const resData = await res.json();
    if (res.ok) {
      return resData;
    } else {
      const { message } = resData;
      throw new Error(message);
    }
  }

  static async getUserNameProfile(
    username: string,
    token: string
  ): Promise<any> {
    const res = await fetch(this.url + `/get/profile/${username}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const resData = await res.json();
    if (res.ok) {
      return resData;
    } else {
      const { message } = resData;
      throw new Error(message);
    }
  }

  static async getSearchedUsers(
    token: string,
    username: string,
  ): Promise<any> {
    const res = await fetch(this.url + `/get/search/${username}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const resData = await res.json();
    if (res.ok) {
      return resData;
    } else {
      const { message } = resData;
      throw new Error(message);
    }
  }


  static async getFollowers(token: string, userName: string, page: number, perPage: number): Promise<any> {
    const res = await fetch(this.url + `/get/followers/${userName}/${page}/${perPage}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const resData = await res.json();
    if (res.ok) {
      return resData;
    } else {
      const { message } = resData;
      throw new Error(message);
    }
  }

  static async getFollow(token: string, userName: string, page: number, perPage: number): Promise<any> {
    const res = await fetch(this.url + `/get/follow/${userName}/${page}/${perPage}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const resData = await res.json();
    if (res.ok) {
      return resData;
    } else {
      const { message } = resData;
      throw new Error(message);
    }
  }

  static async followUser(token: string, userName: string): Promise<any> {
    const res = await fetch(this.url + "/add/follow", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ user_name: userName }),
    });
    const resData = await res.json();
    if (res.ok) {
      return resData;
    } else {
      const { message } = resData;
      throw new Error(message);
    }
  }

  static async unfollowUser(token: string, userName: string): Promise<any> {
    const res = await fetch(this.url + "/remove/follow", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ user_name: userName }),
    });
    const resData = await res.json();
    if (res.ok) {
      return resData;
    } else {
      const { message } = resData;
      throw new Error(message);
    }
  }

  static async setWallet(token: string, wallet: string) {
    const bodyData = {
      wallet_address: wallet,
    };
    const res = await fetch(this.url + "/set/wallet", {
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

  static async setUserName(token: string, userName: string) {
    const bodyData = {
      user_name: userName,
    };
    const res = await fetch(this.url + "/set/user_name", {
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

  static async setUserEmail(token: string, userEmail: string) {
    const bodyData = {
      user_email: userEmail,
    };
    const res = await fetch(this.url + "/set/user_email", {
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

  static async setUserPassword(token: string, userNewPassword: string) {
    const bodyData = {
      user_new_password: userNewPassword,
    };
    const res = await fetch(this.url + "/set/user_password", {
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

  static async setUserProfile(
    token: string,
    bodyData: SetUserProfileReqData,
  ) {
    const formData = new FormData();
    if (bodyData.userDescription) {
      formData.append("user_description", bodyData.userDescription);
    }
    if (bodyData.userPicture) {
      formData.append("user_picture", bodyData.userPicture);
    }
    if (bodyData.userPictureName) {
      formData.append("user_picture_name", bodyData.userPictureName);
    }
    if (bodyData.userPictureType) {
      formData.append("user_picture_type", bodyData.userPictureType);
    }
    const res = await fetch(this.url + "/set/profile",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        method: "POST",
        body: formData,
      }
    );
    const resData = await res.json();
    if (res.ok) {
      return resData;
    } else {
      const { message } = resData;
      throw new Error(message);
    }
  }

  static async getUser(token: string) {
    const res = await fetch(this.url + "/get/user", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const resData = await res.json();
    if (res.ok) {
      return resData;
    } else {
      const { message } = resData;
      throw new Error(message);
    }
  }

  static async getUserName(token: string, userName: string) {
    const res = await fetch(this.url + `/get/user/${userName}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const resData = await res.json();
    if (res.ok) {
      return resData;
    } else {
      const { message } = resData;
      throw new Error(message);
    }
  }

  static async setUserSocials(
    token: string,
    platform: SocialPlatformType,
    platformHandle: string
  ) {
    const bodyData = {
      platform,
      platform_handler: platformHandle,
    };
    const res = await fetch(this.url + "/set/social", {
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

  static async removeUserSocials(
    token: string,
    platform: SocialPlatformType,
  ) {
    const bodyData = {
      platform,
    };
    const res = await fetch(this.url + "/remove/social", {
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

  static async recoverPassword(
    email: string,
  ) {
    const bodyData = {
      email,
    };
    const res = await fetch(this.authUrl + "/recover/password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
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

  static async setRecoverPassword(
    token: string,
    password: string,
  ) {
    const bodyData = {
      token,
      password,
    };
    const res = await fetch(this.authUrl + "/change/recover/password", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
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
}
