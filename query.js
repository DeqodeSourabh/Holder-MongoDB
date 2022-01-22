const addressNFT = require('./config/AddressOfContracts')
const User = require('./models/user')

const INFURA_KEY1 = "55397e793412497fb349e0ff77f154f2";
const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.HttpProvider('https://mainnet.infura.io/v3/' + INFURA_KEY1));
const erc721 = require("@0xcert/ethereum-erc721/build/erc721.json").ERC721;

const connectDB = require('./models/connection');
const { set } = require('mongoose');

connectDB();

function ContractDetails (){
    for(let i=0; i<6; i++){
        const CONTRACT_ACCOUNT = addressNFT.NFTHolders[i].address;
        const Transection_Hash = addressNFT.NFTHolders[i].transectionHash;
        init(CONTRACT_ACCOUNT, Transection_Hash)
        //console.log(ACCOUNT);
    }
}

const init= async (CONTRACT_ACCOUNT, Transection_Hash)=>{
    const contract = new web3.eth.Contract(erc721.abi, CONTRACT_ACCOUNT);
    let first =await web3.eth.getTransactionReceipt(Transection_Hash); // here we find the first and last(latest) BlockNumber
    let firstBlock = first.blockNumber;
    let latestBlock = await web3.eth.getBlockNumber();

    totalResults = latestBlock-firstBlock; // this is the total results obtained
    
    let start = firstBlock; //here we divided the totalResults into patches
    let from ,to;
    if(totalResults >10000){
        while( totalResults>= 10000){
            from = start;
            to = start + 10000;
            holderEvents(from ,to, contract);
            totalResults =totalResults-10000;
            start = to;
        }
        if (totalResults!=0){
            from = start;
            to = start+ totalResults;
            holderEvents(from,to, contract);
        }
    }
    else{
        holderEvents(from,to, contract );
    }
};

reciever=[]
sender= [];
reciever_sender = [];
totalHolders = []
const holderEvents = async(from ,to,contract ) =>{
    try{
        const AllPastEvents = await contract.getPastEvents('Transfer',{fromBlock: from, toBlock: to});
        for (let i=0; i<AllPastEvents.length;i++){
            reciever.push(AllPastEvents[i].returnValues._to);
            sender.push(AllPastEvents[i].returnValues._from);
        }
        
        reciever = Array.from(new Set(reciever)); // remove the Duplicate address
        sender = Array.from(new Set(sender));
         
        for (let i of reciever){
            reciever_sender.push(i);
        }
        for (let i of sender){
            reciever_sender.push(i);
        }

        totalHolders = Array.from(new Set(reciever_sender)); // merge the two array and remove the duplicates

        for (let i=0; i< totalHolders.length; i++){
            if(totalHolders[i] == '0x0000000000000000000000000000000000000000'){
                continue;
            }
            else{    
                const tokenBalance = await contract.methods.balanceOf(totalHolders[i]).call(); // find the balance of the tokens of that contract.
                if (tokenBalance != 0){

                    let userModel = new User({
                        HolderAddress: totalHolders[i],
                        Quantity: tokenBalance
                        });
                    try{
                        userModel.save()         
                         .then(() => {            
                        console.log('inserted');
                        })
                        .catch((err) => {        
                             //console.log(err);
                         });
                    }
                    catch(error){
                        //console.log(error);
                    }   
            
                }
            }                                      
        }   
    }
    catch(error){
        //console.log(error);
    } 
}
ContractDetails();