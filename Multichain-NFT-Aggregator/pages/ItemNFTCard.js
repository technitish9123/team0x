/* eslint-disable react-hooks/rules-of-hooks */
import React from "react";
import {
  Box,
  Flex,
  AspectRatio,
  Image,
  Text,
  Link,
  Button,
  Stack,
  SimpleGrid,
  useColorModeValue,
  Heading,
  EmailIcon,
  Center,
  Select,
  Input,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Hstack,
  useToast,
} from "@chakra-ui/react";
import { useState } from "react";
import { ethers } from "ethers";
import { useMetamask } from "./api/components/context/metamsk.context";
import { ABI } from "./api/components/context/LazyNFT.js";
import { MARKETPLACE_ABI } from "./api/components/context/MarketplaceABI.js";
import { BRDIGE_ABI } from "./api/components/context/CrossChainNFTBridge.js";
import { useDisclosure } from "@chakra-ui/react";
import { LazyMinter } from "./api/components/context/CreateVoucher.js";
const faunadb = require("faunadb");

const q = faunadb.query;
const client = new faunadb.Client({
  secret: "fnAEpgv5JuACSfwsB64X-MjaKKApGX9EQZ05sKfJ",
});
function ItemNFTCard({ key, singlenft }) {
  if (singlenft) {
    let ethValue = "";
    console.log("ITEM NFT details", singlenft);
    ethValue = ethers.utils.formatEther(singlenft?.rt);

    //   const refId = singlenft.ref.value.id;
    //   singlenft = singlenft.data.metadata;
    // const { owner, name, description, collection, uri } = singlenft;

    let ETHttpProvider = new ethers.providers.JsonRpcProvider(
      "https://rinkeby.infura.io/v3/5ddd51a644fb4366bf26895ff5a6afbf"
    );
    let PolygonProvider = new ethers.providers.JsonRpcProvider(
      "https://speedy-nodes-nyc.moralis.io/694753c7969c59c42f2dea1b/polygon/mumbai"
    );
    let BSCttpProvider = new ethers.providers.JsonRpcProvider(
      "https://data-seed-prebsc-1-s1.binance.org:8545"
    );
    const ETHbridgeContract = new ethers.Contract(
      "0x3829a4a816C8be668162EE2EdE7495c7c91ed681",
      BRDIGE_ABI,
      ETHttpProvider
    );
    const BSCbridgeContract = new ethers.Contract(
      "0x0182DEC919C1fd865D19ECBef271B73829123E5C",
      BRDIGE_ABI,
      BSCttpProvider
    );
    const POLYbridgeContract = new ethers.Contract(
      "0xf3994f679ce5636f791De88e7d1f96417395C887",
      BRDIGE_ABI,
      PolygonProvider
    );
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { provider, walletAddress, balance, chain } = useMetamask();
    const toast = useToast();
    const [swapTo, setSwapTo] = useState("");
    const [swapFrom, setSwapFrom] = useState("");
    const [buyON, setBuyOn] = useState("4");
    const [moveTo, setMoveTo] = useState("4");
    const [signer, setSigner] = useState(null);
    const [contract, setContract] = useState(null);
    const [bridgeContract, setBridgeContract] = useState(null);
    const [nftMarketplaceContract, setNftMarketplace] = useState(null);
    const [isLoading, setLoading] = useState(false);
    const [chainString, setChainString] = useState("");
    const [nativeCrypto, setNativeCrypto] = useState("");
    const [salePrice, setSalePrice] = useState("");
    const [tokenIDName, setTokenName] = useState("");

    const moveHandler = async () => {
      if (walletAddress) {
        console.log("Chain", chain.toString());
        console.log("NFT Contract Address", singlenft.nftContractAddress);
        console.log("Move to chain", moveTo);
        console.log("Token ID", singlenft.id);
        if (chain.toString() === "4") {
          setSwapFrom("RINKBEY");
        } else if (chain.toString() === "97") {
          setSwapFrom("BSC Testnet");
        } else {
          setSwapFrom("Mumbai Testnet");
        }
        if (moveTo === "4") {
          setSwapTo("Rinkbey Testnet");
        } else if (moveTo === "97") {
          setSwapTo("BSC Testnet");
        } else {
          setSwapTo("Mumbai Testnet");
        }

        if (chain?.toString() === singlenft.chainId) {
          const txReceipt = await (
            await bridgeContract.deposit(
              singlenft.nftContractAddress,
              "1",
              moveTo,
              singlenft.id
            )
          ).wait();
          console.log("tx", txReceipt.status);
          if (txReceipt.status === 1) {
          }
        } else {
          alert(
            `Please switch your metamask network to ${chainString} to Cross Chain this NFT`
          );
        }
      } else {
        alert(
          `Please connect your metamask wallet to ${chainString} to Cross Chain this NFT`
        );
      }
    };

    const listItem = async () => {
      if (walletAddress) {
        console.log("Chain", chain.toString());
        console.log("NFT Contract Address", singlenft.nftContractAddress);
        console.log("Move to chain", moveTo);
        console.log("Token ID", singlenft.id);

        if (chain?.toString() === singlenft.chainId) {
          const isApprovedForAll = await contract.isApprovedForAll(
            walletAddress,
            nftMarketplaceContract.address
          );
          console.log("Approved", isApprovedForAll);
          if (!isApprovedForAll) {
            const txReceipt = await (
              await contract.setApprovalForAll(
                nftMarketplaceContract.address,
                true
              )
            ).wait();
            console.log("approve tx", txReceipt.status);
            console.log("approve txReceipt", txReceipt);
          }
          const listPrice = ethers.utils.parseEther(salePrice).toString();
          const txReceipt = await (
            await nftMarketplaceContract.createMarketItem(
              singlenft.nftContractAddress,
              singlenft.id,
              listPrice
            )
          ).wait();
          console.log("tx", txReceipt.status);
          console.log("txReceipt", txReceipt);
          if (txReceipt.status === 1) {
            const marketplaceSaleId = txReceipt.events[2].args[0];
            console.log("marketplaceSaleId", marketplaceSaleId.toString());
            var metadata = singlenft;
            metadata.listedPrice = listPrice;
            metadata.marketplaceSaleId = marketplaceSaleId.toString();
            metadata.owner = walletAddress;
            try {
              console.log(chain?.toString());
              const data = await client.query(
                q.Create(q.Collection("marketplace_nfts"), {
                  data: {
                    metadata,
                  },
                })
              );
              console.log(data);
            } catch (error) {
              console.error(error);
            }
            toast({
              title: ` WOOHOO! your ${tokenIDName} NFT is listed for sale`,
              variant: "subtle",
              isClosable: true,
            });
          }
        } else {
          alert(
            `Please switch your metamask network to ${chainString} to List this NFT for Sale`
          );
        }
      } else {
        alert(
          `Please connect your metamask wallet to ${chainString} to Cross Chain this NFT`
        );
      }
    };

    React.useEffect(() => {
      const fetchData = async () => {
        if (walletAddress) {
          const tokenNameID = singlenft.name + "#" + singlenft.id;
          console.log("tokenNameID", tokenNameID);
          setTokenName(tokenNameID);
          const signer = provider?.getSigner();
          console.log(walletAddress, chain.toString());
          let marketplace;
          let bridgeContract;
          let nftMarketplace;
          if (chain?.toString() == "5") {
            nftMarketplace = new ethers.Contract(
              "0x90D3e58DbC2D33a05CE07F2092880E5142b05309",
              MARKETPLACE_ABI,
              signer
            );
            marketplace = new ethers.Contract(
              "0x6a1b2c56311046c20c1a127dec5306ed1656650d",
              ABI,
              signer
            );
            bridgeContract = new ethers.Contract(
              "0x3829a4a816C8be668162EE2EdE7495c7c91ed681",
              BRDIGE_ABI,
              signer
            );
          } else if (chain?.toString() == "97") {
            nftMarketplace = new ethers.Contract(
              "0x6a1b2c56311046c20c1a127dec5306ed1656650d",
              MARKETPLACE_ABI,
              signer
            );
            marketplace = new ethers.Contract(
              "0x31991b93cdbc78a5c5a3ec8f4c3cf907fee24aab",
              ABI,
              signer
            );
            bridgeContract = new ethers.Contract(
              "0x0182DEC919C1fd865D19ECBef271B73829123E5C",
              BRDIGE_ABI,
              signer
            );
          } else {
            nftMarketplace = new ethers.Contract(
              "0x8b6f3cb4231a7738b15ce7fcfaaf917b22c607ab",
              MARKETPLACE_ABI,
              signer
            );
            marketplace = new ethers.Contract(
              "0x31991b93cdbc78a5c5a3ec8f4c3cf907fee24aab",
              ABI,
              signer
            );
            bridgeContract = new ethers.Contract(
              "0xf3994f679ce5636f791De88e7d1f96417395C887",
              BRDIGE_ABI,
              signer
            );
          }

          if (singlenft.chainId === "4") {
            chainString = "Rinkbey Testnet";
            setNativeCrypto("ETH");
          } else if (singlenft.chainId === "97") {
            chainString = "Binance Smart Chain Testnet";
            setNativeCrypto("BNB");
          } else {
            chainString = "Mumbai Polygon Testnet";
            setNativeCrypto("MATIC");
          }
          setChainString(chainString);
          console.log("Bridge Contract", bridgeContract);
          console.log(bridgeContract.address);
          setContract(marketplace);
          setBridgeContract(bridgeContract);
          setNftMarketplace(nftMarketplace);
          setLoading(false);
          setSigner(signer);
        }
      };
      fetchData();
    }, [walletAddress, provider, chain]);

    React.useEffect(() => {
      const ETHListener = (tokenID, sender, tokenAddress) => {
        console.log("ETH WITHDRAW", tokenID.toString(), sender, tokenAddress);
        onOpen();
      };

      const BSCListener = (tokenID, sender, tokenAddress) => {
        console.log("BSC WITHDRAW", tokenID.toString(), sender, tokenAddress);
        onOpen();
      };

      const POLYListener = (tokenID, sender, tokenAddress) => {
        console.log("POLY WITHDRAW", tokenID.toString(), sender, tokenAddress);
        onOpen();
      };
      // adding listeners everytime props.x changes
      ETHbridgeContract.on("WITHDRAW", ETHListener);
      BSCbridgeContract.on("WITHDRAW", BSCListener);
      POLYbridgeContract.on("WITHDRAW", POLYListener);
      return () => {
        ETHbridgeContract.removeAllListeners("WITHDRAW");
        BSCbridgeContract.removeAllListeners("WITHDRAW");
        POLYbridgeContract.removeAllListeners("WITHDRAW");
      };
    }, []);

    return (
      <Stack>
        <Box
          role={"group"}
          p={6}
          maxW={"330px"}
          w={"full"}
          bg={useColorModeValue("white", "gray.800")}
          boxShadow={"2xl"}
          rounded={"lg"}
          zIndex={1}
        >
          <Box
            rounded={"lg"}
            mt={-10}
            pos={"relative"}
            height={"230px"}
            _after={{
              transition: "all .3s ease",
              content: '""',
              w: "full",
              h: "full",
              pos: "absolute",
              top: 5,
              left: 0,
              backgroundImage: singlenft.image,
              filter: "blur(15px)",
              zIndex: -1,
            }}
            _groupHover={{
              _after: {
                filter: "blur(20px)",
              },
            }}
          >
            <Image
              rounded={"lg"}
              height={230}
              width={282}
              objectFit={"cover"}
              src={singlenft.image}
            />
          </Box>
          <Heading
            pt={"8px"}
            textAlign={"center"}
            fontSize={"2xl"}
            color={"black"}
            fontFamily={"body"}
            fontWeight={500}
          >
            {tokenIDName}
          </Heading>

          <Heading
            pt={"5px"}
            textAlign={"center"}
            fontSize={"2xl"}
            color={"darkblue"}
            fontFamily={"body"}
            fontWeight={500}
          >
            {singlenft.description}
          </Heading>
          <Flex justifyContent={"center"}>
            <Text
              pt={"5px"}
              textAlign={"center"}
              fontWeight={800}
              fontSize={"xl"}
              color={"purple.500"}
            >
              {ethValue}
              {/* {nativeCrypto}  */}
            </Text>
            <Image w={"15px"} ml={"10px"} src={singlenft.chainlogo} />
          </Flex>

          <Center>
            <Button mt={"6"} mr={"5"} bg={"purple.800"} onClick={moveHandler}>
              {" "}
              <Text color={"white"}> Cross chain NFT to </Text>{" "}
            </Button>
            <Select
              placeholder=""
              borderColor={"purple.200"}
              color={"black"}
              bg={"purple.100"}
              fontSize={"xl"}
              fontWeight={"bold"}
              width={"150px"}
              pt={"9%"}
              borderRadius={"10px"}
              // value={swapFrom}
              onChange={(e) => {
                setMoveTo(e.target.value);
              }}
            >
              <option value="4"> ETH </option>
              <option value="80001"> POLYGON </option>
              <option value="97"> BSC </option>
            </Select>
          </Center>
          {/* <Center>
          <Button mt={"5%"} bg={"purple.800"}>
            {" "}
            <Text color={"white"}> Convert to Liquid NFT </Text>{" "}
          </Button>
        </Center> */}
          <Center>
            <Button
              mr={"5"}
              // onClick={onOpen}
              onClick={listItem}
              width={"150px"}
              mt={"4"}
              bg={"purple.800"}
            >
              {" "}
              <Text color={"white"}> List for Sale </Text>{" "}
            </Button>
            <Modal isOpen={isOpen} onClose={onClose}>
              <ModalOverlay />
              <ModalContent>
                <ModalHeader> You Cross Chained your NFT </ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                  {tokenIDName} NFT moved from {swapFrom} to {swapTo}
                </ModalBody>
              </ModalContent>
            </Modal>
            <Input
              id="first-name"
              placeholder="Price of the NFT"
              color={"black"}
              mt={"4"}
              onChange={(e) => setSalePrice(e.target.value)}
            />
          </Center>
        </Box>
      </Stack>
    );
  }
}

export default ItemNFTCard;
