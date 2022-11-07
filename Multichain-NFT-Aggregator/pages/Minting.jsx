import {
  Box,
  Divider,
  Select,
  Flex,
  Button,
  Image,
  Input,
  Text,
  Spacer,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Icon,
  InputGroup,
  Wrap,
  WrapItem,
  Center,
} from "@chakra-ui/react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";
import { useToast } from "@chakra-ui/react";
import * as React from "react";
import { ReactNode, useRef } from "react";
import SearchBar from "./Search";
import { RiSwapLine } from "react-icons/ri";
import { useState } from "react";

import { FiFile } from "react-icons/fi";
import { Row, Form, Spinner } from "react-bootstrap";
import { useForm, UseFormRegisterReturn } from "react-hook-form";
import { create as ipfsHttpClient } from "ipfs-http-client";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { LazyMinter } from "./api/components/context/CreateVoucher.js";
import { ABI } from "./api/components/context/LazyNFT.js";
import { useMetamask } from "./api/components/context/metamsk.context";
import Navbar from "./api/components/Navbar";
import { ethers } from "ethers";
import { useDisclosure } from "@chakra-ui/react";
const faunadb = require("faunadb");

const q = faunadb.query;
const fclient = new faunadb.Client({
  secret: "fnAE0m7nU_ACTG_OUURc4S76PRn3ugUdxF5AityE",
});
const url = "https://ipfs.infura.io:5001/api/v0";
// const client = ipfsHttpClient(url);
const INFURA_SECRET_KEY = "1a9ec38205a846bfde9ce364e4558136";
const INFURA_ID = "2H7KDEUR4Et3muJmTPGvBNINyu3";

const auth =
  "Basic " +
  Buffer.from(INFURA_ID + ":" + INFURA_SECRET_KEY).toString("base64");
const client = ipfsHttpClient({
  host: "ipfs.infura.io",
  port: 5001,
  protocol: "https",
  headers: {
    authorization: auth,
  },
});

