import type { NoSerialize, QRL, Signal } from "@builder.io/qwik";
import {
  $,
  component$,
  useContext,
  useOn,
  useStore,
  useTask$,
} from "@builder.io/qwik";
import { Modal } from "~/components/modal";
import { Button } from "~/style/buttons/button";
import {
  maxLength,
  maxSize,
  mimeType,
  required,
  reset,
  setValue,
  setValues,
  useForm,
} from "@modular-forms/qwik";
import { FormTextAreaControl } from "~/components/form-controls/text-area";
import { useAlerts } from "~/hooks/alerts";
import { UploadFormControl } from "~/components/form-controls/upload";
import { UserServiceContext } from "~/services/user.service";
import type { UserProfile } from "~/models/user";

const MAX_FILE_SIZE = 2000000;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png"];

interface EditProfileModalProps {
  showModal: {
    value: boolean;
  };
  userProfile: Signal<UserProfile | undefined>;
  actionComplete: QRL<(newUserDescription: string) => void>;
}

type EditProfileForm = {
  user_description: string;
  user_picture: NoSerialize<File> | undefined;
};

export const EditProfileModal = component$(
  ({ showModal, userProfile, actionComplete }: EditProfileModalProps) => {
    const userService = useContext(UserServiceContext);
    const { errorAlert } = useAlerts();
    const state = useStore({
      advanced: false,
      showModal: {
        value: showModal.value,
      },
    });
    const [userProfileForm, { Form, Field }] = useForm<EditProfileForm>({
      loader: {
        value: {
          user_description: "",
          user_picture: undefined,
        },
      },
      validateOn: "submit",
    });

    const uploadFile = $((file: NoSerialize<File>) => {
      setValue(userProfileForm, "user_picture", file);
    });

    const onSubmit = $(async (values: EditProfileForm) => {
      try {
        if (!userProfileForm.invalid && userProfile.value) {
          const resData = await userService.setUserProfile(
            values.user_description,
            values.user_picture
          );
          if (resData) {
            await actionComplete(values.user_description);
            state.advanced = false;
            state.showModal = {
              value: false,
            };
          }
        }
      } catch (err) {
        await errorAlert("Edit profile failed!", String(err));
        console.log("onSubmitComplete Error ", err);
      }
    });

    useTask$(
      ({ track }) => {
        track(() => showModal);
        if (showModal.value && userProfile.value) {
          setValues(userProfileForm, {
            user_description: userProfile.value.user_description,
            user_picture: undefined,
          });
        } else {
          reset(userProfileForm);
        }
        state.advanced = false;
        state.showModal = {
          value: showModal.value,
        };
      }
    );

    useOn(
      "keydown",
      $(($event: any) => {
        if ($event.key === "Escape" && state.showModal.value) {
          state.showModal = { value: false };
        }
      })
    );

    return (
      <Modal title="Edit Profile" showModal={state.showModal}>
        <section class="flex w-full flex-col gap-2 mt-5" q:slot="body">
          <Form
            id="myEditProfileForm"
            class="flex flex-col gap-2"
            onSubmit$={onSubmit}
          >
            <Field
              name="user_description"
              type="string"
              validate={[
                required("Please enter your description.") as any,
                maxLength(255, "Description to long"),
              ]}
            >
              {(field, props) => (
                <FormTextAreaControl
                  inputProps={props}
                  value={field.value}
                  required
                  id="user_description"
                  name="user_description"
                  label="User description"
                  validationError={Boolean(field.error)}
                  validationMessage={field.error}
                />
              )}
            </Field>
            <Field
              name="user_picture"
              type="File"
              validate={[
                maxSize(MAX_FILE_SIZE, "Max file size is 2MB."),
                mimeType(
                  ACCEPTED_IMAGE_TYPES,
                  ".jpg, .jpeg, .png file are accepted."
                ),
              ]}
            >
              {(field, props) => (
                <UploadFormControl
                  uploadFile={uploadFile}
                  inputProps={props}
                  id="user_picture"
                  name="user_picture"
                  validationError={Boolean(field.error)}
                  validationMessage={field.error}
                />
              )}
            </Field>
            <article class="flex w-full items-center justify-center">
              <Button
                buttonType="submit"
                text="Save profile"
                disabled={userProfileForm.invalid}
              />
            </article>
          </Form>
        </section>
      </Modal>
    );
  }
);
