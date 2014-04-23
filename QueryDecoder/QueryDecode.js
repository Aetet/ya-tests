var QueryDecode;

/**
 * Декодирует url query строку в js-объект
 *
 * @param {String} queryString url query
 * @param {String} sep         разделитель параметров, по-умолчанию &
 * @param {String} eq          разделитель ключ-значение в параметре, по-умолчанию =
 *
 * @return {Object} объект query параметров
 *
 * @example
 *
 * var query = QueryDecode('search=test&dir=desc&unk=&arr[]=1&arr[]=test&encoded%26=z%5D');
 * console.log(query);
 * // {search: 'test', dir: 'desc', unk: '', 'arr[]': ['1', 'test'], 'encoded&': 'z]'}
 */
QueryDecode = function(queryString, sep, eq) {
  var result = {};

  sep         = sep || '&';
  eq          = eq  || '=';
  queryString = queryString || '';

  queryString.split(sep).forEach(function (partString) {
    var key,
        value,
        parts = partString.split(eq);

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
