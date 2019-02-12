'use strict'

/* eslint camelcase: 0 */
/* eslint no-unused-vars: 0 */

function buildIndicesShrink (opts) {
  // eslint-disable-next-line no-unused-vars
  const { makeRequest, ConfigurationError, result } = opts
  /**
   * Perform a [indices.shrink](http://www.elastic.co/guide/en/elasticsearch/reference/master/indices-shrink-index.html) request
   *
   * @param {string} index - The name of the source index to shrink
   * @param {string} target - The name of the target index to shrink into
   * @param {boolean} copy_settings - whether or not to copy settings from the source index (defaults to false)
   * @param {time} timeout - Explicit operation timeout
   * @param {time} master_timeout - Specify timeout for connection to master
   * @param {string} wait_for_active_shards - Set the number of active shards to wait for on the shrunken index before the operation returns.
   * @param {object} body - The configuration for the target index (`settings` and `aliases`)
   */

  const acceptedQuerystring = [
    'copy_settings',
    'timeout',
    'master_timeout',
    'wait_for_active_shards',
    'pretty',
    'human',
    'error_trace',
    'source',
    'filter_path'
  ]

  const snakeCase = {
    copySettings: 'copy_settings',
    masterTimeout: 'master_timeout',
    waitForActiveShards: 'wait_for_active_shards',
    errorTrace: 'error_trace',
    filterPath: 'filter_path'
  }

  return function indicesShrink (params, options, callback) {
    options = options || {}
    if (typeof options === 'function') {
      callback = options
      options = {}
    }
    if (typeof params === 'function' || params == null) {
      callback = params
      params = {}
      options = {}
    }
    // promises support
    if (callback == null) {
      return new Promise((resolve, reject) => {
        indicesShrink(params, options, (err, body) => {
          err ? reject(err) : resolve(body)
        })
      })
    }

    // check required parameters
    if (params['index'] == null) {
      return callback(
        new ConfigurationError('Missing required parameter: index'),
        result
      )
    }
    if (params['target'] == null) {
      return callback(
        new ConfigurationError('Missing required parameter: target'),
        result
      )
    }

    // check required url components
    if (params['target'] != null && (params['index'] == null)) {
      return callback(
        new ConfigurationError('Missing required parameter of the url: index'),
        result
      )
    }

    // validate headers object
    if (options.headers != null && typeof options.headers !== 'object') {
      return callback(
        new ConfigurationError(`Headers should be an object, instead got: ${typeof options.headers}`),
        result
      )
    }

    var warnings = null
    var { method, body, index, target } = params
    var querystring = semicopy(params, ['method', 'body', 'index', 'target'])

    if (method == null) {
      method = 'PUT'
    }

    var ignore = options.ignore || null
    if (typeof ignore === 'number') {
      ignore = [ignore]
    }

    var path = ''

    path = '/' + encodeURIComponent(index) + '/' + '_shrink' + '/' + encodeURIComponent(target)

    // build request object
    const request = {
      method,
      path,
      body: body || '',
      querystring
    }

    const requestOptions = {
      ignore,
      requestTimeout: options.requestTimeout || null,
      maxRetries: options.maxRetries || null,
      asStream: options.asStream || false,
      headers: options.headers || null,
      compression: options.compression || false,
      warnings
    }

    return makeRequest(request, requestOptions, callback)

    function semicopy (obj, exclude) {
      var target = {}
      var keys = Object.keys(obj)
      for (var i = 0, len = keys.length; i < len; i++) {
        var key = keys[i]
        if (exclude.indexOf(key) === -1) {
          target[snakeCase[key] || key] = obj[key]
          if (acceptedQuerystring.indexOf(snakeCase[key] || key) === -1) {
            warnings = warnings || []
            warnings.push('Client - Unknown parameter: "' + key + '", sending it as query parameter')
          }
        }
      }
      return target
    }
  }
}

module.exports = buildIndicesShrink
