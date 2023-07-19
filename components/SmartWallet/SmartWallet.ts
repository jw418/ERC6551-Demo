import { NFT, SmartContract } from "@thirdweb-dev/sdk";
import { BaseContract } from "ethers";
import { IMPLEMENTATION_ADDRESS, NFTDROP_ADDRESS, activeChain } from "../../const/constants";
import { FACTORY_ADDRESS, TW_API_KEY } from "../../const/constants";
import { ethers } from "ethers";
import { WalletOptions, SmartWallet } from "@thirdweb-dev/wallets";
import type { SmartWalletConfig } from "@thirdweb-dev/wallets";

export default function newSmartWallet(token: NFT) {
    //Smart Wallet config object
    const config: WalletOptions<SmartWalletConfig> = {
        chain: activeChain, // the chain where your smart wallet will be or is deployed
        factoryAddress: FACTORY_ADDRESS, // your own deployed account  factory address
        thirdwebApiKey: TW_API_KEY, // your thirdweb api key
        gasless: true, // if you want to use gasless transactions
        factoryInfo: {
            createAccount: async(
                factory: SmartContract<BaseContract>,
                owner: string
            ) => {
                const account = factory.prepare('createAccount', [
                    IMPLEMENTATION_ADDRESS,
                    activeChain.chainId,
                    NFTDROP_ADDRESS,
                    token.metadata.id,
                    0,
                    ethers.utils.toUtf8Bytes('')                    
                ])
                console.log("here", account)
                return account
            }, // the factory method to call to create an account
            getAccountAddress: async(
                factory: SmartContract<BaseContract>,
                owner: string
            ) => {
                return factory.call("account", [
                    IMPLEMENTATION_ADDRESS,
                    activeChain.chainId,
                    NFTDROP_ADDRESS,
                    token.metadata.id,
                    0,
                ])
            }, // the factory method to call to get the account address
        },
    }
    return new SmartWallet(config)
}