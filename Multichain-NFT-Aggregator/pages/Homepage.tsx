import {
  background,
  Box,
  Button,
  Flex,
  Image,
  Img,
  Text,
  Link,
} from "@chakra-ui/react";
import Navbar from "./api/components/Navbar";
import NotConnectedModal from "./api/components/NotConnectedModal";
import { useMetamask } from "./api/components/context/metamsk.context";
import ConnectedModal from "./api/components/ConnectedModal";
import { ButtonGroup } from "@chakra-ui/react";
import { BeatLoader } from "react-spinners";
import LazyMarketplace from "./LazyMarketplace";
import React from "react";
const Homepage = () => {
  const {
    isWalletConnected,
    walletAddress,
    chain,
    currentWallet,
    connectMetamask,
  } = useMetamask();
  // React.useEffect(() => {
  //   connectMetamask();
  // }, []);
  return (
    <>
      {/* <Navbar/> */}

      <Flex
        backgroundColor={
          "#1C1C1C"
        }
        backgroundRepeat={"no-repeat"}
        backgroundSize={"cover"}
        width={"100vw"}
        height={"150vh"}
        flexDirection={"column"}
      >
        <Flex
          width={"100vw"}
          flexDirection={"row"}
          justifyContent={"flex-end"}
          padding={"20px"}
        >
          <Link
            href="./LazyMarketplace"
            pl={"70px"}
            pr={"60px"}
            variant={"unstyled"}
            colorScheme={"purple"}
            color={"white"}
          >
            Lazy Marketplace
          </Link>
          <Link
            href="./NFTMarketplace"
            pl={"70px"}
            pr={"60px"}
            variant={"unstyled"}
            colorScheme={"purple"}
            color={"white"}
          >
            NFT MarketPlace
          </Link>
          <Link
            href="./Minting"
            pl={"70px"}
            pr={"60px"}
            variant={"unstyled"}
            colorScheme={"purple"}
            color={"white"}
          >
            Create NFT
          </Link>
          <Link
            href={"./Profile"}
            pl={"70px"}
            pr={"60px"}
            variant={"unstyled"}
            colorScheme={"purple"}
            color={"white"}
          >
            Profile
          </Link>

          <Box pl={"70px"} pr={"60px"}>
            {isWalletConnected && walletAddress && chain && currentWallet ? (
              <>
                <ConnectedModal />
              </>
            ) : (
              <NotConnectedModal />
            )}
          </Box>
        </Flex>

        <Flex flexDirection={"row"} height={"150vh"} wrap={"wrap"}>
          <Flex width={"40%"}>
            <Text
              bgGradient="linear(to-l, purple.800, purple.200)"
              bgClip="text"
              fontSize="5xl"
              fontWeight="extrabold"
              pl={"100px"}
              pt={"200px"}
              position={"absolute"}
            >
              Buy or Trade your<Text>NFTs</Text>
            </Text>
          </Flex>

          <Flex mt={"90px"} ml={"110px"}>
            <Box
              boxShadow="inner"
              p="6"
              rounded="md"
              bgGradient="linear(purple.400,purple.100)"
              dropShadow={"md"}
              width={"fit-content"}
              height={"fit-content"}
            >
              <Image src="https://s8.gifyu.com/images/WhatsApp-Video-2022-06-09-at-9.06.07-PM9d0aee11c2a7e0d3.gif" />
            </Box>
          </Flex>
        </Flex>
      </Flex>
    </>
  );
};

export default Homepage;
