import { component$, useStore, $, useContext } from '@builder.io/qwik';
import { Image } from '@unpic/qwik';
import BackImg from "~/../public/images/backmodal.png?jsx";

import { AccountInfo } from './account-info';
import { ChangeEmail } from './change-email';
import { ChangeUserName } from './change-user-name';
import { ChangePassword } from './change-password';

import cn from "classnames";
import { UserServiceContext } from '~/services/user.service';

enum MyAccountSections {
    AccountInformation = 0,
    ChangeUserName = 1,
    ChangeEmail = 2,
    ChangePassword = 3
}

type MyAccount = {
    show: boolean,
    text: string,
    value: MyAccountSections,
    subtext?: string,
}

export const MyAccount = component$(() => {
    const userService = useContext(UserServiceContext);
    const state = useStore({
        myAccount: [
            {
                show: false,
                text: "Account information",
                subtext: "See your account information like your phone number and email address.",
                value: MyAccountSections.AccountInformation
            },
            {
                show: false,
                text: "Change user name",
                subtext: "The user name should be unique",
                value: MyAccountSections.ChangeUserName
            },
            {
                show: false,
                text: "Change email",
                value: MyAccountSections.ChangeEmail
            },
            {
                show: false,
                text: "Change password",
                value: MyAccountSections.ChangePassword
            },
        ],
        myAccountMode: false,
    })

    const activateSection = $((account: MyAccount) => {
        account.show = true;
        state.myAccountMode = true;
    })

    const backMyAccount = $(() => {
        state.myAccountMode = false;
        state.myAccount = state.myAccount.map((x: MyAccount) => ({ ...x, show: false }))
    })

    return <div class="flex w-full flex-col gap-4 font-nuito">
        {state.myAccountMode &&
            <figure>
                <BackImg
                    class="cursor-pointer hover:scale-110 duration-75"
                    onClick$={backMyAccount}
                    style={{ width: "16px", margin: "8px" }}
                />
            </figure>
        }
        <ul class={cn("flex flex-col justify-center w-full h-full")}>
            {state.myAccount
                .filter((x: MyAccount) => state.myAccountMode ? x.show : !x.show)
                .map(
                    (account: MyAccount, index: number) => (
                        <li key={"account-links" + index}>
                            {account.show ?
                                <>
                                    {
                                        account.value === MyAccountSections.AccountInformation &&
                                        <AccountInfo />
                                    }
                                    {
                                        account.value === MyAccountSections.ChangeUserName &&
                                        <ChangeUserName />
                                    }
                                    {
                                        account.value === MyAccountSections.ChangeEmail &&
                                        <ChangeEmail title={
                                            userService.state.user.user_type === 0 ?
                                                "Add email" :
                                                "Change email"
                                        } />
                                    }
                                    {
                                        account.value === MyAccountSections.ChangePassword &&
                                        <ChangePassword />
                                    }
                                </> :
                                <section
                                    onClick$={$(() => activateSection(account))}
                                    class={cn(
                                        index === state.myAccount.length - 1 && "!border-b-0",
                                        "flex cursor-pointer p-4 w-full border-b-2 border-solid border-black hover:bg-gray-200 items-center justify-between")}
                                >
                                    <Image src="/images/profile.png" width={30} height={30} />
                                    <article class=" px-2 w-full flex flex-col items-start">
                                        <p>
                                            {
                                                account.value === MyAccountSections.ChangeEmail ?
                                                    userService.state.user.user_type === 0 ?
                                                        "Add email" : "Change email"
                                                    : account.text
                                            }
                                        </p>
                                        {account.subtext && <p class="text-xs text-gray-600">{account.subtext}</p>}
                                    </article>
                                    <span class="flex justify-end w-7">{'>'}</span>
                                </section>
                            }
                        </li>
                    )
                )}
        </ul>


    </div>
});