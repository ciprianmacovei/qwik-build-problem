import { component$, useContext, useSignal, useStore, useTask$, $ } from '@builder.io/qwik';
import { isServer } from '@builder.io/qwik/build';
import { CustomInput } from '~/components/form-controls/custom-input';
import { useAlerts } from '~/hooks/alerts';
import { useDebounce } from '~/hooks/debounce';
import type { UserStorage } from '~/models/user';
import { UserServiceContext } from '~/services/user.service';
import { useServerStorage } from '~/storage';

export const ChangeUserName = component$(() => {

    const userService = useContext(UserServiceContext);
    const userNameFormControl = useSignal<string | undefined>();
    const state = useStore({
        userNameFormControlInvalid: false,
        userNameFormControlErrorMessage: "User name is invalid",
        userNameFormControlValidMessage: "User name available",
    });
    const { successAlert } = useAlerts();
    const { deboucedSignal } = useDebounce<string>(
        { signal: userNameFormControl, milliseconds: 300 }
    );
    const [serverStorage, setServerStorage] = useServerStorage<UserStorage>("user");

    const saveUserName = $(async () => {
        try {
            if (userNameFormControl.value) {
                const resData = await userService.setUserName(userNameFormControl.value)
                if (resData) {
                    if (serverStorage.value) {
                        setServerStorage.value = {
                            ...serverStorage.value,
                            user_name: userNameFormControl.value,
                        }
                    }
                    userService.state.user.user_name = userNameFormControl.value;
                    userNameFormControl.value = "";
                    await successAlert("Success", "Successfully changed user name");
                }
            }
        } catch (err) {
            console.log(err);
        }
    })

    useTask$(async ({ track }) => {
        track(() => deboucedSignal.value)
        if (isServer) return;
        if (deboucedSignal.value) {
            const resData = await userService.getUserName(deboucedSignal.value);
            state.userNameFormControlInvalid = !resData.data;
        }
    })

    return <section class="flex flex-col gap-3 justify-center items-center">
        <kbd class="kbd kbd-lg">Change user name</kbd>
        <CustomInput
            placeholder='User name'
            label='User name'
            name='change_user_name'
            value={userNameFormControl}
            invalid={state.userNameFormControlInvalid}
            errorMessage={state.userNameFormControlErrorMessage}
            validMessage={state.userNameFormControlValidMessage}
        />
        {(
            !state.userNameFormControlInvalid &&
            userNameFormControl.value &&
            userNameFormControl.value.length > 0
        ) &&
            <button class="btn mb-3" onClick$={saveUserName}>Save</button>
        }
    </section>
});