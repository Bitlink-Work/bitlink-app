

export function shortenAddress(contractAddress: string | any, leftChacterAmount : number, rightChacterAmount : number) {
    if(contractAddress == "" || !contractAddress) return "--"
    else {
        const firstFiveCharacters = contractAddress.slice(0, leftChacterAmount);
        const lastFourCharacters = contractAddress.slice(-rightChacterAmount);
        return `${firstFiveCharacters}...${lastFourCharacters}`
    }
}