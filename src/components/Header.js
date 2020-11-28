import { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

class Header extends Component {

    logout = () => {
        // sign out should clear all application stored settings.
        localStorage.removeItem("authToken");
        this.props.updateAuthState(null, "loggedout");
    }

    render() {
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
                    {this.props.userInfo !== null && (
                    <ul className="navbar-nav ml-auto">
                        <li className="nav-item dropdown float-right">
                            <div className="nav-link dropdown-toggle" id="dropdown01" title="Account" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                <img className="user-profile" src={this.props.userInfo.thumb} alt="profile"/>
                            </div>
                            <div className="dropdown-menu" aria-labelledby="dropdown01">
                                <div className="dropdown-item label">{this.props.userInfo.username}</div>
                                <Link className="dropdown-item" to={`/settings`}>Account</Link>
                                <Link className="dropdown-item" to={`/settings`}>Settings</Link>
                                <div className="item-separator"></div>
                                <div className="dropdown-item" onClick={() => this.logout()}>Sign Out</div>
                            </div>
                        </li>
                    </ul>
                    )}
                    {this.props.userInfo === null && (
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
}

Header.propTypes = {
    userInfo: PropTypes.object,
    updateAuthState: PropTypes.func.isRequired
}

export default Header;