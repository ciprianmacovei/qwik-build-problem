import { component$, useSignal, useTask$, useContext, $ } from "@builder.io/qwik";
import { useLocation } from "@builder.io/qwik-city";
import { isBrowser } from "@builder.io/qwik/build";
import { useUserActions } from "~/actions/user";
import { useInfiniteScroll } from "~/hooks/infinite-scroll";
import type { UserProfile } from "~/models/user";
import { LoadingServiceContext } from "~/services/loading.service";
import { UserServiceContext } from "~/services/user.service";
import { ProfileCard } from "~/style/cards/profile";

export default component$(() => {
    const loadingService = useContext(LoadingServiceContext);
    const userService = useContext(UserServiceContext);
    const location = useLocation();
    const data = useSignal<UserProfile[]>([]);
    const pageState = useInfiniteScroll({
        page: 1,
        perPage: 10,
        data: data,
    });
    const { followAction, unfollowAction } = useUserActions();

    const followUser = $(async (userName?: string) => {
        if (userName) {
            await followAction(userName, data);
        }
    });

    const unfollowUser = $(async (userName?: string) => {
        if (userName) {
            await unfollowAction(userName, data);
        }
    });

    useTask$(async ({ track }) => {
        track(() => pageState.page);
        try {
            if (isBrowser) {
                loadingService.simpleLoading = true;
            }
            const resData: { data: UserProfile[] | undefined } =
                await userService.getUserFollowers(location.params.username, pageState.page, pageState.perPage);
            if (resData.data?.length) {
                data.value = [...data.value, ...resData.data];
            }
        } catch (err) {
            console.log("backEndReq followers Error ", err);
        } finally {
            if (isBrowser) {
                loadingService.simpleLoading = false;
            }
        }
    });
    return <section class="flex w-full h-full justify-center">
        <ul class="w-3/4 flex flex-col gap-4 mt-7">
            {data.value.map((u: UserProfile, index: number) => (
                <li key={"followers" + index}>
                    <ProfileCard
                        followCardType={true}
                        publicProfile={true}
                        followUser={$(() => followUser(u.user_name))}
                        unfollowUser={$(() => unfollowUser(u.user_name))}
                        userProfileData={{ value: u }}
                        publicSelf={u.user_name === userService.state.user.user_name}
                    />
                </li>
            ))}
        </ul>
    </section>
})