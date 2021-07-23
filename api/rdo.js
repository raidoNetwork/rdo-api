/**
 * rdo management api.
 *
 * @module api/rdo
 */

'use strict';

const CryptoEdDSAUtil = require('../lib/cryptoEdDSAUtil');
const CryptoUtil = require('../lib/cryptoUtil');
const TransactionBuilder = require('../lib/transactionBuilder');
const Transaction = require('../lib/transaction');
const utils      = {};// require('../lib/helpers');

module.exports = exports = Rdo;

/**
 * Master node.
 *
 * @type {String}
 */
const MASTER_NODE = exports.MASTER_NODE = 'f9ccec1891bedf54151b496b8be7dca8fe540b24699d41103ce1eef203a48003';
const DEFAULT_FEE = exports.DEFAULT_FEE = 10000000;

/**
 * Initiate Rdo object.
 *
 * @param {RdoApi} command Command object.
 * @class
 */
function Rdo(command) {
    if (!new.target) {
        return new Rdo(command);
    }

    Object.getOwnPropertyNames(command).forEach(key => Object.defineProperty(this, key, {value: command[key]}));
}

/**
 * Generate Key Pair.
 * @method password
 *
 * @param  {String}          password        Password to key pair.
 * @return {Promise<Object>}                 Key Pair object.
 *
 * @example
 * const transactionHash = await rdoApi.rdo.generateKeyPair(password);
 */
Rdo.prototype.generateKeyPair = async function generateKeyPair(password) {
    if (!password) {
        password = CryptoUtil.randomId(128);
    }

    let passwordHash = CryptoUtil.hash(password);

    let seed = CryptoEdDSAUtil.generateSecret(passwordHash);
    let keyPairRaw = CryptoEdDSAUtil.generateKeyPairFromSecret(seed);
    let newKeyPair = {
        secretKey: CryptoEdDSAUtil.toHex(keyPairRaw.getSecret()),
        publicKey: CryptoEdDSAUtil.toHex(keyPairRaw.getPublic())
    };
    return Promise.resolve(newKeyPair);

};

/**
 * Send transaction.
 * @method rdo_sendTransaction
 *
 * @param  {Object}          transaction    Transaction.
 * @return {Promise<String>}
 */
Rdo.prototype.sendTransaction = function sendTransaction(transaction) {
    return this.api('POST', `/blockchain/transactions`, transaction)
        .then(data=>{
            return data
        })
};

/**
 * Create transaction object, sign transaction, serialize transaction.
 * @method rdo_buildTransaction
 *
 * @param  {Object}          opts                   Options object.
 * @param  {String}          opts.to                Address of receiver of call.
 * @param  {String}          opts.privateKey        Private key to sign transaction.
 * @param  {Number}          opts.value             Value to send.
 * @param  {Object[]}        opts.utxo              Utxo.
 * @param  {String}          [opts.changeAddress]   Address for change to call.
 * @param  {String}          [opts.fromNode]        Arguments to send.
 * @param  {String}          [opts.toNode]          Sender nonce.
 *
 * @return {Promise<Object>}                        Transaction.
 *
 * @example
 * const transactionHash = await rdoApi.rdo.transaction({to, privateKey, value, utxo, changeAddress, fromNode, toNode});
 */
Rdo.prototype.buildTransaction = async function buildTransaction({to, privateKey, value, utxo, changeAddress, fromNode, toNode}) {
    if (!privateKey) {
        throw '"privateKey" is required';
    }

    if (!to) {
        throw '"to" is required';
    }

    if (!value) {
        throw '"value" is required';
    }


    let keyPairRaw = CryptoEdDSAUtil.generateKeyPairFromSecret(privateKey);

    let address = CryptoEdDSAUtil.toHex(keyPairRaw.getPublic());

    if (!changeAddress) {
        changeAddress = address;
    }
    console.log('address', address);

    let tx = new TransactionBuilder();
    tx.from(utxo);
    tx.to(to, toNode, value);
    tx.change(changeAddress, fromNode);
    tx.fee(DEFAULT_FEE);
    tx.sign(privateKey);

    return Transaction.fromJson(tx.build());
};

