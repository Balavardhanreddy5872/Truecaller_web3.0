// https://eth-sepolia.g.alchemy.com/v2/29ZYauhqr1hecI8ROOH2Ajtcc0kqgBaR

require('@nomiclabs/hardhat-waffle');

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.0",
  networks: {
    Sepolia:{
      url:'https://eth-sepolia.g.alchemy.com/v2/29ZYauhqr1hecI8ROOH2Ajtcc0kqgBaR',
      accounts:['e2cbd0a4a786f1d2b1ee321fef781c3be67ad62c4f1030fc9a0b64f654b76017']
    }
  }
}
