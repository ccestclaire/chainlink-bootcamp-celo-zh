import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { createPublicClient, custom, erc20Abi, formatEther, formatUnits } from "viem";
import { celoAlfajores } from "viem/chains";
import Web3 from "web3";



export default function Home() {
    const CELOTokenAddress = "0xF194afDf50B03e69Bd7D057c1Aa9e10c9954E4C9"; // CELO Testnet
 
    const web3 = new Web3("https://alfajores-forno.celo-testnet.org")
    const celoContract = new web3.eth.Contract(erc20Abi, CELOTokenAddress)

    const [userAddress, setUserAddress] = useState("");
    const [isMounted, setIsMounted] = useState(false);
    const [celoBalance, setCeloBalance] = useState("");
  

    const { address, isConnected } = useAccount();

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        if (isConnected && address) {
            setUserAddress(address);

            if (isMounted) {
                getBalance();
            }
        }
    }, [address, isConnected, isMounted]);

    if (!isMounted) {
        return null;
    }

    const getBalance = async () => {
        celoContract.methods.balanceOf(userAddress as `0x${string}`).call()
            .then(balance => {
                // Balance is returned in Wei, convert it to Ether (or token's equivalent)
                const tokenBalance = web3.utils.fromWei(balance, 'ether');
                setCeloBalance((tokenBalance))
                console.log(`The balance is: ${tokenBalance}`);
            })
            .catch(error => {
                console.error(error);
            });
    };

 


    return (
        <div className="flex flex-col justify-center items-center">
            <div className="h1">
                There you go... a canvas for your next Celo project!
            </div>
            {isConnected ? (
                <div className="h2 text-center">
                    Your address: {userAddress}
                      {/* add your values here, we will shorten it to two decimal values */}
                    <p> CELO Balance {Number(celoBalance).toFixed(2)}</p>
                </div>

            ) : (
                <div>No Wallet Connected</div>
            )}
        </div>
    );
}
