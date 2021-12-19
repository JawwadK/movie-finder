import React, { useEffect } from "react";
import { useState } from "react";

import "./Filters.css";

const DISCOVERSEARCH = "https://api.themoviedb.org/3/discover/movie?api_key=a18a4c3abe6c63b9d003880cedebf790";

const Filter = ({ setGenre, genre, setYear, year, setSort, sort, genres}) => {
    

    
    return (
        <div id="filter" className="toolbar">
            <div>
                Genres:       
                <select className="genres" value={genre} onChange={(e) => setGenre(e.target.value)} >
                    <option value="" className="genre">All Genres</option>
                    {genres ? genres.map((genre , i) => (
                        <option key={i} className="genres" value={genre.id}>{genre.name}</option >
                    ))
                     : ""}
                </select>
            </div>
            <div>
                Sort By:      
                <select className="sortby" value={sort} onChange={(e) => setSort(e.target.value)}>
                    <option className="sort" value="popularity.desc">Popularity ▼</option>
                    <option className="sort" value="popularity.asc">Popularity ▲</option>
                    <option className="sort" value="release_date.desc">Release Date ▼</option>
                    <option className="sort" value="release_date.asc">Release Date ▲</option>
                    <option className="sort" value="revenue.desc">Earnings ▼</option>
                    <option className="sort" value="revenue.asc">Earnings ▲</option>
                </select>
            </div>
            <div>
                Year:      
                <input className="year" name="year" value={year} onChange ={(e) => setYear(e.target.value)} type="number" min="1900" max="2099" step="1" placeholder="Year..."/>
            </div>
        </div>
    );    
};

export default Filter;