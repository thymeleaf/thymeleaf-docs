/*
 * Copyright 2013, The Thymeleaf Project (http://www.thymeleaf.org/)
 *
 * Licenciado bajo la Licencia Apache, Versión 2.0 (la "Licencia");
 * No puede usar este archivo excepto de conformidad con la Licencia.
 * Puede obtener una copia de la Licencia en
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Salvo que lo exija la legislación aplicable o se acuerde por escrito, el software
 * distribuido bajo la Licencia se distribuye "TAL CUAL",
 * SIN GARANTÍAS NI CONDICIONES DE NINGÚN TIPO, ni expresas ni implícitas.
 * Consulte la Licencia para conocer el idioma específico que rige los permisos y las
 * limitaciones de la Licencia.
 */

/**
 * JavaScript para realizar modificaciones posteriores a Pandoc en los artículos de Thymeleaf
 * con el fin de aplicar los estilos estándar del sitio web.
 * 
 * @author Daniel Fernandez
 */
(function() {
	'use strict';

	// Idiomas utilizados para resaltar la sintaxis
	var languages = ['html', 'java', 'javascript', 'xml', 'css', 'text'];

	// Se corrige el marcado de código generado por Pandoc para asignar las clases de código correctas
	// a los elementos correctos. Esto genera bloques de código semántico, un requisito
	// de Prism.
	languages.forEach(function(language) {
		$$('pre.' + language).forEach(function(pre) {
			pre.classList.remove(language);
			$('code', pre).classList.add('language-' + language);
		});
	});

	// Ejecuta el resaltador de sintaxis Prism
	Prism.highlightAll();

	// Hacer que el botón del menú del sitio revele el menú del sitio al hacer clic
	$('#site-menu-button').addEventListener('click', function(event) {
		$('#site-menu').classList.toggle('show-menu');
	});

})();
