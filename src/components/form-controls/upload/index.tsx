import type { NoSerialize, QRL } from "@builder.io/qwik";
import { $, component$, noSerialize, useOn, useSignal, useStore } from "@builder.io/qwik";

import cn from "classnames";

interface UploadFormControlProps {
    uploadFile: QRL<(file: NoSerialize<File>) => void>;
    inputProps?: any;
    id: string;
    name: string;
    validationError?: boolean;
    validationMessage?: string;
    required?: boolean;
}

interface UploadFormControlState {
    dragStarted: boolean;
    file: NoSerialize<File> | undefined;
}

export const UploadFormControl = component$(({
    uploadFile,
    inputProps,
    id,
    name,
    validationError,
    validationMessage,
    required
}: UploadFormControlProps) => {
    const uploadFormControlState = useStore<UploadFormControlState>({
        dragStarted: false,
        file: undefined,
    })
    const uploadFormControlRef = useSignal<HTMLInputElement>();

    const selectFile = $(($event: any) => {
        const file = $event.target?.files?.[0];
        if (file) {
            uploadFormControlState.file = noSerialize(file);
        }
    })

    useOn(
        "dragover",
        $(($event: Event) => {
            $event.preventDefault();
            uploadFormControlState.dragStarted = true
        })
    );

    useOn(
        "dragleave",
        $(() => {
            uploadFormControlState.dragStarted = false;
        })
    );

    useOn(
        "drop",
        $(async ($event: DragEvent) => {
            $event.preventDefault();
            const file = $event.dataTransfer?.files[0];
            if (file) {
                await uploadFile(noSerialize(file))
                uploadFormControlState.file = noSerialize(file);
            }
            uploadFormControlState.dragStarted = false;
        })
    );

    return (
        <div
            id="drop-container"
            class="relative font-nuito flex items-center justify-center w-full"
        >
            <div class="z-10 w-full sm:max-w-lg">
                <div class="grid grid-cols-1 space-y-2">
                    <label for={id} class="text-sm font-bold tracking-wide text-gray-500 relative">
                        {required && <span class="font-bold text-red-600 absolute top-0.5 z-3">*</span>}
                        <span class={cn(required && "ml-3")}>Attach File (jpeg, png, gif)</span>
                    </label>
                    <div class="flex w-full items-center justify-center">
                        <label
                            class={cn(
                                "group flex w-full flex-col border-dashed rounded-lg border-4 p-2 text-center",
                                uploadFormControlState.dragStarted && "border-solid border-pink-500",
                                validationError && "border-solid border-red-500"
                            )}
                        >
                            <section class="flex h-full w-full flex-col items-center justify-center text-center  ">
                                <article class="pointer-none text-gray-500 max-w-full">
                                    {uploadFormControlState.file ?
                                        <p class="text-ellipsis overflow-hidden">
                                            {uploadFormControlState.file.name}
                                        </p> :
                                        <p class="text-sm">Drag and drop files here or </p>
                                    }
                                    <p>
                                        {uploadFormControlState.file ?
                                            <>
                                                <span class="text-blue-600 cursor-pointer hover:underline">
                                                    select other file
                                                </span>
                                                <span class="text-gray-500"> from your computer </span>
                                            </> :
                                            <>
                                                <span class="text-blue-600 cursor-pointer hover:underline">
                                                    select a file
                                                </span>
                                                <span class="text-gray-500"> from your computer </span>
                                            </>
                                        }
                                    </p>
                                </article>
                            </section>
                            <input
                                ref={uploadFormControlRef}
                                onChange$={selectFile}
                                {...inputProps}
                                id={id}
                                type="file"
                                name={name}
                                class="hidden"
                            />
                        </label>
                    </div>
                </div>
                <section class="flex mb-3">
                    {validationError && <p class="text-[11px] text-red-500">{validationMessage}</p>}
                </section>
            </div>
        </div>
    );
});
