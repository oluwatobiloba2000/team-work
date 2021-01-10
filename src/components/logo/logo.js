import React from 'react';
import {Link} from 'react-router-dom';
import './logo.css';

function Logo(props) {
    return (
        <Link to="/">
            <span className={`logo_container ${props.className}`}>
            <span className="logo_corner_container">
                <div className="corner_one"></div>
                <div className="corner_two"></div>
                <div className="corner_three"></div>
                <div className="corner_four"></div>
            </span>
            {props.removeLogoName? <></> : <span className="logo_name">Teamily</span>}
            </span>
        </Link>
    )
}

export default Logo
