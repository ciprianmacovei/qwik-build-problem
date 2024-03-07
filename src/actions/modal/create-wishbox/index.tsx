import type { QRL } from "@builder.io/qwik";
import {
  $,
  component$,
  useContext,
  useStore,
  useTask$,
} from "@builder.io/qwik";
import { Modal } from "../../../components/modal";
import { Button } from "~/style/buttons/button";
import { TextFormControl } from "~/components/form-controls/text";
import { useAlerts } from "~/hooks/alerts";
import { WishBoxServiceContext } from "~/services/wishbox.service";

interface CreateWishboxProps {
  showModal: {
    value: boolean;
  };
  actionComplete: QRL<(wishbox_name: string, wishbox_id: number) => void>;
}

export const CreateWishboxModal = component$(
  ({ showModal, actionComplete }: CreateWishboxProps) => {
    const { successAlert, errorAlert } = useAlerts();
    const wishboxService = useContext(WishBoxServiceContext);
    const state = useStore({
      showModal: {
        value: showModal.value,
      },
      wishboxName: "",
    });

    const getHanddler = $(($event: Event) => {
      state.wishboxName = ($event.target as HTMLInputElement).value;
    });

    const onSubmit = $(async () => {
      if (state.wishboxName) {
        const res = await wishboxService.createWishbox(
          state.wishboxName
        );
        if (res.data) {
          actionComplete(res.data.wishbox_name, res.data.id);
          successAlert(
            "Success",
            `Successfully create wishbox ${state.wishboxName}`
          );
        } else {
          errorAlert("Error", "Error adding wishobox, your wishbox name should be unique.");
        }
        state.showModal = {
          value: false,
        };
      }
    });

    useTask$(
      ({ track }) => {
        track(() => showModal);
        state.showModal = {
          value: showModal.value,
        };
      }
    );

    return (
      <Modal title="Create Wishbox" showModal={state.showModal}>
        <section class="flex h-full w-full flex-col gap-4 mt-3" q:slot="body">
          <TextFormControl
            id="wishboxCreateName"
            name="wishboxCreateName"
            onChangeEvent={getHanddler}
            label="Wishbox name"
            type="text"
          />
          <Button text="Save" onClick={onSubmit} />
        </section>
      </Modal>
    );
  }
);
