var QueryEncoder;

var isString = function (value) {
  return (typeof(value)==='string');
};

var isNumber = function (value) {
  return (typeof(value)==='number');
};

QueryEncoder = function (query) {
  var value, queryKey, result = [];
  for (var key in query) {
    if (query.hasOwnProperty(key)) {
      value    = query[key];
      queryKey = encodeURIComponent(key);
      if (Array.isArray(value)) {
        value.forEach(function(param) {
          result.push(queryKey + '=' + encodeURIComponent(param));
        });
      } else if (!value || isString(value) || isNumber(value)) {
        result.push(queryKey + '=' + (value ? encodeURIComponent(value) : ''));
      } else {
        throw 'Property `' + key + '` is not a string or number';
      }
    }
  }

  return result.join('&');
};

module.exports = QueryEncoder;
