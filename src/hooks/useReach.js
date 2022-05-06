// import { ALGO_MyAlgoConnect as MyAlgoConnect } from "@reach-sh/stdlib";
import { loadStdlib } from "@reach-sh/stdlib";
import { useState } from "react";
import Participant from "../reach/lib/participant";

const stdlib = loadStdlib("ALGO");

stdlib.setWalletFallback(stdlib.walletFallback({
    // Uncomment to switch to mainnet
    // providerEnv: "MainNet", 
    // MyAlgoConnect
}));

/**
 * Custom hook to connect wallet
 * @returns {{
 *  participant: Participant,
 *  reachConnected: boolean,
 *  connectReach: () => Promise<any>
 *  disconnectReach: () => void
 * }}
 */
const useReach = () => {
    const [reachConnected, setReachConnected] = useState(false);
    const [participant, setParticipant] = useState(null);

    // Connects to the wallet and creates a Participant abstraction
    const connectReach = async () => {
        if (reachConnected) return;

        // Change it to the commented to use wallets
        const account = await stdlib.newTestAccount(stdlib.parseCurrency(5000))
        // const account = await stdlib.getDefaultAccount();

        console.log(`Connected with address:\n${stdlib.formatAddress(account)}`)
        setParticipant(new Participant(stdlib, account));
        setReachConnected(true);
    };

    // TODO: Doesn't work, understand how disconnect works
    const disconnectReach = async () => {
        if (!reachConnected) return;

        stdlib.disconnect(participant.account);
        console.log("Disconnected")

        setParticipant(null);
        setReachConnected(false);
    }

    return { reachConnected, participant, connectReach, disconnectReach };
};

export default useReach;