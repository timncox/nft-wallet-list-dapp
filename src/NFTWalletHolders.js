import React, { useState } from 'react';
import { createPublicClient, http, encodeFunctionData, decodeFunctionResult } from 'viem';
import { sepolia } from 'viem/chains';
import { ethers } from 'ethers';

const client = createPublicClient({
  chain: sepolia,
  transport: http('https://linea-sepolia.infura.io/v3/f4ecb58930c5494d899206199e8d1ca2'),
});

const NFTWalletHolders = () => {
  const [contractAddress, setContractAddress] = useState('');
  const [holders, setHolders] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleAddressChange = (e) => {
    setContractAddress(e.target.value);
  };

  const getHolders = async () => {
    setLoading(true);
    try {
      const abi = [
        {
          "constant": true,
          "inputs": [{ "name": "", "type": "uint256" }],
          "name": "ownerOf",
          "outputs": [{ "name": "", "type": "address" }],
          "payable": false,
          "stateMutability": "view",
          "type": "function",
        },
        {
          "constant": true,
          "inputs": [],
          "name": "totalSupply",
          "outputs": [{ "name": "", "type": "uint256" }],
          "payable": false,
          "stateMutability": "view",
          "type": "function",
        },
      ];

      const totalSupplyData = encodeFunctionData({
        abi,
        functionName: 'totalSupply',
      });

      const totalSupplyResponse = await client.callContract({
        address: contractAddress,
        data: totalSupplyData,
      });

      const totalSupply = decodeFunctionResult({
        abi,
        functionName: 'totalSupply',
        data: totalSupplyResponse,
      });

      const holderAddresses = [];
      for (let tokenId = 0; tokenId < totalSupply; tokenId++) {
        const ownerData = encodeFunctionData({
          abi,
          functionName: 'ownerOf',
          args: [tokenId],
        });

        const ownerResponse = await client.callContract({
          address: contractAddress,
          data: ownerData,
        });

        const ownerAddress = decodeFunctionResult({
          abi,
          functionName: 'ownerOf',
          data: ownerResponse,
        });

        if (!holderAddresses.includes(ownerAddress)) {
          holderAddresses.push(ownerAddress);
        }
      }

      setHolders(holderAddresses);
    } catch (error) {
      console.error('Error fetching NFT holders:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Linea Sepolia NFT Holder Finder</h1>
      <input
        type="text"
        value={contractAddress}
        onChange={handleAddressChange}
        placeholder="Enter NFT Contract Address"
      />
      <button onClick={getHolders} disabled={loading || !ethers.utils.isAddress(contractAddress)}>
        {loading ? 'Loading...' : 'Get Holders'}
      </button>
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Wallet Address</th>
          </tr>
        </thead>
        <tbody>
          {holders.map((holder, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{holder}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default NFTWalletHolders;