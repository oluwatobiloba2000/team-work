import React from 'react'
import Logo from '../../components/logo/logo';
import { ButtonGroup, Button } from 'rsuite';
import { Link, Redirect } from 'react-router-dom';
import './home.css';
import homeSvg from '../../img/home_svg.png';
import { Helmet } from 'react-helmet';

function Home() {
    const checkToken = () => {
        const token = window.localStorage.getItem('auth-token');
        return token ? true : false;
    }

    return (
        <div className="home_container">
            <Helmet>
                <title>Home || Teamily</title>
            </Helmet>
            {checkToken() && <Redirect to="/user/organization" />}
            <svg style={{ position: 'absolute', width: '305px', zIndex: '-1' }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
                <path fill="rgb(253 168 1 / 26%)" d="M31.3,-26C39,-23.6,42.5,-11.8,46.6,4.1C50.7,20.1,55.5,40.1,47.8,53.9C40.1,67.7,20.1,75.2,-0.4,75.7C-21,76.1,-41.9,69.5,-57.1,55.7C-72.2,41.9,-81.5,21,-78.1,3.4C-74.7,-14.2,-58.6,-28.4,-43.5,-30.7C-28.4,-33.1,-14.2,-23.7,-1.2,-22.5C11.8,-21.3,23.6,-28.4,31.3,-26Z" transform="translate(100 100)" style={{ fill: 'rgb(253 168 1 / 26%)' }} />
            </svg>
            <div className="home_nav">
                <div className="nav_logo">
                    <Logo />
                </div>

                <div className="home_auth_btn">
                    <ButtonGroup className="button_group">
                        <Link to="/auth/login">
                            <Button className="login_btn" appearance={'primary'}>Login</Button>
                        </Link>
                        <Link to="/auth/signup">
                            <Button className="signup_btn" appearance={'default'}>Signup</Button>
                        </Link>
                    </ButtonGroup>
                </div>
            </div>

            <div className="home_body">
                <div className="first_section">
                    <h1>Teamily</h1>

                    <div className="home_text">
                        Teamwork is an internal social network for employees of an organization. The goal of this application is to facilitate more interaction between colleagues and promote team bonding.
                      </div>

                    <Link to="/auth/signup">
                        <Button className="get_started_btn">Get Started</Button>
                    </Link>
                </div>

                <div className="home_svg_container">
                    <img src={homeSvg} alt="home decoration" />
                </div>
            </div>
            {/* */}
        </div>
    )
}

export default Home
