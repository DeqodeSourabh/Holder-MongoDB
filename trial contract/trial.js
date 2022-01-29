const CONTRACT_ACCOUNT = "0xE9e3F9cfc1A64DFca53614a0182CFAD56c10624F";
const INFURA_KEY = "55397e793412497fb349e0ff77f154f2";
const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.HttpProvider('https://mainnet.infura.io/v3/' + INFURA_KEY));
const erc721 = require("@0xcert/ethereum-erc721/build/erc721.json").ERC721;
const contract = new web3.eth.Contract(erc721.abi, CONTRACT_ACCOUNT);

const holderEvents = async() =>{
    // try{
    //     const AllPastEvents = await contract.getPastEvents('Transfer',{fromBlock: '0', toBlock: 'latest'});
    //     console.log(AllPastEvents);
    //     for (let i=0; i<AllPastEvents.length;i++){
    //         reciever.push(AllPastEvents[i].returnValues._to);
            
    //     }
    //     reciever = Array.from(new Set(reciever)); // remove the Duplicate address
    //     for (let i of reciever){
    //         reciever_sender.push(i);
    //     }

    //     totalHolders = Array.from(new Set(reciever_sender)); // remove the duplicates

    //     for (let i=0; i< totalHolders.length; i++){
    //         if(totalHolders[i] == '0x0000000000000000000000000000000000000000'){
                
    //         }
    //         else{    
    //             const tokenBalance = await contract.methods.balanceOf(totalHolders[i]).call(); // find the balance of the tokens of that contract.
    //             if (tokenBalance != 0){
    //                 console.log(totalholders[i]);
    //                 console.log(tokenBalance);
    //                 let userModel = new User({
    //                     HolderAddress: totalHolders[i],
    //                     Quantity: tokenBalance
    //                     });
    //                 try{
    //                     userModel.save()         
    //                      .then(() => {            
    //                     console.log('inserted');
    //                     })
    //                     .catch((err) => {        
    //                          //console.log(err);
    //                      });
    //                 }
    //                 catch(error){
    //                     //console.log(error);
    //                 }   
    //             }
    //         }                                      
    //     }   
    // }    
    // catch(error){
    //     //console.log(error);
    // } 
    let first =await web3.eth.getTransactionReceipt('0xbc872f672908d5c130cb6c0d0936acedb32a0a38a23293489dc44de0ad2c5ec6'); // here we find the first and last(latest) BlockNumber
    //const tokenBalance = await contract.methods.balanceOf('0x0000000000000000000000007b91c5453eabd33e69083b55ce0dd450d6e2c8f4').call();
    console.log(web3.utils.toDecimal(first.logs[1].topics[2]))
    console.log(web3.HextoAscii(first.logs[1].topics[2]))
    console.log(first.logs[1].topics[2]);
    console.log(first.logs[1]);
}
holderEvents();