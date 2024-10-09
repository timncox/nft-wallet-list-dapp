import React, { useState } from 'react';
import { ethers } from 'ethers';
import HolderTable from './components/HolderTable';
import './App.css';
import { CSVLink } from 'react-csv';

// Use environment variables to store sensitive information like Infura keys
const lineaSepoliaRpc = process.env.REACT_APP_INFURA_RPC_URL;

if (!lineaSepoliaRpc) {
  console.error('Error: REACT_APP_INFURA_RPC_URL is not set in environment variables');
}

const provider = new ethers.providers.JsonRpcProvider(lineaSepoliaRpc);

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

      console.log('Fetching holders for contract:', contractAddress);
      console.log('Provider URL:', lineaSepoliaRpc);

      // Define the ABI to fetch the balance of an address
      const abi = [
        'function balanceOf(address owner) view returns (uint256)',
        'event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)'
      ];

      // Create a contract instance
      const contract = new ethers.Contract(contractAddress, abi, provider);
      console.log('Contract instance created:', contract);

      // Fetch all Transfer events to track holders
      const filter = contract.filters.Transfer(null, null);
      const events = await contract.queryFilter(filter, 0, 'latest');
      console.log('Transfer events fetched:', events);

      // Track holders based on Transfer events
      const holderAddresses = new Set();
      events.forEach(event => {
        const { from, to } = event.args;
        if (from !== ethers.constants.AddressZero) {
          holderAddresses.delete(from);
        }
        holderAddresses.add(to);
      });

      console.log('Holders found:', holderAddresses);
      setHolders([...holderAddresses]);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        console.error('Unauthorized access - possible issue with API key:', error);
      } else {
        console.error('Error fetching holders:', error);
      }
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
        {holders.length > 0 && (
          <>
            <HolderTable holders={holders} />
            <CSVLink data={holders.map(holder => ({ address: holder }))} filename="nft_holders.csv">
              Export to CSV
            </CSVLink>
          </>
        )}
      </header>
    </div>
  );
}

export default App;