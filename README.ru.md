**Обратите внимание**. Документацию к старым версиям библиотеки вы можете найти здесь https://github.com/dfilatov/vow/blob/0.3.x/README.md.

<a href="http://promises-aplus.github.com/promises-spec"><img src="http://promises-aplus.github.com/promises-spec/assets/logo-small.png" align="right" /></a>
Vow 0.4.8 [![NPM version](https://badge.fury.io/js/vow.png)](http://badge.fury.io/js/vow) [![Build Status](https://secure.travis-ci.org/dfilatov/vow.png)](http://travis-ci.org/dfilatov/vow)
=========

Vow – библиотека для работы с промисами, реализующая стандарт [Promises/A+](http://promisesaplus.com/).
Также поддерживается спецификация [ES6 Promises](https://people.mozilla.org/~jorendorff/es6-draft.html#sec-promise-objects).

Начало работы
---------------
### В Node.js ###

Библиотеку можно подключить с помощью менеджера пакетов Node (npm):

    npm install vow

### В браузере ###

```html
<script type="text/javascript" src="vow.min.js"></script>
```

Также поддерживаются форматы модулей:

* RequireJS.
* [YM module](https://github.com/ymaps/modules).

Vow прошел тестирование в IE6+, Mozilla Firefox 3+, Chrome 5+, Safari 5+, Opera 10+.

Использование
-----
### Создание промиса ###
Есть два возможных пути создания промиса:

#### 1. С помощью deferred ####

```js
function doSomethingAsync() {
    var deferred = vow.defer();
    
    // теперь можно воспользоваться методами resolve, reject и notify 
    // для изменения состояний `deferred`. 
    // Например, `defered.resolve('ok');`
        
    return deferred.promise(); // затем возвращаем promise, чтобы предоставить возможность подписки
}

doSomethingAsync().then(
    function() {}, // реакция на успешное разрешение (resolve)
    function() {}, // реакция на разрешение отказом (reject)
    function() {}  // реакция на изменение состояния (notify)
    );
```

Разница между `deferred` и `promise` состоит в том, что, `deferred` имеет методы для изменения состояний промиса – разрешения, отмены и успеха, тогда как промис позволяет лишь подписаться на эти состояния.

#### 2. Совместимый с ES6 путь ####

```js
function doSomethingAsync() {
    return new vow.Promise(function(resolve, reject, notify) {
        // теперь можно устанавливать состояния resolve, reject, notify для промиса
    });
}

doSomethingAsync().then(
    function() {}, // реакция на успешное разрешение (resolve)
    function() {}, // реакция на разрешение отказом (reject)
    function() {}  // реакция на изменение состояния (notify)
    );
```


С полным API вы можете ознакомиться здесь http://dfilatov.github.io/vow/.

Расширения и связанные проекты
-------------------------------
  * [vow-fs](https://github.com/dfilatov/vow-fs) — основанная на vow файловая система ввода-вывода для Node.js
  * [vow-node](https://github.com/dfilatov/vow-node) — расширение для работы с колбеками в стиле nodejs
  * [vow-queue](https://github.com/dfilatov/vow-queue) — основанная на vow очередь задач с поддержкой весов и приоритетов
  * [vow-asker](https://github.com/nodules/vow-asker) — обертка из vow промисов над API [asker](https://github.com/nodules/asker)
