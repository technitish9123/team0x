##### By Team "_Team0x_"

# Multichain NFT Aggregator

- Current scenereo in NFT domain is we can not Trade NFT CrossChain. Lets take example if some person bought NFT on polygon chain but he want to stake it or trade it on Binance Chain (Reason might be anything maybe he getting more value on other chain sometheing) then they can not Do that❌

- How can we fix this??

- We made CrossChain NFT aggregator which give flexibility to the user to transfer their nft from one chain to other in a single click with same metadata. **Cross Chain**.✅
- .This Project make a complete interportability ecosystem for NFT marketplace and Removes the limitation of cross chain Talk.
- This Project is contains all the need of user under one hood like Lazy-Marketplace , Nft marketplace and obviously cross chain NFT protability.🏁

## Demo video link

🟡[Demo Video Link ](https://clipchamp.com/watch/SKlVk2nE6gW)

## Documentation

[PPT Documentation](https://docs.google.com/presentation/d/10w_FK_ibP_kG7cdNITtwzDAertTNC2EUOl0QYC1y7nw/edit?usp=sharing)

## Screenshots

|                                      Dashboard                                      |                                               Create NFT                                                |
| :---------------------------------------------------------------------------------: | :-----------------------------------------------------------------------------------------------------: |
| <img src="https://i.postimg.cc/8CMHVH88/Screenshot-130.png" alt="dash" border="0" width=500 > | <img src="https://i.postimg.cc/KzcgsrxD/Screenshot-131.png" alt="create-nft-page" border="0" width=500> |

|                                            Lazy-Marketplace                                             |                                           NFT-marketplace                                           |
| :-----------------------------------------------------------------------------------------------------: | :-------------------------------------------------------------------------------------------------: |
| <img src="https://i.postimg.cc/WbzQghqD/Screenshot-134.png" alt="lazymarketplace" border="0" width=500> | <img src="https://i.postimg.cc/WbzQghqD/Screenshot-134.png" alt="marketplace" border="0" width=500> |

## Table of Contents

- [Features](#features)
- [TechStack](#techstack)
- [Installation](#installation)
- [Documentation](#documentation)

## Features

- Multi-Chain
- Easy to use UI-Interface.
- The user can transfer the NFT- from one chain to other in single Click.
  \*Within a min The NFT get migrated from one chain to other. In backend Our listner sccipts are running continously that listen to the request.
- All the NFT metadata are stored on **IPFS**.
- FaunaDB is used to maintain the ipfs hash, signature, chainId and other details when NFT is minited

### **_Lets get into some technicality: 😁😁_**

**ready?**

## TechStack

1. Front End / Client Side

   - _Next JS_
   - _CSS, React-Chakra_ and other components
   - _TypeScript_
   - _ether.js_

2. BackEnd Server:
   - _NodeJS_
3. Smart-Contract:
   - **_Solidity._**

## Installation

### Pre-Requisites:

1. Install Git Version Control
   [ https://git-scm.com/ ]

2. Install NodeJs
   [ https://nodejs.org/en/download/ ]

3. Remix/Hardhat(compiling smart contracts )
   [ https://remix-project.org/ ]

### Clone the project:

```bash
  git clone https://github.com/technitish9123/team0x.git

```

Go to the project directory

```bash
  cd team0x

```

**_update the .env key:_**

```bash
MNEMONICS=" "
BINANCE_HTTP_INFURA=""
POLYGON_HTTP_INFURA=""
POLYGON_INFURA=""
BINANCE_INFURA=""
ETHERSCAN_API_KEY=""
REPORT_GAS=""

```

**Backend Server:**

Go to folder **Cross-X-SmartContract-backend**

```bash
  cd Cross-X-SmartContract-backend
```

**Backend Server:**

Install all dependencies

```bash
 npm install
```

Run Backend

```bash
 node app.js
```

**Frontend Server:**

Go to folder **_multichain-NFT-Aggregator_**

```bash
 cd multichain-NFT-Aggregator
```

Install all dependencies

```bash
yarn
```

Start frontend server

```bash
 yarn dev
```

#### Local Url for Server:

- Frontend is running on http://localhost:3000

## Documentation

[PPT Documentation]https://docs.google.com/presentation/d/10w_FK_ibP_kG7cdNITtwzDAertTNC2EUOl0QYC1y7nw/edit?usp=sharing)

##### **_Note:_**

```bash
faunadb Schema (table: lazy_mint_nft_signatures):
{
  "ref": Ref(Collection("lazy_mint_nft_signatures"), "347478478131561036"),
  "ts": 1667640150100000,
  "data": {
    "metadata": {
      "tokenId": 4,
      "uri": "https://infura-ipfs.io/ipfs/QmPhH6nCS9K4GjAsJPQo5FQo4wiw43ygWRid3yMev743J5",
      "minPrice": "100000000000000",
      "name": "nk",
      "description": "nk",
      "signature": "0xc3123d1cd376d7008ec93d8ef684d33156cf39791edb3c33db6c03798cd8b5ba2b54fe90e80429e718d6ce431e4819e0996439454330555850cb14c60d2505d11b",
      "owner": "0x10fd6725ca9597945f9310ac794d109c4d4f6032",
      "chainId": "97",
      "image": "https://infura-ipfs.io/ipfs/QmcmhdGBvcriZSvN7BY3yHKXjeJ3KXJU1BFGC5Rp5nV8Ni",
      "collection": "nk"
    }
  }
}
```

## Future Aspects

- Improvising the system design to integerate huge data sets of users and products.
- Improving the speed of blockchain related transactions on the website.

## Authors

> [Nitish Kumar](https://github.com/technitish9123)

##### Made with perseverance and love by

#### Team _Team0x_ ❤️
