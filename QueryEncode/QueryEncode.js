/**
 * Encode query object to string and add to optional url
 *
 *
 * @example
 *
 * var testQuery = {
 *   search: 'test',
 *   unk: '',
 *   arr: ['t1', 't2', 't3'],
 *   'encoded&': '[z]'
 * };
 *
 * var result = QueryEncode(testQuery, 'http://ya.ru?param1=test&param2=test');
 * // http://ya.ru?param1=test&param2=test&search=test&unk=&arr=t1&arr=t2&arr=t3&encoded%26=%5Bz%5D
 */
var QueryEncode;

/**
 * Is value string
 *
 * @param value
 * @return bool
 */
var isString = function (value) {
  return (typeof(value)==='string');
};

/**
 * Is value number
 *
 * @param value
 * @return bool
 */
var isNumber = function (value) {
  return (typeof(value)==='number');
};

/**
 * Is value object
 *
 * @param value
 * @return bool
 */
var isObject = function(obj) {
  return obj === Object(obj);
};

/**
 * Encode query object to string and add to optional url
 *
 * @param {Object} query
 * @param {String|undefined} url Optional url to which we add our query string
 *
 * @throws TypeError if input value is not an object or property is not string or number
 *
 * @return {String} url + query string
 *
 * @example
 *
 * var testQuery = {
 *   search: 'test',
 *   unk: '',
 *   arr: ['t1', 't2', 't3'],
 *   'encoded&': '[z]'
 * };
 *
 * var result = QueryEncode(testQuery, 'http://ya.ru?param1=test&param2=test');
 * // http://ya.ru?param1=test&param2=test&search=test&unk=&arr=t1&arr=t2&arr=t3&encoded%26=%5Bz%5D
 */
QueryEncode = function (query, url) {
  var value, queryKey, pushIfValid, key, queryString, result = [];
  query = query || {};

  if (!isObject(query)) {
    throw new TypeError('Query is not an object');
  }

  /**
   * Push to array if value is a valid type
   *
   * @param {Array}         result Array with query parts
   * @param {String|Number} value  Property value
   * @param {String}        key    Property name
   */
  pushIfValid = function (result, value, key) {
    if (!value || isString(value) || isNumber(value)) {
      result.push(queryKey + '=' + (value ? encodeURIComponent(value) : ''));
    } else {
      throw new TypeError('Property `' + key + '` is not a string or number');
    }
  };

  for (key in query) {
    if (query.hasOwnProperty(key)) {
      value    = query[key];
      queryKey = encodeURIComponent(key);
      if (Array.isArray(value)) {
        value.forEach(function(param) {
          pushIfValid(result, param, key);
        });
      } else  {
        pushIfValid(result, value, key);
      }
    }
  }

  queryString = result.join('&');
  if (url) {
    queryString = url + (url.indexOf('?') === -1 ? '?' : '&') + queryString;
  }

  return queryString;
};

module.exports = QueryEncode;
