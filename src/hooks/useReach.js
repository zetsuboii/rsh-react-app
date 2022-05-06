// import { ALGO_MyAlgoConnect as MyAlgoConnect } from "@reach-sh/stdlib";
import { loadStdlib } from "@reach-sh/stdlib";
import { useState } from "react";
import User from "../reach/lib/user";

const stdlib = loadStdlib("ALGO");

stdlib.setWalletFallback(stdlib.walletFallback({
    // Uncomment to switch to mainnet
    // providerEnv: "MainNet", 
    // MyAlgoConnect
}));

/**
 * Custom hook to connect wallet
 * @returns {{
 *  user: User,
 *  reachConnected: boolean,
 *  connectReach: () => Promise<any>
 *  disconnectReach: () => void
 * }}
 */
const useReach = () => {
    const [ reachConnected, setReachConnected ] = useState(false);
    const [ user, setUser ] = useState(null);
    
    // Connects to the wallet and creates a User abstraction
    const connectReach = async () => {
        if(reachConnected) return;

        // Change it to the commented to use wallets
        const account = await stdlib.newTestAccount(stdlib.parseCurrency(5000))
        // const account = await stdlib.getDefaultAccount();

        console.log(`Connected with address:\n${stdlib.formatAddress(account)}`)
        setUser(new User(stdlib, account));
        setReachConnected(true);
    };

    // TODO: Doesn't work, understand how disconnect works
    const disconnectReach = async() => {
        if(!reachConnected) return;
        
        stdlib.disconnect(user.account);
        console.log("Disconnected")

        setUser(null);
        setReachConnected(false);
    }

    return { reachConnected, user, connectReach, disconnectReach };
};

export default useReach;