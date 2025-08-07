import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { ethers } from 'ethers';
import { useToast } from '@/hooks/use-toast';

// Types
export interface Block {
  number: number;
  hash: string;
  timestamp: number;
  miner: string;
  gasUsed: string;
  gasLimit: string;
  txCount: number;
  size: number;
}

export interface Transaction {
  hash: string;
  blockNumber: number;
  from: string;
  to: string | null;
  value: string;
  gasUsed: string;
  gasPrice: string;
  status: 'success' | 'failed' | 'pending';
  timestamp: number;
  type: string;
}

export interface Account {
  address: string;
  balance: string;
  nonce: number;
  index?: number;
}

export interface NetworkInfo {
  chainId: number;
  name: string;
  gasPrice: string;
  blockNumber: number;
}

export interface AnvilState {
  isConnected: boolean;
  isConnecting: boolean;
  provider: ethers.JsonRpcProvider | null;
  signer: ethers.Wallet | null;
  rpcUrl: string;
  privateKey: string;
  network: NetworkInfo | null;
  accounts: Account[];
  blocks: Block[];
  transactions: Transaction[];
  error: string | null;
}

type AnvilAction =
  | { type: 'SET_CONNECTING'; payload: boolean }
  | { type: 'SET_CONNECTION'; payload: { provider: ethers.JsonRpcProvider; network: NetworkInfo } }
  | { type: 'SET_SIGNER'; payload: ethers.Wallet }
  | { type: 'SET_RPC_URL'; payload: string }
  | { type: 'SET_PRIVATE_KEY'; payload: string }
  | { type: 'SET_ACCOUNTS'; payload: Account[] }
  | { type: 'SET_BLOCKS'; payload: Block[] }
  | { type: 'SET_TRANSACTIONS'; payload: Transaction[] }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'DISCONNECT' };

const initialState: AnvilState = {
  isConnected: false,
  isConnecting: false,
  provider: null,
  signer: null,
  rpcUrl: 'http://127.0.0.1:8545',
  privateKey: '',
  network: null,
  accounts: [],
  blocks: [],
  transactions: [],
  error: null,
};

function anvilReducer(state: AnvilState, action: AnvilAction): AnvilState {
  switch (action.type) {
    case 'SET_CONNECTING':
      return { ...state, isConnecting: action.payload };
    case 'SET_CONNECTION':
      return {
        ...state,
        isConnected: true,
        isConnecting: false,
        provider: action.payload.provider,
        network: action.payload.network,
        error: null,
      };
    case 'SET_SIGNER':
      return { ...state, signer: action.payload };
    case 'SET_RPC_URL':
      return { ...state, rpcUrl: action.payload };
    case 'SET_PRIVATE_KEY':
      return { ...state, privateKey: action.payload };
    case 'SET_ACCOUNTS':
      return { ...state, accounts: action.payload };
    case 'SET_BLOCKS':
      return { ...state, blocks: action.payload };
    case 'SET_TRANSACTIONS':
      return { ...state, transactions: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, isConnecting: false };
    case 'DISCONNECT':
      return {
        ...initialState,
        rpcUrl: state.rpcUrl,
        privateKey: state.privateKey,
      };
    default:
      return state;
  }
}

interface AnvilContextType {
  state: AnvilState;
  connect: (rpcUrl: string, privateKey?: string) => Promise<void>;
  disconnect: () => void;
  setRpcUrl: (url: string) => void;
  setPrivateKey: (key: string) => void;
  sendTransaction: (to: string, value: string) => Promise<string>;
  refreshData: () => Promise<void>;
}

const AnvilContext = createContext<AnvilContextType | undefined>(undefined);

export const useAnvil = () => {
  const context = useContext(AnvilContext);
  if (context === undefined) {
    throw new Error('useAnvil must be used within an AnvilProvider');
  }
  return context;
};

interface AnvilProviderProps {
  children: ReactNode;
}

