import { ConnectWallet, Web3Button, useAddress, useContract, useOwnedNFTs } from "@thirdweb-dev/react";
import styles from "../styles/Home.module.css";
import { NextPage } from "next";
import { NFTDROP_ADDRESS } from "../const/constants";
import NFTGrid from "../components/NFTGrid";

const Home: NextPage = () => {
  const address = useAddress()

  const {
    contract
  } = useContract(NFTDROP_ADDRESS)
  const {
    data,
    isLoading,
  } = useOwnedNFTs(contract, address)

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <ConnectWallet style={{marginBottom: "1rem"}}/>
        { address ? 
          
          <div>
            <h3>Your NFTs</h3>
            <NFTGrid
              isLoading={isLoading}
              nfts={data}
              emptyText="You don't own any NFTs yet."
            />
            <div style={{width: "100%", display: "flex", justifyContent: "center"}}>
              <Web3Button
                contractAddress={NFTDROP_ADDRESS}
                action={contract => contract.erc721.claim(1)}
                style={{marginLeft: "auto", marginRight: "auto"}}
                >Claim NFT</Web3Button>
            </div>
          </div>

          : <p>Connect your wallet to get stared.</p>
        
      }
      </main>
    
    </div>
  );
};

export default Home;
