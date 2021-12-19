import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Nullimage from "./no-image.webp";
import Filter from "./Filters";
import InfiniteScroll from "react-infinite-scroller";
import ReactLoading from "react-loading";
import { getMovies, getGenres } from "../api";
import { db } from "../firebase";
import "./Home.css";

function Home({ searchQuery }) {
	const [movies, setMovies] = useState([]);
	const [hasMore, setHasMore] = useState(false);
	const [genre, setGenre] = useState("");
	const [sort, setSort] = useState("popularity.desc");
	const [year, setYear] = useState("");
	const [page, setPage] = useState(1);
	const [genres, setGenres] = useState([]);

	const DISCOVERSEARCH = "https://api.themoviedb.org/3/discover/movie?api_key=a18a4c3abe6c63b9d003880cedebf790";
	const SEARCHAPI = "https://api.themoviedb.org/3/search/movie?&api_key=a18a4c3abe6c63b9d003880cedebf790&query=";

	useEffect(() => {
		document.title = `Home | Movie Finder`;
	}, []);

	useEffect(() => {
		setTimeout(async () => {
			setMovies(await getMovies(DISCOVERSEARCH));
			setHasMore(false);
			if (movies.length > 0) {
				setHasMore(true);
			}
			setGenres(await getGenres());
		}, 0);
	}, []);

	useEffect(() => {
		setTimeout(async () => {
			setPage(1);
			const movies = await getMovies(DISCOVERSEARCH + "&sort_by=" + sort + "&with_genres=" + genre + "&primary_release_year=" + year + "&page=" + page);
			setMovies(movies);
		}, 0);
	}, [year, sort, genre]);

	useEffect(() => {
		setTimeout(async () => {
			var hasmore = true;
			const filter = document.querySelector("#filter");
			var movies;
			if (searchQuery === "") {
				//filter.style.display = "grid";
				movies = await getMovies(DISCOVERSEARCH + "&sort_by=" + sort + "&with_genres=" + genre + "&primary_release_year=" + year + "&page=" + page);
			} else {
				//filter.style.display = "none";
				movies = await getMovies(SEARCHAPI + searchQuery + "&page=" + page);
			}

			if (movies.length < 20) {
				hasmore = false;
			}
			setMovies(movies);
			setHasMore(hasmore);
		}, 0);
	}, [searchQuery]);

	const filter = document.querySelector("#filter");
	var fetchMoreMovies = () => {
		setTimeout(async () => {
			var newPage = page + 1;
			setPage(newPage);

			var tempmovies;
			var hasmore = true;
			if (searchQuery === "" && filter) {
				//filter.style.display = "grid";
				tempmovies = await getMovies(DISCOVERSEARCH + "&sort_by=" + sort + "&with_genres=" + genre + "&primary_release_year=" + year + "&page=" + newPage);
			} else {
				//filter.style.display = "none";
				tempmovies = await getMovies(SEARCHAPI + searchQuery + "&page=" + newPage);
			}
			var totalMovies = [].concat(movies, tempmovies);

			if (tempmovies.length < 20) {
				hasmore = false;
			}
			setHasMore(hasmore);
			setMovies(totalMovies);
		}, 1000);
	};

	function checkImageExists(image) {
		if (image != null) {
			return "https://image.tmdb.org/t/p/w780" + image;
		}
		return Nullimage;
	}

	return (
		<>
			<Filter setGenre={setGenre} genre={genre} sort={sort} setSort={setSort} setYear={setYear} year={year} genres={genres} />
			<div className="content">
				{movies && movies.length !== 0 ? (
					<InfiniteScroll
						loadMore={fetchMoreMovies}
						hasMore={hasMore}
						initialLoad={false}
						useWindow={true}
						loader={
							<div key={0} className="loading">
								<ReactLoading type={"spin"} color={"grey"} height={50} width={50} />
							</div>
						}
					>
						<main id="main">
							{movies.map((movie, i) => (
								<Link style={{ textDecoration: "none" }} to={`/movie/${movie.id}`} key={i}>
									<div alt={movie.title} title={movie.title} className="movie">
										{/* <span className="span">
											<i className="fas fa-star"></i> {movie.vote_average}
										</span> */}
										<img className="poster" src={checkImageExists(movie.poster_path)} alt={movie.title} />
										<div className="movieinfo">
											<h3>{movie.title}</h3>
											<p className="year">
												<b>{movie.release_date ? movie.release_date.slice(0, movie.release_date.indexOf("-")) : "No Date"}</b>
											</p>
										</div>
									</div>
								</Link>
							))}
						</main>
					</InfiniteScroll>
				) : (
					<div>No More Movies Found</div>
				)}
				<div className="toTop">
					<a href="/#">
						<i className="fas fa-arrow-up"></i>
					</a>
				</div>
			</div>
		</>
	);
}

export default Home;
