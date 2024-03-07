import type { Signal } from '@builder.io/qwik';
import { component$, useStore, $, useContext } from '@builder.io/qwik';
import { UpdateSocialsModal } from '~/actions/modal/update-socials';
import type { SocialPlatformType } from '~/models/types/types';
import { UserServiceContext } from '~/services/user.service';
import { IconButton } from '~/style/buttons/icon-button';

import { siOnlyfans, siTwitter, siFacebook, siInstagram } from "simple-icons"
import type { UserProfile } from '~/models/user';

export interface PlatformInterface {
    completed: boolean;
    platform: SocialPlatformType;
    svgString: string;
    handdle?: string;
}

interface SocialsState {
    socialPlatofmName: SocialPlatformType;
    showModal: {
        value: boolean,
    };
    platforms: PlatformInterface[];
}

interface SocialsProps {
    userProfile: Signal<Readonly<UserProfile>>;
}

export const Socials = component$(({ userProfile }: SocialsProps) => {
    const userService = useContext(UserServiceContext);
    const state = useStore<SocialsState>({
        socialPlatofmName: "",
        showModal: {
            value: false,
        },
        platforms: [
            {
                platform: "instagram",
                completed: Boolean(userProfile.value.user_instagram_url),
                svgString: siInstagram.svg,
            },
            {
                platform: "twitter",
                completed: Boolean(userProfile.value.user_twitter_url),
                svgString: siTwitter.svg,
            },
            {
                platform: "onlyfans",
                completed: Boolean(userProfile.value.user_of_url),
                svgString: siOnlyfans.svg,
            },
            {
                platform: "facebook",
                completed: Boolean(userProfile.value.user_facebook_url),
                svgString: siFacebook.svg,
            },
        ],
    })

    const openSocialModal = $((platform: SocialPlatformType) => {
        state.socialPlatofmName = platform;
        state.showModal = {
            value: true,
        };
    });

    const setPlatformComplete = $((platform: SocialPlatformType, complete: boolean, handller?: string) => {
        const selectedPlatformIndex: number | undefined = state.platforms.findIndex(
            (p) => p.platform === platform
        );
        if (Number.isInteger(selectedPlatformIndex) && selectedPlatformIndex >= 0) {
            state.platforms[selectedPlatformIndex].completed = complete;
            if (handller) {
                state.platforms[selectedPlatformIndex].handdle = handller;
            }
            state.platforms = [...state.platforms];
        }
    });

    const deleteSocialMedia = $(async (platform: SocialPlatformType) => {
        try {
            await setPlatformComplete(platform, false);
            await userService.removeUserSocials(platform);
        } catch (err) {
            await setPlatformComplete(platform, true);
            console.log("deleteSocialMedia Error ", err);
        }
    });

    const getPlatformHanddle = $((userData: Signal<Readonly<UserProfile>>, platform: SocialPlatformType, handdler?: string) => {
        if (handdler) return handdler;

        let platformString: string | undefined;

        if (platform === "facebook") {
            platformString = userData.value.user_facebook_url
        }
        if (platform === "instagram") {
            platformString = userData.value.user_instagram_url
        }
        if (platform === "onlyfans") {  
            platformString = userData.value.user_of_url
        }
        if (platform === "twitter") {
            platformString = userData.value.user_twitter_url
        }

        if (platformString) {
            return platformString.split(".com/")[1];
        }
    })

    const actionComplete = $(async (myPlatform: SocialPlatformType, handller: string) => {
        await setPlatformComplete(myPlatform, true, handller);
        state.showModal = {
            value: false,
        }
    });

    return <>
        <section class="flex p-3 flex-col gap-4 justify-center items-center">
            {state.platforms.map((platform: PlatformInterface) => (
                <article class="w-full" key={"platform" + platform.platform}>
                    {platform.completed ? (
                        <div onClick$={$(() => deleteSocialMedia(platform.platform))} class="font-nuito flex flex-col items-center justify-center rounded-3xl bg-green-400 p-2 shadow-[0.25rem_0.25rem_black]">
                            <IconButton
                                buttonClass="w-full !bg-red-400 hover:!bg-red-400 "
                                size="sm"
                                text={`Remove ${platform.platform}`}
                                svgString={platform.svgString}
                            />
                            <span class="text-xs flex font-nuito mt-1">
                                Handdle:
                                <span class="font-bold">{getPlatformHanddle(userProfile, platform.platform, platform.handdle)}</span>
                            </span>
                        </div>
                    ) : (
                        <IconButton
                            buttonClass="w-full"
                            size="sm"
                            text={`Connect with ${platform.platform}`}
                            onClick={$(() => openSocialModal(platform.platform))}
                            svgString={platform.svgString}
                        />
                    )}
                </article>
            ))}

        </section>
        <UpdateSocialsModal
            showModal={state.showModal}
            platformKey={state.socialPlatofmName}
            actionComplete={actionComplete}
        />
    </>
});