"use client";

import { useState } from "react";

export default function Home() {
  const [userData, setUserData] = useState({});
  
  const connectWallet = () => {
    alert("connectWallet function called");
  };

  const disconnectWallet = () => {
    alert("disconnectWallet function called");
  };

  const reserveBitbadge = () => {
    alert("reserveBitbadge function called");
  };

  const mintBitbadge = () => {
    alert("mintBitbadge function called");
  };
  
  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-24">
      <h1 className="text-6xl font-bold text-center text-white">Bitbadges</h1>
      {!userData.profile ? (
        <button
          className="px-4 py-2 mt-4 text-lg font-bold text-white bg-indigo-600 rounded hover:bg-indigo-500"
          onClick={connectWallet}
        >
          Connect Your Wallet
        </button>
      ) : (
        <>
          <button
            className="px-4 py-2 mt-4 text-lg font-bold text-white bg-indigo-600 rounded hover:bg-indigo-500"
            onClick={reserveBitbadge}
          >
            Reserve Your Bitbadge
          </button>
          <button
            className="px-4 py-2 mt-4 text-lg font-bold text-indigo-600 bg-white rounded hover:bg-indigo-500"
            onClick={disconnectWallet}
          >
            Disconnect Wallet
          </button>
        </>
      )}
    </main>
  );
}