import {
  Box,
  Divider,
  Flex,
  Button,
  Image,
  Input,
  Text,
  Center,
  VStack,
  StackDivider,
  ButtonGroup,
  useColorModeValue,
  Stack,
  Heading,
  Hstack,
  SimpleGrid,
  Tabs,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Link,
} from "@chakra-ui/react";
import axios from "axios";
import * as React from "react";
import SearchBar from "./Search";
import { Icon } from "@chakra-ui/react";
import Card from "./NftCard";
import ListedNFTCard from "./ListedNFTCard";
import ItemNFTCard from "./ItemNFTCard";
import Nftdatalist from "./Nftdatalist.json";
import { useState } from "react";

import { useMetamask } from "./api/components/context/metamsk.context";
import Navbar from "./api/components/Navbar";
import { ethers } from "ethers";

import { MARKETPLACE_ABI } from "./api/components/context/MarketplaceABI.js";
import { BRDIGE_ABI } from "./api/components/context/CrossChainNFTBridge.js";

import { ABI } from "./api/components/context/LazyNFT.js";

const faunadb = require("faunadb");

const q = faunadb.query;
const client = new faunadb.Client({
  secret: "fnAE0m7nU_ACTG_OUURc4S76PRn3ugUdxF5AityE",
});

const Profile = () => {
  const [polygonNFTs, setPolygonNFTs] = useState([]);
  const [EthNFTs, setEthNFTs] = useState([]);
  const [nfts, setNFTs] = useState([]);
  const [listednfts, setListedNFTs] = useState([]);
  const [nftData, setNftData] = useState([]);
  const { provider, walletAddress, balance, chain, connectMetamask } =
    useMetamask();
  React.useEffect(() => {
    connectMetamask();
  }, []);

  const options = {
    method: "GET",
    url: `https://deep-index.moralis.io/api/v2/${walletAddress}/nft`,
    params: { chain: `mumbai`, format: "decimal" },
    headers: {
      accept: "application/json",
      "X-API-Key":
        "qBe8UzCGKl3dpAz8zWRJuIxiXnclEqP2XbcnTc0MdW5dznbTlM2alOvYFkbFGpaU",
    },
  };

  axios
    .request(options)
    .then(function (response) {
      setNftData(response.data);
      console.log(response.data);
    })
    .catch(function (error) {
      console.error(error);
    });

  let ETHttpProvider = new ethers.providers.JsonRpcProvider(
    "https://goerli.infura.io/v3/3f5afc2af37742299b9315ee0ca29dfd"
  );
  let PolygonProvider = new ethers.providers.JsonRpcProvider(
    "https://weathered-ultra-patina.matic-testnet.discover.quiknode.pro/9384631805b8657371a79c9e9aced55d01d93c5c/"
  );
  let BSCttpProvider = new ethers.providers.JsonRpcProvider(
    "https://methodical-wiser-frog.bsc-testnet.discover.quiknode.pro/a7561e686e573ed54f721e8fc1caef3161786e5e/"
  );

  const BSC_POLY_PEGGED = "0x6f36F1F339E0B79e795cf81DcDeEd3A9CBDA3b14";
  const BSC_ETH_PEGGED = "0xEd50fbd614Ff8e4c3522401C7413d5F800e11cE9";
  const BSC_MINTED = "0x6cd7fE9D0f79845981A4C138E52c4ff3Ae011616";

  const POLY_BSC_PEGGED = "0x676995C39297bcCaD486ad0Bee4120E915A15780";
  const POLY_ETH_PEGGED = "0x7918D07106652Ddb5bece2028E32a0A6591e14AE";
  const POLY_MINTED = "0x31991b93cdbc78a5c5a3ec8f4c3cf907fee24aab";

  const ETH_BSC_PEGGED = "0x91aB57A558342117055f434D59539a194fDDBd6E";
  const ETH_POLY_PEGGED = "0xCd9d9975f481312Fc8fF63a2F01d40C2D30CFb68";
  const ETH_MINTED = "0xe466f8671fcff36a910fa75fa0713b3172df359b";

  React.useEffect(() => {
    const fetchData = async () => {
      if (walletAddress) {
        const allRefs = await client.query(
          q.Paginate(q.Match(q.Index("get_by_address"), walletAddress))
        );

        console.log("allRefs--", allRefs);
        const query = await client.query(allRefs.data.map((ref) => q.Get(ref)));
        console.log("query--", query);

        const allRefsOnChain = await client.query(
          q.Paginate(q.Match(q.Index("get_by_address_onchain"), walletAddress))
        );

        console.log("allRefsOnChain--", allRefsOnChain);
        const queryOnChain = await client.query(
          allRefsOnChain.data.map((ref) => q.Get(ref))
        );
        console.log("queryOnChain--", queryOnChain);

        const listedNFTs = [];
        if (query.length > 0) {
          for (var i = 0; i < query.length; i++) {
            var details = query[i].data.metadata;
            details.isOnChain = false;
            details.refId = query[i].ref.value.id;
            listedNFTs.push(details);
          }
        }
        if (queryOnChain.length > 0) {
          for (var i = 0; i < queryOnChain.length; i++) {
            var details = queryOnChain[i].data.metadata;
            details.isOnChain = true;
            details.refId = queryOnChain[i].ref.value.id;
            listedNFTs.push(details);
          }
        }

        setListedNFTs(listedNFTs);

        const NFTList = [];

        let ETHNFTContract = new ethers.Contract(
          ETH_MINTED,
          ABI,
          ETHttpProvider
        );

        const ethIds = await ETHNFTContract.userTokens(walletAddress);
        for (var i = 0; i < ethIds.length; i++) {
          const tokenUri = await ETHNFTContract.tokenURI(ethIds[i]);
          const details = await axios(tokenUri);
          var metadata = details.data;
          metadata.chainId = "4";
          metadata.uri = tokenUri;
          metadata.nftContractAddress = ETH_MINTED;
          metadata.chainlogo =
            "https://cryptologos.cc/logos/ethereum-eth-logo.svg?v=022";
          NFTList.push(metadata);
        }
        let ETH_BSC_NFTContract = new ethers.Contract(
          ETH_BSC_PEGGED,
          ABI,
          ETHttpProvider
        );
        const ethBSCIds = await ETH_BSC_NFTContract.userTokens(walletAddress);
        for (var i = 0; i < ethBSCIds.length; i++) {
          const tokenUri = await ETH_BSC_NFTContract.tokenURI(ethBSCIds[i]);
          const details = await axios(tokenUri);
          var metadata = details.data;
          metadata.chainId = "4";
          metadata.uri = tokenUri;
          metadata.nftContractAddress = ETH_BSC_PEGGED;
          metadata.chainlogo =
            "https://cryptologos.cc/logos/ethereum-eth-logo.svg?v=022";
          NFTList.push(metadata);
        }
        let ETH_POLY_NFTContract = new ethers.Contract(
          ETH_POLY_PEGGED,
          ABI,
          ETHttpProvider
        );
        const ethPOLYIds = await ETH_POLY_NFTContract.userTokens(walletAddress);
        for (var i = 0; i < ethPOLYIds.length; i++) {
          const tokenUri = await ETH_POLY_NFTContract.tokenURI(ethPOLYIds[i]);
          const details = await axios(tokenUri);
          var metadata = details.data;
          metadata.chainId = "4";
          metadata.uri = tokenUri;
          metadata.nftContractAddress = ETH_POLY_PEGGED;
          metadata.chainlogo =
            "https://cryptologos.cc/logos/ethereum-eth-logo.svg?v=022";
          NFTList.push(metadata);
        }
        // -----------X----------//
        let BSCNFTcontract = new ethers.Contract(
          BSC_MINTED,
          ABI,
          BSCttpProvider
        );
        const bscIds = await BSCNFTcontract.userTokens(walletAddress);
        for (var i = 0; i < bscIds.length; i++) {
          console.log(bscIds[i].toString());
          const tokenUri = await BSCNFTcontract.tokenURI(bscIds[i]);
          const details = await axios(tokenUri);
          var metadata = details.data;
          metadata.chainId = "97";
          metadata.uri = tokenUri;
          metadata.nftContractAddress = BSC_MINTED;
          metadata.chainlogo =
            "https://cryptologos.cc/logos/bnb-bnb-logo.svg?v=022";
          NFTList.push(metadata);
        }
        let BSC_ETH_NFTcontract = new ethers.Contract(
          BSC_ETH_PEGGED,
          ABI,
          BSCttpProvider
        );
        const bscETHIds = await BSC_ETH_NFTcontract.userTokens(walletAddress);
        for (var i = 0; i < bscETHIds.length; i++) {
          const tokenUri = await BSC_ETH_NFTcontract.tokenURI(bscETHIds[i]);
          const details = await axios(tokenUri);
          var metadata = details.data;
          metadata.chainId = "97";
          metadata.uri = tokenUri;
          metadata.nftContractAddress = BSC_ETH_PEGGED;
          metadata.chainlogo =
            "https://cryptologos.cc/logos/bnb-bnb-logo.svg?v=022";
          NFTList.push(metadata);
        }
        let BSC_POLY_NFTcontract = new ethers.Contract(
          BSC_POLY_PEGGED,
          ABI,
          BSCttpProvider
        );
        const bscPOLYIds = await BSC_POLY_NFTcontract.userTokens(walletAddress);
        for (var i = 0; i < bscPOLYIds.length; i++) {
          const tokenUri = await BSC_POLY_NFTcontract.tokenURI(bscPOLYIds[i]);
          const details = await axios(tokenUri);
          var metadata = details.data;
          metadata.chainId = "97";
          metadata.uri = tokenUri;
          metadata.nftContractAddress = BSC_POLY_PEGGED;
          metadata.chainlogo =
            "https://cryptologos.cc/logos/bnb-bnb-logo.svg?v=022";
          NFTList.push(metadata);
        }
        // -----------X----------//
        let POLYNFTcontract = new ethers.Contract(
          POLY_MINTED,
          ABI,
          PolygonProvider
        );
        const polyIds = await POLYNFTcontract.userTokens(walletAddress);
        for (var i = 0; i < polyIds.length; i++) {
          const tokenUri = await POLYNFTcontract.tokenURI(polyIds[i]);
          const details = await axios(tokenUri);
          var metadata = details.data;
          metadata.chainId = "80001";
          metadata.uri = tokenUri;
          metadata.nftContractAddress = POLY_MINTED;
          metadata.chainlogo =
            "https://cryptologos.cc/logos/polygon-matic-logo.svg?v=022";
          NFTList.push(metadata);
        }
        let POLY_ETH_NFTcontract = new ethers.Contract(
          POLY_ETH_PEGGED,
          ABI,
          PolygonProvider
        );
        const polyETHIds = await POLY_ETH_NFTcontract.userTokens(walletAddress);
        for (var i = 0; i < polyETHIds.length; i++) {
          const tokenUri = await POLY_ETH_NFTcontract.tokenURI(polyETHIds[i]);
          const details = await axios(tokenUri);
          var metadata = details.data;
          metadata.chainId = "80001";
          metadata.uri = tokenUri;
          metadata.nftContractAddress = POLY_ETH_PEGGED;
          metadata.chainlogo =
            "https://cryptologos.cc/logos/polygon-matic-logo.svg?v=022";
          NFTList.push(metadata);
        }
        let POLY_BSC_NFTcontract = new ethers.Contract(
          POLY_BSC_PEGGED,
          ABI,
          PolygonProvider
        );
        const polyBSCIds = await POLY_BSC_NFTcontract.userTokens(walletAddress);
        for (var i = 0; i < polyBSCIds.length; i++) {
          const tokenUri = await POLY_BSC_NFTcontract.tokenURI(polyBSCIds[i]);
          const details = await axios(tokenUri);
          var metadata = details.data;
          metadata.chainId = "80001";
          metadata.uri = tokenUri;
          metadata.nftContractAddress = POLY_BSC_PEGGED;
          metadata.chainlogo =
            "https://cryptologos.cc/logos/polygon-matic-logo.svg?v=022";
          NFTList.push(metadata);
        }

        // const polygonnfts = await web3Poly.alchemy.getNfts({
        //   owner: walletAddress,
        // });
        // // console.log(polygonnfts.ownedNfts);
        // if (polygonnfts.ownedNfts.length > 0) {
        //   for (var i = 0; i < polygonnfts.ownedNfts.length; i++) {
        //     const details = await axios(
        //       polygonnfts.ownedNfts[0].tokenUri.gateway
        //     );
        //     // console.log("Poylgon Details", details);
        //     NFTList.push(details.data);
        //   }
        // }
        // setPolygonNFTs(polygonnfts.ownedNfts);
        // const ethNFts = await web3Eth.alchemy.getNfts({
        //   owner: walletAddress,
        // });

        // if (ethNFts.ownedNfts.length > 0) {
        //   for (var i = 0; i < ethNFts.ownedNfts.length; i++) {
        //     const details = await axios(ethNFts.ownedNfts[0].tokenUri.gateway);
        //     //console.log("ETH Details", details);
        //     NFTList.push(details.data);
        //   }
        // }
        // //console.log("NFT List", NFTList);
        // setEthNFTs(ethNFts.ownedNfts);
        console.log("Total NFTs in user wallet accross three chains", NFTList);

        setNFTs(NFTList);
      }
    };
    fetchData();
  }, [walletAddress, chain]);

  const colors = useColorModeValue(
    ["red.50", "teal.50", "blue.50"],
    ["red.90", "purple.50", "blue.90"]
  );
  const [tabIndex, setTabIndex] = useState("");

  return (
    <>
      <SearchBar />
      <Box
        height={"150vh"}
        backgroundSize={"cover"}
        paddingBottom={"40px"}
        bgGradient="linear(to-br, #1F0942, #000000)"
      >
        <Stack direction={"column"} spacing={4}>
          ""
          <Center>
            <Box
              bgImg={"https://i.ibb.co/thGgrny/Rectangle-28profile.png"}
              justifyItems={"center"}
              w={"190vw"}
              h={"20vh"}
              mt={"30px"}
              mr={"30px"}
              ml={"30px"}
            >
              <Center>
                {" "}
                <Image
                  borderRadius="full"
                  boxSize="150px"
                  src="https://bit.ly/dan-abramov"
                  alt="Dan Abramov"
                  mt={"50px"}
                />{" "}
              </Center>
            </Box>
          </Center>
          <Text
            fontSize={"3xl"}
            pt={"20px"}
            color={"white"}
            textAlign={"center"}
          >
            {" "}
            Nitish k{" "}
          </Text>
          <Center>
            <Tabs
              isFitted
              variant="soft-rounded"
              onChange={(index) => setTabIndex(index)}
            >
              <TabList textAlign={"center"} colorScheme="purple.200">
                <Tab> MY ITEMS </Tab>
                <Tab> LISTED ITEMS </Tab>
                {/* <Tab>  AUCTIONS </Tab>
    <Tab> OFFERS MADE </Tab>
    <Tab>  OFFERS RECIEVED </Tab>
    <Tab>  ACTIVITIES </Tab> */}
              </TabList>

              <TabPanels color={"white"}>
                <TabPanel>
                  <Flex
                    direction={"row"}
                    justifyContent={"center"}
                    wrap={"wrap"}
                    width={"182vh"}
                    height={"fit-content"}
                  >
                    <Flex
                      direction={"column"}
                      alignItems={"center"}
                      justifyContent={"center"}
                      margin={"10px"}
                      width={"fit-content"}
                      height={"fit-content"}
                      bgColor={"#1F0942"}
                    >
                      <Flex
                        direction={"column"}
                        alignItems={"center"}
                        justifyContent={"center"}
                        margin={"10px"}
                        width={"fit-content"}
                        height={"fit-content"}
                        bgColor={"#1F0942"}
                      >
                        <Flex justifyContent={"center"} wrap={"wrap"}>
                          {nfts
                            ? nfts.map((nft, index) => {
                                return (
                                  <Link key={index}>
                                    <Box marginTop={"50px"} marginLeft={"20px"}>
                                      <ItemNFTCard
                                        key={index}
                                        singlenft={nft}
                                      />
                                    </Box>
                                  </Link>
                                );
                              })
                            : ""}
                        </Flex>
                      </Flex>
                    </Flex>
                  </Flex>
                </TabPanel>
                <TabPanel>
                  <Flex
                    direction={"row"}
                    justifyContent={"center"}
                    wrap={"wrap"}
                    width={"182vh"}
                    height={"fit-content"}
                  >
                    <Flex
                      direction={"column"}
                      alignItems={"center"}
                      justifyContent={"center"}
                      margin={"10px"}
                      width={"fit-content"}
                      height={"fit-content"}
                      bgColor={"#1F0942"}
                    >
                      <Flex justifyContent={"center"} wrap={"wrap"}>
                        {listednfts
                          ? listednfts.map((nft, index) => {
                              return (
                                <Link key={index}>
                                  <Box marginTop={"50px"} marginLeft={"20px"}>
                                    <ListedNFTCard
                                      key={index}
                                      singlenft={nft}
                                    />
                                  </Box>
                                </Link>
                              );
                            })
                          : ""}
                      </Flex>
                    </Flex>
                  </Flex>
                </TabPanel>
                <TabPanel>
                  <Flex
                    direction={"row"}
                    justifyContent={"center"}
                    wrap={"wrap"}
                    width={"182vh"}
                    height={"fit-content"}
                  />
                </TabPanel>
              </TabPanels>
            </Tabs>
          </Center>
        </Stack>
        <Center></Center>
      </Box>
    </>
  );
};

export default Profile;
