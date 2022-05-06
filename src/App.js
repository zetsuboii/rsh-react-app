import * as FixedSale from "./reach/artifacts/fixedSale.main.mjs";

import useContract from "./hooks/useContract"
import useReach from "./hooks/useReach"

import { useEffect, useState } from 'react';

function App() {
  const { reachConnected, user, connectReach, disconnectReach} = useReach();

  return (
    <div>
      <h1>{reachConnected ? "Connected" : "Not Connected"}</h1>
      { !reachConnected && <button onClick={connectReach}>Connect Reach</button>}
      { reachConnected && <button onClick={disconnectReach}>Disconnect Reach</button>}
      {reachConnected && <DeployComp user={user} />}
    </div>
  );
}

/** @param {{ user: import("./reach/lib/user").default }} */
const DeployComp = ({ user }) => {
  const [repr, setRepr] = useState('{}')
  const [tokId, setTokId] = useState(0);
  
  const { appState, updateState, run, proceed } = useContract(user);

  useEffect(() => {
    if (appState != null)
      setRepr(JSON.stringify(appState, null, 2))
  }, [appState])

  // Interface of the owner
  // Keep this in an another file
  const ownerFunctions = {
    getNftDetails: async (appState) => {
      return appState.vars.nftDetails;
    }
  }

  const doDeploy = () => {
    // We declare we're deploying by not providing contract information
    user.setBackend(FixedSale);
    // Run the participant in the background
    run("Owner", ownerFunctions);
  }

  const doFulfill = () => {
    // Prepare the state for the getNftDetails function
    updateState({
      nftDetails: {
        tokenId: tokId,
        initialPrice: user.stdlib.parseCurrency(100),
        platformCommission: 1000,
        platformAddress: "QLN3CNSUV7ZGM6CV5EDTWYQHZLGOLCLY76UVRSQM22JKFD2AWRC6NBLPEQ"
      }
    });
    // Proceed to the function
    proceed()
  }

  const optIn = async () => {
    await user.account.tokenAccept(tokId)
    console.log(`Opted in for ${tokId}`)
  }

  const callAPI = async () => {
    console.log(String(await user.apis("UserA").testAPI()));
  }

  return (
    <div>
      <input onChange={(e) => {setTokId(e.target.value)}} />
      <button onClick={optIn}>Opt In</button>
      <pre>{repr}</pre>
      <button onClick={doDeploy}>Deploy</button>
      <button onClick={doFulfill}>Return NFT params</button>
      <button onClick={callAPI}>Call Test API</button>
    </div>
  );
}

export default App;
