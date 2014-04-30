Декодирует и кодирует url строку и массив
=================

Запуск тестов
---------

`npm install && npm test`

Использование
---

```js
var qp = require('QueryParser');
var result = qp.encode({test: 123, param2: 'aa'});
//test=123&param2=aa

result = qp.decode('test=123&param2=aa');
// {test: 123, param2: 'aa'}

```
