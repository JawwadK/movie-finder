import React from "react";
import { db } from "../firebase";
import { useState, useEffect } from "react";
import {calcMovieSimilarity} from "../api/recommender";
import "./ExportDB.css";

const ExportDB = () => {
	const [allMovies, setAllMovies] = useState([]);
	const [uniqueUsers, setUniqueUsers] = useState([]);
	const [uniqueMovies, setUniqueMovies] = useState([]);

	useEffect(() => {
		document.title = `Export Data | Movie Finder`;
	}, []);


	useEffect(() => {
		const allMoviesList = db.collection("movies");
		allMoviesList.get().then((movieSnapshot) => {
			const tempMovies = [];
			movieSnapshot.forEach((doc) => {
				tempMovies.push({ id: doc.id, ...doc.data() });
			});
			setAllMovies(tempMovies);
		});
	}, []);

	const jsonString = JSON.stringify(allMovies, null, "\t");

	const downloadHandler = () => {
		exportTableToCSV("movies-db.csv");
	}

	useEffect(() => {
		// Get unique user emails
		const users = allMovies.map((movie) => movie.ratings.map((rating) => rating.userId));
		const uniqueUsers = users.flat().filter((userId, index, self) => self.indexOf(userId) === index);
		setUniqueUsers(uniqueUsers);

		// Get unique movie titles
		const uniqueMovies = allMovies.map((movie) => movie.title);
		setUniqueMovies(uniqueMovies);
	}, [allMovies]);

	function exportTableToCSV(filename) {
		var csv = [];
		var rows = document.querySelectorAll("table tr, caption");
		for (var i = 0; i < rows.length; i++) {
			var row = [],
				cols = rows[i].querySelectorAll("td, th");

			for (var j = 0; j < cols.length; j++) row.push(cols[j].innerText);
			csv.push(row.join(","));
		}
		downloadCSV(csv.join("\n"), filename);
	}

	function downloadCSV(csv, filename) {
		var csvFile;
		var downloadLink;
		csvFile = new Blob([csv], { type: "text/csv" });
		downloadLink = document.createElement("a");
		downloadLink.download = filename;
		downloadLink.href = window.URL.createObjectURL(csvFile);
		downloadLink.style.display = "none";
		document.body.appendChild(downloadLink);
		downloadLink.click();
	}

	return (
		<div className="exportPage">
			<h1 className="exportTitle">Export / View Database</h1>
			<h2>Download Data</h2>
			{allMovies.length > 0 && (
				<div className="exportBtnContainer">
					<div className="exportBtn">
						<i className="fas fa-file-code icon"></i>
						<a className="export-link" href={`data:text/json;charset=utf-8,${encodeURIComponent(jsonString)}`} download="movies-db.json">
							{`Export as JSON`}
						</a>
					</div>
					<div className="exportBtn" onClick={downloadHandler}>
						<i className="fas fa-file-csv icon"></i>
						{`Export as CSV`}
					</div>
				</div>
			)}

			<h2>Movie Ratings</h2>
			<div className="displayTable">
				<table>
					<caption>Movie Ratings</caption>
					<tr>
						<td>
							Movie Title \ User Email
						</td>
						{uniqueUsers.map((userId) => (
							<td key={userId}>{userId}</td>
						))}
					</tr>
					{uniqueMovies.map((movieTitle, index1) => (
						<tr key={movieTitle}>
							<td>{movieTitle}</td>
							{uniqueUsers.map((userId) =>
								allMovies[index1].ratings.filter((rating) => rating.userId === userId)[0] ? (
									<td key={userId}>{allMovies[index1].ratings.filter((rating) => rating.userId === userId)[0].rating}</td>
								) : (
									<td>-</td>
								)
							)}
						</tr>
					))}
				</table>
			</div>

			<h2>Movie Similarity Scores</h2>
			<div className="displayTable">
				<table>
					<caption>Movie Similarity Scores</caption>
					<tr>
						<td>
							Movie Title
						</td>
						{uniqueMovies.map((movieTitle) => (
							<td key={movieTitle}>{movieTitle}</td>
						))}
					</tr>
					{uniqueMovies.map((movieTitleA) => (
						<tr key={movieTitleA}>
							<td>{movieTitleA}</td>
							{uniqueMovies.map((movieTitleB) =>
								(movieTitleA !== movieTitleB) ? (
								<td>{calcMovieSimilarity(movieTitleA, movieTitleB, allMovies)} </td>) : <td>1</td>
								)
							}
						</tr>
					))}
				</table>
			</div>
			<h2>Database (JSON)</h2>
			<pre>{jsonString}</pre>
		</div>
	);
};

export default ExportDB;
