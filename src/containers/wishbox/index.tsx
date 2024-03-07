import {
  component$,
  useContext,
  $,
  useTask$,
  useSignal,
  useStore,
} from "@builder.io/qwik";
import { CreateWishboxModal } from "~/actions/modal/create-wishbox";
import { WishBoxServiceContext } from "~/services/wishbox.service";
import { Button } from "~/style/buttons/button";
import { WishBoxStyle } from "~/style/cards/wishbox";

import { Image } from "@unpic/qwik";
import { useCommonWishboxActions } from "~/actions/wishbox";
import type { Wishbox } from "~/models/wishbox";

export const WishBoxContainer = component$(() => {
  const wishBoxService = useContext(WishBoxServiceContext);
  const data = useSignal<Wishbox[]>([]);
  const state = useStore({
    showModal: {
      value: false,
    },
  });
  const { onSelectWishBox, onAddingWishbox, onDeleteWishbox } =
    useCommonWishboxActions();

  const nextSlide = $(async () => {
    await wishBoxService.nextSlide(data.value.length);
  });

  const prevSlide = $(async () => {
    await wishBoxService.prevSlide();
  });

  const openCreateWishboxModal = $(() => {
    state.showModal = {
      value: true,
    };
  });

  const actionComplete = $((wishbox_name: string, wishbox_id: number) => {
    wishBoxService.state.selectMode = false;
    if (data.value.length === 0) {
      data.value.push({
        id: 0,
        wishbox_name: "all",
      });
    }
    data.value.push({
      id: wishbox_id,
      wishbox_name,
    });
    wishBoxService.state.refresh = {
      value: true,
      added_WishboxName: wishbox_name,
    };
  });

  const deleteWishbox = $(async (wishbox_id: number, wishbox_name: string) => {
    await onDeleteWishbox(wishbox_id, wishbox_name, data);
  });

  useTask$(async () => {
    try {
      const resData = await wishBoxService.getWishboxes();
      if (resData.data.length > 0) {
        data.value = [{ wishbox_name: "all", id: -1 }, ...resData.data];
      }
    } catch (err) {
      console.log("wishbox Error ", err);
    }
  });

  return (
    <>
      <section class="my-3 w-full flex flex-col gap-4">
        <section class="flex items-center gap-3">
          {!wishBoxService.state.selectMode ? (
            <Button text={"CREATE GROUP"} onClick={onAddingWishbox}></Button>
          ) : (
            wishBoxService.state.selectedWishesIdsArrays.length > 0 && (
              <Button
                text={"SAVE GROUP"}
                buttonClass="bg-white"
                onClick={openCreateWishboxModal}
              ></Button>
            )
          )}
          <article class="my-3">
            {wishBoxService.state.selectMode ? (
              <p>
                Please select the wishes that you want to include in the
                GROUP.
              </p>
            ) : (
              <p>
                You can group your wishes into categories, e.g. ‘Christmas
                Wishes’. If you wish to do so, click on ADD GROUP.
              </p>
            )}
          </article>
        </section>
        {data.value.length > 0 &&
          <article class="flex justify-center items-center w-full">
            <p class="text-lg font-special">Wishbox list</p>
          </article>
        }
        <section class="flex w-full items-center justify-center gap-5">
          {data.value.length > 3 ? (
            <>
              <section class="flex w-full items-center justify-center gap-4">
                {wishBoxService.state.index > 0 ? (
                  <Image
                    class="cursor-pointer duration-75 hover:scale-105"
                    onClick$={prevSlide}
                    src="/images/left-arrow.png"
                    layout="constrained"
                    alt="arrow left"
                    width={30}
                    height={30}
                  />
                ) : (
                  <div class="w-[30px]"></div>
                )}
                {data.value
                  .slice(
                    wishBoxService.state.index,
                    wishBoxService.state.index + 3
                  )
                  .map((wishbox: Wishbox, index: number) => (
                    <WishBoxStyle
                      key={"wishbox" + wishbox.id}
                      wishbox={wishbox}
                      selectMode={wishBoxService.state.selectMode}
                      deleteWishbox={deleteWishbox}
                      selectWishBoxAction={onSelectWishBox}
                      wishBoxSelectedIndex={
                        wishBoxService.state.selectedWishBoxIndex
                      }
                      index={index + wishBoxService.state.index}
                    />
                  ))}
                {wishBoxService.state.index < data.value.length - 3 ? (
                  <Image
                    class="cursor-pointer duration-75 hover:scale-105"
                    onClick$={nextSlide}
                    src="/images/right-arrow.png"
                    layout="constrained"
                    alt="arrow left"
                    width={30}
                    height={30}
                  />
                ) : (
                  <div class="w-[30px]"></div>
                )}
              </section>
            </>
          ) : (
            <>
              {data.value.map((wishbox: Wishbox, index: number) => (
                <WishBoxStyle
                  wishbox={wishbox}
                  selectMode={wishBoxService.state.selectMode}
                  wishBoxSelectedIndex={
                    wishBoxService.state.selectedWishBoxIndex
                  }
                  deleteWishbox={deleteWishbox}
                  selectWishBoxAction={onSelectWishBox}
                  index={index}
                  key={"wishbox" + wishbox.id}
                />
              ))}
            </>
          )}
        </section>
      </section>
      <CreateWishboxModal
        showModal={state.showModal}
        actionComplete={actionComplete}
      />
    </>
  );
});
