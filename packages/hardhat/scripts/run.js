const main = async () => {
    // The Hardhat Runtime Environment, or HRE for short, is an object containing all the functionality that Hardhat exposes when running a task, test or script. In reality, Hardhat is the HRE.
    // So what does this mean? Well, every time you run a terminal command that starts with npx hardhat you are getting this hre object built on the fly using the hardhat.config.js specified in your code! This means you will never have to actually do some sort of import into your files like:
    const nftContractFactory = await hre.ethers.getContractFactory('PabEpicNFT');

    //What's happening here is Hardhat will create a local Ethereum network for us, but just for this contract. Then, after the script completes it'll destroy that local network. So, every time you run the contract, it'll be a fresh blockchain. Whats the point? It's kinda like refreshing your local server every time so you always start from a clean slate which makes it easy to debug errors.
    const nftContract = await nftContractFactory.deploy();

    // hardhat make fake miners to imitate blockchain
    await nftContract.deployed();

    console.log("Contract deployed to : ", nftContract.address);

    // let txn = await nftContract.mintEpicNft({value: ethers.utils.parseEther("0.5")})
    // await txn.wait()
    // txn = await nftContract.mintEpicNft({value: ethers.utils.parseEther("0.5")})
    // await txn.wait()
};

const runMain = async () => {
    try {
        await main();
        process.exit(0);
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
};

runMain();