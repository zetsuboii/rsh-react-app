import AppState from "./appState";

// Encapsulates functionality of a single account. This way it becomes possible
// to interact with the contract without passing a contract around
// It is assumed that a single User instance interacts with a single contract
// In order to interact with multiple contracts at the same time, it would be 
// sensible to have multiple User's from the same account, although it isn't 
// tested 
class User {
    stdlib = null;
    account = null;
    contract = null;

    constructor(stdlib, account) {
        this.stdlib = stdlib;
        this.account = account;
    }

    setBackend(backend, infoPromise) {
        this.contract = this.account.contract(backend, infoPromise);
    }

    /**
     * Runs the backend of the user
     * @param {string} role 
     * @param {AppState} initState 
     * @param {(AppState) => void} setAppState 
     * @param {{ [key: string]: (AppState) => any }} iface 
     * @returns 
     */
    run(role, initState, setAppState, iface) {
        if(this.contract == undefined)
            throw new Error("Backend is undefined, panic");
        
        console.log(`Running as ${role}`)
        // [1] Keeping a copy of the state inside one function allows us to carry 
        // state between different participant calls, it might be a better idea
        // to ditch this and have a brand new state on each call. In that case
        // state would be held outside of the run function
        let appState = initState

        const wrappedInterface = Object.keys(iface).reduce((prev, name) => {
            // If the value is a variable, add it to the object
            if (!iface[name] instanceof Function)
                return Object.assign(prev, {[name]: iface[name]});
            
            // Otherwise create a wrapped function that updates the app state 
            // and then executes the function logic
            /** @param {...any} ctcArgs */
            const wrapped = async (...ctcArgs) => {
                const newState = await new Promise((resolve, reject) => {
                    setAppState(new AppState({
                        name, resolve, reject, ctcArgs,
                        vars: appState?.vars
                    }));
                });

                // Update the state inside the function [1]
                appState = newState
                return await iface[name](newState);
            }
    
            return Object.assign(prev, { [name]: wrapped });
        }, {})
    
        // Run the participant and try to catch any error
        return (async () => {
            try {
                return await this.contract.participants[role](wrappedInterface);
            }
            catch(e) {
                if(e.message != undefined) {
                    const errObj = JSON.parse(RegExp(/.*({[\w\W]*)/gm).exec(e.message)[1])
                    console.log(errObj)
                    // It is possible to handle errors based on errObj
                } else {
                    console.log(e)
                }
            }
        })()
    }

    // Return APIs of the contract for a role
    apis(role) { 
        return this.contract.apis[role]; 
    }

    // Return View functions of the contract for a role
    views(role) { 
        return this.contract.apis[role]; 
    }
}

export default User;