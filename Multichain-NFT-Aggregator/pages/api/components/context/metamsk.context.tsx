import WalletConnect from "@walletconnect/client";
import { BigNumber, ethers, Signer, utils } from "ethers";
import { createContext, Context, useState, useContext, useEffect } from "react";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { providers } from "ethers";
import { Web3Provider } from "@ethersproject/providers";
import { RPC_DICT } from "./constant";

interface AppContextInterface {
  isWalletConnected: boolean;
  walletAddress: string | null;
  setWalletAddress: Function;
  setChain: Function;
  setIsWalletConnected: Function;
  connectMetamask: Function;
  chain: number | null;
  changeChain: Function;
  balance: any;
  connectWalletconnect: Function;
  signMessage: Function;
  currentWallet: any;
  killSession: Function;
  provider: Web3Provider | null;
}

const MetamaskContext: Context<AppContextInterface | null> =
  createContext<AppContextInterface | null>(null);

interface Props {
  children: any;
}

enum Wallet {
  "Metamask" = "Metamask",
  "Walletconnect" = "Walletconnect",
}

let currentWallet: Wallet | null = null;

export const MetaMaskProvider = ({ children }: Props) => {
  const [isWalletConnected, setIsWalletConnected] = useState<boolean>(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [chain, setChain] = useState<number | null>(null);
  const [balance, setBalance] = useState<string | null>(null);
  const [fetching, setFetching] = useState<boolean | null>(null);
  const [connector, setConnector] = useState<WalletConnect | null>(null);
  // const [currentWallet, setCurrentWallet] = useState<Wallet | null>(null)
  const [provider, setProvider] = useState<Web3Provider | null>(null);

  useEffect(() => {
    console.log(currentWallet);
  }, [currentWallet]);

  useEffect(() => {
    getBalance();
  }, [walletAddress, provider]);

  const connectWalletconnect = async () => {
    try {
      // setCurrentWallet(Wallet.Walletconnect)
      currentWallet = Wallet.Walletconnect;

      const walletConnectProvider = new WalletConnectProvider({
        rpc: RPC_DICT,
      });

      //  Enable session (triggers QR Code modal)
      await walletConnectProvider.enable();

      const web3Provider = new providers.Web3Provider(walletConnectProvider);

      walletConnectProvider.on("accountsChanged", handleAccountsChanged);
      walletConnectProvider.on("chainChanged", handleChainChanged);
      walletConnectProvider.on("disconnect", handleDisconnect);

      setProvider(web3Provider);

      const accounts = walletConnectProvider.accounts;

      const chain = walletConnectProvider.chainId;

      const account = accounts[0];
      setIsWalletConnected(true);

      setWalletAddress(account);

      const chainAsInt = chain;

      setChain(chainAsInt);
    } catch (error) {
      console.log(error);
    }
  };

  const resetApp = () => {
    setConnector(null);
    setFetching(false);
    setIsWalletConnected(false);
    setWalletAddress(null);
    setChain(null);
  };

  const killSession = () => {
    // Make sure the connector exists before trying to kill the session
    if (connector) {
      connector.killSession();
    }
    resetApp();
  };

  const onConnect = async (chainId: number, connectedAccount: string) => {};

  const signMessage = async () => {
    const signer = provider?.getSigner();

    if (signer) {
      const signedMessage = await signer.signMessage("Hey, I am Karun");

      console.log(signedMessage);
    } else {
      console.log("Provider", provider);
      console.log("Signer", signer);
    }
  };

  const connectMetamask = async () => {
    try {
      // setCurrentWallet(Wallet.Metamask)
      currentWallet = Wallet.Metamask;

      if (window.ethereum) {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });

        const chain = await window.ethereum.request({
          method: "eth_chainId",
        });

        const account = accounts[0];
        setIsWalletConnected(true);

        setWalletAddress(account);

        const chainAsInt = parseInt(chain);

        setChain(chainAsInt);

        const provider = new ethers.providers.Web3Provider(window.ethereum);

        window.ethereum.on("accountsChanged", handleAccountsChanged);
        window.ethereum.on("chainChanged", handleChainChanged);
        window.ethereum.on("disconnect", handleDisconnect);

        setProvider(provider);
      } else {
        console.log("No Metamask detected");
      }
    } catch (error: any) {
      if (error?.code === -32002) {
        // errorHandler('Please navigate to metamask.')
      }
      // console.log(error)
    }
  };

  const handleAccountsChanged = (accounts: any) => {
    if (accounts.length === 0) {
      // MetaMask is locked or the user has not connected any accounts
      console.log("Please connect to MetaMask.");
      setIsWalletConnected(false);
      setWalletAddress(null);
      setChain(null);
    } else if (accounts[0] !== walletAddress) {
      setIsWalletConnected(true);
      setWalletAddress(accounts[0]);
      // Do any other work!
    }
  };

  const handleDisconnect = () => {
    setIsWalletConnected(false);
    setWalletAddress(null);
    setChain(null);
  };

  const getBalance = async () => {
    let balance;

    if (walletAddress && provider) {
      balance = await provider.getBalance(walletAddress);

      const formattedBalance = ethers.utils.formatEther(balance);

      setBalance(formattedBalance);
    }
  };

  const handleChainChanged = async (chainId: string) => {
    if (currentWallet === Wallet.Metamask) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);

      provider.on("accountsChanged", handleAccountsChanged);
      provider.on("chainChanged", handleChainChanged);
      provider.on("disconnect", handleDisconnect);

      setProvider(provider);
    } else {
      const walletConnectProvider = new WalletConnectProvider({
        rpc: RPC_DICT,
      });

      //  Enable session (triggers QR Code modal)
      await walletConnectProvider.enable();

      const web3Provider = new providers.Web3Provider(walletConnectProvider);

      walletConnectProvider.on("accountsChanged", handleAccountsChanged);
      walletConnectProvider.on("chainChanged", handleChainChanged);
      walletConnectProvider.on("disconnect", handleDisconnect);

      setProvider(web3Provider);
    }

    const chainAsInt = parseInt(chainId);

    setChain(chainAsInt);
  };

  const changeChain = async (chainId: number) => {
    try {
      // const chain = await window.ethereum.request({
      //   method: 'wallet_switchEthereumChain',
      //   params: [{ chainId: `0x${chainId.toString()}` }],
      // })

      const hex = parseInt(`${chainId}`).toString(16);

      await provider?.send("wallet_switchEthereumChain", [
        { chainId: `0x${hex}` },
      ]);

      if (currentWallet == Wallet.Metamask) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);

        provider.on("accountsChanged", handleAccountsChanged);
        provider.on("chainChanged", handleChainChanged);
        provider.on("disconnect", handleDisconnect);

        setProvider(provider);
      } else {
        const walletConnectProvider = new WalletConnectProvider({
          rpc: RPC_DICT,
        });

        //  Enable session (triggers QR Code modal)
        await walletConnectProvider.enable();

        const web3Provider = new providers.Web3Provider(walletConnectProvider);

        walletConnectProvider.on("accountsChanged", handleAccountsChanged);
        walletConnectProvider.on("chainChanged", handleChainChanged);
        walletConnectProvider.on("disconnect", handleDisconnect);

        setProvider(web3Provider);
      }

      setChain(chainId);
    } catch (error: any) {
      if (error?.code === 4902) {
        // errorHandler('Please add chain in metamask.')
      }
      console.log(error);
    }
  };

  return (
    <MetamaskContext.Provider
      value={{
        isWalletConnected,
        walletAddress,
        connectMetamask,
        connectWalletconnect,
        chain,
        changeChain,
        setWalletAddress,
        setChain,
        setIsWalletConnected,
        balance,
        signMessage,
        currentWallet,
        killSession,
        provider,
      }}
    >
      {children}
    </MetamaskContext.Provider>
  );
};

export function useMetamask() {
  const metamaskContext = useContext(MetamaskContext);

  if (!metamaskContext) {
    throw new Error(
      "Component must be enclosed by MetamaskProvider to be able to use MetamaskContext"
    );
  }

  return metamaskContext;
}
