import { component$, useContext } from "@builder.io/qwik";
import { UserServiceContext } from "~/services/user.service";
import { Web3ServiceContext } from "~/services/web3.service";

export const AccountInfo = component$(() => {
    const userService = useContext(UserServiceContext);
    const web3Service = useContext(Web3ServiceContext);
    return <section class=" px-3">
        <div class="px-4 sm:px-0">
            <h3 class="text-base font-semibold leading-7 text-gray-900">Applicant Information</h3>
            <p class="mt-1 max-w-2xl text-sm leading-6 text-gray-500">Personal details and application.</p>
        </div>
        <div class="mt-6 border-t border-gray-100">
            <dl class="divide-y divide-gray-100">
                <div class="px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                    <dt class="text-sm font-medium leading-6 text-gray-900">User name</dt>
                    <dd class="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{userService.state.user.user_name}</dd>
                </div>
                <div class="px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                    <dt class="text-sm font-medium leading-6 text-gray-900">User email</dt>
                    <dd class="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0 break-words">{userService.state.user.user_email}</dd>
                </div>
                <div class="px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                    <dt class="text-sm font-medium leading-6 text-gray-900">Wallet currency</dt>
                    <dd class="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0 break-words">{web3Service.state.symbol}</dd>
                </div>
                <div class="px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                    <dt class="text-sm font-medium leading-6 text-gray-900">User type</dt>
                    <dd class="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                        {
                            userService.state.user.user_type === 0 && "Wallet Account"
                        }
                        {
                            userService.state.user.user_type === 1 && "Email Account"
                        }
                        {
                            userService.state.user.user_type === 10 && "Full Account"
                        }
                    </dd>
                </div>
                {web3Service.state.user_wallet &&
                    <div class="px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                        <dt class="text-sm font-medium leading-6 text-gray-900">Application wallet connected</dt>
                        <dd class="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0 break-words">{web3Service.state.user_wallet}</dd>
                    </div>
                }
                <div class="px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                    <dt class="text-sm font-medium leading-6 text-gray-900">Note</dt>
                    <dd class="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                        Please note that all your informations are safe with us,
                        and when ever you wish to delete your account, this process will
                        be instant and all the user data will be deleted.
                    </dd>
                </div>
            </dl>
        </div>
    </section>
})
