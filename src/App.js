import React, { useState } from 'react';
import { createPublicClient, http } from 'viem';
import { ethers } from 'ethers';
import HolderTable from './components/HolderTable';

// Linea Sepolia RPC endpoint
const lineaSepoliaRpc = 'https://rpc-sepolia.linea.build';

const client = createPublicClient({
  transport: http(lineaSepoliaRpc),
});

function App() {
  const [contractAddress, setContractAddress] = useState('');
  const [holders, setHolders] = useState([]);

  const fetchHolders = async () => {
    try {
      // Ensure the provided address is valid
      if (!ethers.utils.isAddress(contractAddress)) {
        alert('Invalid contract address');
        return;
      }

      // Define the ABI to fetch the balance of an address
      const abi = [
        'function balanceOf(address owner) view returns (uint256)',
        'event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)'
      ];

      // Create a contract instance
      const contract = new ethers.Contract(contractAddress, abi, client);

      // Fetch all Transfer events to track holders
      const filter = contract.filters.Transfer(null, null);
      const events = await contract.queryFilter(filter, 0, 'latest');

      // Track holders based on Transfer events
      const holderAddresses = new Set();
      events.forEach(event => {
        const { from, to } = event.args;
        if (from !== ethers.constants.AddressZero) {
          holderAddresses.delete(from);
        }
        holderAddresses.add(to);
      });

      setHolders([...holderAddresses]);
    } catch (error) {
      console.error('Error fetching holders:', error);
      alert('An error occurred while fetching holders');
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>NFT Holder Lookup</h1>
        <input
          type="text"
          value={contractAddress}
          onChange={(e) => setContractAddress(e.target.value)}
          placeholder="Enter NFT Contract Address"
        />
        <button onClick={fetchHolders}>Fetch Holders</button>
        {holders.length > 0 && <HolderTable holders={holders} />}
      </header>
    </div>
  );
}

export default App;