const sha256 = require('sha256');


class Block {

    constructor(data) {
        this.header = {
            previousHash: '',
            nonce: 0,
            accountStateHash:''
        };
        this.body = data;
    }

    findBlockHashByNonce(difficulty, hashNewBlock) {
        let zerosString = '';
        for(let i =0; i< difficulty; i++){
            zerosString = zerosString.concat('0');
        }
        while (hashNewBlock.substring(0, difficulty) !== zerosString) {
           // this.header.nonce ++; //
           // this.header.nonce = Math.random(); // Random Between 0 y 1
            this.header.nonce = Math.floor(Math.random() * (4294967295)); //Random Between integers 32 bits
            hashNewBlock = sha256(JSON.stringify({header: this.header, body: this.body}));
           //console.log(hashNewBlock);
        }

        console.log(`Block mined by nonce: ${this.header.nonce}, hash: ${hashNewBlock} \n`);
    }

}

module.exports = Block;