import React from 'react';

function HolderTable({ holders }) {
  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>Wallet Address</th>
          </tr>
        </thead>
        <tbody>
          {holders.map((holder, index) => (
            <tr key={index}>
              <td>{holder}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default HolderTable;