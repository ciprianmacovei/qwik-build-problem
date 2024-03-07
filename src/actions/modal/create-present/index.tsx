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
import { z } from "@builder.io/qwik-city";
import { reset, setValue, useForm, zodForm$ } from "@modular-forms/qwik";
import { FormTextAreaControl } from "~/components/form-controls/text-area";
import { SwitchFormControl } from "~/components/form-controls/switch";
import { useAlerts } from "~/hooks/alerts";
import { UploadFormControl } from "~/components/form-controls/upload";
import { DateFormControl } from "~/components/form-controls/datetime";
import { LoadingServiceContext } from "~/services/loading.service";
import { NumberFormControl } from "~/components/form-controls/number";
import { isServer } from "@builder.io/qwik/build";
import { UserServiceContext } from "~/services/user.service";
import { CheckboxInput } from "~/components/form-controls/checkbox";

const MAX_FILE_SIZE = 2000000;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png"];

interface CreateModalProps {
  showModal: {
    value: boolean;
  };
}

export const createPresentSchema = z.object({
  present_description: z
    .string()
    .min(1, "please complete present description")
    .max(255, "text is too big"),
  random_winner: z.boolean().optional(),
  present_photo: z
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
  present_end_date: z.date().optional(),
  present_price: z.number().optional(),
});

export type CreatePresentFormType = z.infer<typeof createPresentSchema>;

export const CreatePresentModal = component$(({ showModal }: CreateModalProps) => {
  const userService = useContext(UserServiceContext);
  const loadingService = useContext(LoadingServiceContext);
  const { errorAlert } = useAlerts();
  const state = useStore({
    preventFocus: false,
    advanced: false,
    showModal: {
      value: false,
    },
  });
  const [createWishForm, { Form, Field }] = useForm<CreatePresentFormType>({
    loader: {
      value: {
        present_description: "",
        random_winner: undefined,
        present_photo: undefined,
        present_end_date: undefined,
        present_price: 0,
      },
    },
    validate: zodForm$(createPresentSchema),
    validateOn: "submit",
  });

  const onChangeAdvancedToggle = $(($event: any) => {
    state.advanced = $event.target.checked;
  });

  const uploadFile = $((file: NoSerialize<File>) => {
    setValue(createWishForm, "present_photo", file);
  });

  const onSubmit = $(async (values: CreatePresentFormType) => {
    try {
      if (!createWishForm.invalid) {
        state.advanced = false;
        state.showModal = {
          value: false,
        };
        console.log(values);
        // loadingService.simpleLoading = true;
      }
    } catch (err) {
      loadingService.simpleLoading = false;
      await errorAlert("Login failed!", String(err));
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
    <Modal title="Create Present" showModal={state.showModal}>
      <article class="flex w-full" q:slot="header-left">
        <SwitchFormControl
          label="Advanced"
          id="present_switch_add"
          name="present_switch_add"
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
          <Field name="present_description" type="string">
            {(field, props) => (
              <FormTextAreaControl
                inputProps={props}
                value={field.value}
                required
                id="present_description"
                label={`${userService.state.user.user_name} your present description`}
                name="present_description"
                validationError={Boolean(field.error)}
                validationMessage={field.error}
              />
            )}
          </Field>
          {state.advanced && (
            <>
              <Field name="random_winner" type="boolean">
                {(field, props) => (
                  <CheckboxInput
                    inputProps={props}
                    inputValue={field.value}
                    name="random_winner"
                    label="Random Winner"
                  />
                )}
              </Field>
              <Field name="present_photo" type="File">
                {(field, props) => (
                  <UploadFormControl
                    uploadFile={uploadFile}
                    inputProps={props}
                    id="present_photo"
                    name="present_photo"
                    validationError={Boolean(field.error)}
                    validationMessage={field.error}
                  />
                )}
              </Field>
              <div class="flex items-center gap-2 [&>*]:w-[calc(50%-4px)]">
                <Field name="present_end_date" type="Date">
                  {(field, props) => (
                    <DateFormControl
                      inputProps={props}
                      value={field.value}
                      id="present_end_date"
                      label="Present end date"
                      name="present_end_date"
                      validationError={Boolean(field.error)}
                      validationMessage={field.error}
                    />
                  )}
                </Field>
                <Field name="present_price" type="number">
                  {(field, props) => (
                    <NumberFormControl
                      size="sm"
                      inputProps={props}
                      value={field.value}
                      id="present_price"
                      label="Present price"
                      name="present_price"
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
              text="Create your present"
              disabled={createWishForm.invalid}
            />
          </article>
        </Form>
      </section>
    </Modal>
  );
});
