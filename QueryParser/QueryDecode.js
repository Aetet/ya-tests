/**
 * Decode url query string to query object
 *
 * @example
 *
 * var query = QueryDecode('search=test&dir=desc&unk=&arr[]=1&arr[]=test&encoded%26=z%5D');
 * // {search: 'test', dir: 'desc', unk: '', 'arr[]': ['1', 'test'], 'encoded&': 'z]'}
 */
var QueryDecode;

/**
 * Decode url query string to query object
 *
 * @param {String} queryString url query
 *
 * @return {Object} query object
 *
 * @example
 *
 * var query = QueryDecode('search=test&dir=desc&unk=&arr[]=1&arr[]=test&encoded%26=z%5D');
 * // {search: 'test', dir: 'desc', unk: '', 'arr[]': ['1', 'test'], 'encoded&': 'z]'}
 */
QueryDecode = function(queryString) {
  var result = {};

  queryString = queryString || '';

  queryString.split('&').forEach(function (partString) {
    var key,
        value,
        parts = partString.split('=');

    if (parts.length > 1) {
      key   = decodeURIComponent(parts[0]);
      value = decodeURIComponent(parts[1]);

      if (result.hasOwnProperty(key)) {
        if (!Array.isArray(result[key])) {
          result[key] = [result[key]];
        }
        result[key].push(value);
      } else {
        result[key] = value;
      }
    }
  });

  return result;
};

module.exports = QueryDecode;
