import type {
    NoSerialize,
    QRL
} from "@builder.io/qwik";
import {
    createContextId,
    useContextProvider,
    useStore,
    $,
    noSerialize
} from "@builder.io/qwik";
import { io, type Socket } from "socket.io-client";

export type SectionType = "profile" | "settings";

interface SocketData {
    user_name?: string;
    novu_subscriber_id?: string;
}
interface WssService {
    state: WssServiceState;
    setSocket: QRL<(userData: SocketData) => void>
    disconnectSocket: QRL<() => void>
}

interface WssServiceState {
    socketIO: NoSerialize<Socket> | undefined;
}



export const WssServiceContext = createContextId<WssService>(
    "wss-service-context"
);



export const useWssService = () => {
    const state = useStore<WssServiceState>({
        socketIO: undefined
    });

    const setSocket = $((userData: SocketData) => {
        const socket = io({
            transports: ['websocket'],
            autoConnect: true,
        });
        socket.on("connect", () => {
            console.log("wss connected");
            socket.emit('join_notifications',
                {
                    user_name: userData.user_name,
                    room: userData.novu_subscriber_id,
                }
            );
        })
        state.socketIO = noSerialize(socket);
    });

    const disconnectSocket = $(() => {
        state.socketIO?.disconnect();
    })

    const service = {
        state,
        setSocket,
        disconnectSocket
    };
    useContextProvider(WssServiceContext, service);
};
