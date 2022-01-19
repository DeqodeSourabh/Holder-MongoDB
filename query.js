const addressNFT = require('./config/AddressOfContracts')
const User = require('./models/user')

const INFURA_KEY1 = "55397e793412497fb349e0ff77f154f2";
//const INFURA_KEY3 = ""
const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.HttpProvider('https://mainnet.infura.io/v3/' + INFURA_KEY1));
const erc721 = require("@0xcert/ethereum-erc721/build/erc721.json").ERC721;

const connectDB = require('./models/connection');
//connectDB();

function ContractDetails (){
for(let i=0; i<1; i++){
    
    const CONTRACT_ACCOUNT = addressNFT.NFTHolders[i].address;
    const Transection_Hash = addressNFT.NFTHolders[i].transectionHash;
    init(CONTRACT_ACCOUNT, Transection_Hash)
    //console.log(ACCOUNT);

}
}

const init= async (CONTRACT_ACCOUNT, Transection_Hash)=>{
    const contract = new web3.eth.Contract(erc721.abi, CONTRACT_ACCOUNT);

// here we find the first and last(latest) BlockNumber

    let first =await web3.eth.getTransactionReceipt(Transection_Hash);
    let firstBlock = first.blockNumber;
    let latestBlock = await web3.eth.getBlockNumber();

    totalResults = latestBlock-firstBlock;
    //console.log(totalResults);
    
    let start = firstBlock;
    let from ,to;
    if(totalResults >10000){
        while( totalResults>= 10000){
            from = start;
            to = start + 10000;
            holderEvents(from ,to, contract);
            totalResults =totalResults-10000;
            //console.log(totalResults);
            start = to;
        }
        if (totalResults!=0){
            from = start;
            to = start+ totalResults;
            //console.log('hello');
            holderEvents(from,to, contract);
        }
    }
    else{
        //console.log('hello');
        holderEvents(from,to, contract );
    }
 };
Holders=[]
const holderEvents = async(from ,to,contract ) =>{
    //console.log(from,to);
    try{
    const AllPastEvents = await contract.getPastEvents('Transfer',{fromBlock: from, toBlock: to});

    for (let i=0; i<AllPastEvents.length;i++){
        Holders.push(AllPastEvents[i].returnValues._to);
     }
     let uniqueHolders = Array.from(new Set(Holders));
     //console.log(uniqueHolders);

     for (let i=0; i< Holders.length; i++){
        
                let userModel = new User({
                    HolderAddress: uniqueHolders[i],
                });
                console.log(userModel);
                try{
                userModel.save()         
                 .then(() => {            
                console.log('inserted');
                })
                .catch((err) => {        
                     console.log(err);
                 });
            }
            catch(error){
                console.log(error);
            }
                             
                       
    }
}
    catch(error){
        console.log(error);
    } 
     //console.log(Holders);

}
ContractDetails();