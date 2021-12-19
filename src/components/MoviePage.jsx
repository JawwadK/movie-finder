import React from "react";
import "./MoviePage.css";
import firebase from "firebase";
import { Link, withRouter } from "react-router-dom";
import { useEffect, useState } from "react";
import { useHistory } from "react-router";
import { useStateValue } from "../StateProvider";
import imdb from "./imdb.png";
import background from "./background.jpg";
import Nullimage from "./no-image.webp";
import { findMovie, getRecommended, getCast, getRecommended2 } from "../api";
import { calcSimScores, sortMovieIdsByScore } from "../api/recommender";
import { db } from "../firebase";

function MoviePage({ id }) {
	const [movie, setMovie] = useState({});
	const [{ user }, dispatch] = useStateValue();
	const [allMovies, setAllMovies] = useState([]);
	const [recommended, setRecommended] = useState([]);
	const [cast, setCast] = useState([]);
	const [simScores, setSimScores] = useState({});
	const [sortedMovieIds, setSortedMovieIds] = useState([]);
	const [rating, setRating] = useState(0);
	const [movieRatings, setMovieRatings] = useState([]);
	const history = useHistory();

	useEffect(() => {
		document.title = ` ${movie.title} | Movie Finder`;
	}, [movie]);
	
	useEffect(() => {
		const allMoviesList = db.collection("movies");
		allMoviesList.get().then((movieSnapshot) => {
			const tempMovies = [];
			movieSnapshot.forEach((doc) => {
				tempMovies.push({ id: doc.id, ...doc.data() });
			});
			setAllMovies(tempMovies);
		});
		//console.log(allMovies);
	}, [rating]);

	useEffect(() => {
		setTimeout(async () => {
			setMovie(await findMovie(id));

			//setRecommended(await getRecommended(id));
			setCast(await getCast(id));
		}, 0);
	}, []);

	// Fetch user rating if exists
	useEffect(() => {
		if (movie !== undefined && Object.keys(movie).length !== 0) {
			const movieDoc = db.collection("movies").doc(id);
			const getMovie = movieDoc.get();
			//const ratings = movieDoc.ratings;
			//const userExists = ratings?.some((dbuser) => dbuser.userId === user.email);

			db.collection("movies")
				.doc(id)
				.get()
				.then((ratingsSnapshot) => {
					var ratingsData = ratingsSnapshot.data();
					if (ratingsData) {
						var movieRatings = ratingsData.ratings;
						setMovieRatings(movieRatings);
						var userRatingObj = movieRatings.find((ratingObj) => ratingObj.userId === user?.email);
						if (userRatingObj) {
							var userRating = userRatingObj.rating;
							setRating(userRating);
						}
					}
				});
		}
	}, [rating, user, movie]);

	// Create or update a movie rating entry in db
	useEffect(() => {
		if (movie !== undefined && Object.keys(movie).length !== 0) {
			const movieDoc = db.collection("movies").doc(id);
			const getMovie = movieDoc.get();
			if (!getMovie.exists) {
				movieDoc.set({
					title: movie.title,
					ratings: [],
				});
			}
			var ratingsTemp = movieRatings.filter((ratingObj) => ratingObj.userId !== user?.email);
			ratingsTemp.push({
				userId: user.email,
				rating: rating,
			});
			setMovieRatings(ratingsTemp);
			movieDoc.set({
				title: movie.title,
				ratings: ratingsTemp,
			});
		}
	}, [rating]);

	// JACKY'S SIM SCORE CODE
	useEffect(() => {
		if (movieRatings !== undefined && movieRatings.length !== 0) {
			const getMovie =  db.collection("movies").doc(id).get();
			if (rating > 0) {
				var allSimScores = calcSimScores(movie.title, allMovies);
				setSimScores(allSimScores);
				var sortedIds = sortMovieIdsByScore(allSimScores);
				setSortedMovieIds(sortedIds);
				console.log(allSimScores);
				//console.log(sortedIds);
				setTimeout(async () => {
					setRecommended(await getRecommended2(sortedIds));
				}, 0);
			}
		}
	}, [allMovies, rating]);


	function checkImageExists(image) {
		if (image != null) {
			return "https://image.tmdb.org/t/p/w1280" + image;
		}
		return Nullimage;
	}

	function checkBackdropExists(image) {
		if (image != null) {
			return "https://image.tmdb.org/t/p/w1280" + image;
		}
		return background;
	}

	const avgRating = (movieRatings.reduce((a, r) => (a = a + r.rating), 0) / movieRatings.length).toFixed(2);

	return (
		<div className="moviePagecontainer">
			<div className="background" style={{ backgroundImage: "url(" + checkBackdropExists(movie.backdrop_path) + ")" }}></div>
			<div className="foreground">
				<div className="back">
					<Link onClick={() => history.goBack()} style={{ textDecoration: "none" }} to="/">
						<i className="fas fa-arrow-left"></i>
					</Link>{" "}
					Go Back
				</div>
				{Object.keys(movie).length !== 0 && movie.constructor === Object ? (
					<div className="movieContainer">
						<a href={`https://www.themoviedb.org/movie/${movie.id}`} target="_blank" rel="noreferrer" style={{ textDecoration: "none" }}>
							<div className="movie-Page">
								<span className="span" title={`Average Rating: ${avgRating}⭐`}>
									<i className="fas fa-star"></i> {avgRating > 0 ? avgRating : "0.00"}
								</span>
								<img className="poster" src={checkImageExists(movie.poster_path)} alt={movie.title} />
							</div>
						</a>
						<div className="movieContent">
							<h1 className="title">{movie.title}</h1>
							<h4>
								{movie.release_date ? movie.release_date : ""} {movie.runtime ? `• ${movie.runtime}m` : ""}<br/><br/>{movieRatings.length ? <> <i className="stars fas fa-star"/> {avgRating} • {movieRatings.length} ratings</> : "No ratings yet"}
							</h4>
							{movie.overview ? <h3>Overview:</h3> : ""}
							<p className="overview">{movie.overview}</p>
							{movie.genres ? movie.genres.length ? <h3>Genre:</h3> : "" : ""}
							<p>
								{movie.genres &&
									movie.genres.map((genre, i) => (
										<span key={i}>
											{" "}
											{genre.name}
											{i === movie.genres.length - 1 ? "" : ","}
										</span>
									))}
							</p>
							{movie.imdb_id && (
								<div>
									<a target="_blank" rel="noreferrer" href={`https://www.imdb.com/title/${movie.imdb_id}`}>
										<img src={imdb} width="70" alt="imdb" />
									</a>
								</div>
							)}
							<div className="userRatings">
								<h5>Watched this movie? </h5>
								{user ? (
									<h6>Submit your rating:</h6>
								) : (
									<h6>
										<Link className="signinLink" to="/login">
											Sign in
										</Link>{" "}
										to submit a rating!
									</h6>
								)}
								{Array(rating)
									.fill()
									.map((_, i) => (
										<i key={i} className="stars fas fa-star" onClick={() => user && setRating(i + 1)}></i>
									))}
								{Array(5 - rating)
									.fill()
									.map((_, i) => (
										<i key={i} className=" stars far fa-star" onClick={() => user && setRating(rating + i + 1)}></i>
									))}
									
								{<i className="trash fas fa-times-circle" onClick={() => user && setRating(0)}></i>}
							</div>
						</div>
					</div>
				) : (
					"This Movie Does Not Exist 😞"
				)}

				<div className="castOuter">
					{cast ? cast.length ? <h3 className="castTitle">Cast:</h3> : "" : ""}
					<div className="castContainer">
						{cast
							? cast.length
								? cast.slice(0, 8).map((member, i) => (
										<a key={i} href={`https://www.themoviedb.org/person/${member.id}`} target="_blank" rel="noreferrer" style={{ textDecoration: "none" }}>
											<div alt={member.name} title={member.name} className="castMember">
												<img className="poster" src={checkImageExists(member.profile_path)} alt={`${member.name} as ${member.character}`} />
												<div className="movieinfo">
													<h3>{member.name}</h3>
													<h3 className="character">{member.character}</h3>
												</div>
											</div>
										</a>
								  ))
								: ""
							: ""}
					</div>
				</div>

				<div className="recommendedOuter">
					{recommended ? recommended.length ? <h3 className="recommendedTitle">Recommended:</h3> : "" : ""}
					<div className="recommendedContainer">
						{recommended
							? recommended.length
								? recommended.slice(0, 8).map((movie, i) => (
										<Link to={`/movie/${movie.id}`} key={i} style={{ textDecoration: "none" }}>
											<div alt={movie.title} title={movie.title} className="recommendedMovie">
												{/* <span className="span">{(simScores[movie.id] * 100).toFixed(2)}%</span> */}

												<img className="poster" src={checkImageExists(movie.poster_path)} alt={movie.title} />
												<div className="movieinfo">
													<h3>{movie.title}</h3>
													<h3 className="character">{(simScores[movie.id] * 100).toFixed(2)}% Match</h3>
												</div>
											</div>
										</Link>
								  ))
								: ""
							: ""}
					</div>
				</div>
			</div>
		</div>
	);
}

export default withRouter(MoviePage);
