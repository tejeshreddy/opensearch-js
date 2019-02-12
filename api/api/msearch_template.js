'use strict'

/* eslint camelcase: 0 */
/* eslint no-unused-vars: 0 */

function buildMsearchTemplate (opts) {
  // eslint-disable-next-line no-unused-vars
  const { makeRequest, ConfigurationError, result } = opts
  /**
   * Perform a [msearch_template](http://www.elastic.co/guide/en/elasticsearch/reference/current/search-multi-search.html) request
   *
   * @param {list} index - A comma-separated list of index names to use as default
   * @param {list} type - A comma-separated list of document types to use as default
   * @param {enum} search_type - Search operation type
   * @param {boolean} typed_keys - Specify whether aggregation and suggester names should be prefixed by their respective types in the response
   * @param {number} max_concurrent_searches - Controls the maximum number of concurrent searches the multi search api will execute
   * @param {boolean} rest_total_hits_as_int - Indicates whether hits.total should be rendered as an integer or an object in the rest search response
   * @param {object} body - The request definitions (metadata-search request definition pairs), separated by newlines
   */

  const acceptedQuerystring = [
    'search_type',
    'typed_keys',
    'max_concurrent_searches',
    'rest_total_hits_as_int',
    'pretty',
    'human',
    'error_trace',
    'source',
    'filter_path'
  ]

  const snakeCase = {
    searchType: 'search_type',
    typedKeys: 'typed_keys',
    maxConcurrentSearches: 'max_concurrent_searches',
    restTotalHitsAsInt: 'rest_total_hits_as_int',
    errorTrace: 'error_trace',
    filterPath: 'filter_path'
  }

  return function msearchTemplate (params, options, callback) {
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
        msearchTemplate(params, options, (err, body) => {
          err ? reject(err) : resolve(body)
        })
      })
    }

    // check required parameters
    if (params['body'] == null) {
      return callback(
        new ConfigurationError('Missing required parameter: body'),
        result
      )
    }

    // check required url components
    if (params['type'] != null && (params['index'] == null)) {
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
    var { method, body, index, type } = params
    var querystring = semicopy(params, ['method', 'body', 'index', 'type'])

    if (method == null) {
      method = body == null ? 'GET' : 'POST'
    }

    var ignore = options.ignore || null
    if (typeof ignore === 'number') {
      ignore = [ignore]
    }

    var path = ''

    if ((index) != null && (type) != null) {
      path = '/' + encodeURIComponent(index) + '/' + encodeURIComponent(type) + '/' + '_msearch' + '/' + 'template'
    } else if ((index) != null) {
      path = '/' + encodeURIComponent(index) + '/' + '_msearch' + '/' + 'template'
    } else {
      path = '/' + '_msearch' + '/' + 'template'
    }

    // build request object
    const request = {
      method,
      path,
      bulkBody: body,
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

module.exports = buildMsearchTemplate
