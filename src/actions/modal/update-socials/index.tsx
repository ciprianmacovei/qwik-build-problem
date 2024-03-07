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
import type { SocialPlatformType } from "~/models/types/types";
import { UserServiceContext } from "~/services/user.service";
import { TextFormControl } from "~/components/form-controls/text";
import { useAlerts } from "~/hooks/alerts";

interface UpdateSocialsProps {
  platformKey: SocialPlatformType;
  showModal: {
    value: boolean;
  };
  actionComplete: QRL<(partformKey: SocialPlatformType, handller: string) => void>;
}

export const UpdateSocialsModal = component$(
  ({ platformKey, showModal, actionComplete }: UpdateSocialsProps) => {
    const { successAlert, errorAlert } = useAlerts();
    const userService = useContext(UserServiceContext);
    const state = useStore({
      handller: "",
      showModal: {
        value: false,
      },
    });

    const getHanddler = $(($event: Event) => {
      state.handller = ($event.target as HTMLInputElement).value;
    });

    const onSubmit = $(async () => {
      if (state.handller) {
        const res = await userService.setUserSocials(
          platformKey,
          state.handller
        );
        if (res) {
          actionComplete(platformKey, state.handller);
          successAlert("Success", "Successfully updated social");
        } else {
          errorAlert("Error", "Error updating social");
        }
        state.showModal = {
          value: false,
        };
      }
    });

    useTask$(
      ({ track }) => {
        track(() => showModal);
        if (showModal.value) {
          state.handller = "";
        }
        state.showModal = {
          value: showModal.value,
        };
      }
    );

    return (
      <Modal title={platformKey} showModal={state.showModal}>
        <section class="flex h-full w-full flex-col gap-4 mt-3" q:slot="body">
          <p class="text-md font-bold font-nuito">
            Add your {platformKey} handdler an example should be
            {platformKey}.com/example in this case example will be your handdler
          </p>
          <TextFormControl
            id={platformKey + "_social"}
            name={platformKey + "_social"}
            onChangeEvent={getHanddler}
            label={platformKey}
            type="text"
            value={state.handller}
          />
          <Button text="Save" onClick={onSubmit} />
        </section>
      </Modal>
    );
  }
);
