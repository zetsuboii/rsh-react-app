// Not used in current version, but generally it should be used this way
export const ownerInterface = {
    getNftDetails: async (appState) => {
        return appState.vars.nftDetails;
    }
}