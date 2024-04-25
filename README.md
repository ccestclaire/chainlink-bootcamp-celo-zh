# chainlink-bootcamp-celo-zh
Chainlink Developer Bootcamp - Special Guest Session with CELO
This repository is part of the presentation on Celo for the Chainlink Developer Bootcamp 2024.

Find the slides here:

Install Celo-Composer
The easiest way to start with Celo Composer is using @celo/celo-composer. This CLI tool lets you quickly start building dApps on Celo for multiple frameworks, including React (with either react-celo or rainbowkit-celo). To get started, just run the following command, and follow the steps:

npx @celo/celo-composer@latest create
Install all dependencies
run

npm i
or

yarn
Get token Balance
In the index.tsx file, you will find some template code. We will add our code in there.

First we want to read the balance of CELO tokens.

For that we will need to get the address of CELO on Alfajores. You can find the addresses in the Celo docs. Or when you check top ERC20 tokens in the celoscan.
    const CELOTokenAddress = "0xF194afDf50B03e69Bd7D057c1Aa9e10c9954E4C9"; // CELO Testnet
Import an ERC20 abi from viem
 //  Import an eRC20 abi from viem
    import { erc20Abi } from "viem";
we will use web3.js to read from the contracts. so, we need to create an instance, initialize it with the RPC for Celo Alfajores.
Install web.js

yarn add web3
Import Web3.js

 
Create the web3 instance. You will need an RPC. You can find the Celo RPCs in the Celo docs

    import Web3 from "web3";
Create a Contract instance of the celo contract to be able to interact with it
    const celoContract = new web3.eth.Contract(erc20Abi, CELOTokenAddress)
Call the contract function to read the users current CELO balance.
    // save the balance value in the state
    const [celoBalance, setCeloBalance] = useState("");

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

        return;
    };
Call the function in a react hook above. The hook already exists and we add out code
    useEffect(() => {
        if (isConnected && address) {
            setUserAddress(address);

            // add this code, as we only want to load the user balance, once we are connected and the component is mounted.
            if (isMounted) {
                getBalance();
            }
        }
        // isMounted needs to be added here as well
    }, [address, isConnected, isMounted]);
Add some code to the HTML to show the users current amount of CELO tokens
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
Your code should now look likes this:

// ERC20 abi 

