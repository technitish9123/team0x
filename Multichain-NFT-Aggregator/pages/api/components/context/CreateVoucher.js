// These constants must match the ones used in the smart contract.
const SIGNING_DOMAIN_NAME = "LazyNFT-Voucher";
const SIGNING_DOMAIN_VERSION = "1";

export class LazyMinter {
  constructor({ contract, signer }) {
    this.contract = contract;
    this.signer = signer;
  }

  async createVoucher(tokenId, uri, minPrice, name, description) {
    console.log(tokenId, uri, minPrice, name, description);
    const voucher = { tokenId, uri, minPrice, name, description };
    const domain = await this._signingDomain();
    const types = {
      NFTVoucher: [
        { name: "tokenId", type: "uint256" },
        { name: "minPrice", type: "uint256" },
        { name: "name", type: "string" },
        { name: "description", type: "string" },
        { name: "uri", type: "string" },
      ],
    };
    const signature = await this.signer._signTypedData(domain, types, voucher);
    return {
      ...voucher,
      signature,
    };
  }

  async _signingDomain() {
    if (this._domain != null) {
      return this._domain;
    }

    const chainId = await this.contract.getChainID();
    console.log(chainId);
    this._domain = {
      name: SIGNING_DOMAIN_NAME,
      version: SIGNING_DOMAIN_VERSION,
      verifyingContract: this.contract.address,
      chainId,
    };
    return this._domain;
  }
}
