# Reach React Starter

Intended as a simple React app that shows how Reach works with functional React

Connect wallet using:
```js
const { reachConnected, connectReach, participant } = useReach();

return <>
    { !reachConnected && <button onClick={connectReach}>Connect Wallet</button> }
</>
```

Run a participant using:
```js
// After connecting wallet, we'll have a participant object
const { appState, updateState, run, proceed } = useContract(participant);

const participantFunctions = {
    doA: (appState) => { return 100; },
    doB: (appState) => { return appState.vars.varX * 100; }
}

const startApp = () => {
    participant.setBackend(CompiledBackend);
    run(participant, participantFunctions);
}

// It is better to render a different component depending on the currently called
// function
const render = (name) => {
    switch (name) {
        case "doA": return <DoA />
        case "doB": return <DoB />
        default: return <button onClick={startApp}>Start Reach Application</button>
    }
} 

return <>
    { render(appState?.name) }
</>
```