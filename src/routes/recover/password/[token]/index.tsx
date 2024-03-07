import { $, component$, useContext } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { useLocation, useNavigate, z } from "@builder.io/qwik-city";
import { custom$, getValue, required, useForm } from "@modular-forms/qwik";
import { Button } from "~/style/buttons/button";
import { TextFormControl } from "~/components/form-controls/text";
import { useAlerts } from "~/hooks/alerts";
import { UserServiceContext } from "~/services/user.service";
import { LoadingServiceContext } from "~/services/loading.service";

const setNewPasswordSchema = z.object({
    password: z.string().min(8, "Password requires at least 8 characters"),
    confirm_password: z
        .string()
        .min(8, "Confirm password requires at least 8 characters"),
});

type setNewPasswordType = z.infer<typeof setNewPasswordSchema>;

export default component$(() => {
    const navigation = useNavigate();
    const location = useLocation();
    const { errorAlert, successAlert } = useAlerts();
    const loadingState = useContext(LoadingServiceContext);
    const userService = useContext(UserServiceContext);
    const [setNewPassword, { Form, Field }] = useForm<setNewPasswordType>({
        loader: {
            value: {
                password: "",
                confirm_password: "",
            },
        },
        validateOn: "submit",
    });

    const onSubmit = $(async (values: any) => {
        try {
            loadingState.loading = true;
            if (!setNewPassword.invalid) {
                const res = await userService.setRecoverPassword(
                    location.params.token,
                    values.password
                );
                if (res) {
                    successAlert(
                        "Reseting password successful!",
                        "Success, go to login page and try your new password"
                    );
                    await navigation("/login/");
                }
            }
        } catch (err) {
            errorAlert(
                "Reseting password failed!",
                "Reseting failed, please try again later or contact support"
            );
            console.log("Error onSubmit register", err);
        } finally {
            loadingState.loading = false;
        }
    });

    return (
        <section
            class="flex h-full w-full flex-col items-center justify-center bg-[url('/images/landingpage.webp')] bg-cover"
        >
            <section
                class="flex h-[684px] w-[623px] flex-col items-center justify-center gap-[20px] bg-[#FFF5FA] text-black"
            >
                <section class="w-2/3">
                    <article>
                        <p class="py-4 text-center text-[32px] font-bold">Set new password</p>
                    </article>
                    <Form onSubmit$={onSubmit}>
                        <section class="flex flex-col gap-4">
                            <article>
                                <Field
                                    name="password"
                                    type="string"
                                    validate={[required("Please enter an password") as any]}
                                >
                                    {(field, props) => (
                                        <TextFormControl
                                            required
                                            inputProps={props}
                                            value={field.value}
                                            type="password"
                                            name="password"
                                            id="password"
                                            label="Password"
                                            validationError={Boolean(field.error)}
                                            validationMessage={field.error}
                                        />
                                    )}
                                </Field>
                            </article>
                            <article>
                                <Field
                                    name="confirm_password"
                                    type="string"
                                    validate={[
                                        required("Please enter the confirm password"),
                                        custom$(
                                            () =>
                                                getValue(setNewPassword, "confirm_password") ===
                                                getValue(setNewPassword, "password"),
                                            "Passwords do not match"
                                        ) as any,
                                    ]}
                                >
                                    {(field, props) => (
                                        <TextFormControl
                                            required
                                            inputProps={props}
                                            value={field.value}
                                            type="password"
                                            name="confirm_password"
                                            id="confirm_password"
                                            label="Confirm password"
                                            validationError={Boolean(field.error)}
                                            validationMessage={field.error}
                                        />
                                    )}
                                </Field>
                            </article>
                            <article class="flex w-full items-center justify-center">
                                <Button
                                    buttonType="submit"
                                    w="280px"
                                    text="Change password"
                                    disabled={setNewPassword.invalid}
                                />
                            </article>
                        </section>
                    </Form>
                </section>
            </section>
        </section>
    );
});

export const head: DocumentHead = {
    title: "Welcome to Wisher recover password",
    meta: [
        {
            name: "description",
            content:
                "This is the main page where u can recover your password.",
        },
    ],
};
