var format;

/**
 * Форматирует строку подставляя значения из formatParameters вместо ключевых слов, начинающихся с :
 *
 * @param {String} text
 * @param {Object} formatParameters
 *
 * @return {String}
 *
 * @example
 *
 * format('user email is :email', {email: 'test@ya.ru'});
 * // user email is test.ya.ru
 */
format = function(text, formatParameters) {
  return text.replace(/:(\w+)/g, function(match, key) {
    return formatParameters.hasOwnProperty(key) ? formatParameters[key] : '';
  });
};

module.exports = format;
