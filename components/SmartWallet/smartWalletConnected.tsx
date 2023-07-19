import { ThirdwebNftMedia, ThirdwebSDKProvider, Web3Button, useAddress, useBalance, useContract, useOwnedNFTs } from "@thirdweb-dev/react";
import { Signer } from "ethers";
import React from "react";
import { EDITIONDROP_ADDRESS, TOKENDROP_ADDRESS, activeChain } from "../../const/constants";


interface ConnectedProps {
    signer: Signer | undefined;
};

const SmartWalletConnected: React.FC<ConnectedProps> = ({ signer }) => {
    return (
        <ThirdwebSDKProvider signer={signer} activeChain={activeChain}>
            <ClaimTokens/>
        </ThirdwebSDKProvider>
    )
}

const ClaimTokens = () => {
    const address = useAddress()
    const {
        data: tokenBalance,
        isLoading: tokenBalanceIsLoading
    } = useBalance(TOKENDROP_ADDRESS)

    const {
        contract
    } = useContract(EDITIONDROP_ADDRESS)
    const {
        data: ownedNFTs,
        isLoading: ownedNFTsIsLoading
    } = useOwnedNFTs(contract, address)
    
    return (
        <div>
            <p>Smart Wallet addres: <span style={{overflowWrap: "break-word", maxWidth: "280px"}}>{address}</span></p>
            <h1>Claim Tokens:</h1>
            {tokenBalanceIsLoading ? (
                <p>Loading...</p>
            ) : (
                <p>Token Balance: {tokenBalance?.displayValue}</p>
            )}
            <Web3Button
                contractAddress={TOKENDROP_ADDRESS}
                action={contract => contract.erc20.claim(10)}
            >Claim Tokens</Web3Button>
        <br/>
        <h1>Claim NFT:</h1>
        <Web3Button
            contractAddress={EDITIONDROP_ADDRESS}
            action={contract => contract.erc1155.claim(0, 1)}
        >Claim NFT</Web3Button>
        {ownedNFTsIsLoading ? (
            <p>Loading...</p>
        ) : (
            <div>
                {ownedNFTs && ownedNFTs.length > 0 ? (
                    ownedNFTs.map((nft, index) => {
                        return (
                            <div key={index}>
                                <ThirdwebNftMedia
                                    metadata={nft.metadata}
                                />
                                <p>{nft.metadata.name}</p>
                                <p>QTY: {nft.quantityOwned}</p>
                            </div>
                        )
                    })
                    
                    
                ) : (
                    <p>You have no NFTs</p>
                )}
            </div>
        )}
        </div>
    )
}

export default SmartWalletConnected
