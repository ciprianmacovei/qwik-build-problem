import type { NoSerialize, QRL } from "@builder.io/qwik";
import {
  createContextId,
  $,
  useContextProvider,
  useStore,
} from "@builder.io/qwik";
import { server$ } from "@builder.io/qwik-city";
import { useAlerts } from "~/hooks/alerts";
import type { SocialPlatformType } from "~/models/types/types";
import UserServerServiceReq from "./requests/user";
import { fileToBytes } from "~/utils";
import type { UserStorage } from "~/models/user";
import type { SetUserProfileReqData } from "~/models/requests/user";

interface UserService {
  state: UserServiceState;
  removeUserState: QRL<() => void>;
  setUserState: QRL<(userData: UserState, enable_ens?: boolean) => void>;
  login: QRL<
    (login_auth: string, login_passowrd: string) => Promise<any>
  >;
  loginWithWallet: QRL<
    (
      wallet: string,
      ens?: string | null,
      symbol?: string | null
    ) => Promise<any>
  >;
  loginWithGoogle: QRL<
    (
      email: string,
      username: string,
      token: string
    ) => Promise<any>
  >;
  register: QRL<
    (userName: string, email: string, password: string) => Promise<any>
  >;
  setWallet: QRL<(wallet_address: string) => Promise<any> | undefined>;
  setUserName: QRL<(userName: string) => Promise<any> | undefined>;
  setUserEmail: QRL<(userEmail: string) => Promise<any> | undefined>;
  setUserPassword: QRL<(userNewPassword: string) => Promise<any> | undefined>;
  setUserProfile: QRL<
    (
      user_description: string,
      user_picture: NoSerialize<File>
    ) => Promise<any> | undefined
  >;
  getUser: QRL<() => Promise<any> | undefined>;
  getUserName: QRL<(userName: string) => Promise<any> | undefined>;
  getUserSearched: QRL<(userName: string) => Promise<any> | undefined>;
  getUserNameProfile: QRL<(username: string) => Promise<any> | undefined>;
  getUserFollowers: QRL<(username: string, page: number, perPage: number) => Promise<any> | undefined>
  getUserFollow: QRL<(username: string, page: number, perPage: number) => Promise<any> | undefined>
  setUserSocials: QRL<
    (key: SocialPlatformType, handdle: string) => Promise<any> | undefined
  >;
  removeUserSocials: QRL<
    (key: SocialPlatformType) => Promise<any> | undefined
  >;
  followUser: QRL<(user_name: string) => Promise<any> | undefined>;
  unfollowUser: QRL<(user_name: string) => Promise<any> | undefined>;
  recoverPassword: QRL<(email: string) => Promise<any> | undefined>;
  setRecoverPassword: QRL<(token: string, password: string) => Promise<any> | undefined>;
}

interface UserServiceState {
  user: UserState;
  refreshPfp: {
    value: boolean;
  }
}

interface UserState extends UserStorage {
  isLoggedIn?: boolean;
}

export const UserServiceContext = createContextId<UserService>(
  "user-service-context"
);

