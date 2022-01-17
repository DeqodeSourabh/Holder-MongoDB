const express = require('express');
const app =express();
const mongoose = require('mongoose');
const User = require('./models/user')


const CONTRACT_ACCOUNT = "0xE9e3F9cfc1A64DFca53614a0182CFAD56c10624F";
const INFURA_KEY = "55397e793412497fb349e0ff77f154f2";
const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.HttpProvider('https://mainnet.infura.io/v3/' + INFURA_KEY));
const erc721 = require("@0xcert/ethereum-erc721/build/erc721.json").ERC721;
const contract = new web3.eth.Contract(erc721.abi, CONTRACT_ACCOUNT);





mongoose.connect('mongodb+srv://sourabh:sourabh@cluster0.il3sa.mongodb.net/HoldersData?retryWrites=true&w=majority',{
    useNewUrlParser: true,
    useUnifiedTopology: true
});
// const data = new User({
//     HolderAddress: 'fdfsd'
// });
// data.save().then((results)=>{
//     console.warn(results);
// })
// .catch(err =>console.log(err)
// )


Holders= []
const init = async () =>{
   const AllEvents = await contract.getPastEvents('Transfer',{fromBlock: '0', toBlock: 'latest'});
   for (let i=0; i<AllEvents.length;i++){
           Holders.push(AllEvents[i].returnValues._to);
         }
        
    let outputArray = Array.from(new Set(Holders))
    
    for (let i=0; i< Holders.length; i++){
        //const Balance = await web3.eth.getBalance(Holders[i].returnValues._to);
        let userModel = new User({
            HolderAddress: outputArray[i],
        });
         console.log(userModel);
        try {
            userModel.save()
            .then((data) => {
                console.log('inserted');
            })
            .catch((err) => {
                console.log(err);
            });
             
        } catch (error) {
            console.log(error);
        }
         
        
        
}
}
init();