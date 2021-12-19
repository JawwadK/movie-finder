import React from "react";
import tmdb from './tmdb.svg';

import "./Footer.css";

const Footer = () => {
    return (
        <footer id="footer" className="footer">
            <p>
                Made with ❤ by
                <a
                    href="https://github.com/seyon123"
                    target="_blank"
                    rel="noopener noreferrer"
                > Seyon Rajagopal </a>,
                <a
                    href="https://github.com/lyjacky11"
                    target="_blank"
                    rel="noopener noreferrer"
                > Jacky Ly </a>, and
                <a
                    href="https://github.com/JawwadK"
                    target="_blank"
                    rel="noopener noreferrer"
                > Jawwad Khan </a>
                
                

                <br/>
                Powered by: <a href="https://www.themoviedb.org/" target="_blank" rel="noopener noreferrer"><img height="14"src={tmdb} alt="The Movie DB (TMDB)"></img></a>

            </p>
        </footer>
    );
};

export default Footer;
