import type { QRL } from "@builder.io/qwik";
import { $, component$, useStore, useTask$ } from "@builder.io/qwik";
import { Modal } from "../../../components/modal";
import { Button } from "~/style/buttons/button";
import { TextFormControl } from "~/components/form-controls/text";
import { useAlerts } from "~/hooks/alerts";
import type { Wish } from "~/models/wish";

interface ContributionProps {
  wish: Wish;
  showModal: {
    value: boolean;
  };
  actionComplete: QRL<(wish: Wish, contribution: number) => Promise<void>>;
}

export const ContributeModal = component$(
  ({ showModal, actionComplete, wish }: ContributionProps) => {
    const { errorAlert } = useAlerts();
    const state = useStore({
      contribution: 0,
      showModal: {
        value: showModal.value,
      },
      isInvalidControl: false,
      invalidControlMessage: "",
    });

    const getContribution = $(($event: Event) => {
      try {
        const price = Number(($event.target as HTMLInputElement).value);
        if (price > 0 && price < wish.wish_price! - wish.wish_contribution) {
          state.isInvalidControl = false;
          state.invalidControlMessage = "";
          state.contribution = price;
        } else {
          state.isInvalidControl = true;
          state.invalidControlMessage = `You need to go from ${
            wish!.wish_contribution
          } to ${wish!.wish_price}`;
        }
      } catch (err) {
        errorAlert("Error", "Please select a valid amount");
      }
    });

    const onSubmit = $(async () => {
      if (state.contribution) {
        actionComplete(wish!, state.contribution);
        state.showModal = {
          value: false,
        };
      } else {
        errorAlert("Error", "Please select a valid amount");
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
      <Modal title="Contribution" showModal={state.showModal}>
        <section class="flex h-full w-full flex-col gap-4 mt-3" q:slot="body">
          <TextFormControl
            id="contribution-control"
            name="contribution-control"
            onChangeEvent={getContribution}
            validationError={state.isInvalidControl}
            validationMessage={state.invalidControlMessage}
            label={"Contribution Sum"}
            type="text"
          />
          <Button text="Save" disabled={state.isInvalidControl} onClick={onSubmit} />
        </section>
      </Modal>
    );
  }
);
