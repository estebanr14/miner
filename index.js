require('./config');
const Block = require('./block');
const BlockChain = require('./blockchain');
const TransactionsWaitingForMine = require('./transactionsWaitingForMine');
const AccountBalanceState = require('./account-balance');
const bodyParser = require('body-parser');
const cors = require('cors');
const express = require('express');
const sha256  = require('sha256');


///////////////////////////////////////////////////////
let accountBalanceState = new AccountBalanceState();
let transactionsWaitingForMine = new TransactionsWaitingForMine();
let blockchain = new BlockChain(process.env.DIFFICULTY);
const app = express();


///////////////////////////////////////////////////////
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.listen('8085', () => {
    console.log(`****************** BLOCKCHAIN MINER STARTED ************************`);
});



///////////////////////////////////////////////////////
//END-POINTS
app.post('/config',(req,res)=>{

    //register mine and miner account
    accountBalanceState.newAccount(process.env.ADDRESS_MINER,0);
    accountBalanceState.newAccount(process.env.ADDRESS_MINE,21000000);
    //Fee transaction of Genesis block
    transactionsWaitingForMine.newTransaction({from : process.env.ADDRESS_MINE, to : process.env.ADDRESS_MINER, value: process.env.FEE});
    //proccess transaction in world state
    accountBalanceState.processTransactions(transactionsWaitingForMine.getTransactions());
    let genesisBlock = new Block(transactionsWaitingForMine.getTransactions());
    //Hash the world state data
    let hashWorldState = sha256(accountBalanceState.worldStateToString());
    genesisBlock.header.accountStateHash =hashWorldState;
    genesisBlock.header.mine = {
        address :  process.env.ADDRESS_MINE,
        balance: 21000000
    };
    blockchain.mineGenesisBlock(genesisBlock);
    transactionsWaitingForMine.clear();
    res.send('Genesis block mined');
});

app.post('/register-account',(req,res) =>{
    let privKey = req.body.privKey;
    accountBalanceState.newAccount(sha256(privKey), 0);
    res.send(`Address: ${sha256(privKey)} was create succesful with balance: 0`)
});
app.get('/print-worldstate',(req,res) =>{
    accountBalanceState.printWorldState();
    res.send('ok');
});
app.post('/transaction', (req,res) =>{
    transactionsWaitingForMine.newTransaction({from: req.body.from, to: req.body.to, value: req.body.value});
    if(transactionsWaitingForMine.getTransactions().length >= process.env.TX_PER_BLOCK){
        accountBalanceState.processTransactions(transactionsWaitingForMine.getTransactions());
        let block = new Block(transactionsWaitingForMine.getTransactions());
        block.header.accountStateHash =sha256(accountBalanceState.worldStateToString());
        blockchain.mineBlock(block);
        transactionsWaitingForMine.newTransaction({from : process.env.ADDRESS_MINE, to : process.env.ADDRESS_MINER, value: process.env.FEE});
        transactionsWaitingForMine.clear();
        return res.send('Block mined, this transaction is commited and will be mined in the next block');
    }
    res.send('Transaction commited');
});
app.get('/print-blockchain',(req,res)=>{
   blockchain.printBlockchain();
   res.send('ok');
});

