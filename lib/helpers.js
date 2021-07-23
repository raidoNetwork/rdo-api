/**
 * Internal helpers.
 *
 * @module lib/helpers
 */

'use strict';

/**
 * Identify whether number format is hexadecimal.
 *
 * @param  {String}  value Value to check.
 * @return {Boolean}       Whether string is in hexadecimal format.
 */
exports.isHex = function isHex(value) {
    if ((typeof value !== 'string') && !(value instanceof String)) {
        return false;
    }

    const regexp = /^[0-9a-f]+$/;

    if (value.slice(0, 2) === '0x') {
        value = value.slice(2);
    }

    return regexp.test(value.toLowerCase());
};
