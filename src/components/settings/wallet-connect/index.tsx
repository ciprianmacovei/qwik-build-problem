import { component$, useContext } from '@builder.io/qwik';
import { WalletComponent } from '~/components/wallet-connect';
import { Web3ServiceContext } from '~/services/web3.service';

export const WalletConnect = component$(() => {
    const web3Service = useContext(Web3ServiceContext);
    return <div class="flex p-3 flex-col items-center justify-center gap-4">
        {!web3Service.state.user_wallet ? (
            <>
                <p class="font-nuito text-lg">
                    U can connet with ur wallet in order to recieve the money
                    for your wish, so to have enabled the take or contribute
                    features you will need to connect and save wallet address in
                    order to recieve or give love
                </p>
                <WalletComponent />
                <div class="flex">
                    {web3Service.state.user_wallet && (
                        <div class="flex flex-col gap-2">
                            <div class="flex gap-1">
                                <p>Address:</p>
                                {web3Service.state.user_wallet}
                            </div>
                            {/* <Button text="Add wallet address" onClick={setWallet} /> */}
                        </div>
                    )}
                </div>
            </>
        ) : (
            <p class="font-nuito text-lg break-all" style={{ wordBreak: "break-word" }}>
                Your wallet {web3Service.state.user_wallet} is connected and
                stored thank you, now u can receive your funds on your
                wallet.
            </p>
        )}
    </div>
});