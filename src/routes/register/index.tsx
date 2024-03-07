import { $, component$, useContext } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { z } from "@builder.io/qwik-city";
import { custom$, getValue, required, useForm } from "@modular-forms/qwik";
import { Button } from "~/style/buttons/button";
import { TextFormControl } from "~/components/form-controls/text";
import { useAlerts } from "~/hooks/alerts";
import { UserServiceContext } from "~/services/user.service";
import { LoadingServiceContext } from "~/services/loading.service";
import { useCustomLoadingNavigation } from "~/hooks/navigation";

const registerFormSchema = z.object({
    email: z.string().email("Plase provide a valid email"),
    username: z.string(),
    password: z.string().min(8, "Password requires at least 8 characters"),
    confirm_password: z
        .string()
        .min(8, "Confirm password requires at least 8 characters"),
});

type RegisterFormType = z.infer<typeof registerFormSchema>;

export default component$(() => {
    const { successAlert } = useAlerts();
    const loadingState = useContext(LoadingServiceContext);
    const userService = useContext(UserServiceContext);
    const [registerForm, { Form, Field }] = useForm<RegisterFormType>({
        loader: {
            value: {
                username: "",
                email: "",
                password: "",
                confirm_password: "",
            },
        },
        validateOn: "submit",
    });
    const { navigateWithLoading } = useCustomLoadingNavigation();

    const onSubmit = $(async (values: any) => {
        try {
            loadingState.loading = true;
            if (!registerForm.invalid) {
                const res = await userService.register(
                    values.username,
                    values.email,
                    values.password
                );
                if (res) {
                    successAlert(
                        "Registration successful!",
                        "Registration successful, please confirm your email"
                    );
                    await navigateWithLoading("/login/");
                }
            }
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
                        <p class="py-4 text-center text-[32px] font-bold">Sign up</p>
                    </article>
                    <Form onSubmit$={onSubmit}>
                        <section class="flex flex-col gap-4">
                            <article>
                                <Field
                                    name="username"
                                    type="string"
                                    validate={[required("Please enter an username") as any]}
                                >
                                    {(field, props) => (
                                        <TextFormControl
                                            required
                                            inputProps={props}
                                            value={field.value}
                                            type="text"
                                            name="username"
                                            id="username"
                                            label="Username"
                                            size="lg"
                                            validationError={Boolean(field.error)}
                                            validationMessage={field.error}
                                        />
                                    )}
                                </Field>
                            </article>
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
                                            size="lg"
                                            validationError={Boolean(field.error)}
                                            validationMessage={field.error}
                                        />
                                    )}
                                </Field>
                            </article>
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
                                            size="lg"
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
                                                getValue(registerForm, "confirm_password") ===
                                                getValue(registerForm, "password"),
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
                                            size="lg"
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
                                    text="Sign up"
                                    disabled={registerForm.invalid}
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
    title: "Welcome to Wisher Profile",
    meta: [
        {
            name: "description",
            content:
                "This is the main page where u can create your wishes and share with others.",
        },
    ],
};
