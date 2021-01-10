import React from 'react'
import Logo from '../../components/logo/logo';
import { ButtonGroup, Button } from 'rsuite';
import { Link } from 'react-router-dom';
import './home.css';
import homeSvg from '../../img/home_svg.png';

function Home() {
    return (
        <div className="home_container">
            <svg style={{position: 'absolute', width: '305px', zIndex: '-1'}} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
                  <path fill="rgb(253 168 1 / 26%)" d="M31.3,-26C39,-23.6,42.5,-11.8,46.6,4.1C50.7,20.1,55.5,40.1,47.8,53.9C40.1,67.7,20.1,75.2,-0.4,75.7C-21,76.1,-41.9,69.5,-57.1,55.7C-72.2,41.9,-81.5,21,-78.1,3.4C-74.7,-14.2,-58.6,-28.4,-43.5,-30.7C-28.4,-33.1,-14.2,-23.7,-1.2,-22.5C11.8,-21.3,23.6,-28.4,31.3,-26Z" transform="translate(100 100)" style={{fill: 'rgb(253 168 1 / 26%)'}}/>
            </svg>
            <div className="home_nav">
                <div className="nav_logo">
                    <Logo />
                </div>

                <div>
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
                      <img  src={homeSvg} alt="home decoration"/>
                    </div>

                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
                          <path fill="rgb(253 168 1 / 44%)" d="M26.2,-44C30.6,-43,28.3,-29,25.5,-19.5C22.8,-10,19.6,-5,29.7,5.8C39.8,16.7,63.2,33.3,68.6,47.4C74,61.5,61.4,73,47,66.1C32.5,59.2,16.3,33.9,7,21.7C-2.2,9.5,-4.4,10.5,-17.1,16.4C-29.8,22.3,-52.9,33.1,-62.9,31.2C-73,29.3,-69.9,14.6,-65.9,2.3C-61.9,-10,-56.9,-20,-53.9,-34.1C-50.9,-48.1,-49.8,-66.3,-41.2,-64.8C-32.5,-63.3,-16.3,-42.2,-2.6,-37.7C11,-33.1,21.9,-45,26.2,-44Z" transform="translate(100 100)" style={{fill: 'rgb(253 168 1 / 44%)'}}/>
                    </svg>
                </div>
            {/* */}
        </div>
    )
}

export default Home
