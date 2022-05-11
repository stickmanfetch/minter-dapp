require('dotenv').config();
const basePath = process.cwd();
const fs = require("fs");
const { MODE } = require(`${basePath}/constants/blend_mode.js`);
const { NETWORK } = require(`${basePath}/constants/network.js`);

const network = NETWORK.eth;

// General metadata for Ethereum
const namePrefix = "The Stick Alliance";
const description = "The Stick Alliance is building a pfp & play-to-earn game in metaverse, where players need to earn currency known as GP or Gamepoints from completing dungeon quests to upgrade equipment and in-game items. In PVP they can earn Stick Points or SP where they can exchange it to other altcoin . They can freely switch among the characters they purchased before entering combat, each with their specific equipment, skills, and experience level.";
const baseUri = "ipfs://NewUriToReplace"; // This will be replaced automatically

// If you have selected Solana then the collection starts from 0 automatically
const layerConfigurations = [
  {
    growEditionSizeTo: 1,
    layersOrder: [
      { name: "Wizard Background" },
      { name: "Wizard Skin" },
      { name: "Wizard Base" },
      { name: "Wizard Clothes" },
      { name: "Wizard Eyes" },
      { name: "Wizard Mouth" },
      { name: "Wizard Head Accessory"},
      { name: "Wizard Weapon"},
    ],
  },
  {
    growEditionSizeTo: 2,
    layersOrder: [
      { name: "Boxer Background" },
      { name: "Boxer Skin" },
      { name: "Boxer Base" },
      { name: "Boxer Eyes" },
      { name: "Boxer Mouth" },
      { name: "Boxer Nose"},
      { name: "Boxer Weapon"},
    ],
  },
  {
    growEditionSizeTo: 3,
    layersOrder: [
      { name: "Archer Background" },
      { name: "Archer Skin" },
      { name: "Archer Base" },
      { name: "Archer Clothes" },
      { name: "Archer Eyes" },
      { name: "Archer Mouth" },
      { name: "Archer Mouth Accessory" },
      { name: "Archer Nose"},
      { name: "Archer Weapon"},
    ],
  },
  {
    growEditionSizeTo: 4,
    layersOrder: [
      { name: "Swordsman Background" },
      { name: "Swordsman Skin" },
      { name: "Swordsman Base" },
      { name: "Swordsman Clothes" },
      { name: "Swordsman Eyes" },
      { name: "Swordsman Mouth" },
      { name: "Swordsman Head Accessory" },
      { name: "Swordsman Weapon"},
    ],
  },
  {
    growEditionSizeTo: 5,
    layersOrder: [
      { name: "Warrior Background" },
      { name: "Warrior Skin" },
      { name: "Warrior Base" },
      { name: "Warrior Clothes" },
      { name: "Warrior Eyes" },
      { name: "Warrior Mouth" },
      { name: "Warrior Weapon"},
    ],
  },
  {
    growEditionSizeTo: 20,
    layersOrder: [
      { name: "Background" },
      { name: "Skin" },
      { name: "Base" },
      { name: "Clothes" },
      { name: "Eyes" },
      { name: "Mouth" },
      { name: "Head Accessory" },
      { name: "Banana"},
      { name: "Mouth Accessory"},
      { name: "Nose"},
      { name: "Weapon"},
    ],
  },
];

const shuffleLayerConfigurations = true;

const debugLogs = false;

const format = {
  width: 900,
  height: 900,
  smoothing: false,
};

const extraMetadata = {
  external_url: "https://twitter.com/stickalliance", // Replace with your website or remove this line if you do not have one.
};

// NFTPort Info

// ** REQUIRED **
const AUTH = process.env.NFTPORT_API_KEY; // Set this in the .env file to prevent exposing your API key when pushing to Github
const LIMIT = 2; // Your API key rate limit
const CHAIN = 'polygon'; // only rinkeby or polygon

// REQUIRED CONTRACT DETAILS THAT CANNOT BE UPDATED LATER!
const CONTRACT_NAME = 'The Stick Alliance';
const CONTRACT_SYMBOL = 'STICK';
const METADATA_UPDATABLE = true; // set to false if you don't want to allow metadata updates after minting
const OWNER_ADDRESS = '0x98aF8722404f27341f365c8118e83d08AD9F0186';
const TREASURY_ADDRESS = '0x378Ac8c1DFeb0e5D03027F7d1bb68C8640fB7bdD';
const MAX_SUPPLY = 5000; // The maximum number of NFTs that can be minted. CANNOT BE UPDATED!
const MINT_PRICE = 100; // Minting price per NFT. Rinkeby = ETH, Polygon = MATIC. CANNOT BE UPDATED!
const TOKENS_PER_MINT = 10; // maximum number of NFTs a user can mint in a single transaction. CANNOT BE UPDATED!

