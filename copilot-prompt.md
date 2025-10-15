Necesito pedirte un ajuste en la logica del programa. Lo que sucede, es que el usuario tiene dos tipos de flujos de datos, de los cuales deriba uno que sería apk o epk, y el otro que siempre tiene por nombre gg. Lo que sucede, es que en nuestro programa asumimos que siempre es apk. Necesito que re-organices el codigo para que la manera de guardar y consultar la información tenga una estructura como la siguiente:

Estructura nueva
```json
{
  "data":[],
  "segments": [],
  "gg": [],
  "prorrateo": []
}
```

Ahora, en vez de guardar en localStorage el item "apkData" y "ggData", simplemente guardaría los items "apk" y "epk".

Practicamente, el como lucen los items es igual, se supone que su estructura sigue siendo la siguiente:

Ejemplo de objeto dentro del array de "data", así como de "gg" y del "prorrateo"
```json
{
  "id": 45,
  "fecha": "11/Sep/2025",
  "egresos": "Egresos",
  "folio": 341,
  "proveedor": "COMISION FEDERAL DE ELECTRICIDAD",
  "factura": "530-161-101-256",
  "importe": 16335.38,
  "concepto": "ENERGIA ELECTRICA",
  "vuelta": "APK3/4-15/6",
  "mes": "Sep",
  "año": 2025
}
```

Solamente en el caso de los segmentos ubicados del flujo principal de movimientos, tendran esta estructura (como ya se hace):

Ejemplo de segmentos, ya sea "apk" o "epk"
```json
[
  {
    "segment":"APK3/4-15/6",
    "count":11425
  }
]
```

El sentido de esto, es que apk sigue un proceso diferente al de epk, estos dos nombres son acronimos los procesos que hacen con los cerdos. Y el caso es que contablemente los maneja por separado, por ende, el proceso de prorrateo o distribución de gastos generales es diferente para ambos. Por ejemplo, en ambos se invierte dinero en gasolina, pero la suma de la gasolina se extrae de un excel desde el software contpaq, y el caso es que se hace la suma de todo el gasto de gasolina, pero solo de un proceso; apk tiene su propio gasto de gasolina total así como epk, por eso, apk sería un objeto que tiene su data con los movimientos bancarios principal y su data de gastos generales, el cual llamamos gg.

Concluyo con la petición que quiero que hagas:

Quiero que en el html, se modifique y en la sección cuyo id es `dataTypeSelector`, se agregue un nuevo input de tipo `<select>` con dos elementos `<option>`; el primer valor sería apk con un texto visible que diga "APK's" y el otro valor sería epk con un texto visible que diga "EPK's". Todo esto, posicionado antes del botón de confirmar prorrateo cuyo contenedor tiene la clase `data-type-actions`.

En el css, simplemente los estilos que veas necesarios para ver estetico dicho `<select>` y su `<label>` que indique al usuario en donde esta guardando la información.

En el JavaScript, basicamente, quiero que ese componente nuevo de HTML donde esta este input, tenga su respectivo id con el cual se va a obtener el valor actual del destino donde se guarde la información. A partir de ese dato, al momento de procesar los archivos de vuelta y gastos generales, cuando llegue el momento en el codigo donde se guarde los cambios a localStorage para sincronizar la inforamción y para almacenarla en su creación se divida la información con la estructura planteada al principio, es decir, dividir los tres flujos de datos en un mismo objeto con la clave "apk" o "epk" según sea el caso seleccionado en el elemento `<select>` del HTML. 