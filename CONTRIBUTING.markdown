º# Contribuyendo a Thymeleaf

Thymeleaf se publica bajo la licencia Apache 2.0. Si desea contribuir o 
modificar el código, este documento le ayudará a empezar.

## Código de Conducta

Este proyecto se adhiere al [código de conducta][code-of-conduct] del Pacto del 
Colaborador.
Al participar, se espera que respete este código. Por favor, informe de 
cualquier comportamiento inaceptable a 
[los líderes del proyecto][thymeleaf-team].

## Uso de GitHub Issues

Usamos GitHub Issues para rastrear errores y mejoras.
Si tiene alguna pregunta sobre el uso general, pregunte en
[Stack Overflow][stackoverflow].
El equipo de Thymeleaf y la comunidad en general monitorean la etiqueta
[`thymeleaf`][stackoverflow-thymeleaf].

Si informa un error, por favor, ayude a acelerar el diagnóstico del problema 
proporcionando la mayor cantidad de información posible. Idealmente, esto 
incluiría un pequeño proyecto de muestra que reproduzca el problema.

## Antes de enviar una contribución

Antes de enviar una contribución que no sea una solución obvia o trivial, 
contacta con [los líderes del proyecto][thymeleaf-team] y comparte tus ideas (un 
correo electrónico bastará). Permítenos analizar las posibilidades contigo para 
asegurarnos de que tu contribución vaya en la dirección correcta y se ajuste a 
los estándares, las intenciones y la hoja de ruta del proyecto.

Ten en cuenta que *no todas las contribuciones serán aceptadas ni se integrarán 
en los repositorios del proyecto*. Hablar sobre tus contribuciones previstas con 
los mantenedores del proyecto antes de crear solicitudes de incorporación de 
cambios puede maximizar las posibilidades de que sean aceptadas.

## Firma del Acuerdo de Licencia de Colaborador

Antes de aceptar un parche o una solicitud de incorporación de cambios 
significativos, necesitarás firmar un **Acuerdo de Licencia de Colaborador**.

Existen dos versiones del CLA:

* **CLA Individual**: Para personas que actúan en nombre propio, es decir, que 
  no cuentan con el respaldo de ninguna empresa ni gobierno, y que no realizan 
  sus contribuciones bajo la influencia de contratos, acuerdos o leyes que 
  puedan dar lugar a que sus empleados (o cualquier otra entidad) reclamen 
  derechos sobre sus contribuciones.

* **CLA Corporativo**: Para entidades corporativas que permiten que algunos de 
  sus empleados contribuyan a Thymeleaf en nombre de la entidad.

Para obtener más información sobre el CLA y el sencillo proceso que implica este 
paso, consulte el [repositorio de CLA de Thymeleaf][cla].

## Convenciones y Mantenimiento

### Directrices Generales:

- Obviamente, **su código debe compilarse y funcionar correctamente**.
- Todo su código debe ser fácil de leer y comprender para una persona. El mismo 
  requisito se aplica a la documentación. - Salvo para artefactos específicos 
  como traducciones de documentación, todo el código, los comentarios, la 
  documentación, los nombres de clases y variables, los mensajes de registro, 
  etc., deben estar **en inglés**.
- Todos los archivos contribuidos deben incluir el encabezado de copyright 
  estándar de Thymeleaf.
- La longitud máxima de línea recomendada es de 120 caracteres. Esto no se 
  aplica estrictamente.
- La sangría debe ser de 4 espacios, no de tabulaciones. Los saltos de línea 
  deben ser similares a los de UNIX (`\n`).
- Todos los archivos fuente deben ser ASCII puro, excepto los archivos 
  `.properties`, que deben cumplir la norma ISO-8859-1.
- Debe agregarse como _autor_ (por ejemplo, Javadoc `@author`) a cualquier 
  archivo que cree o modifique sustancialmente (más allá de cambios 
  superficiales).

### Directrices específicas para el código Java:

- Todo su código debe compilarse y ejecutarse en la versión mínima actual de 
  Java del proyecto.
- Todo su código debe seguir las convenciones de código Java en cuanto a la 
  nomenclatura de variables, métodos y clases. - Se prohíbe el autoboxing y/o 
  autounboxing de números.
- Cada clase debe definir un constructor, incluso si es el constructor sin 
  argumentos, e incluir una llamada a `super()`.
- Todos los parámetros del método deben declararse como `final` para que no se 
  puedan modificar ni reasignar en el método.
- Todos los parámetros no nulos en los métodos públicos deben validarse primero 
  para verificar su no nulidad dentro del código.
- La documentación Java existente debe mantenerse junto con los cambios 
  realizados. La adición de nueva documentación Java para métodos públicos o 
  comentarios de código para cualquier algoritmo no trivial siempre es 
  bienvenida.
- La escritura de pruebas unitarias para código nuevo, existente y modificado 
  también es bienvenida. Para cualquier nuevo algoritmo o funcionalidad 
  aportada, o modificaciones sustanciales realizadas a los existentes, el equipo 
  podría considerarlos un requisito.

[cla]: https://github.com/thymeleaf/thymeleaf-org/blob/CLA_CURRENT/CLA/
[code-of-conduct]: https://github.com/thymeleaf/thymeleaf-org/blob/CoC_CURRENT/CoC/THYMELEAF_CODE_OF_CONDUCT.markdown
[thymeleaf-team]: https://www.thymeleaf.org/team.html
[stackoverflow]: https://stackoverflow.com
[stackoverflow-thymeleaf]: https://stackoverflow.com/tags/thymeleaf