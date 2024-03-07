import { component$, $, useContext } from '@builder.io/qwik';
import { z } from '@builder.io/qwik-city';
import { custom$, getValue, required, reset, useForm, zodForm$ } from '@modular-forms/qwik';
import { CustomInput } from '~/components/form-controls/custom-input';
import { useAlerts } from '~/hooks/alerts';
import { UserServiceContext } from '~/services/user.service';

const setNewPasswordSchema = z.object({
    new_password: z.string().min(8, "Password must contain at least 8 caracters"),
    confirm_password: z.string().min(8, "Password must contain at least 8 caracters"),
});

type NewPasswordType = z.infer<typeof setNewPasswordSchema>;

export const ChangePassword = component$(() => {
    const userService = useContext(UserServiceContext);
    const [newPasswordForm, { Form, Field }] = useForm<NewPasswordType>({
        loader: {
            value: {
                new_password: "",
                confirm_password: "",
            },
        },
        validate: zodForm$(setNewPasswordSchema),
        validateOn: "submit",
    });

    const { successAlert } = useAlerts();

    const onSubmit = $(async (values: NewPasswordType) => {
        try {
            if (!newPasswordForm.invalid) {
                const resData = await userService.setUserPassword(
                    values.new_password,
                );
                if (resData) {
                    reset(newPasswordForm);
                    await successAlert("Success", "Successfully updated user email");
                }
            }
        } catch (err) {
            console.log(err);
        }
    })

    return <section class="flex flex-col gap-3 justify-center items-center">
        <kbd class="kbd kbd-lg">Change password</kbd>
        <Form
            id="myChangeEmailForm"
            class="flex flex-col gap-2"
            onSubmit$={onSubmit}
        >
            <Field name="new_password" type="string" validate={[required("Please enter the confirm email") as any]}>
                {(field, props) => (
                    <CustomInput
                        placeholder='New password'
                        label='New password'
                        name='new_password'
                        inputProps={props}
                        inputValue={field.value}
                        invalid={Boolean(field.error)}
                        errorMessage={field.error}
                    />)}
            </Field>
            <Field name="confirm_password" type="string" validate={
                [required("Please enter the confirm email") as any,
                custom$(
                    () =>
                        getValue(newPasswordForm, "new_password") ===
                        getValue(newPasswordForm, "confirm_password"),
                    "emails do not match"
                ) as any]}
            >
                {(field, props) => (
                    <CustomInput
                        placeholder='Confirm password'
                        label='Confirm password'
                        name='confirm_password'
                        inputProps={props}
                        inputValue={field.value}
                        invalid={Boolean(field.error)}
                        errorMessage={field.error}
                    />)}
            </Field>

            <button class="btn mb-3" type="submit">Save</button>
        </Form>
    </section>
});