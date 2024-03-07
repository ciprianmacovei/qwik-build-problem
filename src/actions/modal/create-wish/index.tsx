import type { NoSerialize } from "@builder.io/qwik";
import {
  $,
  component$,
  useContext,
  useStore,
  useTask$,
} from "@builder.io/qwik";
import { Modal } from "~/components/modal";
import { Button } from "~/style/buttons/button";
import { useLocation, z } from "@builder.io/qwik-city";
import { WishServiceContext } from "~/services/wish.service";
import { reset, setValue, useForm, zodForm$ } from "@modular-forms/qwik";
import { FormTextAreaControl } from "~/components/form-controls/text-area";
import { SwitchFormControl } from "~/components/form-controls/switch";
import { useAlerts } from "~/hooks/alerts";
import { TextFormControl } from "~/components/form-controls/text";
import { UploadFormControl } from "~/components/form-controls/upload";
import { DateFormControl } from "~/components/form-controls/datetime";
import { NotificationServiceContext } from "~/services/notif.service";
import { LoadingServiceContext } from "~/services/loading.service";
import { NumberFormControl } from "~/components/form-controls/number";
import { isServer } from "@builder.io/qwik/build";
import { UserServiceContext } from "~/services/user.service";

const MAX_FILE_SIZE = 2000000;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png"];

interface CreateModalProps {
  showModal: {
    value: boolean;
  };
}

export const createWishSchema = z.object({
  wish_name: z.string().optional(),
  wish_description: z
    .string()
    .min(1, "please complete wish description")
    .max(255, "text is too big"),
  wish_photo: z
    .custom<NoSerialize<File>>()
    .refine((file) => {
      if (file) {
        return file.size <= MAX_FILE_SIZE;
      }
    }, `Max file size is 2MB.`)
    .refine((file) => {
      if (file) {
        return ACCEPTED_IMAGE_TYPES.includes(file.type) || file.size === 0;
      }
    }, ".jpg, .jpeg, .png file are accepted.")
    .optional(),
  wish_end_date: z.date().optional(),
  wish_price: z.number().optional(),
});

export type CreateWishFormType = z.infer<typeof createWishSchema>;

export const CreateModal = component$(({ showModal }: CreateModalProps) => {
  const wishService = useContext(WishServiceContext);
  const userService = useContext(UserServiceContext);
  const notificationService = useContext(NotificationServiceContext);
  const loadingService = useContext(LoadingServiceContext);
  const location = useLocation();
  const { errorAlert } = useAlerts();
  const state = useStore({
    preventFocus: false,
    advanced: false,
    showModal: {
      value: false,
    },
  });
  const [createWishForm, { Form, Field }] = useForm<CreateWishFormType>({
    loader: {
      value: {
        wish_description: "",
        wish_name: undefined,
        wish_photo: undefined,
        wish_end_date: undefined,
        wish_price: 0,
      },
    },
    validate: zodForm$(createWishSchema),
    validateOn: "submit",
  });

  const onChangeAdvancedToggle = $(($event: any) => {
    state.advanced = $event.target.checked;
  });

  const uploadFile = $((file: NoSerialize<File>) => {
    setValue(createWishForm, "wish_photo", file);
  });

  const onSubmit = $(async (values: any) => {
    try {
      if (!createWishForm.invalid) {
        state.advanced = false;
        state.showModal = {
          value: false,
        };
        loadingService.simpleLoading = true;
        const resData = await wishService.createWish(
          values.wish_description,
          values.wish_name,
          values.wish_photo,
          values.wish_end_date,
          values.wish_price
        );
        if (resData && resData.data) {
          wishService.onCreateCompleted(resData.data);
          if (!location.url.pathname.includes("profile")) {
            await notificationService.setNotificationNavBarArray([
              { section: "profile", newlyCreated: true },
            ]);
          }
        } else {
          await errorAlert(
            "Create wish failed!",
            "Something went wrong please try again, if it persists please contact suport."
          );
          loadingService.simpleLoading = false;
        }
      }
    } catch (err) {
      loadingService.simpleLoading = false;
      await errorAlert("Create wish failed!", String(err));
      console.log("onSubmitComplete Error ", err);
    }
  });

  // eslint-disable-next-line qwik/no-use-visible-task
  useTask$(
    ({ track }) => {
      track(() => showModal);
      if (isServer) return;
      state.advanced = false;
      state.showModal = {
        value: showModal.value,
      };
      reset(createWishForm);
    }
  );

  return (
    <Modal title="Add Wish" showModal={state.showModal}>
      <article class="flex w-full" q:slot="header-left">
        <SwitchFormControl
          label="Advanced"
          id="wish_switch_add"
          name="wish_switch_add"
          value={state.advanced}
          onChangeEvent={onChangeAdvancedToggle}
          hasNoValidation={true}
        />
      </article>
      <section class="flex w-full flex-col gap-2 mt-5" q:slot="body">
        <Form
          id="myCreateWishForm"
          class="flex flex-col gap-2"
          onSubmit$={onSubmit}
        >
          {state.advanced && (
            <Field name="wish_name" type="string">
              {(field, props) => (
                <TextFormControl
                  inputProps={props}
                  size="sm"
                  value={field.value}
                  type="text"
                  id="wish_name"
                  label="Wish name"
                  name="wish_name"
                  validationError={Boolean(field.error)}
                  validationMessage={field.error}
                />
              )}
            </Field>
          )}
          <Field name="wish_description" type="string">
            {(field, props) => (
              <FormTextAreaControl
                inputProps={props}
                value={field.value}
                required
                id="wish_description"
                label={`What do you wish ${userService.state.user.user_name}?`}
                name="wish_description"
                validationError={Boolean(field.error)}
                validationMessage={field.error}
              />
            )}
          </Field>
          {state.advanced && (
            <>
              <Field name="wish_photo" type="File">
                {(field, props) => (
                  <UploadFormControl
                    uploadFile={uploadFile}
                    inputProps={props}
                    id="wish_photo"
                    name="wish_photo"
                    validationError={Boolean(field.error)}
                    validationMessage={field.error}
                  />
                )}
              </Field>
              <div class="flex items-center gap-2 [&>*]:w-[calc(50%-4px)]">
                <Field name="wish_end_date" type="Date">
                  {(field, props) => (
                    <DateFormControl
                      inputProps={props}
                      value={field.value}
                      id="wish_end_date"
                      label="Wish end date"
                      name="wish_end_date"
                      validationError={Boolean(field.error)}
                      validationMessage={field.error}
                    />
                  )}
                </Field>
                <Field name="wish_price" type="number">
                  {(field, props) => (
                    <NumberFormControl
                      size="sm"
                      inputProps={props}
                      value={field.value}
                      id="wish_price"
                      label="Wish price"
                      name="wish_price"
                      validationError={Boolean(field.error)}
                      validationMessage={field.error}
                    />
                  )}
                </Field>
              </div>
            </>
          )}
          <article
            class="flex w-full items-center justify-center"
            onClick$={$(() => console.log(createWishForm))}
          >
            <Button
              buttonType="submit"
              text="Create your wish"
              disabled={createWishForm.invalid}
            />
          </article>
        </Form>
      </section>
    </Modal>
  );
});
