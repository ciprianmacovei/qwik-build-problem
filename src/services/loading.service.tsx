import { createContextId, useContextProvider, useStore } from "@builder.io/qwik";

export interface loadingStateType {
    loadingTransparent: boolean;
    loading: boolean;
    appLoading: boolean;
    appLoadingTransparent: boolean;
    simpleLoading: boolean;
  }
  
export const LoadingServiceContext = createContextId<loadingStateType>('loading-context');

export const useLoadingService = () => {

 const loadingState = useStore<loadingStateType>({
    loading: false,
    loadingTransparent: false,
    appLoading: false,
    appLoadingTransparent: false,
    simpleLoading: false,
  });

  useContextProvider(LoadingServiceContext, loadingState);
}