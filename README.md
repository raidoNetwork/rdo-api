# RDO API

Lightweight wrapper library on top of [RDO](https://raido.network).

## Quick start

```js
const rdoApi = require('./raido-api/index')('https://rdo.raido.network');

(async () => {

    // Get the block number.
    const blockNumber = await rdoApi.rdo.blockNumber();

    console.log(blockNumber); // 5400

    // Get a balance for the address.
    const getBalanceForAddress = await rdoApi.rdo.getBalanceForAddress('66cfdbac44340f8b1c0c11c5ec99f1065854de6a84ab6518fd0c3b767ee13c20');
    
    console.log('getBalanceForAddress', getBalanceForAddress); // in satoshi
        
    // Get a stake balance for the address.
    const getStakeBalanceForAddress = await rdoApi.rdo.getBalanceForAddress('66cfdbac44340f8b1c0c11c5ec99f1065854de6a84ab6518fd0c3b767ee13c20');
    
    console.log('getStakeBalanceForAddress', getStakeBalanceForAddress); // in satoshi

})();
```

```js
const rdoApi = require('./raido-api/index')('https://rdo.raido.network');

(async () => {
        // Generate a random key pair.
        const keyPair1 = await rdoApi.rdo.generateKeyPair();
    
        console.log('keyPair', keyPair1); // { secretKey: 'f61994...', publicKey: '86097acd85f5f9afa8f125990ccce4f14a6c6acc8ef25a55f845ee6cb7f341d6' }

        // Generate a key pair from the passphrase.
        const keyPair = await rdoApi.rdo.generateKeyPair('SECRET_PHRASE');
    
        console.log('keyPair', keyPair); // { secretKey: '7c0d840240...', publicKey: '75ddcdb0bcd033d80f7598575a328a0fab2638b6664fd02c2713a64fae08b379' }

})();
```

```js
const rdoApi = require('./raido-api/index')('https://rdo.raido.network');

//Send rdo
(async ()=>{
    try {
        let keyPair = {
            publicKey: 'e5be48cc581a40139d2da7e3f00e1d6781d48342c37b45dc21c7bcbe870e02c2',
            secretKey: '7c0d84024079994ebb57dcc8382bc0ff12e9715f484a75b3504b061f7bc57fc7900d49cd4075e5d87b3b9cc6f27cd1ba53eda1c65bd69052610850c4811895b91f8415cfa992ad677bd6b7e8b70029e64677c178607449ded0dfd33b18c2f0c4c54019c029af5f956ec2..'
        }
        const unspentTransactions = await rdoApiGet.rdo.getUnspentTransactionsByAddress(keyPair.publicKey);

        const buildTransaction = await rdoApi.rdo.buildTransaction({
            to: '369db66682651d1b7909a21ae9abced20ecf734d85cca51648a407bdb4e8cb7c',
            privateKey: keyPair.secretKey,
            value: 10000000, //amount in satoshi
            utxo: unspentTransactions
        });
        const transaction = await rdoApi.rdo.sendTransaction(buildTransaction);

        console.log('buildTransaction', JSON.stringify(buildTransaction));

        console.log('sendTransaction', transaction);

    } catch (e) {
        console.log('e', e)
    }
})()

```


## Features

- lightweight
- support for basic RDO operations
- minimum levels of abstraction
- easy address handling

## API

### RDO

- `generateKeyPair` - Generate a Key Pair.  
- `sendTransaction` - Send a transaction.
- `buildTransaction` - Create transaction object, sign transaction, serialize transaction.
- `getTransaction` - Receive a transaction.
- `blockNumber` - Get the last block number.
- `getBlockByNumber` - Get the block by number.
- `getBlockByHash` - Get the block by hash.
- `getRegularTransactionsByAddress` - Get regular transactions at an address.
- `getRewardTransactionsByAddress` - Receive transactions of reward at an address.
- `getBalanceForAddress` - Get a balance for the address.
- `getStakeBalanceForAddress` - Get a stake balance for the address.
- `getUnspentTransactionsByAddress` - Get unspent transactions by address.

### utils

- `toRDO` - Convert satoshi to RDO.
- `toSatoshi` - Convert RDO to satoshi.
- `isValidAddress` - Validate address.

## License

The rdo-api library is licensed under the GNU GENERAL PUBLIC LICENSE, which can be found in this repository in the `LICENSE` file.

## Acknowledgments

- This library was written with support of [RDO](https://raido.network).

