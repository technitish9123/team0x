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
import { ABI } from "./api/components/context/LazyNFT.js";
const faunadb = require("faunadb");

const q = faunadb.query;
const client = new faunadb.Client({
  secret: "fnAEpgv5JuACSfwsB64X-MjaKKApGX9EQZ05sKfJ",
});

function Card({ key, singlenft }) {
  if (singlenft) {
    console.log("NFT details", singlenft);
    const refId = singlenft.ref.value.id;
    singlenft = singlenft.data.metadata;
    const ethValue = ethers.utils.formatEther(singlenft.minPrice);

    // const { owner, name, description, collection, uri } = singlenft;

    const { provider, walletAddress, balance, chain } = useMetamask();
    const toast = useToast();
    const [swapTo, setSwapTo] = useState("");
    const [swapFrom, setSwapFrom] = useState("");
    const [buyON, setBuyOn] = useState("97");
    const [tokenIDName, setTokenName] = useState("");
    const [nftON, setNftON] = useState("");
    const [signer, setSigner] = useState(null);
    const [logo, setlogo] = useState("");
    const [contract, setContract] = useState(null);
    const [isLoading, setLoading] = useState(false);

    const buyHandler = async () => {
      if (chain?.toString() == singlenft.chainId) {
        if (walletAddress === singlenft.owner) {
          alert("You cant buy your own nft");
        } else {
          try {
            const txReceipt = await (
              await contract.redeem(
                walletAddress,
                singlenft.tokenId,
                singlenft.minPrice.toString(),
                singlenft.uri,
                singlenft.name,
                singlenft.description,
                singlenft.signature,
                { value: singlenft.minPrice }
              )
            ).wait();
            console.log(txReceipt);
            console.log("tx", txReceipt.status);
            if (txReceipt.status === 1) {
              const ref = await client.query(
                q.Delete(q.Ref(q.Collection("lazy_mint_nft_signatures"), refId))
              );
              console.log("Deleted Ref", ref);
              toast({
                title: ` WOOHOO! you bought ${tokenIDName} NFT `,
                variant: "subtle",
                isClosable: true,
              });
            }
          } catch (error) {
            console.log(error);
          }

          // let timer1 = setTimeout(() => loadMarketplaceItems(), 2000);
        }
      } else {
        const chainString = "";
        if (singlenft.chainId === "4") {
          chainString = "Rinkbey Tesnet";
        } else if (singlenft.chainId === "97") {
          chainString = "Binance Smart Chain Testnet";
        } else {
          chainString = "Mumbai Testnet";
        }
        alert(
          `Switch your metamask to ${chainString} to buy this NFT on chain`
        );
      }
    };

    React.useEffect(() => {
      const fetchData = async () => {
        if (walletAddress) {
          const signer = provider?.getSigner();
          const tokenNameID = singlenft.name + "#" + singlenft.tokenId;
          setTokenName(tokenNameID);

          if (signer) {
            let marketplace;
            if (chain?.toString() == "5") {
              marketplace = new ethers.Contract(
                "0x6a1b2c56311046c20c1a127dec5306ed1656650d",
                ABI,
                signer
              );
            } else if (chain?.toString() == "97") {
              marketplace = new ethers.Contract(
                "0x31991b93cdbc78a5c5a3ec8f4c3cf907fee24aab",
                ABI,
                signer
              );
            } else {
              marketplace = new ethers.Contract(
                "0x31991b93cdbc78a5c5a3ec8f4c3cf907fee24aab",
                ABI,
                signer
              );
            }

            setContract(marketplace);
            setLoading(false);
          }
          if (singlenft.chainId === "4") {
            setNftON("ETHEREUM");
            setlogo("https://cryptologos.cc/logos/ethereum-eth-logo.svg?v=022");
          } else if (singlenft.chainId === "97") {
            setNftON("BINANCE SMART CHAIN");
            setlogo("https://cryptologos.cc/logos/bnb-bnb-logo.svg?v=022");
          } else {
            setNftON("POLYGON");
            setlogo(
              "https://cryptologos.cc/logos/polygon-matic-logo.svg?v=022"
            );
          }
          setSigner(signer);
        }
      };
      fetchData();
    }, [walletAddress, provider]);

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
              alt="hello"
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
            color={"black.500"}
            textTransform={"uppercase"}
            fontSize={"2xl"}
          >
            {singlenft.description}
          </Text>

          <Text
            pt={"4px"}
            color={"black"}
            textAlign={"center"}
            fontWeight={800}
            fontSize={"xl"}
          >
            {singlenft.price}
          </Text>

          <Center>
            {/* <Select
            placeholder=""
            borderColor={"purple.200"}
            color={"black"}
            bg={"purple.100"}
            fontSize={"xl"}
            fontWeight={"bold"}
            width={"160px"}
            pt={"9%"}
            borderRadius={"10px"}
            // value={swapFrom}
            onChange={(e) => {
              setBuyOn(e.target.value);
            }}
          >
            <option value="4"> ETHEREUM </option>
            <option value="80001"> POLYGON </option>
            <option value="97"> BINANCE SMART CHAIN </option>
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
              <Image w={"15px"} ml={"10px"} src={logo} />
            </Flex>
          </Center>

          <Center>
            <Button mt={"5%"} bg={"purple.800"} onClick={buyHandler}>
              {" "}
              <Text color={"white"}> BUY </Text>{" "}
            </Button>
          </Center>
        </Box>
      </Stack>
    );
  }
}

export default Card;