/**
 * Get transaction.
 * @method rdo_getTransaction
 *
 * @param  {String}          transactionHash Transaction id.
 * @return {Promise<String>}
 */
Rdo.prototype.getTransaction = function getTransaction(transactionId) {
    return this.api('GET', `/blockchain/blocks/transactions/${transactionId}/`, {})
        .then(data=>{
            return data && data.transactions && data.transactions.filter(t => t.id === transactionId)[0]
        })
};


/**
 * Get number of the latest block.
 * @method rdo_blockNumber
 *
 * @return {Promise<Number>} Current block number.
 */
Rdo.prototype.blockNumber = function blockNumber() {
    return this.api('GET', '/blockchain/blocks/latest', {}).then(data => { return data && data.index});
};

/**
 * Get block by number.
 * @method rdo_getBlockByNumber
 *
 * @param  {Number}          blockNumber Block number.
 * @return {Promise<Object>}             Block.
 */
Rdo.prototype.getBlockByNumber = function getBlockByNumber(blockNumber) {
    return this.api('GET', `/blockchain/blocks/${blockNumber}`, {});
};

/**
 * Get block by hash.
 * @method rdo_getBlockByHash
 *
 * @param  {String}          blockHash Block hash.
 * @return {Promise<Object>}             Block.
 */
Rdo.prototype.getBlockByHash = function getBlockByHash(blockHash) {
    return this.api('GET', `/blockchain/blocks/${blockHash}`, {});
};

/**
 * Get regular transactions by address.
 * @method rdo_getRegularTransactionsByAddress
 *
 * @param  {String}          address Address.
 * @param  {Object}          options Options.
 * @return {Promise<Object[]>}             Transactions.
 */
Rdo.prototype.getRegularTransactionsByAddress = function getRegularTransactionsByAddress(address, options) {
    return this.api('GET', `/blockchain/blocks/transactions/regular/${address}`, {}, options);
};

/**
 * Get reward transactions by address.
 * @method rdo_getRewardTransactionsByAddress
 *
 * @param  {String}          address Address.
 * @param  {Object}          options Options.
 * @return {Promise<Object[]>}             Transactions.
 */
Rdo.prototype.getRewardTransactionsByAddress = function getRewardTransactionsByAddress(address, options) {
    return this.api('GET', `/blockchain/blocks/transactions/reward/${address}`, {}, options);
};

/**
 * Get balance for address.
 * @method rdo_getBalanceForAddress
 *
 * @param  {String}          address Address.
 * @return {Promise<Number>}         Balance.
 */
Rdo.prototype.getBalanceForAddress = function getBalanceForAddress(address) {
    return this.api('GET', `/operator/${address}/balance`, {}) .then(data=>{ return data && data.balance || 0});
};


/**
 * Get stake balance for address.
 * @method rdo_getStakeBalanceForAddress
 *
 * @param  {String}          address Address.
 * @return {Promise<Number>}         Balance.
 */
Rdo.prototype.getStakeBalanceForAddress = function getStakeBalanceForAddress(address) {
    return this.api('GET', `/operator/${address}/stake/balance`, {}) .then(data=>{ return data && data.balance || 0});
};

/**
 * Get unspent transactions by address.
 * @method rdo_getUnspentTransactionsByAddress
 *
 * @param  {String}          address Address.
 * @param  {Object}          options Options.
 * @return {Promise<Object[]>}             Transactions.
 */
Rdo.prototype.getUnspentTransactionsByAddress = function getUnspentTransactionsByAddress(address) {
    return this.api('GET', `/blockchain/transactions/unspent`, {}, {address});
};

/**
 * Get blocks.
 * @method rdo_getBlocks
 *
 * @param  {Number}            limit Number of blocks.
 * @param  {Number}            offset   Number of blocks to offset.
 * @return {Promise<Object[]>}           Blocks.
 */
Rdo.prototype.getLogs = function getLogs(fromBlock, toBlock) {
    return this.api('GET', [formatLogOptions(fromBlock, toBlock)]);
};

/**
 * Parse hexaadecimal integer.
 *
 * @param  {Number} int
 * @return {Number}
 */
function parseInt16(int) {
    return parseInt(int, 16);
}
