//const CONTRACT_ACCOUNT = "0xE9e3F9cfc1A64DFca53614a0182CFAD56c10624F";
const INFURA_KEY = "55397e793412497fb349e0ff77f154f2";
const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.HttpProvider('https://mainnet.infura.io/v3/' + INFURA_KEY));
const erc721 = require("@0xcert/ethereum-erc721/build/erc721.json").ERC721;
//const contract = new web3.eth.Contract(erc721.abi, CONTRACT_ACCOUNT);
const User = require('../models/user');
const connectDB = require('../models/connection');
connectDB();


async function fetchContract(){
    let result1 = await User.findOne({ contractAddress: "0x57f1887a8bf19b14fc0df6fd9b2acc9af147ea85" }).exec();
    console.log(result1);
    if (result1 == "null"){
        console.log('not a');
    }

}
fetchContract();