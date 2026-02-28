export interface Network {
  id: string;
  name: string;
  symbol: string;
  type: "evm" | "utxo" | "solana" | "cardano";
  path: string;
  chainId?: number;
  color: string;
}

export interface AddressInfo {
  index: number;
  address: string;
  path: string;
}

export interface SeedData {
  encrypted: string;
  iv: string;
  salt: string;
}

export interface WalletState {
  isUnlocked: boolean;
  hasSeed: boolean;
  currentNetwork: Network | null;
  addresses: AddressInfo[];
}

export const SUPPORTED_NETWORKS: Network[] = [
  {
    id: "eth",
    name: "Ethereum",
    symbol: "ETH",
    type: "evm",
    path: "m/44'/60'/0'/0/0",
    chainId: 1,
    color: "#627eea",
  },
  {
    id: "bsc",
    name: "Binance Smart Chain",
    symbol: "BNB",
    type: "evm",
    path: "m/44'/60'/0'/0/0",
    chainId: 56,
    color: "#f3ba2f",
  },
  {
    id: "polygon",
    name: "Polygon",
    symbol: "MATIC",
    type: "evm",
    path: "m/44'/60'/0'/0/0",
    chainId: 137,
    color: "#8247e5",
  },
  {
    id: "avax",
    name: "Avalanche",
    symbol: "AVAX",
    type: "evm",
    path: "m/44'/60'/0'/0/0",
    chainId: 43114,
    color: "#e84142",
  },
  {
    id: "btc-legacy",
    name: "Bitcoin Legacy",
    symbol: "BTC",
    type: "utxo",
    path: "m/44'/0'/0'/0/0",
    color: "#f7931a",
  },
  {
    id: "btc-segwit",
    name: "Bitcoin SegWit",
    symbol: "BTC",
    type: "utxo",
    path: "m/49'/0'/0'/0/0",
    color: "#f7931a",
  },
  {
    id: "btc-native",
    name: "Bitcoin Native SegWit",
    symbol: "BTC",
    type: "utxo",
    path: "m/84'/0'/0'/0/0",
    color: "#f7931a",
  },
  {
    id: "sol",
    name: "Solana",
    symbol: "SOL",
    type: "solana",
    path: "m/44'/501'/0'/0'",
    color: "#14f195",
  },
  {
    id: "ada",
    name: "Cardano",
    symbol: "ADA",
    type: "cardano",
    path: "m/1852'/1815'/0'/0/0",
    color: "#0033ad",
  },
];
