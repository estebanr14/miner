

class AccountBalanceState {

    constructor() {
        this.data = [];
    }

    newAccount(address, balance){
        this.data.push({ address, balance});
      //  console.log(`Address: ${address} was create succesful with balance: ${balance}`);
    }

    processTransactions(transactions){
        transactions.forEach(tx => {
            let fromIndex = this.findAccount(tx.from);
            this.data[fromIndex].balance = this.data[fromIndex].balance - tx.value;
            let toIndex = this.findAccount(tx.to);
            this.data[toIndex].balance = parseInt(tx.value) + parseInt( this.data[toIndex].balance) ;
        });
    }

    findAccount(address){
        for (let i = 0; i < this.data.length ; i++){
            if (this.data[i].address === address) return i;
        }
    }

    worldStateToString(){
        let text = 'WorldState: ';
        for (let i = 0; i < this.data.length ; i++){
            text = text + JSON.stringify(this.data[i]);
        }
        return text;
    }

    printWorldState(){
        for (let i = 0; i < this.data.length ; i++){
            console.log(`Account ${i}: ${JSON.stringify(this.data[i])}`)
        }
        console.log('\n');
    }
}

module.exports = AccountBalanceState;