export const useUserService = () => {
  const { errorAlert } = useAlerts();
  const state = useStore<UserServiceState>({
    refreshPfp: {
      value: false,
    },
    user: {
      token: undefined,
      user_name: undefined,
      user_email: undefined,
      novu_subscriber_id: undefined,
      user_type: undefined,
      isLoggedIn: false,
      last_login: undefined,
    },
  });

  const setUserState = $((userData: UserState) => {
    state.user = {
      token: userData.token,
      user_name: userData.user_name,
      user_email: userData.user_email,
      user_type: userData.user_type,
      novu_subscriber_id: userData.novu_subscriber_id,
      isLoggedIn: true,
      last_login: userData.last_login,
    };

  });

  const removeUserState = $(() => {
    state.user = {
      token: undefined,
      user_name: undefined,
      user_email: undefined,
      user_type: undefined,
      novu_subscriber_id: undefined,
      isLoggedIn: false,
      last_login: undefined,
    };
  });

  const login = $(
    async (login_auth: string, login_passowrd: string) => {
      try {
        const data = await server$(async function (login_auth, login_passowrd) {
          try {
            const resData = await UserServerServiceReq.login(login_auth, login_passowrd)
            if (resData.data) {
              this.cookie.set(
                "user",
                JSON.stringify({
                  ...resData.data
                }),
                { path: "/" }
              );
              return resData;
            } else {
              throw new Error("Login request failed");
            }
          } catch (err: unknown) {
            if (err) {
              throw new Error(err.toString());
            }
          }
        })(login_auth, login_passowrd);
        if (data.data) {
          await setUserState(data.data);
          return data;
        }
      } catch (err) {
        console.log("login error: " + err);
        errorAlert(
          "Login failed!",
          "Please try again or contact support."
        );
      }
    });

  const loginWithGoogle = $(
    async (email: string, username: string, token: string) => {
      try {
        const data = await server$(async function (
          email,
          username,
          token
        ) {
          try {
            const resData = await UserServerServiceReq.loginGoogle(email, username, token);
            if (resData.data) {
              this.cookie.set(
                "user",
                JSON.stringify({
                  ...resData.data
                }),
                { path: "/" }
              );
              return resData;
            } else {
              throw new Error("Login request failed!");
            }
          } catch (err: unknown) {
            if (err) {
              throw new Error(err.toString());
            }
            console.log("Error loginWithWallet", err);
          }
        })(email, username, token);
        if (data.data) {
          await setUserState(data.data);
          return data;
        }
      } catch (err) {
        errorAlert(
          "Login with wallet failed!",
          "Your login has faild. Please try again or contact support."
        );
      }
    }
  );

  const loginWithWallet = $(
    async (wallet: string, ens?: string | null, symbol?: string | null) => {
      try {
        const data = await server$(async function (
          wallet: string,
          ens?: string | null,
          symbol?: string | null
        ) {
          try {
            const bodyData: {
              wallet: string;
              ens?: string | null;
              crypto_symbol?: string | null;
            } = {
              wallet,
            };
            if (ens) {
              bodyData.ens = ens;
            }
            if (symbol) {
              bodyData.crypto_symbol = symbol;
            }
            const resData = await UserServerServiceReq.loginWallet(bodyData);
            if (resData.data) {
              this.cookie.set(
                "user",
                JSON.stringify({
                  ...resData.data
                }),
                { path: "/" }
              );
              return resData;
            } else {
              throw new Error("Login request failed!");
            }
          } catch (err: unknown) {
            if (err) {
              throw new Error(err.toString());
            }
            console.log("Error loginWithWallet", err);
          }
        })(wallet, ens, symbol);
        if (data.data) {
          await setUserState(data.data);
          return data;
        }
      } catch (err) {
        errorAlert(
          "Login with wallet failed!",
          "Your login has faild. Please try again or contact support."
        );
      }
    }
  );

  const register = $(
    async (userName: string, email: string, password: string) => {
      try {
        const data = await server$(async function () {
          try {
            const resData = await UserServerServiceReq.register(userName, email, password);
            return resData
          } catch (err: unknown) {
            if (err && err instanceof Error) {
              throw new Error(err.message);
            }
          }
        })();
        return data;
      } catch (err: unknown) {
        console.log("login error: " + err);
        if (err && err instanceof Error) {
          errorAlert(
            "Register failed!",
            err.message
          );
        }
      }
    });


  const setWallet = $(async (wallet: string) => {
    try {
      const data = await server$(async function (wallet) {
        try {
          const cookie: { token: string } | undefined = this.cookie
            .get("user")
            ?.json<{ token: string }>();
          if (cookie?.token) {
            const resData = await UserServerServiceReq.setWallet(
              cookie.token,
              wallet
            );
            return resData;
          } else {
            throw new Error("User is not logged in.");
          }
        } catch (err: unknown) {
          if (err && err instanceof Error) {
            throw new Error(err.message);
          }
          console.log("following user Error ", err);
        }
      })(wallet);
      return data;
    } catch (err: unknown) {
      if (err && err instanceof Error) {
        errorAlert(
          "Setting user wallet failed!",
          "Please try again or contact support."
        );
      }
    }
  });


  const setUserName = $(async (userName: string) => {
    try {
      const data = await server$(async function (userName) {
        try {
          const cookie: { token: string } | undefined = this.cookie
            .get("user")
            ?.json<{ token: string }>();
          if (cookie?.token) {
            const resData = await UserServerServiceReq.setUserName(
              cookie.token,
              userName
            );
            return resData;
          } else {
            throw new Error("User is not logged in.");
          }
        } catch (err: unknown) {
          console.log("setUserName Error ", err);
          if (err && err instanceof Error) {
            throw new Error(err.message);
          }
        }
      })(userName);
      return data;
    } catch (err) {
      errorAlert(
        "Setting user name failed!",
        "Please try again or contact support."
      );
    }
  });


  const setUserEmail = $(async (userEmail: string) => {
    try {
      const data = await server$(async function (userEmail) {
        try {
          const cookie: { token: string } | undefined = this.cookie
            .get("user")
            ?.json<{ token: string }>();
          if (cookie?.token) {
            const resData = await UserServerServiceReq.setUserEmail(
              cookie.token,
              userEmail
            );
            return resData;
          } else {
            throw new Error("User is not logged in.");
          }
        } catch (err: unknown) {
          if (err && err instanceof Error) {
            throw new Error(err.message);
          }
          console.log("setUserName Error ", err);
        }
      })(userEmail);
      return data;
    } catch (err) {
      errorAlert(
        "Setting user name failed!",
        "Please try again or contact support."
      );
    }
  });


  const setUserPassword = $(async (userNewPassword: string) => {
    try {
      const data = await server$(async function (userNewPassword) {
        try {
          const cookie: { token: string } | undefined = this.cookie
            .get("user")
            ?.json<{ token: string }>();
          if (cookie?.token) {
            const resData = await UserServerServiceReq.setUserPassword(
              cookie.token,
              userNewPassword,
            );
            return resData;
          } else {
            throw new Error("User is not logged in.");
          }
        } catch (err: unknown) {
          if (err && err instanceof Error) {
            throw new Error(err.message);
          }
          console.log("setUserPassword Error ", err);
        }
      })(userNewPassword);
      return data;
    } catch (err) {
      errorAlert(
        "Setting user password failed!",
        "Please try again or contact support."
      );
    }
  });

  const setUserProfile = $(
    async (userDescription: string, userPicture?: NoSerialize<File>) => {
      try {
        const bodyData: SetUserProfileReqData = {
          userDescription,
        }
        if (userPicture) {
          const bytes = await fileToBytes(userPicture);
          bodyData.userPictureName = userPicture.name;
          bodyData.userPictureType = userPicture.type;
          bodyData.userPicture = bytes;
        }
        const data = await server$(async function (bodyData) {
          try {
            const cookie: { token: string } | undefined = this.cookie
              .get("user")
              ?.json<{ token: string }>();
            if (cookie?.token) {
              const resData = await UserServerServiceReq.setUserProfile(
                cookie.token,
                bodyData
              );
              return resData;
            } else {
              throw new Error("User is not logged in.");
            }
          } catch (err: unknown) {
            if (err && err instanceof Error) {
              throw new Error(err.message);
            }
            console.log("set user profile Error ", err);
          }
        })(bodyData);
        return data;
      } catch (err) {
        errorAlert(
          "Setting user profile failed!",
          "Please try again or contact support."
        );
      }
    }
  );

  const getUser = $(async () => {
    try {
      const data = await server$(async function () {
        try {
          const cookie: { token: string } | undefined = this.cookie
            .get("user")
            ?.json<{ token: string }>();
          if (cookie?.token) {
            const resData = await UserServerServiceReq.getUser(cookie.token);
            return resData;
          } else {
            throw new Error("User is not logged in.");
          }
        } catch (err: unknown) {
          if (err && err instanceof Error) {
            throw new Error(err.message);
          }
          console.log("following user Error ", err);
        }
      })();
      return data;
    } catch (err) {
      errorAlert(
        "Gettings user failed!",
        "Please try again or contact support."
      );
    }
  });


  const getUserSearched = $(async (userName: string) => {
    try {
      const data = await server$(async function (userName) {
        try {
          const cookie: { token: string } | undefined = this.cookie
            .get("user")
            ?.json<{ token: string }>();
          if (cookie?.token) {
            const resData = await UserServerServiceReq.getSearchedUsers(cookie.token, userName);
            return resData;
          } else {
            throw new Error("User is not logged in.");
          }
        } catch (err: unknown) {
          if (err && err instanceof Error) {
            throw new Error(err.message);
          }
          console.log("following user Error ", err);
        }
      })(userName);
      return data;
    } catch (err) {
      errorAlert(
        "Gettings user failed!",
        "Please try again or contact support."
      );
    }
  });

  const getUserName = $(async (userName: string) => {
    try {
      const data = await server$(async function (userName) {
        try {
          const cookie: { token: string } | undefined = this.cookie
            .get("user")
            ?.json<{ token: string }>();
          if (cookie?.token) {
            const resData = await UserServerServiceReq.getUserName(cookie.token, userName);
            return resData;
          } else {
            throw new Error("User is not logged in.");
          }
        } catch (err: unknown) {
          if (err && err instanceof Error) {
            throw new Error(err.message);
          }
          console.log("following user Error ", err);
        }
      })(userName);
      return data;
    } catch (err) {
      errorAlert(
        "Gettings user failed!",
        "Please try again or contact support."
      );
    }
  });

  const getUserNameProfile = $(async (userName: string) => {
    try {
      const data = await server$(async function (userName) {
        try {
          const cookie: { token: string } | undefined = this.cookie
            .get("user")
            ?.json<{ token: string }>();
          if (cookie?.token) {
            const resData = await UserServerServiceReq.getUserNameProfile(
              cookie.token,
              userName
            );
            return resData;
          } else {
            throw new Error("User is not logged in.");
          }
        } catch (err: unknown) {
          if (err && err instanceof Error) {
            throw new Error(err.message);
          }
          console.log("following user Error ", err);
        }
      })(userName);
      return data;
    } catch (err) {
      errorAlert(
        "Gettings user profile failed!",
        "Please try again or contact support."
      );
    }
  });

  const getUserFollowers = $(
    async (userName: string, page: number, perPage: number) => {
      try {
        const data = await server$(async function (userName, page, perPage) {
          try {
            const cookie: { token: string } | undefined = this.cookie
              .get("user")
              ?.json<{ token: string }>();
            if (cookie?.token) {
              const resData = await UserServerServiceReq.getFollowers(
                cookie.token,
                userName,
                page,
                perPage
              );
              return resData;
            } else {
              throw new Error("User is not logged in.");
            }
          } catch (err: unknown) {
            if (err && err instanceof Error) {
              throw new Error(err.message);
            }
            console.log("get followers Error ", err);
          }
        })(userName, page, perPage);
        return data;
      } catch (err) {
        errorAlert(
          "Getting user followers failed!",
          "Please try again or contact support."
        );
      }
    }
  );

  const getUserFollow = $(
    async (userName: string, page: number, perPage: number) => {
      try {
        const data = await server$(async function (userName, page, perPage) {
          try {
            const cookie: { token: string } | undefined = this.cookie
              .get("user")
              ?.json<{ token: string }>();
            if (cookie?.token) {
              const resData = await UserServerServiceReq.getFollow(
                cookie.token,
                userName,
                page,
                perPage
              );
              return resData;
            } else {
              throw new Error("User is not logged in.");
            }
          } catch (err: unknown) {
            if (err && err instanceof Error) {
              throw new Error(err.message);
            }
            console.log("get followers Error ", err);
          }
        })(userName, page, perPage);
        return data;
      } catch (err) {
        errorAlert(
          "Getting user followers failed!",
          "Please try again or contact support."
        );
      }
    }
  );

  const setUserSocials = $(
    async (platform: SocialPlatformType, platformHandle: string) => {
      try {
        const data = await server$(async function (platform, platformHandle) {
          try {
            const cookie: { token: string } | undefined = this.cookie
              .get("user")
              ?.json<{ token: string }>();
            if (cookie?.token) {
              const resData = await UserServerServiceReq.setUserSocials(
                cookie.token,
                platform,
                platformHandle
              );
              return resData;
            } else {
              throw new Error("User is not logged in.");
            }
          } catch (err: unknown) {
            console.log("following user Error ", err);
            if (err && err instanceof Error) {
              throw new Error(err.message);
            }
          }
        })(platform, platformHandle);
        return data;
      } catch (err) {
        errorAlert(
          "Setting user platform handle failed!",
          "Please try again or contact support."
        );
      }
    }
  );

  const removeUserSocials = $(
    async (platform: SocialPlatformType) => {
      try {
        const data = await server$(async function (platform) {
          try {
            const cookie: { token: string } | undefined = this.cookie
              .get("user")
              ?.json<{ token: string }>();
            if (cookie?.token) {
              const resData = await UserServerServiceReq.removeUserSocials(
                cookie.token,
                platform,
              );
              return resData;
            } else {
              throw new Error("User is not logged in.");
            }
          } catch (err: unknown) {
            console.log("following user Error ", err);
            if (err && err instanceof Error) {
              throw new Error(err.message);
            }
          }
        })(platform);
        return data;
      } catch (err) {
        errorAlert(
          "Setting user platform handle failed!",
          "Please try again or contact support."
        );
      }
    }
  );

  const followUser = $(async (userName: string) => {
    try {
      const data = await server$(async function (userName) {
        try {
          const cookie: { token: string } | undefined = this.cookie
            .get("user")
            ?.json<{ token: string }>();
          if (cookie?.token) {
            const resData = await UserServerServiceReq.followUser(
              cookie.token,
              userName
            );
            return resData;
          } else {
            throw new Error("User is not logged in.");
          }
        } catch (err: unknown) {
          console.log("following user Error ", err);
          if (err && err instanceof Error) {
            throw new Error(err.message);
          }
        }
      })(userName);
      return data;
    } catch (err) {
      if (err && err instanceof Error) {
        errorAlert(
          "Following user failed!",
          err.message,
        );
      }
    }
  });

  const unfollowUser = $(async (userName: string) => {
    try {
      const data = await server$(async function (userName) {
        try {
          const cookie: { token: string } | undefined = this.cookie
            .get("user")
            ?.json<{ token: string }>();
          if (cookie?.token) {
            const resData = await UserServerServiceReq.unfollowUser(
              cookie.token,
              userName
            );
            return resData;
          } else {
            throw new Error("User is not logged in.");
          }
        } catch (err: unknown) {
          console.log("following user Error ", err);
          if (err && err instanceof Error) {
            throw new Error(err.message);
          }
        }
      })(userName);
      return data;
    } catch (err) {
      if (err && err instanceof Error) {
        errorAlert(
          "Unfollowing user failed!",
          err.message,
        );
      }
    }
  });

  const recoverPassword = $(async (email: string) => {
    try {
      const data = await server$(async function (email) {
        try {
          const resData = await UserServerServiceReq.recoverPassword(
            email
          );
          return resData;
        } catch (err: unknown) {
          console.log("following user Error ", err);
          if (err && err instanceof Error) {
            throw new Error(err.message);
          }
        }
      })(email);
      return data;
    } catch (err) {
      if (err && err instanceof Error) {
        errorAlert(
          "Resetting password failed!",
          err.message,
        );
      }
    }
  });

  const setRecoverPassword = $(async (token: string, password: string) => {
    try {
      const data = await server$(async function (token, password) {
        try {
          const resData = await UserServerServiceReq.setRecoverPassword(
            token,
            password
          );
          return resData;
        } catch (err: unknown) {
          console.log("setRecoverPassword Error ", err);
          if (err && err instanceof Error) {
            throw new Error(err.message);
          }
        }
      })(token, password);
      return data;
    } catch (err) {
      errorAlert(
        "Setting new password failed!",
        "Please try again or contact support."
      );
    }
  });



  const service = {
    state,
    setUserState,
    removeUserState,
    login,
    loginWithGoogle,
    loginWithWallet,
    register,
    setWallet,
    setUserName,
    setUserEmail,
    setUserPassword,
    setUserProfile,
    getUser,
    getUserName,
    getUserSearched,
    getUserNameProfile,
    getUserFollowers,
    getUserFollow,
    setUserSocials,
    removeUserSocials,
    followUser,
    unfollowUser,
    recoverPassword,
    setRecoverPassword,
  };

  useContextProvider(UserServiceContext, service);
};
