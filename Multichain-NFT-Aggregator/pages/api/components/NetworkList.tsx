import * as React from 'react';
import { CHAIN_DICT } from './context/constant';
import { Select } from '@chakra-ui/react';
import { useMetamask } from './context/metamsk.context';

const NetworkList =() =>{

    const{
        changeChain
    }=useMetamask()

    return(
        <Select
                onChange={(e) => {
                  changeChain(
                    Object.keys(CHAIN_DICT)[e.target.options.selectedIndex]
                  )
                }}
              >
                {Object.keys(CHAIN_DICT).map((chainId: string) => {
                  return (
                    <option key={chainId}>
                      {CHAIN_DICT[parseInt(chainId) as keyof typeof CHAIN_DICT]}
                    </option>
                  )
                })}
        </Select>
    )
}

export default NetworkList