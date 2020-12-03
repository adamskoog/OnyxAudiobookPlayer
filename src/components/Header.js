import React from 'react';
import { Link } from 'react-router-dom';

function Header(props) {

    const logout = () => {
        // sign out should clear all application stored settings.
        localStorage.removeItem("authToken");
        props.updateAuthState(null, "loggedout");
    }

    return (
        <nav className="navbar navbar-expand-md navbar-dark bg-dark fixed-top">
            <Link className="navbar-brand" to={`/`}>Onyx Player</Link>
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#appheadernav" aria-controls="appheadernav" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="appheadernav">
                <ul className="navbar-nav mr-auto">
                    <li className="nav-item">
                        <Link className="nav-link" to={`/`}>Home</Link>
                    </li>
                </ul>
                {props.userInfo !== null && (
                <ul className="navbar-nav ml-auto">
                    <li className="nav-item dropdown float-right">
                        <div className="nav-link dropdown-toggle" id="settingsDropdown" title="Account" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            <img className="user-profile" src={props.userInfo.thumb} alt="profile"/>
                        </div>
                        <div className="dropdown-menu" aria-labelledby="settingsDropdown">
                            <div className="dropdown-item label">{props.userInfo.username}</div>
                            <Link className="dropdown-item" to={`/settings`}>Account</Link>
                            <Link className="dropdown-item" to={`/settings`}>Settings</Link>
                            <div className="item-separator"></div>
                            <div className="dropdown-item" onClick={() => logout()}>Sign Out</div>
                        </div>
                    </li>
                </ul>
                )}
                {props.userInfo === null && (
                <ul className="navbar-nav ml-auto">
                    <li className="nav-item float-right">
                        <Link className="nav-link" to={`/login`}>Sign In with Plex</Link>
                    </li>
                </ul>                   
                )}
            </div>
        </nav>
    ); 
}

export default Header;