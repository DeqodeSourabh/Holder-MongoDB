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
    async  PastEvents(from, to,contract, CONTRACT_ACCOUNT , Transection_Hash){
        
        var reciever =[]
        var reciever_sender =[]
        var totalHolders =[]
        const AllPastEvents =await contract.getPastEvents('Transfer', {fromBlock: from, toBlock: to})
        //console.log(web3.utils.hexToNumber(events[2].raw.topics[2]));
        try{
            for (let i=0; i<AllPastEvents.length;i++){
                reciever.push(AllPastEvents[i].returnValues._to);  
            }
            reciever = Array.from(new Set(reciever)); // remove the Duplicate address
            for (let i of reciever){
                reciever_sender.push(i);
            }

            totalHolders = Array.from(new Set(reciever_sender)); // remove the duplicates

            for (let i=0; i< totalHolders.length; i++){
                if(totalHolders[i] == '0x0000000000000000000000000000000000000000'){
                    continue;
                }
                else{    
                    const tokenBalance = await contract.methods.balanceOf(totalHolders[i]).call(); // find the balance of the tokens of that contract.
                    if (tokenBalance != 0){

                        let userModel = new User({
                            HolderAddress: totalHolders[i],
                            tokenID: AllPastEvents[i].returnValues._tokenId,
                            contractAddress: CONTRACT_ACCOUNT,
                            Transection_Hash: Transection_Hash

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
                this.PastEvents(from ,to, contract, CONTRACT_ACCOUNT , Transection_Hash);
                totalResults =totalResults-10000;
                start = to;
            }
            if (totalResults!=0){
                from = start;
                to = start+ totalResults;
                this.PastEvents(from,to, contract, CONTRACT_ACCOUNT , Transection_Hash);
            }
        }
        else{
            this.PastEvents(from,to, contract, CONTRACT_ACCOUNT, Transection_Hash);
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
                let getContract = await User.findOne({ contractAddress: contractAddress }).exec(); //check if contractAddress is already present in Db or not
                if (getContract == null){
                    if (contractAddress!= "null"){
                    this.init(contractAddress,txn_hash);
                    }

                }
            }
        }
    } 
}
const holders = new HoldersOfNft();
holders.fetchContract();