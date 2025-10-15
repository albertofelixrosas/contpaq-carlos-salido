Quisiera que revisaras el uso de la variable `apkDataArray` y `ggDataArray`. Existe una función llamada `changeRecordConcept` que al parecer da un error debido al uso de esta variable. En la consola, me aprece este texto

```txt
script.js:1952 Uncaught TypeError: Cannot read properties of undefined (reading 'concepto')
    at changeRecordConcept (script.js:1952:59)
    at HTMLButtonElement.<anonymous> (script.js:251:3)
```

Quisiera que hicieras un chequeo y me digas antes de hacer lo que sea, que proposito cumplen esas variables para saber si las vamos a remover, o si vamos a cambiar las secciones donde se llaman.
