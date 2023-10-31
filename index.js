const githubExt = (() => {
	'use strict';

	function getTime(dateTime) {
		
	}

	function exec(branch) {
		const usuario = "PHPostApp";
		const repositorio = "PHPost";
		const apigithub = `https://api.github.com/repos/${usuario}/${repositorio}/commits/${branch}`;
	
		fetch(apigithub).then((response) => {
		  	if (response.ok) return response.json();
		  	throw new Error('Something went wrong');
		})
		.then(responseJson => {
			const { sha, commit, html_url } = responseJson;
			const { message, author } = commit;
			let resultado = '';

			// Usamos una expresión regular para encontrar el número que sigue al hashtag (#)
			const match = message.match(/#(\d+)/);

			if (match) {
			  const numero = match[1];
			  const enlace = `https://github.com/${usuario}/${repositorio}/pull/${numero}`;
			  resultado = message.replace(/#(\d+)/, `<a href="${enlace}">#$1</a>`);
			} else resultado = message;

			document.getElementById("message").innerHTML = resultado;
			document.getElementById("sha").innerHTML = '<a href="' + html_url + '" target="_blank" rel="external">' + sha + '...' + "</a>";
			//
			var date = new Date(author.date);
			const objectDate = { day: "2-digit", month: "2-digit",  year: "numeric" }

			const formattedDate = date.toLocaleDateString('es-ES', objectDate);
			const time = date.toLocaleTimeString("es-ES", { hour12: true });

			const [day, month, year] = formattedDate.split('/');
			const [hour, minute, second] = time.split(':');

			document.querySelector("time").innerHTML = `${day}/${month}/${year}, ${hour.padStart(2, '0')}:${minute.padStart(2, '0')}:${second}`;
		})
		.catch((error) => {
			console.log(error)
		});
	}

	return { exec: exec }
})();

// EJECUTAMOS EL BRANCH POR DEFECTO
githubExt.exec('master');

// FUNCIÓN PARA DETECTAR CLICK
const button = [].slice.call(document.querySelectorAll('.button'));
button.map( btn => {
	// CAMBIAMOS EL BRANCH
	btn.addEventListener('click', (e) => githubExt.exec(btn.id));
})