import { component$, $, useContext } from '@builder.io/qwik';
import { z } from '@builder.io/qwik-city';
import { custom$, getValue, required, reset, useForm, zodForm$ } from '@modular-forms/qwik';
import { CustomInput } from '~/components/form-controls/custom-input';
import { useAlerts } from '~/hooks/alerts';
import type { User } from '~/models/user';
import { UserServiceContext } from '~/services/user.service';
import { useServerStorage } from '~/storage';

const setNewEmailSchema = z.object({
    user_email: z.string().email("Please provide a valid email address"),
    confirm_user_email: z
        .string()
        .email("Please provide a valid email address"),
});

type NewEmailType = z.infer<typeof setNewEmailSchema>;

interface ChangeEmailProps {
    title: string
}

export const ChangeEmail = component$(({ title }: ChangeEmailProps) => {
    const userService = useContext(UserServiceContext);
    const [newEmailForm, { Form, Field }] = useForm<NewEmailType>({
        loader: {
            value: {
                user_email: "",
                confirm_user_email: "",
            },
        },
        validate: zodForm$(setNewEmailSchema),
        validateOn: "submit",
    });
    const [serverStorage, setServerStorage] = useServerStorage<User>("user");
    const { successAlert } = useAlerts();



    const onSubmit = $(async (values: NewEmailType) => {
        try {
            if (!newEmailForm.invalid) {
                const resData = await userService.setUserEmail(values.user_email)
                if (resData) {
                    reset(newEmailForm);
                    if (userService.state.user.user_type === 0) {
                        userService.state.user.user_type = 10;
                        setServerStorage.value = {
                            ...serverStorage.value!,
                            user_type: 10,
                        }
                    }
                    await successAlert("Success", "Successfully updated user email");
                }
            }
        } catch (err) {
            console.log(err);
        }
    })

    return <section class="flex flex-col gap-3 justify-center items-center">
        <kbd class="kbd kbd-lg">
            {
                title
            }
        </kbd>
        <Form
            id="myChangeEmailForm"
            class="flex flex-col gap-2"
            onSubmit$={onSubmit}
        >
            <Field name="user_email" type="string" validate={[required("Please enter the confirm email") as any]}>
                {(field, props) => (
                    <CustomInput
                        placeholder='Email'
                        label='Email'
                        name='user_email'
                        inputProps={props}
                        inputValue={field.value}
                        invalid={Boolean(field.error)}
                        errorMessage={field.error}
                    />
                )}
            </Field>
            <Field name="confirm_user_email" type="string" validate={[
                required("Please enter the confirm email"),
                custom$(
                    () =>
                        getValue(newEmailForm, "user_email") ===
                        getValue(newEmailForm, "confirm_user_email"),
                    "emails do not match"
                ) as any,
            ]}>
                {(field, props) => (
                    <CustomInput
                        placeholder='Confirm email'
                        label='Confirm email'
                        name='confirm_user_email'
                        inputProps={props}
                        inputValue={field.value}
                        invalid={Boolean(field.error)}
                        errorMessage={field.error}
                    />
                )}
            </Field>


            <button class="btn mb-3" type="submit">Save</button>
        </Form>
    </section>
});