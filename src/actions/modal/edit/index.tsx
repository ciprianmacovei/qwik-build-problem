import type { NoSerialize } from "@builder.io/qwik";
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
import { WishServiceContext } from "~/services/wish.service";
import {
  reset,
  setValue,
  setValues,
  useForm,
  zodForm$,
} from "@modular-forms/qwik";
import { FormTextAreaControl } from "~/components/form-controls/text-area";
import { SwitchFormControl } from "~/components/form-controls/switch";
import { useAlerts } from "~/hooks/alerts";
import { TextFormControl } from "~/components/form-controls/text";
import { UploadFormControl } from "~/components/form-controls/upload";
import { DateFormControl } from "~/components/form-controls/datetime";
import { LoadingServiceContext } from "~/services/loading.service";
import type { CreateWishFormType } from "../create-wish";
import { createWishSchema } from "../create-wish";
import { NumberFormControl } from "~/components/form-controls/number";
import type { Wish } from "~/models/wish";

interface EditModalProps {
  showModal: {
    value: boolean;
  };
  wish: Wish | undefined;
}

type EditWishForm = {
  wish_id: number | undefined;
} & CreateWishFormType;

export const EditModal = component$(({ showModal, wish }: EditModalProps) => {
  const wishService = useContext(WishServiceContext);
  const loadingService = useContext(LoadingServiceContext);
  const { errorAlert } = useAlerts();
  const state = useStore({
    advanced: false,
    showModal: {
      value: showModal.value,
    },
  });
  const [editWishForm, { Form, Field }] = useForm<EditWishForm>({
    loader: {
      value: {
        wish_id: undefined,
        wish_name: undefined,
        wish_description: "",
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
    setValue(editWishForm, "wish_photo", file);
  });

  const onSubmit = $(async (values: EditWishForm) => {
    try {
      loadingService.simpleLoading = true;
      if (!editWishForm.invalid && wish) {
        state.advanced = false;
        state.showModal = {
          value: false,
        };
        const resData = await wishService.editWish(
          values.wish_description,
          values.wish_name,
          values.wish_photo,
          values.wish_end_date,
          values.wish_price,
          wish.id
        );
        if (resData && resData.data) {
          wishService.onEditWishCompleted(resData.data);
        }
      } else {
        loadingService.simpleLoading = false;
      }
    } catch (err) {
      loadingService.simpleLoading = false;
      await errorAlert("Edit wish failed!", String(err));
      console.log("onSubmitComplete Error ", err);
    }
  });

  useTask$(
    ({ track }) => {
      track(() => showModal);
      if (showModal.value && wish) {
        setValues(editWishForm, {
          wish_name: wish.wish_name || "",
          wish_description: wish.wish_description,
          wish_photo: undefined,
          wish_end_date: new Date(wish.wish_end_date),
          wish_price: wish.wish_price || 0,
        });
      } else {
        reset(editWishForm);
      }
      if (wish?.wish_name || wish?.wish_end_date || wish?.wish_price) {
        state.advanced = true;
      } else {
        state.advanced = false;
      }
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
    <Modal title="Edit Wish" showModal={state.showModal}>
      <article class="flex w-full" q:slot="header-left">
        <SwitchFormControl
          label="Advanced"
          id="wish_switch_edit"
          name="wish_switch_edit"
          value={state.advanced}
          onChangeEvent={onChangeAdvancedToggle}
          hasNoValidation={true}
        />
      </article>
      <section class="flex w-full flex-col gap-2 mt-5" q:slot="body">
        <Form
          id="myEditWishForm"
          class="flex flex-col gap-2"
          onSubmit$={onSubmit}
        >
          {state.advanced && (
            <Field name="wish_name" type="string">
              {(field, props) => (
                <TextFormControl
                  size="sm"
                  inputProps={props}
                  value={field.value}
                  type="text"
                  label="Wish name"
                  id="wish_name_edit"
                  name="wish_name_edit"
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
                id="wish_description_edit"
                name="wish_description_edit"
                label="Wish description"
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
                    id="wish_photo_edit"
                    name="wish_photo_edit"
                    validationError={Boolean(field.error)}
                    validationMessage={field.error}
                  />
                )}
              </Field>
              <div class="flex items-center gap-2 [&>*]:w-[calc(50%-4px)]">
                <Field name="wish_end_date" type="string">
                  {(field, props) => (
                    <DateFormControl
                      inputProps={props}
                      value={field.value}
                      id="wish_end_date_edit"
                      name="wish_end_date_edit"
                      label="Wish end date"
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
                      id="wish_price_edit"
                      label="Wish price"
                      name="wish_price_edit"
                      validationError={Boolean(field.error)}
                      validationMessage={field.error}
                    />
                  )}
                </Field>
              </div>
            </>
          )}
          <article class="flex w-full items-center justify-center">
            <Button
              buttonType="submit"
              text="Edit your wish"
              disabled={editWishForm.invalid}
            />
          </article>
        </Form>
      </section>
    </Modal>
  );
});
