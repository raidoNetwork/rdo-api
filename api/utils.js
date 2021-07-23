/**
 * utils api.
 *
 * @module api/utils
 */

'use strict';

const utils   = require('../lib/helpers');

/**
 * RDO decimal.
 *
 * @type {Number}
 */
const DECIMAL = 100000000;
const ADDRESS_LENGTH = 64;

exports.toRDO  = toRDO;
exports.toSatoshi = toSatoshi;
exports.isValidAddress = isValidAddress;

/**
 * Convert satoshi to RDO.
 *
 * @param  {Number}  amount Amount in satoshi.
 * @return {Number}         Amount in RDO.
 */
function toRDO(amount) {
    return amount / DECIMAL;
}

/**
 * Convert RDO to satoshi.
 *
 * @param  {Number}  amount Amount in RDO.
 * @return {Number}         Amount in satoshi.
 */
function toSatoshi(amount) {
    return amount * DECIMAL;
}

/**
 * Validate address.
 *
 * @param  {String}  address Ethereum address.
 * @return {Boolean}         Whether address is valid.
 */
function isValidAddress(address) {
    return address
        && address.length === ADDRESS_LENGTH
        && utils.isHex(address);
}