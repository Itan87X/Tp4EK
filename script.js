//import { ethers } from './node_modules/ethers/dist/ethers.esm.js';
const  { ethers } = window.ethers;

let provider, signer, contractDEX, tokenA, tokenB;


// Direcciones de los contratos desplegados
const contractAddressSimpleDEX = "0x1a978c082ae7d91a012e3d48aec6a5a9052f4781";
const contractAddressTokenA = "0xB987E3f09eb04c38b5AE9F73f9842Eedde158d39";
const contractAddressTokenB = "0xA2aeF71aa45828aA981bd4D2aB5860F0d689742d";

// ABI del contrato SimpleDEX
const abiSimpleDEX = [
    
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "_tokenA",
                    "type": "address"
                },
                {
                    "internalType": "address",
                    "name": "_tokenB",
                    "type": "address"
                }
            ],
            "stateMutability": "nonpayable",
            "type": "constructor"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "amountA",
                    "type": "uint256"
                },
                {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "amountB",
                    "type": "uint256"
                }
            ],
            "name": "LiquidityAdded",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "amountA",
                    "type": "uint256"
                },
                {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "amountB",
                    "type": "uint256"
                }
            ],
            "name": "LiquidityRemoved",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "trader",
                    "type": "address"
                },
                {
                    "indexed": false,
                    "internalType": "address",
                    "name": "tokenIn",
                    "type": "address"
                },
                {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "amountIn",
                    "type": "uint256"
                },
                {
                    "indexed": false,
                    "internalType": "address",
                    "name": "tokenOut",
                    "type": "address"
                },
                {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "amountOut",
                    "type": "uint256"
                }
            ],
            "name": "TokensSwapped",
            "type": "event"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "amountA",
                    "type": "uint256"
                },
                {
                    "internalType": "uint256",
                    "name": "amountB",
                    "type": "uint256"
                }
            ],
            "name": "addLiquidity",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "_token",
                    "type": "address"
                }
            ],
            "name": "getPrice",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "price",
                    "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "owner",
            "outputs": [
                {
                    "internalType": "address",
                    "name": "",
                    "type": "address"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "amountA",
                    "type": "uint256"
                },
                {
                    "internalType": "uint256",
                    "name": "amountB",
                    "type": "uint256"
                }
            ],
            "name": "removeLiquidity",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "reserveA",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "reserveB",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "amountAIn",
                    "type": "uint256"
                }
            ],
            "name": "swapAforB",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "amountBIn",
                    "type": "uint256"
                }
            ],
            "name": "swapBforA",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "tokenA",
            "outputs": [
                {
                    "internalType": "address",
                    "name": "",
                    "type": "address"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "tokenB",
            "outputs": [
                {
                    "internalType": "address",
                    "name": "",
                    "type": "address"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        }
    ];

// ABI de los contratos TokenA y TokenB (básicos ERC-20)
const abiToken = [
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "initialSupply",
				"type": "uint256"
			}
		],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "spender",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "allowance",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "needed",
				"type": "uint256"
			}
		],
		"name": "ERC20InsufficientAllowance",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "sender",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "balance",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "needed",
				"type": "uint256"
			}
		],
		"name": "ERC20InsufficientBalance",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "approver",
				"type": "address"
			}
		],
		"name": "ERC20InvalidApprover",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "receiver",
				"type": "address"
			}
		],
		"name": "ERC20InvalidReceiver",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "sender",
				"type": "address"
			}
		],
		"name": "ERC20InvalidSender",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "spender",
				"type": "address"
			}
		],
		"name": "ERC20InvalidSpender",
		"type": "error"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "spender",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "value",
				"type": "uint256"
			}
		],
		"name": "Approval",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "from",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "value",
				"type": "uint256"
			}
		],
		"name": "Transfer",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "spender",
				"type": "address"
			}
		],
		"name": "allowance",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "spender",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "value",
				"type": "uint256"
			}
		],
		"name": "approve",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "account",
				"type": "address"
			}
		],
		"name": "balanceOf",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "decimals",
		"outputs": [
			{
				"internalType": "uint8",
				"name": "",
				"type": "uint8"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "name",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "symbol",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "totalSupply",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "value",
				"type": "uint256"
			}
		],
		"name": "transfer",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "from",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "value",
				"type": "uint256"
			}
		],
		"name": "transferFrom",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	}
];



