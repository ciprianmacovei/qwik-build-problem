import { $, component$, useContext } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { useNavigate, z } from "@builder.io/qwik-city";
import { required, useForm } from "@modular-forms/qwik";
import { Button } from "~/style/buttons/button";
import { TextFormControl } from "~/components/form-controls/text";
import { useAlerts } from "~/hooks/alerts";
import { UserServiceContext } from "~/services/user.service";
import { LoadingServiceContext } from "~/services/loading.service";

const recoverPasswordFormSchema = z.object({
    email: z.string().email("Plase provide a valid email"),
});

type recoverPasswordFormType = z.infer<typeof recoverPasswordFormSchema>;

export default component$(() => {
    const navigation = useNavigate();
    const { errorAlert, successAlert } = useAlerts();
    const loadingState = useContext(LoadingServiceContext);
    const userService = useContext(UserServiceContext);
    const [recoverPasswordForm, { Form, Field }] = useForm<recoverPasswordFormType>({
        loader: {
            value: {
                email: "",
            },
        },
        validateOn: "submit",
    });

    const onSubmit = $(async (values: any) => {
        try {
            loadingState.loading = true;
            if (!recoverPasswordForm.invalid) {
                const res = await userService.recoverPassword(
                    values.email
                );
                if (res) {
                    successAlert(
                        "Recovering password successful!",
                        "Success, please visit your email to confirm password recovery."
                    );
                    await navigation("/login/");
                }
            }
        } catch (err) {
            errorAlert(
                "Recover password failed!",
                "Recover failed, please try again later or contact support"
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
                        <p class="py-4 text-center text-[32px] font-bold">Recover Password</p>
                    </article>
                    <Form onSubmit$={onSubmit}>
                        <section class="flex flex-col gap-4">
                            <article>
                                <Field
                                    name="email"
                                    type="string"
                                    validate={[required("Please enter an email") as any]}
                                >
                                    {(field, props) => (
                                        <TextFormControl
                                            required
                                            inputProps={props}
                                            value={field.value}
                                            type="text"
                                            name="email"
                                            id="email"
                                            label="Email"
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
                                    text="Recover password"
                                    disabled={recoverPasswordForm.invalid}
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
