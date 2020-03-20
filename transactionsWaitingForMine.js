require('./config');


class TransactionsWaitingForMine {

    constructor() {
        this.transactions = [];
    }

    newTransaction(transaction){
        this.transactions.push(transaction);
    }

    clear(){
        this.transactions = [];
    }

    getTransactions(){
        return this.transactions;
    }

    printTransactionsWaitingForMine(){
        for (let i = 0; i < this.transactions.length ; i++){
            console.log(`transaction ${i}: ${JSON.stringify(this.transactions[i])}`)
        }
        console.log('\n');

    }

}

module.exports = TransactionsWaitingForMine;
