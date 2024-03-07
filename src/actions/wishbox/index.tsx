import type { QRL, Signal } from "@builder.io/qwik";
import { $, useContext } from "@builder.io/qwik";
import { useAlerts } from "~/hooks/alerts";
import type { Wishbox } from "~/models/wishbox";
import { WishBoxServiceContext } from "~/services/wishbox.service";

interface UseBaseWishboxActionReturnType {
    onSelectWishBox: QRL<(index: number, wishbox: Wishbox, refresh: boolean) => void>
    onDeleteWishbox: QRL<(wishbox_id: number, wishbox_name: string, data: Signal<Wishbox[]>) => void> 
    onAddingWishbox: QRL<() => void> 
}

export const useCommonWishboxActions = (): UseBaseWishboxActionReturnType => {
  const wishboxService = useContext(WishBoxServiceContext);
  const { errorAlert } = useAlerts();

  const onSelectWishBox = $(
    (index: number, wishbox: Wishbox, refresh: boolean) => {
      if (!wishboxService.state.selectMode) {
        wishboxService.state.selectedWishBoxIndex = index;
        wishboxService.state.selectedWishbox = wishbox.wishbox_name;
        if (refresh) {
          wishboxService.state.refresh = {
            value: true,
          };
        }
      }
    }
  );

  const onDeleteWishbox = $(
    async (
      wishbox_id: number,
      wishbox_name: string,
      data: Signal<Wishbox[]>
    ) => {
      const index: number = data.value.findIndex(
        (w: Wishbox) => w.id === wishbox_id
      );
      try {
        data.value.splice(index, 1);
        data.value = [...data.value];
        if (data.value.length >= 2) {
          onSelectWishBox(0, { wishbox_name: "all", id: 0 }, false);
        } else {
          data.value = [];
        }
        wishboxService.state.refresh = {
          value: true,
          deleted_WishboxName: wishbox_name,
        };
        await wishboxService.deleteWishbox(wishbox_id, wishbox_name);
      } catch (err) {
        errorAlert("Error deleting wishbox", "An error occurred please try again later");
        data.value.splice(index, 0, {
          id: wishbox_id,
          wishbox_name: wishbox_name,
        });
        data.value = [...data.value];
        console.log(err, "delete wishbox req error");
      }
    }
  );

  const onAddingWishbox = $(() => {
    onSelectWishBox(0, { wishbox_name: "all", id: 0 }, true);
    wishboxService.state.selectMode = true;
  });

  return {
    onSelectWishBox,
    onAddingWishbox,
    onDeleteWishbox,
  };
};
