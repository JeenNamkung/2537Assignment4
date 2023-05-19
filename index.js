const startGame = () => {
	let cardCount;
	const selectedDifficulty = $('#difficultySelect').val();
	let columnCount;

	if (selectedDifficulty === 'easy') {
		cardCount = 6;
		columnCount = 3;
	} else if (selectedDifficulty === 'normal') {
		cardCount = 12;
		columnCount = 4;
	} else if (selectedDifficulty === 'hard') {
		cardCount = 24;
		columnCount = 6;
	}

	$('#game_grid').css('grid-template-columns', `repeat(${columnCount}, 1fr)`);

	let randomPokemonIds = [];
	for (let i = 0; i < cardCount / 2; i++) {
		const randomId = Math.floor(Math.random() * 810) + 1;
		randomPokemonIds.push(randomId, randomId);  // Add each ID twice to the array
	}

	// Shuffle the array
	randomPokemonIds.sort(() => Math.random() - 0.5);

	const cards = $('#game_grid');
	cards.empty();

	if (selectedDifficulty === 'normal') {
		cards.css('grid-template-columns', 'repeat(4, 1fr)');
	} else if (selectedDifficulty === 'hard') {
		cards.css('grid-template-columns', 'repeat(6, 1fr)');
	}

	for (let i = 0; i < cardCount; i++) {
		const card = $('<div class="card"></div>');
		const frontFace = $('<img class="front_face" alt="Pokemon">');
		const backFace = $('<img class="back_face" src="back.webp" alt="Card Back">');
		card.append(frontFace);
		card.append(backFace);
		cards.append(card);
	}

	let counter = 0;
	$('.card .front_face').each(function () {
		$.ajax({
			url: `https://pokeapi.co/api/v2/pokemon/${randomPokemonIds[counter]}/`,
			success: (data) => {
				const imageUrl = data.sprites.front_default;
				$(this).attr('src', imageUrl);
			},
			error: (xhr, status, error) => {
				console.error('Error retrieving Pokemon data:', error);
			},
		});
		counter++;
	});

	let score = 0;
	document.getElementById('score').innerText = 'Score: ' + score;

	let firstCard = null;
	let secondCard = null;

	$('.card').on('click', function () {
		const clickedCard = $(this);
		const frontFace = clickedCard.find('.front_face');

		// 이미 매칭된 카드인 경우 무시
		if (clickedCard.hasClass('matched')) {
			return;
		}

		// 같은 카드를 두 번 클릭한 경우 무시
		if (clickedCard.hasClass('flip')) {
			return;
		}

		clickedCard.addClass('flip');

		if (!firstCard) {
			// 첫 번째 카드 클릭
			firstCard = clickedCard;
		} else {
			// 두 번째 카드 클릭
			secondCard = clickedCard;

			// 일치하는 카드인지 확인
			if (firstCard.find('.front_face').attr('src') === secondCard.find('.front_face').attr('src')) {
				// 일치하는 경우
				firstCard.addClass('matched');
				secondCard.addClass('matched');

				score++;
				document.getElementById('score').innerText = 'Score: ' + score;

				firstCard = null;
				secondCard = null;
			} else {
				// 일치하지 않는 경우
				setTimeout(() => {
					firstCard.removeClass('flip');
					secondCard.removeClass('flip');

					firstCard = null;
					secondCard = null;
				}, 1000);
			}
		}
	});
};

const setup = () => {
	$('#startButton').on('click', startGame);
};

$(document).ready(setup);
