//const CONTRACT_ACCOUNT = "0xE9e3F9cfc1A64DFca53614a0182CFAD56c10624F";
const INFURA_KEY = "55397e793412497fb349e0ff77f154f2";
const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.HttpProvider('https://mainnet.infura.io/v3/' + INFURA_KEY));
const erc721 = require("@0xcert/ethereum-erc721/build/erc721.json").ERC721;
const connectDB = require('./models/connection');
const User = require('./models/user');
connectDB();
class HoldersOfNft{
    
//---------------------Get Past Events for the contracts-----------------------
    async  PastEvents(from, to,contract){
        const events =await contract.getPastEvents('Transfer', {fromBlock: from, toBlock: to})
        //console.log(web3.utils.hexToNumber(events[2].raw.topics[2]));

        for (let i=0; i<events.length;i++){
            if (events[i].raw.topics.length == 4){
                let toAddress = web3.utils.hexToNumberString(events[i].raw.topics[2]);
                if(web3.utils.hexToNumber(toAddress == "0x0000000000000000000000000000000000000000")){
                    continue;
                }
                else{
                   let quantity=BigInt(web3.utils.hexToNumber(events[i].raw.topics[3]))
                    let userModel = new User({
                        HolderAddress: toAddress,
                        Quantity: quantity
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

    //---------------------------******---------------------------------


    //--------------------------this solve the 10000 results error---------------------------------------

    async init (CONTRACT_ACCOUNT, Transection_Hash){
        const contract = new web3.eth.Contract(erc721.abi, CONTRACT_ACCOUNT);
        let first =await web3.eth.getTransactionReceipt(Transection_Hash); // here we find the first and last(latest) BlockNumber
        let firstBlock = first.blockNumber;
        let latestBlock = await web3.eth.getBlockNumber();

        let totalResults = latestBlock-firstBlock; // this is the total results obtained
        
        let start = firstBlock; //here we divided the totalResults into patches
        let from ,to;
        if(totalResults >10000){
            while( totalResults>= 10000){
                from = start;
                to = start + 10000;
                this.PastEvents(from ,to, contract);
                totalResults =totalResults-10000;
                start = to;
            }
            if (totalResults!=0){
                from = start;
                to = start+ totalResults;
                this.PastEvents(from,to, contract);
            }
        }
        else{
            this.PastEvents(from,to, contract );
        }
    }

    //--------------------------------*****----------------------------------

    // ----------------------Fetch the contracts Details---------------------
    async fetchContract(){
        const blockNumber = await web3.eth.getBlockNumber();
        let count = blockNumber+1;
        while( count>=0){
            count= count-1;
            const blockInfo =await web3.eth.getBlock(count);
            for (let txn_hash of blockInfo.transactions){
                //console.log(txn_hash);
                let result = await  web3.eth.getTransactionReceipt(txn_hash);
                let contractAddress = result.to;
                //if (contractAddress is in DB){
                //    query for checking in DB
                //}
                //else{ PastEvents(contractAddress)}
                this.init(contractAddress,txn_hash);
            }
        }
    } 
}
const holders = new HoldersOfNft();
holders.fetchContract();