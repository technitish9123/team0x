import { Box, Flex, Link } from "@chakra-ui/react";
import * as React from "react";
import SearchBar from "./Search";
import { useState } from "react";
import MarketplaceCard from "./MarketplaceCard";

import { useMetamask } from "./api/components/context/metamsk.context";
const faunadb = require("faunadb");

const q = faunadb.query;
const client = new faunadb.Client({
  secret: "fnAE0m7nU_ACTG_OUURc4S76PRn3ugUdxF5AityE",
});

const LazyMarketplace = () => {
  const { provider, walletAddress, balance, connectMetamask } = useMetamask();
  React.useEffect(() => {
    connectMetamask();
  }, []);
  const [signer, setSigner] = useState(null);

  const [listedNFTs, setListedNFTs] = useState([]);

  React.useEffect(() => {
    const fetchData = async () => {
      if (walletAddress) {
        const signer = provider?.getSigner();
        console.log(signer);

        // if (signer) {
        const allRefs = await client.query(
          q.Map(
            q.Paginate(q.Documents(q.Collection("marketplace_nfts"))),
            q.Lambda((x) => q.Get(x))
          )
        );
        console.log("allRefs--", allRefs);
        if (allRefs.data.length === 0) {
          console.log("No data found");
        } else {
          setListedNFTs(allRefs.data);
        }
        //   const marketplace = new ethers.Contract(
        //     "0x3EF309E793619FfA816D455771B374A552882D7b",
        //     ABI,
        //     signer
        //   );
        //   console.log(marketplace);
        //   console.log(marketplace.address);
        //   setContract(marketplace);
        //   setLoading(false);
        // }
        setSigner(signer);
      }
    };
    fetchData();
  }, [walletAddress, provider]);

  return (
    <>
      <SearchBar />
      <Flex
        height={"150vh"}
        backgroundSize={"cover"}
        bgGradient="linear(to-br, #1F0942, #000000)"
        justifyContent={"space-between"}
      >
        <Flex justifyContent={"center"} wrap={"wrap"}>
          {listedNFTs
            ? listedNFTs.map((nft, index) => {
                return (
                  <Link key={index}>
                    <Box marginTop={"50px"} marginLeft={"20px"}>
                      <MarketplaceCard key={index} singlenft={nft} />
                    </Box>
                  </Link>
                );
              })
            : ""}
        </Flex>
      </Flex>
    </>
  );
};

export default LazyMarketplace;
