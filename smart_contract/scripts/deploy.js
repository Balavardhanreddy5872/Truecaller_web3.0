const hre = require("hardhat");

const main = async() => {
   const Truecall = await hre.ethers.getContractFactory("Truecaller"); // fetching byte code  and ABI
   const Truecaller = await Truecall.deploy(); //creating an instance of our smart contract 

   await Truecaller.deployed(); // deploying smart contract 

  console.log(`Deployed contract address: ${Truecaller.address}`);

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

runMain();
