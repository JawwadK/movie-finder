// Fetch all movies except the selected movie
function fetchOtherMovies(selectedMovie, movies) {
	let otherMovies = [];
	for (const movie of movies) {
		let movieTitle = movie.title;
		if (movieTitle != selectedMovie) {
			otherMovies.push(movieTitle);
		}
	}
	return otherMovies;
}

// Find common users between two movie ratings
function findCommonUsers(movieA, movieB) {
	let usersMovieA = [];
	let usersMovieB = [];
	let commonUsers = [];

	for (const ratings of movieA) {
		usersMovieA.push(ratings.userId);
	}
	for (const ratings of movieB) {
		usersMovieB.push(ratings.userId);
	}

	commonUsers = usersMovieA.filter((user) => usersMovieB.includes(user));
	return commonUsers;
}

// Get the ratings of two movies
function getMoviesRatings(selectedMovie, compareMovie, movies) {
	let compareRatings = {};
	let selectedMovieObj = {};
	let compareMovieObj = {};

	let selectedMovieRatings = [];
	let compareMovieRatings = [];

	for (const movie of movies) {
		let movieTitle = movie.title;
		// selected movie
		if (movieTitle == selectedMovie) {
			selectedMovieObj = movie.ratings;
		}
		// movie to be compared
		else if (movieTitle == compareMovie) {
			compareMovieObj = movie.ratings;
		}
	}
	let commonUsers = findCommonUsers(selectedMovieObj, compareMovieObj);
	//console.log("Selected Movie:", selectedMovieObj);
	//console.log("Comparing Movie:", compareMovieObj);
	//console.log("Common Users:", commonUsers);

	for (const userRating of selectedMovieObj) {
		if (commonUsers.includes(userRating.userId)) {
			selectedMovieRatings.push(userRating.rating);
		}
	}
	compareRatings[selectedMovie] = selectedMovieRatings;

	for (const userRating of compareMovieObj) {
		if (commonUsers.includes(userRating.userId)) {
			compareMovieRatings.push(userRating.rating);
		}
	}
	compareRatings[compareMovie] = compareMovieRatings;
	return compareRatings;
}

// Calculate average ratings
function calcAvgRatings(compareRatings) {
	let avgRatings = {};
	for (const movieTitle in compareRatings) {
		let sumRatings = 0;
		let avgRating = 0.0;

		let movieRatings = compareRatings[movieTitle];
		let numRatings = movieRatings.length;

		for (const rating of movieRatings) {
			sumRatings += rating;
		}
		avgRating = sumRatings / numRatings;
		avgRatings[movieTitle] = avgRating;
	}
	return avgRatings;
}

// Calculate numerator value
function calcNumerator(compareRatings, avgRatings) {
	let numeratorValuesList = [];
	let numeratorValues = [];
	let numerator = 0;

	for (const movieTitle in compareRatings) {
		let movieRatings = compareRatings[movieTitle];
		let numerators = [];
		for (const rating of movieRatings) {
			let value = rating - avgRatings[movieTitle];
			numerators.push(value);
		}
		numeratorValuesList.push(numerators);
	}
	let listA = numeratorValuesList[0];
	let listB = numeratorValuesList[1];

	for (var i = 0; i < listA.length; i++) {
		numeratorValues[i] = listA[i] * listB[i];
	}
	// calculate sum
	for (var i = 0; i < numeratorValues.length; i++) {
		numerator += numeratorValues[i];
	}
	//console.log(numeratorValuesList);
	//console.log("Numerator Values:", numeratorValues);
	return numerator;
}

// Calculate denominator value
function calcDenominator(compareRatings, avgRatings) {
	let denomValuesList = [];
	let denominator = 0;

	for (const movieTitle in compareRatings) {
		let movieRatings = compareRatings[movieTitle];
		let denoms = [];
		for (const rating of movieRatings) {
			let value = Math.pow(rating - avgRatings[movieTitle], 2);
			denoms.push(value);
		}
		denomValuesList.push(denoms);
	}
	let listA = denomValuesList[0];
	let sumListA = 0;
	// calculate sum
	for (var i = 0; i < listA.length; i++) {
		sumListA += listA[i];
	}
	let listB = denomValuesList[1];
	let sumListB = 0;
	// calculate sum
	for (var i = 0; i < listB.length; i++) {
		sumListB += listB[i];
	}
	denominator = Math.sqrt(sumListA * sumListB);
	//console.log("Denominator Values:", denomValuesList);
	return denominator;
}

// Calculate similarity score between two movies
export function calcMovieSimilarity(selectedMovie, compareMovie, movies) {
	let compareRatings = getMoviesRatings(selectedMovie, compareMovie, movies);
	//console.log("Ratings:", compareRatings);

	let avgRatings = calcAvgRatings(compareRatings);
	//console.log("Average Ratings:", avgRatings);

	let numerator = calcNumerator(compareRatings, avgRatings);
	//console.log("Numerator:", numerator);

	let denominator = calcDenominator(compareRatings, avgRatings);
	//console.log("Denominator:", denominator);

	let simScore = 0;
	if (denominator > 0) {
		simScore = numerator / denominator;
	}
	return simScore;
}

// Returns the movie id
function getMovieId(movieName, movies) {
	for (const movie of movies) {
		if (movie.title == movieName) {
			return movie.id;
		}
	}
}

// Calculate all similarity scores for a selected movie
export const calcSimScores = (selectedMovie, movies) => {
	let allSimScores = {};
	let otherMovies = fetchOtherMovies(selectedMovie, movies);
	for (const movie of otherMovies) {
		let compareMovie = movie;
		let simScore = calcMovieSimilarity(selectedMovie, compareMovie, movies);
		let movieId = getMovieId(compareMovie, movies);
		allSimScores[movieId] = simScore;
		//console.log("Sim score of", selectedMovie, "and", compareMovie, ":", simScore);
		//console.log("--------");
	}
	return allSimScores;
};

// Return list of movie IDs sorted desc by sim score
export const sortMovieIdsByScore = (allSimScores) => {
	let keys = Object.keys(allSimScores);
	let newKeys = []
	
	let values = Object.values(allSimScores);
	let newValues = Object.values(allSimScores);
	
	newValues.sort(function(a, b) {
		return b - a;
	});
	
	for (var i = 0; i < newValues.length; i++)
	{
		let score = newValues[i];
		let index = values.indexOf(score);
		newKeys.push(keys[index]);
		keys[index] = null;
		values[index] = null;
	}
	return newKeys;
}
