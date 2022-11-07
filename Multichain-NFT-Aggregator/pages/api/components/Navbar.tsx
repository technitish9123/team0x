import { Flex, Box } from "@chakra-ui/react";
import * as React from "react";
import { Button, ButtonGroup, Avatar } from "@chakra-ui/react";
import NotConnectedModal from "./NotConnectedModal";
import { useMetamask } from "./context/metamsk.context";
import ConnectedModal from "./ConnectedModal";

const Navbar = () => {
  const { isWalletConnected, walletAddress, chain, currentWallet } =
    useMetamask();
  return (
    <Flex>
      <Box flex={"1"} justifyContent={"flex-start"}></Box>

      <Box
        flex={"2"}
        px={"20px"}
        py={"15px"}
        justifyContent={"flex-end"}
        flexDirection={"row"}
        color={"white"}
        width={"100vw"}
        mt={"20px"}
        bg={"transparent"}
      >
        <ButtonGroup>
          <a href="../../Homepage">
            <Button variant={"ghost"} colorScheme={"grey"}>
              Home
            </Button>
          </a>
          <a href="../../LazyMarketplace">
            <Button variant={"ghost"} colorScheme={"grey"}>
              Lazy Marketplace
            </Button>
          </a>
          <Button variant={"ghost"} colorScheme={"grey"}>
            Create
          </Button>
        </ButtonGroup>
        {isWalletConnected && walletAddress && chain && currentWallet ? (
          <>
            <ConnectedModal />
          </>
        ) : (
          <NotConnectedModal />
        )}
      </Box>
    </Flex>
  );
};

export default Navbar;
