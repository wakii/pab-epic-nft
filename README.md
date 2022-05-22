# P2X NFT project


## TL;DR
- Demo: https://p2x.surge.sh/
- Code : https://rinkeby.etherscan.io/address/0x4a8b3345cf09d820658063fce8420740baa1df63#code
- Opensea : https://testnets.opensea.io/collection/pabtox-v4

- mint to get nft (paid...haha...but on rinkeby)
- it's totally on chain as a svg on EVM
- nft composed of dynamic words in (pseudo random)
- Royalty fee 7.5% for each trading
---
- The random values are *NOT REAL RANDOM*.
    -  Without oracles service such as chainlinks, Since blockchain is deterministic, hard to get random. So I just put tokenID and the blockstamps to keccak256 hash function.

- This NFT is literally *ON CHAIN* data.
    - Nft metadata consists of `name`, `description` and `image source`
    - The image source is a small svg encoded by base64 and can be fetched by Data Url.
    - So, image source is not on IPFS or centralized server but on onchain.
    - Refer to [Data Url](https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/Data_URLs)

- To run this frontend app
```
cd packages/react-app
npm start
npm run start
```
---
- Smart contract file written in Solidity, deployed with hardhat
```
cd packages/hardhat/
npx hardhat compile
npx hardhat run scripts/run.js --network rinkeby   
```

