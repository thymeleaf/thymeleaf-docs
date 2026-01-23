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
 * JavaScript para realizar modificaciones posteriores a Pandoc en los
 * tutoriales de Thymeleaf con el fin de aplicar los estilos estándar del sitio
 * web.
 *
 * @author Emanuel Rabina
 */
(function() {
	'use strict';

	// Agrega nombres de clase a los distintos niveles de la tabla de contenido para que sea más fácil aplicarles estilo.
	$$('#toc > ul').forEach(function(el) {
		el.classList.add('level1');
	});
	$$('#toc > ul > li > ul').forEach(function(el) {
		el.classList.add('level2');
	});
	$$('#toc > ul > li > ul > li > ul').forEach(function(el) {
		el.classList.add('level3');
	});
	$$('#toc > ul > li > ul > li > ul > li > ul').forEach(function(el) {
		el.classList.add('level4');
	});

	// Idiomas utilizados para resaltar la sintaxis
	var languages = ['html', 'java', 'javascript', 'xml', 'css', 'text'];

	// Se corrige el marcado de código generado por Pandoc para asignar las clases de código correctas a
	// los elementos correctos. Esto genera bloques de código semántico, un requisito
	// de Prism.
	languages.forEach(function(language) {
		$$('pre.' + language).forEach(function(pre) {
			pre.classList.remove(language);
			$('code', pre).classList.add('language-' + language);
		});
	});

	// Ejecuta el resaltador de sintaxis Prism
	Prism.highlightAll();

	// Haga que el botón del menú del sitio revele el menú del sitio al hacer clic
	var toc = $('#toc');
	$('#site-menu-button').addEventListener('click', function(event) {
		toc.classList.toggle('show-toc');
	});

	$$('#toc a').forEach(function(link) {
		link.addEventListener('click', function(event) {
			if (toc.classList.contains('show-toc')) {
				window.addEventListener('hashchange', function offset() {
					window.scrollBy(0, -50);
					toc.classList.remove('show-toc');
					window.removeEventListener('hashchange', offset);
				});
			}
		});
	});

})();
