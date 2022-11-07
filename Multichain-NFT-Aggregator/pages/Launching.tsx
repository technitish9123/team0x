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
import img from "../assets/logo.webp";
import Navbar from "./api/components/Navbar";
import NotConnectedModal from "./api/components/NotConnectedModal";
import { useMetamask } from "./api/components/context/metamsk.context";
import ConnectedModal from "./api/components/ConnectedModal";
import { ButtonGroup } from "@chakra-ui/react";
import { BeatLoader } from "react-spinners";
const Launch = () => {
  const { isWalletConnected, walletAddress, chain, currentWallet } =
    useMetamask();
  return (
    <>
      {/* <Navbar/> */}
      <Flex>{/* <Image src={img} alt="logo" /> */}</Flex>

      <Flex
        backgroundColor={"#1C1C1C"}
        backgroundRepeat={"no-repeat"}
        backgroundSize={"cover"}
        width={"120vw"}
        height={"200vh"}
        flexDirection={"column"}
      >
        <Flex flexDirection={"row"} height={"150vh"} wrap={"wrap"}>
          <Flex width={"30%"}>
            <Text
              bgGradient="linear(to-l, #dcd3dc.800, #999199.200)"
              bgClip="text"
              fontSize="5xl"
              fontWeight="extrabold"
              pl={"100px"}
              pt={"200px"}
              position={"absolute"}
            >
              Buy or Trade your<Text>NFTs</Text>
            </Text>

            <Button
              mt={"400px"}
              bgGradient={[
                "linear(to-tr, teal.300, yellow.400)",
                "linear(to-t, blue.200, teal.500)",
                "linear(to-b, orange.100, purple.800)",
              ]}
              ml={"100px"}
            >
              {" "}
              <Link href="./Homepage"> Launch App </Link>
            </Button>
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
              <Image
                src="https://s8.gifyu.com/images/WhatsApp-Video-2022-06-09-at-9.06.07-PM9d0aee11c2a7e0d3.gif"
                alt=""
              />
            </Box>
          </Flex>
        </Flex>
      </Flex>
    </>
  );
};

export default Launch;