// Función para inicializar MetaMask y contratos
async function init() {
  if (typeof window.ethereum !== "undefined") {
    console.log("MetaMask detectado");
    await window.ethereum.request({ method: "eth_requestAccounts" });
    provider = new ethers.providers.Web3Provider(window.ethereum);
    signer = provider.getSigner();

    // Inicializa los contratos
    contractDEX = new ethers.Contract(contractAddressSimpleDEX, abiSimpleDEX, signer);
    tokenA = new ethers.Contract(contractAddressTokenA, abiToken, signer);
    tokenB = new ethers.Contract(contractAddressTokenB, abiToken, signer);
  } else {
    alert("Por favor, instala MetaMask para continuar.");
  }
}

// Función para añadir liquidez
async function addLiquidity() {
  const amountA = ethers.utils.parseUnits(document.getElementById("amountA").value, 18);
  const amountB = ethers.utils.parseUnits(document.getElementById("amountB").value, 18);

  try {
    // Aprobaciones
    await tokenA.approve(contractAddressSimpleDEX, amountA);
    await tokenB.approve(contractAddressSimpleDEX, amountB);

    // Llamada a addLiquidity en el contrato SimpleDEX
    const tx = await contractDEX.addLiquidity(amountA, amountB);
    await tx.wait();
    alert("Liquidez añadida correctamente.");
  } catch (err) {
    console.error("Error al añadir liquidez:", err);
    alert("Error al añadir liquidez.");
  }
}

// Función para intercambiar TokenA por TokenB
async function swapAforB() {
  const amount = ethers.utils.parseUnits(document.getElementById("swapAmount").value, 18);

  try {
    // Aprobación
    await tokenA.approve(contractAddressSimpleDEX, amount);

    // Llamada a swapAforB en el contrato SimpleDEX
    const tx = await contractDEX.swapAforB(amount);
    await tx.wait();
    alert("Intercambio completado.");
  } catch (err) {
    console.error("Error en el intercambio:", err);
    alert("Error al intercambiar TokenA por TokenB.");
  }
}

// Función para intercambiar TokenB por TokenA
async function swapBforA() {
  const amount = ethers.utils.parseUnits(document.getElementById("swapAmount").value, 18);

  try {
    // Aprobación
    await tokenB.approve(contractAddressSimpleDEX, amount);

    // Llamada a swapBforA en el contrato SimpleDEX
    const tx = await contractDEX.swapBforA(amount);
    await tx.wait();
    alert("Intercambio completado.");
  } catch (err) {
    console.error("Error en el intercambio:", err);
    alert("Error al intercambiar TokenB por TokenA.");
  }
}

// Función para obtener el precio de un token
async function getPrice(token) {
  try {
    const price = await contractDEX.getPrice(token);
    const formattedPrice = ethers.utils.formatUnits(price, 18);
    document.getElementById("priceResult").innerText = `Precio: ${formattedPrice}`;
  } catch (err) {
    console.error("Error al obtener precio:", err);
    alert("Error al obtener precio.");
  }
}

// Agregar event listeners a los botones
document.getElementById("addLiquidity").onclick = addLiquidity;
document.getElementById("swapAforB").onclick = swapAforB;
document.getElementById("swapBforA").onclick = swapBforA;
document.getElementById("getPriceA").onclick = () => getPrice(contractAddressTokenA);
document.getElementById("getPriceB").onclick = () => getPrice(contractAddressTokenB);

// Llamada inicial
init();
