"use client";

import { useState, useEffect } from "react";
import { AppConfig, UserSession, showConnect } from "@stacks/connect";
import { StacksTestnet } from "@stacks/network";

export default function Home() {
  const [userData, setUserData] = useState({});
  const appConfig = new AppConfig();
  const userSession = new UserSession({ appConfig });

  useEffect(() => {
    const intervalId = setInterval(() => {
      const txid = JSON.parse(localStorage.getItem("txid"));
      if (txid) {
        fetch(`https://blockstream.info/testnet/api/tx/${txid}/status`)
          .then((response) => response.json())
          .then((status) => {
            if (status.confirmed) {
              localStorage.setItem("txStatus", "confirmed");
              clearInterval(intervalId);
            }
          })
          .catch((err) => console.error(err));
      }
    }, 10000);
    return () => clearInterval(intervalId); // Clean up on component unmount
  }, []);

  useEffect(() => {
    if (userSession.isSignInPending()) {
      userSession.handlePendingSignIn().then((userData) => {
        setUserData(userData);
      });
    } else if (userSession.isUserSignedIn()) {
      setUserData(userSession.loadUserData());
    }
  }, []);

  const connectWallet = () => {
    showConnect({
      userSession,
      network: StacksTestnet,
      appDetails: {
        name: "Bitbadges",
        icon: "https://freesvg.org/img/bitcoin.png",
      },
      onFinish: () => {
        window.location.reload();
      },
      onCancel: () => {
        // handle if user closed connection prompt
      },
    });
  };

  const disconnectWallet = () => {
    userSession.signUserOut(window.location.origin);
    setUserData({});
  };

  // This function sends a Bitcoin transaction and stores the txid in localStorage
  const reserveBitbadge = async () => {
    const resp = await window.btc?.request("sendTransfer", {
      address: "tb1qya9wtp4dyq67ldxz2pyuz40esvgd0cgx9s3pjl",
      amount: "100",
      network: "testnet"
    });
    // Storing txid in local storage
    if (typeof window !== "undefined") {
      localStorage.setItem("txid", JSON.stringify(resp.result.txid));
    }

    localStorage.setItem("txStatus", "pending");
  };

  const getButtonState = () => {
    if (localStorage.getItem("txid")) {
      if (localStorage.getItem("txStatus") == "pending") {
        return {
          text: "Transaction Pending",
          onClick: null,
          disabled: true,
          instructions: "Step 2: Wait for your transaction to confirm",
        };
      }
    }
    return {
      text: "Reserve Your Bitbadge",
      onClick: reserveBitbadge,
      disabled: false,
      instructions: "Step 1: Reserve your Bitbadge by sending 100 sats",
    };
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
          {(() => {
            const buttonState = getButtonState();
            return (
              <button
                className="px-4 py-2 mt-4 text-lg font-bold text-white bg-indigo-600 rounded hover:bg-indigo-500"
                onClick={buttonState.onClick}
                disabled={buttonState.disabled}
              >
                {buttonState.text}
              </button>
            );
          })()}
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