// REQUIRED CONTRACT DETAILS THAT CAN BE UPDATED LATER.
const PUBLIC_MINT_START_DATE = "2022-08-12T11:30:48+00:00"; // This is required. Eg: 2022-02-08T11:30:48+00:00

// OPTIONAL CONTRACT DETAILS THAT CAN BE UPDATED LATER.
const PRESALE_MINT_START_DATE = "2022-08-11T11:30:48+00:00"; // Optional. Eg: 2022-02-08T11:30:48+00:00
const ROYALTY_SHARE = 750; // Percentage of the token price that goes to the royalty address. 100 bps = 1%
const ROYALTY_ADDRESS = "0x6C4B387883ffE8fC0bD043585ad75ED856e459C7"; // Address that will receive the royalty
const BASE_URI = null; // only update if you want to manually set the base uri
const PREREVEAL_TOKEN_URI = null; // only update if you want to manually set the prereveal token uri
const PRESALE_WHITELISTED_ADDRESSES = []; // only update if you want to manually set the whitelisted addresses

// ** OPTIONAL **
let CONTRACT_ADDRESS = "0x472166853404eb47604d8bc03746b50005c44efa"; // If you want to manually include it

// Generic Metadata is optional if you want to reveal your NFTs
const GENERIC = true; // Set to true if you want to upload generic metas and reveal the real NFTs in the future
const GENERIC_TITLE = CONTRACT_NAME; // Replace with what you want the generic titles to say if you want it to be different from the contract name.
const GENERIC_DESCRIPTION = "Who will be your Comrade?"; // Replace with what you want the generic descriptions to say.
const GENERIC_IMAGE = "https://ipfs.io/ipfs/bafkreibykblhf3frnzmtfwi5twvxyfd3i32objyv7ikjhl7erdja4xiufe"; // Replace with your generic image that will display for all NFTs pre-reveal.

// Automatically set contract address if deployed using the deployContract.js script
try {
  const rawContractData = fs.readFileSync(
    `${basePath}/build/contract/_contract.json`
  );
  const contractData = JSON.parse(rawContractData);
  if (contractData.response === "OK" && contractData.error === null) {
    CONTRACT_ADDRESS = contractData.contract_address;
  }
} catch (error) {
  // Do nothing, falling back to manual contract address
}
// END NFTPort Info

const solanaMetadata = {
  symbol: "YC",
  seller_fee_basis_points: 1000, // Define how much % you want from secondary market sales 1000 = 10%
  external_url: "https://www.youtube.com/c/hashlipsnft",
  creators: [
    {
      address: "7fXNuer5sbZtaTEPhtJ5g5gNtuyRoKkvxdjEjEnPN4mC",
      share: 100,
    },
  ],
};

const gif = {
  export: false,
  repeat: 0,
  quality: 100,
  delay: 500,
};

const text = {
  only: false,
  color: "#ffffff",
  size: 20,
  xGap: 40,
  yGap: 40,
  align: "left",
  baseline: "top",
  weight: "regular",
  family: "Courier",
  spacer: " => ",
};

const pixelFormat = {
  ratio: 2 / 128,
};

const background = {
  generate: true,
  brightness: "80%",
  static: false,
  default: "#000000",
};

const rarityDelimiter = "#";

const uniqueDnaTorrance = 10000;

const preview = {
  thumbPerRow: 5,
  thumbWidth: 50,
  imageRatio: format.height / format.width,
  imageName: "preview.png",
};

const preview_gif = {
  numberOfImages: 5,
  order: "ASC", // ASC, DESC, MIXED
  repeat: 0,
  quality: 100,
  delay: 500,
  imageName: "preview.gif",
};

module.exports = {
  format,
  baseUri,
  description,
  background,
  uniqueDnaTorrance,
  layerConfigurations,
  rarityDelimiter,
  preview,
  shuffleLayerConfigurations,
  debugLogs,
  extraMetadata,
  pixelFormat,
  text,
  namePrefix,
  network,
  solanaMetadata,
  gif,
  preview_gif,
  AUTH,
  LIMIT,
  CONTRACT_ADDRESS,
  OWNER_ADDRESS,
  TREASURY_ADDRESS,
  CHAIN,
  GENERIC,
  GENERIC_TITLE,
  GENERIC_DESCRIPTION,
  GENERIC_IMAGE,
  CONTRACT_NAME,
  CONTRACT_SYMBOL,
  METADATA_UPDATABLE,
  ROYALTY_SHARE,
  ROYALTY_ADDRESS,
  MAX_SUPPLY,
  MINT_PRICE,
  TOKENS_PER_MINT,
  PRESALE_MINT_START_DATE,
  PUBLIC_MINT_START_DATE,
  BASE_URI,
  PREREVEAL_TOKEN_URI,
  PRESALE_WHITELISTED_ADDRESSES
};