const Mint = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const variants = ["subtle"];
  const { provider, chain, walletAddress, balance, connectMetamask } =
    useMetamask();
  React.useEffect(() => {
    connectMetamask();
  }, []);

  const toast = useToast();
  const [image, setImage] = useState("");
  const [price, setPrice] = useState(null);
  const [id, setid] = useState(0);
  const [rt, setRt] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [collection, setCollection] = useState("");
  const [voucher, setVoucher] = useState({});
  const [isLoading, setLoading] = useState(false);
  const [redirect, setredirect] = useState(false);
  const [listed, setListed] = useState(true);
  const [sa, setSa] = useState("");
  const [contract, setContract] = useState(undefined);
  const [signer, setSigner] = useState(null);

  const setNameHandler = (event) => setName(event.target.value);

  const setDescriptionHandler = (event) => setDescription(event.target.value);

  const setPriceHandler = (event) => setPrice(event.target.value);

  const setCollectionHandler = (event) => setCollection(event.target.value);

  const uploadToIPFS = async (event) => {
    event.preventDefault();
    if (walletAddress) {
      setSa(walletAddress);
    }

    const file = event.target.files[0];
    if (typeof file !== "undefined" && walletAddress !== null) {
      try {
        console.log(file);
        const result = await client.add(file);
        console.log(result);
        setImage(`https://infura-ipfs.io/ipfs/${result.path}`);
      } catch (error) {
        console.log("ipfs image upload error: ", error);
      }
    }
  };

  const submitFormHandler = async (event) => {
    event.preventDefault();
    await createNFT();
    // toast("Woohoo your NFT is created!");
    toast({
      title: ` WOOHOO your nft is created`,
      variant: "subtle",
      isClosable: true,
    });
  };

  const createNFT = async () => {
    if (!image || !price || !name || !description) {
      return;
    }
    setLoading(true);
    const rt = ethers.utils.parseEther(price).toString();
    setRt(rt);
    try {
      const d = await contract.getTotalMinted();
      console.log(d.toString());
      const id = Number(d) + 1;

      console.log({ image, rt, id, name, description });

      const result = await client.add(
        JSON.stringify({ image, rt, id, name, description })
      );
      console.log(result);
      const uri = `https://infura-ipfs.io/ipfs/${result.path}`;
      console.log(uri);

      console.log(contract?.address);

      const lazyminter = new LazyMinter({ contract, signer });
      const voucher = await lazyminter.createVoucher(
        id,
        uri,
        rt,
        name,
        description
      );
      setVoucher(voucher);
      var metadata = voucher;
      metadata.owner = walletAddress;
      metadata.chainId = chain?.toString();
      metadata.image = image;
      metadata.collection = collection;
      try {
        console.log(chain?.toString());
        const data = await fclient.query(
          q.Create(q.Collection("lazy_mint_nft_signatures"), {
            data: {
              metadata,
            },
          })
        );
        console.log(chain?.toString());
        console.log(data);
      } catch (error) {
        console.error(error);
      }
      setLoading(false);
      let timer1 = setTimeout(() => setredirect(true), 4000);
    } catch (error) {
      console.log("ipfs uri upload error: ", error);
      setLoading(false);
    }
  };
  const [mintAddr, setMintAddr] = useState("");
  const [tokenAddr, setTokenAddr] = useState("");
  const [ownerAddr, setOwnerAddr] = useState("");

  React.useEffect(() => {
    const fetchData = async () => {
      if (walletAddress) {
        const signer = provider?.getSigner();
        console.log(signer);
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
          const d = await marketplace.getTotalMinted();
          console.log(d.toString());

          console.log(marketplace);
          console.log(marketplace.address);
          setContract(marketplace);
          setLoading(false);
        }
        // const allRefs = await fclient.query(
        //   q.Map(
        //     q.Paginate(q.Documents(q.Collection("lazy_mint_nft_signatures"))),
        //     q.Lambda((x: any) => q.Get(x))
        //   )
        // );
        // console.log("allRefs--", allRefs.data);
        // setid(allRefs.data.length + 27);
        setSigner(signer);
      }
    };
    fetchData();
  }, [walletAddress, provider]);

  return (
    <>
      <>
        <SearchBar />
        <Flex
          height={"150vh"}
          backgroundSize={"cover"}
          bgGradient="linear(to-br, #1F0942, #000000)"
          wrap={"wrap"}
        >
          <Flex width={"100%"} textAlign={"center"} justifyContent={"center"}>
            <Box
              width={"50%"}
              mt={"10%"}
              height={"450px"}
              padding={"20px"}
              borderRadius={"20px"}
              bg={"whiteAlpha.300"}
              backdropFilter={"auto"}
              backdropBlur={"2px"}
            >
              <form onSubmit={submitFormHandler}>
                <FormControl isRequired>
                  <FormLabel htmlFor="first-name" color={"white"}>
                    Name :
                  </FormLabel>
                  <Input
                    mt={"10px"}
                    id="first-name"
                    placeholder="Name your NFT "
                    size="sm"
                    color={"white"}
                    onChange={setNameHandler}
                    borderRadius={"12px"}
                  />
                  <FormLabel mt={"10px"} color={"white"} htmlFor="first-name">
                    Collection :
                  </FormLabel>
                  <Input
                    id="first-name"
                    placeholder="Name your Collection"
                    size="sm"
                    onChange={setCollectionHandler}
                    borderRadius={"12px"}
                    color={"white"}
                  />
                  <FormLabel mt={"10px"} color={"white"} htmlFor="first-name">
                    Description :
                  </FormLabel>
                  <Input
                    id="first-name"
                    placeholder="Description of your NFT "
                    size="sm"
                    borderRadius={"12px"}
                    color={"white"}
                    onChange={setDescriptionHandler}
                  />
                  <FormLabel mt={"10px"} color={"white"} htmlFor="first-name">
                    Price :
                  </FormLabel>
                  <Input
                    id="first-name"
                    placeholder="Price at which you want to sell your NFT "
                    size="sm"
                    onChange={setPriceHandler}
                    color={"white"}
                    borderRadius={"12px"}
                  />
                  <FormLabel mt={"10px"} color={"white"}>
                    {"File input :"}
                  </FormLabel>

                  <Form.Control
                    type="file"
                    required
                    name="file"
                    color={"white"}
                    onChange={uploadToIPFS}
                  />
                </FormControl>
                <div>
                  {/* <Button mt={'20px'}  variant='ghost' color={"white"} onClick={submitFormHandler}> Submit</Button>
               
                <ToastContainer /> */}
                  <Center>
                    <Wrap>
                      <WrapItem>
                        <Button mt={"10px"} onClick={submitFormHandler}>
                          Submit
                        </Button>
                      </WrapItem>
                    </Wrap>
                  </Center>
                </div>
              </form>
            </Box>
          </Flex>
        </Flex>
      </>
    </>
  );
};

export default Mint;
