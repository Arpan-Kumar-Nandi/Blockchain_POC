import Web3 from 'web3'
import { fromWei, toWei } from 'web3-utils'
import POC20 from '../contracts/POC20.json'
import POC721 from '../contracts/POC721.json'

export default class Web3Util {
  web3 = new Web3('http://127.0.0.1:7545')

  async poc20() {
    return new this.web3.eth.Contract(
      POC20.abi,
      '0x85860320dE6Df0D9Bb9B6AC667D82Aa90Aee25C1'
    )
  }

  async getPOC20Balance(publicAddress) {
    const poc20 = await this.poc20()
    const balance = await poc20.methods.balanceOf(publicAddress).call()
    const balanceinEther = fromWei(balance, 'ether')
    return parseFloat(balanceinEther)
  }

  async buyPOC20Tokens(publicAddress, ethersToSpend) {
    const poc20 = await this.poc20()
    try {
      const status = await poc20.methods.buyTokens().send({
        from: publicAddress,
        value: toWei(ethersToSpend.toString(), 'ether'),
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
          toWei(productDetails.price.toString(), 'ether'),
          productDetails.date,
          productDetails.address,
        ],
      })
      .send({ from: publicAddress, gas: 4712388, gasPrice: '100000000000' })

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

    const transaction = await nft721.methods.buyItem(tokenId).send({
      from: publicAddress,
      gas: 4712388,
      gasPrice: '100000000000',
    })
    return transaction
  }
  async resellNFTToken(contractAddress, tokenId, price, publicAddress) {
    const nft721 = await new this.web3.eth.Contract(POC721.abi, contractAddress)

    const priceinwei = toWei(price, 'ether')

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
