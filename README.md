# NFT Wallet List dApp

## Overview
The NFT Wallet List dApp is a simple React-based application that allows users to enter an NFT contract address and retrieve a list of wallet addresses that hold the given NFT. The application uses Ethers.js to interact with the blockchain and fetch the holders' information. Users can also export the list of wallet addresses to a CSV file for easy reference.

## Features
- **Fetch NFT Holders**: Enter a smart contract address to retrieve the wallet addresses holding the NFT.
- **CSV Export**: Export the list of holders to a CSV file.
- **User-Friendly Interface**: Simple UI built with React.

## Tools & Technologies Used
- **React**: Frontend framework used to build the user interface.
- **Ethers.js**: Library to interact with the Ethereum blockchain.
- **Infura**: Used for the RPC URL to connect to the Linea Sepolia test network.
- **react-csv**: Library used to export holders' information to a CSV file.
- **GitHub Desktop**: For version control.
- **Visual Studio Code**: Code editor used for development.
- **Vercel**: Platform used to deploy the dApp.

## Project Setup

### Prerequisites
- Node.js and npm installed.
- Infura account to get an RPC URL for interacting with the blockchain.

### Installation Steps
1. **Clone the Repository**:
   ```sh
   git clone https://github.com/YOUR_USERNAME/nft-wallet-list-dapp.git
   cd nft-wallet-list-dapp
   ```

2. **Install Dependencies**:
   ```sh
   npm install
   ```

3. **Set Up Environment Variables**:
   - Create a `.env` file in the root directory and add the following line:
     ```env
     REACT_APP_INFURA_RPC_URL=https://linea-sepolia.infura.io/v3/YOUR_INFURA_PROJECT_ID
     ```
   - Replace `YOUR_INFURA_PROJECT_ID` with your actual Infura Project ID.

4. **Run the Application**:
   ```sh
   npm start
   ```
   This will run the dApp in development mode. Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

## Deployment on Vercel
1. **Connect to GitHub**: Push your repository to GitHub and connect it to Vercel.
2. **Set Environment Variables**: In Vercel, go to **Settings > Environment Variables** and add `REACT_APP_INFURA_RPC_URL` with the correct Infura URL.
3. **Deploy**: Deploy the application through Vercel's automated deployment pipeline.

## File Structure
- **`public/`**: Contains the HTML file to render the app.
- **`src/`**
  - **`components/HolderTable.js`**: Displays the list of NFT holders in a table.
  - **`App.js`**: Main component handling logic for fetching holders and exporting CSV.
  - **`App.css`**: Styles for the application.
  - **`index.js`**: Entry point for the React app.
- **`.gitignore`**: Specifies which files to ignore when pushing to the repository.
- **`package.json`**: Contains project metadata and dependencies.

## Code Overview

### Main Component (`App.js`)
- Handles user input for the NFT contract address.
- Uses Ethers.js to connect to the blockchain and fetch the holders' information.
- Provides an option to export the holders' list to a CSV file.

### Holder Table Component (`HolderTable.js`)
- Renders the wallet addresses that hold the NFT in a simple table format.

### Key Dependencies
- **Ethers.js**: To connect to the Ethereum network and interact with smart contracts.
- **react-csv**: To export the fetched holders' data to a CSV file.

## Usage
1. **Enter Contract Address**: Enter the contract address of the NFT collection.
2. **Fetch Holders**: Click the "Fetch Holders" button to retrieve the wallet addresses holding the NFT.
3. **Export to CSV**: Once holders are displayed, click "Export to CSV" to download the list.

## Example Code
Here is a snippet from the `App.js` file to give you an idea of how the app works:
```javascript
import React, { useState } from 'react';
import { ethers } from 'ethers';
import HolderTable from './components/HolderTable';
import { CSVLink } from 'react-csv';

const lineaSepoliaRpc = process.env.REACT_APP_INFURA_RPC_URL;
const provider = new ethers.providers.JsonRpcProvider(lineaSepoliaRpc);

function App() {
  const [contractAddress, setContractAddress] = useState('');
  const [holders, setHolders] = useState([]);

  const fetchHolders = async () => {
    try {
      if (!ethers.utils.isAddress(contractAddress)) {
        alert('Invalid contract address');
        return;
      }

      const abi = [
        'function balanceOf(address owner) view returns (uint256)',
        'event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)'
      ];

      const contract = new ethers.Contract(contractAddress, abi, provider);
      const filter = contract.filters.Transfer(null, null);
      const events = await contract.queryFilter(filter, 0, 'latest');

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
```

## License
This project is open source and available under the [MIT License](LICENSE).

## Contributions
Contributions are welcome! Feel free to open an issue or submit a pull request.

## Contact
For any questions, please reach out to me via [GitHub](https://github.com/YOUR_USERNAME).

