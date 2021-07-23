'use strict';

const CryptoUtil = require('../lib/cryptoUtil');
const CryptoEdDSAUtil = require('../lib/cryptoEdDSAUtil');
const Transaction = require('../lib/transaction');

class TransactionBuilder {
    constructor() {
        this.UTXOS = null;
        this.addressTo = null;
        this.nodeTo = null;
        this.nodeFrom = null;
        this.totalAmount = null;
        this.changeAddressTo = null;
        this.feeAmount = 0;
        this.secretKey = null;
        this.type = 'regular';
    }

    from(listOfUTXO) {
        this.UTXOS = listOfUTXO;
        return this;
    }

    to(address, node, amount) {
        this.addressTo = address;
        this.totalAmount = amount;
        this.nodeTo = node;
        return this;
    }

    change(changeAddressTo, node) {
        this.changeAddressTo = changeAddressTo;
        this.nodeFrom = node;
        return this;
    }

    fee(amount) {
        this.feeAmount = amount;
        return this;
    }

    sign(secretKey) {
        this.secretKey = secretKey;
        return this;
    }

    type(type) {
        this.type = type;
    }

    build() {
        // Check required information
        if (this.UTXOS == null) throw new Error('LIST_UTXO_IS_EMPTY');
        if (this.totalAmount == null) throw new Error('TOTAL_AMOUNT_IS_NULL.');


        let totalAmount = 0;
        for (const element of this.UTXOS) {
            if(element && element.amount) {
                totalAmount += element.amount;
            }
        }
        let changeAmount = totalAmount - this.totalAmount - this.feeAmount;

        let self = this;
        let inputs = this.UTXOS.map((utxo) => {
            let txiHash;
            if(utxo.node) {
                txiHash = CryptoUtil.hash({
                    transaction: utxo.transaction,
                    index: utxo.index,
                    address: utxo.address,
                    node: utxo.node
                });
            } else {
                txiHash = CryptoUtil.hash({
                    transaction: utxo.transaction,
                    index: utxo.index,
                    address: utxo.address
                });
            }
            utxo.signature = CryptoEdDSAUtil.signHash(CryptoEdDSAUtil.generateKeyPairFromSecret(self.secretKey), txiHash);
            return utxo;
        });

        let outputs = [];

        let output = {
            amount: this.totalAmount,
            address: this.addressTo
        };
        if(this.nodeTo) {
            output.node = this.nodeTo
        }
        outputs.push(output);

        // Add change amount
        if (changeAmount > 0) {
            let output = {
                amount: changeAmount,
                address: this.changeAddressTo
            };
            if(this.nodeFrom) {
                output.node = this.nodeFrom
            }
            outputs.push(output);
        } else if(changeAmount == 0) {

        } else{
            throw new Error('The sender does not have enough to pay for the transaction.');
        }

        // The remaining value is the fee to be collected by the block's creator.        

        return Transaction.fromJson({
            id: CryptoUtil.randomId(64),
            hash: null,
            type: this.type,
            data: {
                inputs: inputs,
                outputs: outputs
            }
        });
    }
}

module.exports = TransactionBuilder;