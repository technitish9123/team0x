import * as React from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Text,
} from "@chakra-ui/react";

import { useDisclosure } from "@chakra-ui/react";
import { useMetamask } from "./context/metamsk.context";
import { Badge } from "@chakra-ui/react";
import { CHAIN_DICT } from "./context/constant";
import NetworkList from "./NetworkList";
import { useEffect, useState } from "react";

const ConnectedModal = () => {
  const { walletAddress, balance, currentWallet, killSession, chain } =
    useMetamask();

  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Button onClick={onOpen}>
        {walletAddress?.substring(0, 7) + "..." + walletAddress?.substring(37)}
      </Button>
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader textAlign={"center"}>Connected Wallet</ModalHeader>
          <ModalCloseButton />
          <ModalBody textAlign={"center"}>
            <NetworkList />
            <Text fontSize={"15px"} fontWeight={"bold"}>
              Balance : {balance}
            </Text>
            <Text fontSize={"15px"} fontWeight={"bold"}>
              Connected Wallet : {currentWallet}
            </Text>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={() => killSession()}>
              Disconnect Wallet
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ConnectedModal;
