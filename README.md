# AnvilX Dashboard

**Foundry Anvil Node Monitor** - A real-time dashboard for monitoring and managing your local Ethereum development node.

#Live Link - https://anvilx.vercel.app/

## What is AnvilX?

AnvilX Dashboard is a comprehensive monitoring tool for Foundry Anvil nodes. It provides real-time insights into your local blockchain development environment, allowing you to:

- **Monitor node status** and network health
- **Track blocks** and transactions in real-time
- **Manage accounts** and view balances
- **Interact with contracts** and deploy new ones
- **Debug transactions** and analyze gas usage

## Getting Started

### Prerequisites

- **Foundry Anvil** running locally (default: `http://localhost:8545`)
- **AnvilX Dashboard** (web app or desktop app)

### Quick Setup

1. **Start Anvil** (if not already running):
   ```bash
   anvil
   ```

2. **Open AnvilX Dashboard**:
   - **Web**: Open in browser at `http://localhost:8080`
   - **Desktop**: Launch the AnvilX app

3. **Connect to Anvil**:
   - Click "Connect" in the top-right corner
   - Enter your Anvil RPC URL (default: `http://localhost:8545`)
   - Click "Connect to Node"

## Dashboard Overview

### Main Dashboard (`/`)

The main dashboard shows real-time metrics:

- **Current Block**: Latest block number
- **Chain ID**: Network identifier (31337 for Anvil)
- **Accounts**: Number of available accounts
- **Gas Price**: Current gas price in Gwei

**Recent Blocks Table**: Shows the latest 10 blocks with:
- Block number and hash
- Timestamp
- Transaction count
- Gas used/limit
- Block size

### Accounts Page (`/accounts`)

Manage your Anvil accounts:

**Account List**:
- View all available accounts
- See account addresses and balances
- Copy addresses to clipboard
- View/hide private keys (for development)

**Account Actions**:
- **Copy Address**: Click the copy icon next to any address
- **View Private Key**: Click the eye icon to reveal private key
- **View Balance**: See ETH balance for each account

**Account Details**:
- Address (with copy button)
- Balance in ETH
- Nonce (transaction count)
- Private key (for development use)

### Blocks Page (`/blocks`)

Explore blockchain data:

**Block Explorer**:
- Browse blocks by number
- View block details (hash, timestamp, gas usage)
- See all transactions in a block
- Navigate between blocks

**Block Information**:
- Block number and hash
- Timestamp and miner address
- Gas used vs gas limit
- Transaction count
- Block size

### Transactions Page (`/transactions`)

Monitor transaction activity:

**Transaction Feed**:
- Real-time transaction updates
- Transaction status (success/failed/pending)
- Gas usage and cost
- From/to addresses

**Transaction Details**:
- Transaction hash
- Block number and timestamp
- Gas used and gas price
- Transaction value
- Status and type

### Contracts Page (`/contracts`)

Interact with smart contracts:

**Contract Management**:
- Deploy new contracts
- Interact with existing contracts
- View contract ABI
- Call contract functions

**Contract Actions**:
- **Deploy**: Upload and deploy contract bytecode
- **Read**: Call view/pure functions
- **Write**: Send transactions to state-changing functions
- **Events**: Monitor contract events

### Tools Page (`/tools`)

Developer utilities:

**Network Tools**:
- Switch between networks
- View network information
- Test RPC endpoints

**Development Tools**:
- Gas price calculator
- Address validator
- Transaction decoder
- Block explorer links

## Features

### Real-time Monitoring
- **Live Updates**: Dashboard updates automatically as new blocks are mined
- **Connection Status**: Visual indicator of node connection
- **Error Handling**: Clear error messages for connection issues

### Account Management
- **Multiple Accounts**: View all Anvil accounts in one place
- **Balance Tracking**: Real-time balance updates
- **Private Key Access**: View private keys for development
- **Address Copying**: Easy copying of addresses

### Transaction Tracking
- **Real-time Feed**: See transactions as they happen
- **Status Monitoring**: Track transaction success/failure
- **Gas Analysis**: Monitor gas usage and costs
- **Transaction Details**: Deep dive into transaction data

### Contract Interaction
- **Deploy Contracts**: Upload and deploy smart contracts
- **Function Calls**: Interact with contract functions
- **Event Monitoring**: Watch for contract events
- **ABI Management**: Import and manage contract ABIs

## Usage Examples

### Monitoring Your Development

1. **Start Anvil**:
   ```bash
   anvil --accounts 10 --balance 1000
   ```

2. **Open AnvilX Dashboard** and connect

3. **Watch Real-time Activity**:
   - See new blocks being mined
   - Monitor transaction activity
   - Track account balances

### Deploying a Contract

1. **Go to Contracts page**
2. **Click "Deploy Contract"**
3. **Paste your contract bytecode**
4. **Select deploying account**
5. **Click "Deploy"**
6. **Monitor deployment transaction**

### Debugging Transactions

1. **Go to Transactions page**
2. **Find your transaction**
3. **Click to view details**
4. **Check gas usage and status**
5. **View transaction logs**

## Keyboard Shortcuts

- `Ctrl/Cmd + R`: Refresh data
- `Ctrl/Cmd + K`: Open command palette
- `Ctrl/Cmd + ,`: Open settings
- `Escape`: Close modals

## Troubleshooting

### Connection Issues

**Problem**: Cannot connect to Anvil
**Solution**: 
- Ensure Anvil is running on `http://localhost:8545`
- Check if port 8545 is available
- Try restarting Anvil

**Problem**: Dashboard shows "Disconnected"
**Solution**:
- Click "Connect" button
- Verify RPC URL is correct
- Check Anvil is still running

### Data Not Updating

**Problem**: Dashboard not showing new blocks
**Solution**:
- Check if Anvil is mining blocks
- Try refreshing the page
- Verify connection status

### Account Issues

**Problem**: Accounts not showing
**Solution**:
- Ensure Anvil is running with accounts
- Check if accounts have been created
- Try reconnecting to node

## System Requirements

- **Anvil**: Foundry Anvil running locally
- **Browser**: Modern browser (Chrome, Firefox, Safari, Edge)
- **Network**: Local network access to Anvil RPC

## Support

For issues or questions:
- Check the troubleshooting section above
- Ensure Anvil is running properly
- Verify network connectivity
- Check browser console for errors

---

**AnvilX Dashboard** - Making Ethereum development easier, one block at a time.
