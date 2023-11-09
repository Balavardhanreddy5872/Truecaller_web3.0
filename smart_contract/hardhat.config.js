// https://eth-sepolia.g.alchemy.com/v2/29ZYauhqr1hecI8ROOH2Ajtcc0kqgBaR

require('@nomiclabs/hardhat-waffle');

/** @type import('hardhat/config').HardhatUserConfig */
require('dotenv').config();

module.exports = {
  solidity: "0.8.0",
  networks: {
    Sepolia: {
      url: process.env.ALCHEMY_URL,
      accounts: [process.env.ALCHEMY_PRIVATE_KEY],
    },
  },
};

