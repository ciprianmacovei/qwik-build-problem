import { component$, $, useTask$ } from '@builder.io/qwik';
import { useLocation } from '@builder.io/qwik-city';
import { isServer } from '@builder.io/qwik/build';
import { useAlerts } from '~/hooks/alerts';


interface TwitterLoginProps {
    link: string;
}

export const TwitterLogin = component$(({ link }: TwitterLoginProps) => {
    const location = useLocation();
    const { errorAlert } = useAlerts();
    const authWithTwitter = $(() => {
        if (link) {
            window.location.href = link;
        } else {
            errorAlert(
                "Twitter auth link",
                `
                There was an error with generating twitter auth url. 
                If the problem persists please contact support.
                `
            );
        }
    })

    useTask$(({ track }) => {
        track(() => location.params)
        if (isServer) return;
        console.log(location.params, "@@@@@@@@");
    })

    return <button class="btn btn-active font-nuito h-[44px] max-w-[400px]" onClick$={authWithTwitter}>Sign up with X</button>
});