import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import {abi as PabEpicNft} from './utils/PabEpicNFT.json';
import './styles/App.css';
import twitterLogo from './assets/twitter-logo.svg';

// Constants
const TWITTER_HANDLE = 'cwh6997';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;
const CONTRACT_ADDRESS = "0x4a8b3345cf09d820658063fce8420740baa1df63";
const TESTNET_OPENSEA_LINK = `https://testnets.opensea.io`;
const VALID_CHAIN_ID = '0x4';

const App = () => {
  const [currentAccount, setCurrentAccount] = useState("");
  const [currentChain, setCurrentChain] = useState("");
  const [mintedTokenId, setMintedTokenId] = useState("");

  const getChainInfo = (chainId) => {
    const chainMap = {
      '0x1': {
                  name: 'eth',
                  decimal: 18,
                  symbol: 'ETH',
              },
      '0x89': {
          name: 'polygon',
          decimal: 18,
          symbol: 'MATIC',
      },
      '0x4': {
          name: 'eth_rinkeby',
          decimal: 18,
          symbol: 'ETH',
      },
      '0x13881': {
          name: 'polygon_mumbai',
          decimal: 18,
          symbol: 'MATIC',
      },
    }
    return chainMap[chainId];
  }

  const checkNetworkChanged = () => {
    const { ethereum } = window;
    if (ethereum) {
      ethereum.on('chainChanged', () => {
        window.location.reload();
      });
      ethereum.on('accountChanged', () => {
        window.location.reload();
      });
    }
  }


  const checkIfWalletIsConnected = async () => {
    const { ethereum } = window;
    if(!ethereum){
      console.log("Make sure you have metamask");
      alert("Install Metamask!");
      return;
    } else {
      console.log("We have the ethereum object", ethereum);
    }
    
    const accounts = await ethereum.request({method: "eth_accounts"});
    const chainId = await ethereum.request({method: "eth_chainId"});

    if (accounts.length != 0) {
      const account = accounts[0];
      setCurrentAccount(account);
      console.log("Found an authorized account:", account);
    } else {
      console.log("No authorized account found");
    }

    const validChainName = getChainInfo(VALID_CHAIN_ID)['name'];
    if (chainId == VALID_CHAIN_ID) {
      console.log(`Connected to network ${validChainName}`);
      setCurrentChain(chainId);
    } else {
      console.log(`You are not connected to the ${validChainName}`);
      alert(`You are not connected to the ${validChainName}`);
    } 
    setupEventListener(ethereum);
  }

  
  const connectWallet = async () => {
    try {
      const { ethereum } = window;
      if (!ethereum) {
        alert("Get Metamask!");
        return;
      }

      const accounts = await ethereum.request({method: "eth_requestAccounts"});
      const chainId = await ethereum.request({method: "eth_chainId"});
      console.log(`${accounts[0]} connected to network ${getChainInfo(chainId)['name']}`)
      
      setCurrentAccount(accounts[0]);
      setCurrentChain(chainId);
      setupEventListener(ethereum);
    } catch (error) {
      console.log(error);
    }
  }

  
  const setupEventListener = async (ethereum) => {
    try {
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, PabEpicNft, signer);
        connectedContract.on('NewEpicNFTMinted', (from,tokenId) => {
          console.log(from, tokenId.toNumber());
          alert(`Token ${tokenId} is minted by ${from}`)
          setMintedTokenId(tokenId);
        });

        console.log('eventListener Setup!')
      } 
      // else {
      //   console.log(error);
      // }
      
    } catch(error) {
      console.log(error);
    }
  }


  const askContractToMintNft = async () => {
    try {
      const { ethereum } = window;
      if(ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const connectedContract= new ethers.Contract(CONTRACT_ADDRESS, PabEpicNft, signer);
        console.log(connectedContract);
        console.log("Going to pop wallet now to pay gas...");
        // let nftTxn = await connectedContract.mintPabForPreSale(1, {"gasLimit":300000, "value": 5 * 10**17});
        let nftTxn = await connectedContract.mintEpicNft({value: ethers.utils.parseEther("0.5")});
        console.log("Mining...please wait");
        await nftTxn.wait();

        console.log(`Mined, see transaction: https://rinkeby.etherscan.io/tx/${nftTxn.hash}`);
      } else {
        console.log("Ethereum object doesn't exist");
      }
    } catch (error) {
      console.log(error);
    }
  }

  
  // Render Methods
  const renderNotConnectedContainer = () => (
    <button onClick={connectWallet} className="cta-button connect-wallet-button">
      Connect to Wallet
    </button>
  );

  const renderMintButton = () => (
    <button onClick={askContractToMintNft} className="cta-button connect-wallet-button">
      Mint Pab NFT
    </button>
  )

  const renderMintedTokenId = (mintedTokenId) => {
    <p> `${mintedTokenId}` </p>
  }
  

  useEffect(()=>{
    checkIfWalletIsConnected();
    checkNetworkChanged();
  }, [])

  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <p className="header gradient-text">P2X On Rinkeby.</p>
          <p className="sub-text">
            Mint and get your NFT with EPIC words in (pseudo) random
          </p>
          {currentAccount == "" || currentChain != VALID_CHAIN_ID ? renderNotConnectedContainer() : renderMintButton()}
        </div>
        <div className="footer-container">
          <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
          <a
            className="footer-text"
            href={TWITTER_LINK}
            target="_blank"
            rel="noreferrer"
          >{`built on @${TWITTER_HANDLE}`}</a>
        </div>
      </div>
    </div>
  );
};

export default App;