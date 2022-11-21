import web3 from '../web3'
import POC20 from '../contracts/POC20.json'
import POC721 from '../contracts/POC721.json'

export default class Web3Util {
  constructor() {
    this.web3 = web3
  }

  async poc20() {
    return new this.web3.eth.Contract(
      POC20.abi,
      '0x85860320dE6Df0D9Bb9B6AC667D82Aa90Aee25C1'
    )
  }

  async getMetamaskBalance(publicAddress) {
    let ethBalance = await web3.eth.getBalance(publicAddress)
    ethBalance = web3.utils.fromWei(ethBalance, 'ether')
    return parseFloat(ethBalance)
  }

  async getPOC20Balance(publicAddress) {
    const poc20 = await this.poc20()
    const balance = await poc20.methods.balanceOf(publicAddress).call()
    const balanceinEther = web3.utils.fromWei(balance, 'ether')
    return parseFloat(balanceinEther)
  }

  async buyPOC20Tokens(publicAddress, ethersToSpend) {
    const poc20 = await this.poc20()
    try {
      const status = await poc20.methods.buyTokens().send({
        from: publicAddress,
        value: web3.utils.toWei(ethersToSpend.toString(), 'ether'),
      })
      return status
    } catch (err) {
      console.log(err)
    }
  }

  async createNFT(publicAddress, productDetails) {
    const deployedContract = await new this.web3.eth.Contract(POC721.abi)
      .deploy({
        data: POC721.bytecode,
        arguments: [
          productDetails.tokenId,
          productDetails.title,
          productDetails.description,
          web3.utils.toWei(productDetails.price.toString(), 'ether'),
          productDetails.date,
          productDetails.address,
        ],
      })
      .send({ from: publicAddress })

    return deployedContract
  }

  async fetchNFTDetails(contractAddress, tokenId) {
    const nft721 = await new this.web3.eth.Contract(POC721.abi, contractAddress)

    const itemDetails = await nft721.methods.item(tokenId).call()
    const itemOwnerHistory = await nft721.methods
      .getTokenOwnerHistory(tokenId)
      .call()
    const itemPriceHistory = await nft721.methods
      .getPriceHistory(tokenId)
      .call()

    return { itemDetails, itemOwnerHistory, itemPriceHistory }
  }

  async buyNFTToken(contractAddress, tokenId, publicAddress) {
    const nft721 = await new this.web3.eth.Contract(POC721.abi, contractAddress)
    const gasPrice = await this.web3.eth.getGasPrice()
    const gas = await nft721.methods.buyItem(tokenId).estimateGas({
      from: publicAddress,
    })
    console.log(web3.utils.toBN(gasPrice) * web3.utils.toBN(gas))

    const transaction = await nft721.methods.buyItem(tokenId).send({
      from: publicAddress,
      gas,
      gasPrice: web3.utils.toBN(gasPrice) * web3.utils.toBN(gas),
    })
    return transaction
  }
  async resellNFTToken(contractAddress, tokenId, price, publicAddress) {
    const nft721 = await new this.web3.eth.Contract(POC721.abi, contractAddress)

    const priceinwei = web3.utils.toWei(price, 'ether')

    const transaction = await nft721.methods
      .resellItem(tokenId, priceinwei)
      .send({
        from: publicAddress,
        gas: 4712388,
        gasPrice: '100000000000',
      })
    return transaction
  }
}
