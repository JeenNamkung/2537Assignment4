const setup = () => {
	let firstCard = undefined;
	let secondCard = undefined;
	let score = 0;
	let randomPokemonIds = [
		Math.floor(Math.random() * 810) + 1,
		Math.floor(Math.random() * 810) + 1,
		Math.floor(Math.random() * 810) + 1,
	];

	let counter = 0;
	$('.card .front_face').each(function () {
		let idIndex = Math.floor(counter / 2);
		$.ajax({
			url: `https://pokeapi.co/api/v2/pokemon/${randomPokemonIds[idIndex]}/`,
			success: (data) => {
				$(this).attr('src', data.sprites.front_default);
			},
		});
		counter++;
	});

	var cards = $('#game_grid');
	for (var i = 0; i < cards.children().length; i++) {
		cards.append(cards.children()[(Math.random() * i) | 0]);
	}

	$('.card').on('click', function () {
		$(this).toggleClass('flip');

		if (!firstCard) {
			firstCard = $(this).find('.front_face')[0];
		} else {
			secondCard = $(this).find('.front_face')[0];

			if (firstCard.src == secondCard.src) {
				console.log('match');
				score++;
				document.getElementById('score').innerText = 'Score: ' + score;
				$(firstCard).parent().off('click');
				$(secondCard).parent().off('click');
				firstCard = undefined;
				secondCard = undefined;
			} else {
				console.log('no match');
				setTimeout(() => {
					$(firstCard).parent().toggleClass('flip');
					$(secondCard).parent().toggleClass('flip');
					firstCard = undefined;
					secondCard = undefined;
				}, 1000);
			}
		}
	});
};

$(document).ready(setup);
