const Block = require('./block');
const sha256 = require('sha256');


class Blockchain {

    constructor(difficulty) {
        this.difficulty = difficulty;
        this.chain = [];
    }

    mineGenesisBlock(newBlock) {
        newBlock.header.previousHash = '';
        newBlock.findBlockHashByNonce(this.difficulty, sha256(JSON.stringify(newBlock)));
        this.chain.push(newBlock);
    }

    mineBlock(newBlock) {
        let previousBlock = this.chain[this.chain.length - 1]; //Get the latest block
        newBlock.header.previousHash = sha256(JSON.stringify(previousBlock));
        newBlock.findBlockHashByNonce(this.difficulty, sha256(JSON.stringify(newBlock)));
        this.chain.push(newBlock);
    }

    printBlockchain() {
        for (let i = 0; i < this.chain.length; i++) {
            console.log(`BLOCK ${i}:`);
            console.log(this.chain[i]);
            console.log('\n');
        }
        console.log('\n');
    }

}

module.exports = Blockchain;