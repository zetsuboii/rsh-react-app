import AppState from "../reach/lib/appState";
import { useState } from "react";

/** 
 * Custom hook to interact with a Reach contract
 * Not really required if contract has only APIs & Views
 * @param {import("../reach/lib/participant").default} participant
 * @param {any} backend
 * @returns {{
 *  appState: AppState?,
 *  updateState: (newVariables: object) => void | null,
 *  run: (role: string, functions: object) => Promise<void>,
 *  proceed: () => void | null
 * }}
 */
const useContract = (participant) => {
    if (participant == undefined)
        throw new Error("User is undefined, panic");

    const [appState, setAppState] = useState(null);

    const runWrap = (role, functions) =>
        participant.run(role, appState, setAppState, functions)

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