export default function Home() {
    //  Import an eRC20 abi from viem
    import { erc20Abi } from "viem";

    // CELO token address on Alfajore Celo Testnet
    const CELOTokenAddress = "0xF194afDf50B03e69Bd7D057c1Aa9e10c9954E4C9"; 

    const web3 = new Web3("https://alfajores-forno.celo-testnet.org")
    const celoContract = new web3.eth.Contract(erc20Abi, CELOTokenAddress)

    const [userAddress, setUserAddress] = useState("");
    const [isMounted, setIsMounted] = useState(false);
    // create a state for the celoBalance
    const [celoBalance, setCeloBalance ]  = useState("");

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

        return;
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
Get USD value of CELO tokens
For this tutorial we will follow the guide from the Chainlink docs for reading data prcie feeds offchain

Find the address of the CELO/USD pricefeed in the Chainlink docs
    // pricefeed address for CELO/USD on Alfajores
    const celoToUsd = "0x022F9dCC73C5Fb43F2b4eF2EF9ad3eDD1D853946";
Add the aggregatorV3InterfaceABI from the tutorial
    // pricefeed address for CELO/USD on Alfajores
    const aggregatorV3InterfaceABI = [
    {
        inputs: [],
        name: "decimals",
        outputs: [{ internalType: "uint8", name: "", type: "uint8" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "description",
        outputs: [{ internalType: "string", name: "", type: "string" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [{ internalType: "uint80", name: "_roundId", type: "uint80" }],
        name: "getRoundData",
        outputs: [
        { internalType: "uint80", name: "roundId", type: "uint80" },
        { internalType: "int256", name: "answer", type: "int256" },
        { internalType: "uint256", name: "startedAt", type: "uint256" },
        { internalType: "uint256", name: "updatedAt", type: "uint256" },
        { internalType: "uint80", name: "answeredInRound", type: "uint80" },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "latestRoundData",
        outputs: [
        { internalType: "uint80", name: "roundId", type: "uint80" },
        { internalType: "int256", name: "answer", type: "int256" },
        { internalType: "uint256", name: "startedAt", type: "uint256" },
        { internalType: "uint256", name: "updatedAt", type: "uint256" },
        { internalType: "uint80", name: "answeredInRound", type: "uint80" },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "version",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
    },
    ]
Create the contract instance for the priceFeed contract
    // contract instance of the price feed contract
    const priceFeed = new web3.eth.Contract(aggregatorV3InterfaceABI, celoToUsd)
Call the latestRound data to get the latest price data. This is the response data that you will get, so you will want to read the second value
    0: roundID,
    1: answer, // this is the value we want
    3: timeStamp,
    2: startedAt,
    4: answeredInRound
First again let's add the state to store our celoValue

   // store the celoValue in the state
    const [celoValue, setCeloValue] = useState("");
Then the function to call the price feed data

    const getUSDValue = async () => {
    priceFeed.methods
        .latestRoundData()
        .call()
        .then((roundData: any) => {
            // get the value from position one of the response object. The value will come back as bigInt so we will have to format it. 
            const balance = (formatUnits(roundData[1], 8))
            setCeloValue(balance)
            // Do something with roundData
            console.log("Latest Round Data", roundData)
        })
    };
Call the function in our hook, when the dApp is connected with a wallet and the component is mounted

    useEffect(() => {
        if (isConnected && address) {
            setUserAddress(address);
            if (isMounted) {
                getBalance();
                getUSDValue()
            }
        }
    }, [address, isConnected, isMounted]);
Add some code to display the celoValue to the user

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
                    <p> USD value of CELO {(Number(celoBalance) * Number(celoValue)).toFixed(2)}</p>
                </div>
            ) : (
                <div>No Wallet Connected</div>
            )}
        </div>
    );
Now your code should look like this

export default function Home() {
    const celoToUsd = "0x022F9dCC73C5Fb43F2b4eF2EF9ad3eDD1D853946"; // Price Feed Contract Address. You can find it here: https://docs.chain.link/data-feeds/price-feeds/addresses?network=celo&page=1#overview

    const [celoValue, setCeloValue ]  = useState("");

   const getUSDValue = async () => {
        priceFeed.methods
            .latestRoundData()
            .call()
            .then((roundData: any) => {
                const balance = (formatUnits(roundData[1], 8))
                setCeloValue(balance)
                // Do something with roundData
                console.log("Latest Round Data", roundData)
            })
    };
}
Final code
Let's add some code to showcase the values to the user. Your whole code should look like this now. And we are done. Congratulations. You now know how to implement price feed data into your dApp.

import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
//  Import an eRC20 abi from viem
import { erc20Abi, formatUnits } from "viem";
import Web3 from "web3";

export default function Home() {
    const CELOTokenAddress = "0xF194afDf50B03e69Bd7D057c1Aa9e10c9954E4C9"; // CELO Testnet
    // pricefeed address for CELO/USD on Alfajores
    const celoToUsd = "0x022F9dCC73C5Fb43F2b4eF2EF9ad3eDD1D853946";
    // create a Web3 instance, initialize it with the RPC for Celo Alfajores
    // pricefeed address for CELO/USD on Alfajores
    const aggregatorV3InterfaceABI = [
        {
            inputs: [],
            name: "decimals",
            outputs: [{ internalType: "uint8", name: "", type: "uint8" }],
            stateMutability: "view",
            type: "function",
        },
        {
            inputs: [],
            name: "description",
            outputs: [{ internalType: "string", name: "", type: "string" }],
            stateMutability: "view",
            type: "function",
        },
        {
            inputs: [{ internalType: "uint80", name: "_roundId", type: "uint80" }],
            name: "getRoundData",
            outputs: [
                { internalType: "uint80", name: "roundId", type: "uint80" },
                { internalType: "int256", name: "answer", type: "int256" },
                { internalType: "uint256", name: "startedAt", type: "uint256" },
                { internalType: "uint256", name: "updatedAt", type: "uint256" },
                { internalType: "uint80", name: "answeredInRound", type: "uint80" },
            ],
            stateMutability: "view",
            type: "function",
        },
        {
            inputs: [],
            name: "latestRoundData",
            outputs: [
                { internalType: "uint80", name: "roundId", type: "uint80" },
                { internalType: "int256", name: "answer", type: "int256" },
                { internalType: "uint256", name: "startedAt", type: "uint256" },
                { internalType: "uint256", name: "updatedAt", type: "uint256" },
                { internalType: "uint80", name: "answeredInRound", type: "uint80" },
            ],
            stateMutability: "view",
            type: "function",
        },
        {
            inputs: [],
            name: "version",
            outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
            stateMutability: "view",
            type: "function",
        },
    ]
    const web3 = new Web3("https://alfajores-forno.celo-testnet.org")
    const celoContract = new web3.eth.Contract(erc20Abi, CELOTokenAddress)
    // contract instance of the price feed contract
    const priceFeed = new web3.eth.Contract(aggregatorV3InterfaceABI, celoToUsd)


    const [userAddress, setUserAddress] = useState("");
    const [isMounted, setIsMounted] = useState(false);
    // save the balance value in the state
    const [celoBalance, setCeloBalance] = useState("");
    // store the celoValue in the state
    const [celoValue, setCeloValue] = useState("");

    const { address, isConnected } = useAccount();

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        if (isConnected && address) {
            setUserAddress(address);
            if (isMounted) {
                getBalance();
                getUSDValue()
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

        return;
    };

    const getUSDValue = async () => {
        priceFeed.methods
            .latestRoundData()
            .call()
            .then((roundData: any) => {
                // get the value from position one of the response object. The value will come back as bigInt so we will have to format it. 
                const balance = (formatUnits(roundData[1], 8))
                setCeloValue(balance)
                // Do something with roundData
                console.log("Latest Round Data", roundData)
            })
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
                    <p> USD value of CELO {(Number(celoBalance) * Number(celoValue)).toFixed(2)}</p>
                </div>
            ) : (
                <div>No Wallet Connected</div>
            )}
        </div>
    );
}
About
No description, website, or topics provided.
Resources
 Readme
License
 MIT license
 Activity
Stars
 0 stars
Watchers
 1 watching
Forks
 0 forks
Report repository
Releases
No releases published
Packages
No packages published
Languages
TypeScript
63.1%
 
JavaScript
32.5%
 
Solidity
4.2%
 
CSS
0.2%
Footer
© 2024 GitHub, Inc.
Footer navigation
Terms
Privacy
Security
Status
Docs
