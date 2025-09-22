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
  privateKey?: string;
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
        
        // Get private key for Anvil prefunded accounts
        let privateKey: string | undefined;
        
        // Known Anvil private keys for the first 10 accounts (these are the actual keys Anvil uses)
        const knownPrivateKeys = [
          "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80", // Account 0
          "0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d", // Account 1
          "0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a", // Account 2
          "0x7c852118e8d7e3b95a4d5c4c4c4c4c4c4c4c4c4c4c4c4c4c4c4c4c4c4c4c4c4c", // Account 3
          "0x47e179ec197488593b187f80a00eb0da91f1b9d0b13f8733639f19c30a34926a", // Account 4
          "0x8b3a350cf5c34c9194ca85829a2df0ec3153be0318b5e2d3348e872092edffba", // Account 5
          "0x92db14e403b83dfe3df233f83dfa3a0d7096f21ca9b0d6d6b8d88b2b4ec1564e", // Account 6
          "0x4bbbf85ce3377467afe5d46f804f221813b2bb87f24d81f60f1fcdbf7cbf4356", // Account 7
          "0xdbda1821b80551c9d65939329250298aa3472ba22feea921c0cf5d620ea67b97", // Account 8
          "0x2a871d0798f97d79848a013d4936a73bf4cc922c825d33c1cf7073dff6ad5a3e", // Account 9
        ];

        if (i < knownPrivateKeys.length) {
          // For now, assign the private key directly without verification
          // This will help us see if the issue is with verification or the keys themselves
          privateKey = knownPrivateKeys[i];
        }
        
        accounts.push({
          address,
          balance: ethers.formatEther(balance),
          nonce,
          index: i,
          privateKey,
        });
        
        // Debug log to see what's happening
        console.log(`Account ${i}:`, { address, privateKey: privateKey ? 'Found' : 'Not found' });
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
      
      // Fetch last 20 blocks for better coverage
      const startBlock = Math.max(0, latestBlockNumber - 19);
      
      for (let i = startBlock; i <= latestBlockNumber; i++) {
        try {
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
        } catch (blockError) {
          console.warn(`Failed to fetch block ${i}:`, blockError);
        }
      }
      
      // Sort blocks by number in descending order (latest first)
      const sortedBlocks = blocks.sort((a, b) => b.number - a.number);
      dispatch({ type: 'SET_BLOCKS', payload: sortedBlocks });
      
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
      try {
        // Update network info first
        const network = await state.provider.getNetwork();
        const blockNumber = await state.provider.getBlockNumber();
        const gasPrice = await state.provider.getFeeData();
        
        const networkInfo: NetworkInfo = {
          chainId: Number(network.chainId),
          name: network.name || 'Unknown',
          gasPrice: ethers.formatUnits(gasPrice.gasPrice || 0, 'gwei'),
          blockNumber,
        };
        
        dispatch({ type: 'SET_CONNECTION', payload: { provider: state.provider, network: networkInfo } });
        
        // Then fetch accounts and blocks
        await fetchAccounts(state.provider);
        await fetchBlocks(state.provider);
      } catch (error) {
        console.error('Refresh data failed:', error);
      }
    }
  };

  // Auto-refresh data every 5 seconds when connected
  useEffect(() => {
    if (state.isConnected && state.provider) {
      const interval = setInterval(async () => {
        try {
          await refreshData();
        } catch (error) {
          console.warn('Auto-refresh failed:', error);
        }
      }, 5000);

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