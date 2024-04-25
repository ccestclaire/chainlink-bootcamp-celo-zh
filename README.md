# Chainlink开发者训练营--CELO 特邀嘉宾专场

本资源库是[Chainlink Developer Bootcamp 2024](https://lu.ma/ChainlinkBootcamp2024?utm_source=0czoelvgwhbx) 中关于 Celo 演示的一部分。

点击此处查看幻灯片：

## 安装 Celo-Composer 

开始使用 Celo Composer 的最简单方法是使用 [`@celo/celo-composer`](https://github.com/celo-org/celo-composer)。这个 CLI 工具可让您快速开始在 Celo 上为多个框架构建 dApp，包括 React（使用 react-celo 或 rainbowkit-celo）。开始使用，只需运行以下命令并按步骤操作即可：

```bash
npx @celo/celo-composer@latest create
```

### 安装所有依赖程序

run

```bash
npm i
```

or 

```bash
yarn
```

## 获取令牌余额

在 `index.tsx` 文件中，你会发现一些模板代码。我们将在其中添加我们的代码。

首先，我们要读取 CELO 代币的余额。





1. 为此，我们需要获取 CELO 在 Alfajores 上的地址。您可以在 [Celo docs](https://docs.celo.org/token-addresses) 中找到地址。或者在[celoscan](https://celoscan.io/tokens)中查看顶级ERC20代币。

```typescript
    const CELOTokenAddress = "0xF194afDf50B03e69Bd7D057c1Aa9e10c9954E4C9"; // CELO 测试网

```

2. 从 viem 导入 ERC20 abi

```typescript
 //  从 viem 导入一个 eRC20 abi
    import { erc20Abi } from "viem";
```

3. 我们将使用 [web3.js](https://web3js.org/)读取合约。因此，我们需要创建一个实例，并使用 Celo Alfajores 的 RPC 对其进行初始化。

安装 web.js

```bash
yarn add web3
```

导入 Web3.js


```typescript
 
```

创建 web3 实例。您需要一个 RPC。您可以在 [Celo docs](https://docs.celo.org/network) 中找到 Celo RPC。

```typescript
    import Web3 from "web3";
```


4. 创建 celo 合约的合约实例，以便与之交互
```typescript
    const celoContract = new web3.eth.Contract(erc20Abi, CELOTokenAddress)
```

5. 调用合约功能，读取用户当前的 CELO 余额。

```typescript
    // 将余额值保存在状态中
    const [celoBalance, setCeloBalance] = useState("");

    const getBalance = async () => {
        celoContract.methods.balanceOf(userAddress as `0x${string}`).call()
            .then(balance => {
                // 余额以Wei返回，请将其转换为以太币（或等价代币）
                const tokenBalance = web3.utils.fromWei(balance, 'ether');
                setCeloBalance((tokenBalance))
                console.log(`The balance is: ${tokenBalance}`);
            })
            .catch(error => {
                console.error(error);
            });

        return;
    };
```

6. 调用上述 react 钩子中的函数。钩子已经存在，我们添加以下代码

```typescript
    useEffect(() => {
        if (isConnected && address) {
            setUserAddress(address);

            // 添加此代码，因为我们只想在连接组件后加载用户余额 
            if (isMounted) {
                getBalance();
            }
        }
        // 这里也需要添加上 isMounted 
    }, [address, isConnected, isMounted]);
```

7. 在 HTML 中添加一些代码，以显示用户当前的 CELO 代币数量

```typescript
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
```


现在您的代码应该是这样的 

```typescript
// ERC20 abi 

export default function Home() {
    //  从 viem 导入 eRC20 abi
    import { erc20Abi } from "viem";

    // Alfajore Celo Testnet 上的 CELO 令牌地址
    const CELOTokenAddress = "0xF194afDf50B03e69Bd7D057c1Aa9e10c9954E4C9"; 

    const web3 = new Web3("https://alfajores-forno.celo-testnet.org")
    const celoContract = new web3.eth.Contract(erc20Abi, CELOTokenAddress)

    const [userAddress, setUserAddress] = useState("");
    const [isMounted, setIsMounted] = useState(false);
    // 为 celoBalance 创建一个状态
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
                //余额以Wei返回，请将其转换为以太币（或等价代币）
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
```

## 获取 CELO 代币的美元价值

在本教程中，我们将按照 [Chainlink docs](https://docs.chain.link/data-feeds/using-data-feeds#reading-data-feeds-offchain) 中的指南来读取链外数据。


1. 在[Chainlink docs ](https://docs.chain.link/data-feeds/price-feeds/addresses?network=celo&page=1#overview) 中找到 CELO/USD pricefeed 的地址。

```typescript
    // Alfajores 上 CELO/USD 的 pricefeed 地址
    const celoToUsd = "0x022F9dCC73C5Fb43F2b4eF2EF9ad3eDD1D853946";
```

2. 添加教程中的聚合器 V3InterfaceABI 
```typescript
    // Alfajores 上 CELO/USD 的 pricefeed 地址
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
```


3. 为 priceFeed 合约创建合约实例

```typescript
    // priceFeed 合约的合约实例
    const priceFeed = new web3.eth.Contract(aggregatorV3InterfaceABI, celoToUsd)
```

4. 调用 latestRound 数据获取最新价格数据。这是您将获得的响应数据，因此您需要读取第二个值
```typescript
    0: roundID,
    1: answer, // this is the value we want
    3: timeStamp,
    2: startedAt,
    4: answeredInRound
```

首先，让我们再次添加状态来存储我们的 celoValue

```typescript
   // 将 celoValue 保存在状态中
    const [celoValue, setCeloValue] = useState("");
```

然后是调用 price feed 数据的函数


```typescript
    const getUSDValue = async () => {
    priceFeed.methods
        .latestRoundData()
        .call()
        .then((roundData: any) => {
            // 从响应对象的一号位置获取值。返回值为 bigInt，因此我们必须对其进行格式化。
            const balance = (formatUnits(roundData[1], 8))
            setCeloValue(balance)
            // 使用 roundData 做一些事情
            console.log("Latest Round Data", roundData)
        })
    };

```

当 dApp 与钱包连接并安装组件时，调用我们钩子中的函数

```typescript
    useEffect(() => {
        if (isConnected && address) {
            setUserAddress(address);
            if (isMounted) {
                getBalance();
                getUSDValue()
            }
        }
    }, [address, isConnected, isMounted]);
```

添加一些向用户显示 celoValue 的代码

```typescript
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
```

现在您的代码应该是这样的


```typescript
export default function Home() {
    const celoToUsd = "0x022F9dCC73C5Fb43F2b4eF2EF9ad3eDD1D853946"; // Price Feed 合约地址。您可以在这里找到： https://docs.chain.link/data-feeds/price-feeds/addresses?network=celo&page=1#overview

    const [celoValue, setCeloValue ]  = useState("");

   const getUSDValue = async () => {
        priceFeed.methods
            .latestRoundData()
            .call()
            .then((roundData: any) => {
                const balance = (formatUnits(roundData[1], 8))
                setCeloValue(balance)
                // 使用 roundData 做一些事情
                console.log("Latest Round Data", roundData)
            })
    };
}
```

## 最终代码

让我们添加一些代码，向用户展示这些值。整个代码现在应该是这样的。我们就大功告成了。恭喜您 您现在知道如何在您的 dApp 中实现 price feed 数据了。

```typescript
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
//  从 viem 导入 eRC20 abi
import { erc20Abi, formatUnits } from "viem";
import Web3 from "web3";

export default function Home() {
    const CELOTokenAddress = "0xF194afDf50B03e69Bd7D057c1Aa9e10c9954E4C9"; // CELO Testnet
    // Alfajores 上 CELO/USD 的 pricefeed 地址
    const celoToUsd = "0x022F9dCC73C5Fb43F2b4eF2EF9ad3eDD1D853946";
    // 创建 Web3 实例，使用 Celo Alfajores 的 RPC 对其进行初始化
    // Alfajores 上 CELO/USD 的 pricefeed 地址
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
    // priceFeed 合約的合約实例
    const priceFeed = new web3.eth.Contract(aggregatorV3InterfaceABI, celoToUsd)


    const [userAddress, setUserAddress] = useState("");
    const [isMounted, setIsMounted] = useState(false);
    //  在状态中保存余额值
    const [celoBalance, setCeloBalance] = useState("");
    // 将 celoValue 保存在状态中
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
                // 余额以Wei返回，请将其转换为以太币（或等价代币）
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
                // 从响应对象的一号位置获取值。返回值为 bigInt，因此我们必须对其进行格式化。
                const balance = (formatUnits(roundData[1], 8))
                setCeloValue(balance)
                // 使用 roundData 做一些事情
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
```
