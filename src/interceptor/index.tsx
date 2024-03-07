export const CustomFetch = async (
    url: string,
    method: string,
    options?: Headers,
    body?: Object,
    signal?: AbortController
) => {
    const getStorageKey = (key: string) => {
        const userSession = JSON.parse(sessionStorage.getItem("user") ?? "null");
        const userStorage = JSON.parse(localStorage.getItem("user") ?? "null");
        const storage = userSession ?? userStorage;
        return storage[key];
    };

    const AuthorizationHeader = getStorageKey("token");
    const isFormData = body instanceof FormData;
    try {
        const res = await fetch(url, {
            method,
            ...(body && { body: !isFormData ? JSON.stringify(body) : body }),
            headers: {
                ...options,
                ...(!isFormData && { "Content-Type": "application/json" }),
                ...(AuthorizationHeader && {
                    Authorization: "Bearer " + AuthorizationHeader,
                }),
            },
            ...(signal && { signal: signal.signal }),
        });
        if (res.ok) {
            return res.json();
        }
    } catch (err) {
        console.log(err);
    }
};
