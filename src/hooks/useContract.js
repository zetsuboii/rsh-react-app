import AppState from "../reach/lib/appState";
import { useState } from "react";

/** 
 * Custom hook to interact with a Reach contract
 * Not really required if contract has only APIs & Views
 * @param {import("../reach/lib/user").default} user
 * @param {any} backend
 */
const useContract = (user) => {
    if(user == undefined)
        throw new Error("User is undefined, panic");

    const [appState, setAppState] = useState(null);

    const runWrap = (role, functions) =>
        user.run(role, appState, setAppState, functions)

    const updateState = (newVariables) => {
        const newState = AppState.update(appState, newVariables)
        setAppState(newState);
    }

    // Resolves the participant function Promise
    const proceed = () => appState.resolve(appState)

    return {
        appState, 
        updateState,
        run: runWrap,
        proceed
    };
}

export default useContract;