export const AnvilProvider: React.FC<AnvilProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(anvilReducer, initialState);
  const { toast } = useToast();

  const connect = async (rpcUrl: string, privateKey?: string) => {
    dispatch({ type: 'SET_CONNECTING', payload: true });
    
    try {
      // Initialize provider
      const provider = new ethers.JsonRpcProvider(rpcUrl);
      
      // Test connection and get network info
      const network = await provider.getNetwork();
      const blockNumber = await provider.getBlockNumber();
      const gasPrice = await provider.getFeeData();
      
      const networkInfo: NetworkInfo = {
        chainId: Number(network.chainId),
        name: network.name || 'Unknown',
        gasPrice: ethers.formatUnits(gasPrice.gasPrice || 0, 'gwei'),
        blockNumber,
      };

      dispatch({ type: 'SET_CONNECTION', payload: { provider, network: networkInfo } });
      dispatch({ type: 'SET_RPC_URL', payload: rpcUrl });

      // Set up signer if private key provided
      if (privateKey) {
        try {
          const signer = new ethers.Wallet(privateKey, provider);
          dispatch({ type: 'SET_SIGNER', payload: signer });
          dispatch({ type: 'SET_PRIVATE_KEY', payload: privateKey });
        } catch (err) {
          console.warn('Invalid private key provided:', err);
          toast({
            title: "Warning",
            description: "Invalid private key provided. Continuing without signer.",
            variant: "destructive",
          });
        }
      }

      // Fetch initial data
      await fetchAccounts(provider);
      await fetchBlocks(provider);
      
      toast({
        title: "Connected Successfully",
        description: `Connected to ${networkInfo.name} (Chain ID: ${networkInfo.chainId})`,
      });

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to connect to RPC';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      toast({
        title: "Connection Failed",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const disconnect = () => {
    dispatch({ type: 'DISCONNECT' });
    toast({
      title: "Disconnected",
      description: "Disconnected from Anvil node",
    });
  };

  const setRpcUrl = (url: string) => {
    dispatch({ type: 'SET_RPC_URL', payload: url });
  };

  const setPrivateKey = (key: string) => {
    dispatch({ type: 'SET_PRIVATE_KEY', payload: key });
  };

  const fetchAccounts = async (provider: ethers.JsonRpcProvider) => {
    try {
      // Try to get accounts from provider (for Anvil/Ganache)
      const accountAddresses = await provider.send('eth_accounts', []);
      
      const accounts: Account[] = [];
      for (let i = 0; i < accountAddresses.length; i++) {
        const address = accountAddresses[i];
        const balance = await provider.getBalance(address);
        const nonce = await provider.getTransactionCount(address);
        
        accounts.push({
          address,
          balance: ethers.formatEther(balance),
          nonce,
          index: i,
        });
      }
      
      dispatch({ type: 'SET_ACCOUNTS', payload: accounts });
    } catch (error) {
      console.error('Failed to fetch accounts:', error);
    }
  };

  const fetchBlocks = async (provider: ethers.JsonRpcProvider) => {
    try {
      const latestBlockNumber = await provider.getBlockNumber();
      const blocks: Block[] = [];
      
      // Fetch last 10 blocks
      for (let i = Math.max(0, latestBlockNumber - 9); i <= latestBlockNumber; i++) {
        const block = await provider.getBlock(i, true);
        if (block) {
          blocks.push({
            number: block.number,
            hash: block.hash,
            timestamp: block.timestamp,
            miner: block.miner || 'Unknown',
            gasUsed: ethers.formatUnits(block.gasUsed, 'wei'),
            gasLimit: ethers.formatUnits(block.gasLimit, 'wei'),
            txCount: block.transactions.length,
            size: block.length || 0,
          });
        }
      }
      
      dispatch({ type: 'SET_BLOCKS', payload: blocks.reverse() });
      
      // Extract transactions from blocks
      const transactions: Transaction[] = [];
      for (const block of blocks) {
        const fullBlock = await provider.getBlock(block.number, true);
        if (fullBlock?.transactions) {
          for (const txHash of fullBlock.transactions) {
            if (typeof txHash === 'string') {
              try {
                const tx = await provider.getTransaction(txHash);
                const receipt = await provider.getTransactionReceipt(txHash);
                
                if (tx && receipt) {
                  transactions.push({
                    hash: tx.hash,
                    blockNumber: tx.blockNumber || 0,
                    from: tx.from,
                    to: tx.to,
                    value: ethers.formatEther(tx.value),
                    gasUsed: ethers.formatUnits(receipt.gasUsed, 'wei'),
                    gasPrice: ethers.formatUnits(tx.gasPrice || 0, 'gwei'),
                    status: receipt.status === 1 ? 'success' : 'failed',
                    timestamp: fullBlock.timestamp,
                    type: tx.to ? 'Transfer' : 'Contract Creation',
                  });
                }
              } catch (error) {
                console.warn('Failed to fetch transaction:', txHash, error);
              }
            }
          }
        }
      }
      
      dispatch({ type: 'SET_TRANSACTIONS', payload: transactions.slice(0, 25) });
    } catch (error) {
      console.error('Failed to fetch blocks:', error);
    }
  };

  const sendTransaction = async (to: string, value: string): Promise<string> => {
    if (!state.signer) {
      throw new Error('No signer available. Please provide a private key.');
    }

    try {
      const tx = await state.signer.sendTransaction({
        to,
        value: ethers.parseEther(value),
        gasLimit: 21000,
      });

      toast({
        title: "Transaction Sent",
        description: `Transaction hash: ${tx.hash}`,
      });

      return tx.hash;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Transaction failed';
      toast({
        title: "Transaction Failed",
        description: errorMessage,
        variant: "destructive",
      });
      throw error;
    }
  };

  const refreshData = async () => {
    if (state.provider) {
      await fetchAccounts(state.provider);
      await fetchBlocks(state.provider);
    }
  };

  // Auto-refresh data every 10 seconds when connected
  useEffect(() => {
    if (state.isConnected && state.provider) {
      const interval = setInterval(() => {
        refreshData();
      }, 10000);

      return () => clearInterval(interval);
    }
  }, [state.isConnected, state.provider]);

  return (
    <AnvilContext.Provider
      value={{
        state,
        connect,
        disconnect,
        setRpcUrl,
        setPrivateKey,
        sendTransaction,
        refreshData,
      }}
    >
      {children}
    </AnvilContext.Provider>
  );
};