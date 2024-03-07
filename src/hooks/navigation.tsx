import { useNavigate } from "@builder.io/qwik-city";
import type { QRL} from "@builder.io/qwik";
import { $, useContext } from "@builder.io/qwik";
import { LoadingServiceContext } from "~/services/loading.service";

interface UseCustomNavigation {
    navigateWithLoading: QRL<(path: string) => Promise<void>>
    appNavigateWishLoading: QRL<(path: string) => Promise<void>>
}

export const useCustomLoadingNavigation = (): UseCustomNavigation => {
    const navigation = useNavigate();
    const loadingState = useContext(LoadingServiceContext);

    const navigateWithLoading = $(async (path: string) => {
        try {
            loadingState.loading = true;
            await navigation(path)
        } catch (err) {
            console.error("navigateWithLoading Error ", err);
        } finally {
            loadingState.loading = false;
        }
    })

    const appNavigateWishLoading = $(async (path: string) => {
        try {
            loadingState.appLoading = true;
            await navigation(path)
        } catch (err) {
            console.error("navigateWithLoading Error ", err);
        } finally {
            loadingState.appLoading = false;
        } 
    })

    return {
        navigateWithLoading,
        appNavigateWishLoading
    }
}