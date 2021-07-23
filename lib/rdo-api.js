/**
 * Lightweight wrapper library on top of RDO API.
 *
 * @module lib/rdo-api
 */

'use strict';

const superagent = require('superagent');
const utils  = require('../api/utils');
const Rdo    = require('../api/rdo');

module.exports = RdoApi;

RdoApi.utils = utils;

/**
 * Initialize client with proper protocol and extract its request method.
 *
 * @param {String} [providerUrl=http://localhost] Rdo API url.
 * @class
 *
 * @example
 * const rdoApi = require('rdo-api')('https://mainnet.raido.network');
 */
function RdoApi(providerUrl = 'https://localhost') {
    if (!new.target) {
        return new RdoApi(providerUrl);
    }

    Object.defineProperties(this, {
        host: {value: providerUrl},
        api:     {value: api},
        utils:   {value: utils}
    });
    Object.defineProperty(this, 'rdo', {value: Rdo(this)});
}

/**
 * API request wrapper.
 *
 * @param  {String}   path   Path to call.
 * @param  {?Object}  params Object with data for called method.
 * @param  {?Object}  options Object with options for called method.
 * @return {Promise}         Response result.
 */
function api(method, path, params, options) {
    let url = this.host + path;
    return superagent[method.toLowerCase()](url)
        .send(params)
        .set({'Content-Type': 'application/json',})
        .query(options)
        .then(res=>{
            if(res.statusCode < 200 || res.statusCode >= 300) {
            //     return 'Error!'
            }
            return res.body;
        })
        .catch(err=>{
            if(err && err.response && err.response.text) {
                return Promise.reject(err.response.text)
            }
            // console.log(err)
        })
}
