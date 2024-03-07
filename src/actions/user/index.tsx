import type { QRL, Signal } from "@builder.io/qwik";
import { $, useContext } from "@builder.io/qwik";
import { useAlerts } from "~/hooks/alerts";
import type { UserProfile } from "~/models/user";
import { UserServiceContext } from "~/services/user.service";

interface UseBaseWishActionReturnType {
    followAction: QRL<
        (userName: string, data: Signal<UserProfile[]>) => void
    >;
    unfollowAction: QRL<
        (userName: string, data: Signal<UserProfile[]>) => void
    >;
}

export const useUserActions = (): UseBaseWishActionReturnType => {
    const userService = useContext(UserServiceContext);
    const { errorAlert } = useAlerts();

    const mutateProfileSignalData = $((userName: string, data: Signal<UserProfile[]>, followCount: -1 | 1) => {
        data.value = data.value.map((u: UserProfile) => {
            if (u.user_name === userName) {
                return {
                    ...u,
                    followers: u.followers + followCount,
                }
            }
            return u;
        });
    })

    const followAction = $(
        async (userName: string, data: Signal<UserProfile[]>) => {
            try {
                await mutateProfileSignalData(userName, data, 1);
                await userService.followUser(userName);
            } catch (err) {
                await errorAlert("Error loving wish", "Please try again later.");
                await mutateProfileSignalData(userName, data, -1);
                console.log(err, "followAction error");
            }
        }
    );

    const unfollowAction = $(
        async (userName: string, data: Signal<UserProfile[]>) => {
            try {
                await mutateProfileSignalData(userName, data, -1)
                await userService.unfollowUser(userName);
            } catch (err) {
                console.log(err, "unfollowAction error");
                await errorAlert(`Error following ${userName}`, "Please try again later.");
                await mutateProfileSignalData(userName, data, 1)
            }
        }
    );

    return {
        followAction,
        unfollowAction,
    };
};
