import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
} from "@chakra-ui/react";

import { useDisclosure } from "@chakra-ui/react";
import { useMetamask } from "./context/metamsk.context";
import { METAMASK_LOGO } from "./context/constant";
import { WALLETC_LOGO } from "./context/constant";

const NotConnectedModal = () => {
  const { connectMetamask, connectWalletconnect } = useMetamask();

  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      <Button
        bgGradient={[
          "linear(to-tr, teal.300, yellow.400)",
          "linear(to-t, blue.200, teal.500)",
          "linear(to-b, orange.100, purple.800)",
        ]}
        onClick={onOpen}
      >
        Connect Wallet
      </Button>

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader textAlign={"center"}>Connect Wallet</ModalHeader>
          <ModalCloseButton />
          <ModalBody textAlign={"center"}>
            <Button width={"80%"} mb={"10px"} onClick={() => connectMetamask()}>
              <img src={METAMASK_LOGO} width={"20px"} /> &nbsp; Connect to
              MetaMask
            </Button>
            <Button width={"80%"} onClick={() => connectWalletconnect()}>
              <img src={WALLETC_LOGO} width={"25px"} /> &nbsp; Connect to
              WalletConnect
            </Button>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default NotConnectedModal;
