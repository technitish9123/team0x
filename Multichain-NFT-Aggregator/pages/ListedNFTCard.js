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
  useToast,
} from "@chakra-ui/react";
import { useState } from "react";
import { ethers } from "ethers";
import { useMetamask } from "./api/components/context/metamsk.context";
import { MARKETPLACE_ABI } from "./api/components/context/MarketplaceABI.js";
import { BRDIGE_ABI } from "./api/components/context/CrossChainNFTBridge.js";
import { ABI } from "./api/components/context/LazyNFT.js";
const faunadb = require("faunadb");

const q = faunadb.query;
const client = new faunadb.Client({
  secret: "fnAEpgv5JuACSfwsB64X-MjaKKApGX9EQZ05sKfJ",
});

function ListedNFTCard({ key, singlenft }) {
  if (singlenft) {
    console.log("Listed NFT details", singlenft);

    //   singlenft = singlenft.data.metadata;
    // const { owner, name, description, collection, uri } = singlenft;
    const ethValue = singlenft.isOnChain
      ? ethers.utils.formatEther(singlenft.listedPrice)
      : ethers.utils.formatEther(singlenft.minPrice);
    const refId = singlenft.refId;

    const { provider, walletAddress, balance, chain } = useMetamask();
    const toast = useToast();
    const [swapTo, setSwapTo] = useState("");
    const [swapFrom, setSwapFrom] = useState("");
    const [buyON, setBuyOn] = useState("4");
    const [signer, setSigner] = useState(null);
    const [contract, setContract] = useState(null);
    const [nftON, setNftON] = useState("");
    const [logo, setlogo] = useState("");
    const [isLoading, setLoading] = useState(false);
    const [tokenIDName, setTokenName] = useState("");
    const [nftMarketplaceContract, setNftMarketplace] = useState(null);

    const cancelListingHandler = async () => {
      if (walletAddress === singlenft.owner) {
        try {
          if (!singlenft.isOnChain) {
            const txReceipt = await (
              await nftMarketplaceContract.cancelMarketItem(
                singlenft.nftContractAddress,
                singlenft.marketplaceSaleId,
                {
                  value: "0",
                }
              )
            ).wait();
            console.log("tx", txReceipt.status);
            console.log("txReceipt", txReceipt);
            if (txReceipt.status === 1) {
              const ref = await client.query(
                q.Delete(q.Ref(q.Collection("marketplace_nfts"), refId))
              );
              console.log("Deleted Ref", ref);
              toast({
                title: `Your NFT is deleted from Lazy Marketplace`,
                variant: "subtle",
                isClosable: true,
              });
            }
          } else {
            console.log("REF ID", refId);
            const ref = await client.query(
              q.Delete(q.Ref(q.Collection("marketplace_nfts"), refId))
            );
            console.log("Deleted Ref", ref);
            toast({
              title: `Your NFT is deleted from Lazy Marketplace`,
              variant: "subtle",
              isClosable: true,
            });
          }
        } catch (error) {}
        // let timer1 = setTimeout(() => loadMarketplaceItems(), 2000);
      }
    };

    // eslint-disable-next-line react-hooks/rules-of-hooks
    React.useEffect(() => {
      const fetchData = async () => {
        const tokenNameID = singlenft.isOnChain
          ? singlenft.name + "#" + singlenft.id
          : singlenft.name + "#" + singlenft.tokenId;
        setTokenName(tokenNameID);
        if (walletAddress) {
          const signer = provider?.getSigner();

          if (signer) {
            let marketplace;
            let bridgeContract;
            let nftMarketplace;
            //bsc-testnet

            if (chain?.toString() == "5") {
              nftMarketplace = new ethers.Contract(
                "0x6a1b2c56311046c20c1a127dec5306ed1656650d",
                MARKETPLACE_ABI,
                signer
              );
              marketplace = new ethers.Contract(
                "0xe466f8671fcff36a910fa75fa0713b3172df359b",
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
                "0x31991b93cdbc78a5c5a3ec8f4c3cf907fee24aab ",
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
            }
            //polygon-testnet
            else {
              nftMarketplace = new ethers.Contract(
                "0x31991b93cdbc78a5c5a3ec8f4c3cf907fee24aab",
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
            setNftMarketplace(nftMarketplace);
          }
          setSigner(signer);
        }
        if (singlenft.chainId === "5") {
          setNftON("ETHEREUM");
          setlogo("https://cryptologos.cc/logos/ethereum-eth-logo.svg?v=022");
        } else if (singlenft.chainId === "97") {
          setNftON("BINANCE SMART CHAIN");
          setlogo("https://cryptologos.cc/logos/bnb-bnb-logo.svg?v=022");
        } else {
          setNftON("POLYGON");
          setlogo("https://cryptologos.cc/logos/polygon-matic-logo.svg?v=022");
        }
      };
      fetchData();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [walletAddress, provider, chain]);

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
              alt="nftimage"
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

          <Text
            pt={"10px"}
            textAlign={"center"}
            color={"darkblue"}
            textTransform={"uppercase"}
            fontSize={"2xl"}
          >
            {singlenft.description}
          </Text>

          <Center>
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
              <Image w={"15px"} ml={"10px"} src={logo} alt="nftimage" />
            </Flex>
          </Center>

          <Center>
            {/* <Select
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
              setBuyOn(e.target.value);
            }}
          >
            <option value="4"> ETH </option>
            <option value="80001"> MATIC </option>
            <option value="97"> BNB </option>
          </Select> */}
            <Text
              pt={"4px"}
              color={"black"}
              textAlign={"center"}
              fontWeight={800}
              fontSize={"xl"}
            >
              {nftON}
            </Text>
          </Center>

          <Center>
            <Button mt={"5%"} bg={"purple.800"} onClick={cancelListingHandler}>
              {" "}
              <Text color={"white"}> CANCEL LISTING</Text>{" "}
            </Button>
          </Center>
        </Box>
      </Stack>
    );
  }
}

export default ListedNFTCard;
