import { Box, Divider,Link, Button,AvatarGroup,Avatar,AiOutlineUser,Image, Hstack, Flex, Input, Text } from "@chakra-ui/react";
import * as React from "react";
import { IconButton } from "@chakra-ui/react";
import Homepage from "./Homepage";
import NotConnectedModal from "./api/components/NotConnectedModal";
import { useMetamask } from "./api/components/context/metamsk.context";
import ConnectedModal from "./api/components/ConnectedModal";
const SearchBar = () => {
  const { isWalletConnected, walletAddress, chain, currentWallet } =
  useMetamask();
  return (
    <>
    <Flex justifyContent={"space-between"} padding={'10px'} bgGradient="linear(to-br, #1F0942, #000000)"> 
    <Box w='70px' h='10'   > 
    <Link href='./Homepage'> 
    <img
  
  mt={'10px'}
  ml={"40px"}
  mb={'10px'}
 

  src='https://i.ibb.co/d4jf3vj/Pngtree-add-user-icon-4479737.png'
 
  
/>
</Link>

</Box>




  
     
     
     
     
     
      <Box
        justifyContent={"center"}
       
        padding={"15px"}
       
        height={"fit-content"}
        flexDirection={'row'}
        w={"100%"}
      >
      
        <Input
          bg={"whiteAlpha.300"}
          backdropFilter={"auto"}
          backdropBlur={"2px"}
          rounded={"2xl"}
          placeholder="Search"
          w={"50%"}
          ml={"25%"}
        />
        </Box> 
       
        
          {" "}
          <Box pl={"70px"} pr={"60px"} mr={'40px'} mt={'15px'} >
            {isWalletConnected && walletAddress && chain && currentWallet ? (
              <>
                <ConnectedModal />
              </>
            ) : (
              <NotConnectedModal />
            )}
          </Box>
         
      
        
        
       
    
      </Flex>
     
    </>
  );
};
export default SearchBar;
