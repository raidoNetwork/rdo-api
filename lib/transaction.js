'use strict';

const CryptoUtil = require('../lib/cryptoUtil');

class Transaction {
    construct() {
        this.id = null;
        this.type = null;
        this.hash = null;
        this.data = {
            inputs: [],
            outputs: []
        };
    }

    toHash() {
        return CryptoUtil.hash(this.id + this.type + JSON.stringify(this.data));
    }

    static fromJson(data) {
        let transaction = new Transaction();
        for (const dataKey in data) {
            if( data.hasOwnProperty( dataKey ) ) {
                transaction[dataKey] = data[dataKey]
            }
        }
        transaction.hash = transaction.toHash();
        return transaction;
    }
}

module.exports = Transaction;