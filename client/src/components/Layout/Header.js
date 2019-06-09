import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import Logo from '../../images/eventhub-logo.png';
import { connect } from 'react-redux';
import { logoutUser } from '../../actions/authActions';

class Header extends Component {
  render() {
    const { isAuthenticated, user } = this.props.auth;

    return (
      <div>
        <nav className='transparent whiteBG'>
          <div className='nav-wrapper'>
            <div className='logoSection'>
              <Link to='/dashboard' className='brand-logo'>
                <img className='logo' alt='EventHub' src={Logo} />
              </Link>
              <Link data-target='mobile' className='sidenav-trigger'>
                <i className='material-icons nav-mobile-icon'>menu</i>
              </Link>
            </div>

            <ul id='nav-mobile' className='right hide-on-med-and-down'>
              {isAuthenticated ? (
                <Fragment>
                  <li className='menuItem'>
                    <Link className='welcomeItem'> HI, {user.name} </Link>{' '}
                  </li>
                  <li className='menuItem'>
                    <Link to='/dashboard'> DASHBOARD </Link>{' '}
                  </li>
                  <li className='menuItem'>
                    <Link to='/manager'> Manager </Link>{' '}
                  </li>
                  <li className='menuItem'>
                    <Link to='' onClick={this.props.logoutUser}>
                      {' '}
                      LOGOUT{' '}
                    </Link>{' '}
                  </li>
                </Fragment>
              ) : (
                <Fragment>
                  <li className='menuItem'>
                    <Link to='/login'> LOGIN </Link>{' '}
                  </li>
                  <li className='menuItem'>
                    <Link to='/register'> REGISTER </Link>{' '}
                  </li>
                </Fragment>
              )}
            </ul>
          </div>
        </nav>

        <ul className='sidenav' id='mobile'>
          {isAuthenticated ? (
            <Fragment>
              <li className='menuItem'>
                <Link className='welcomeItem'> HI, {user.name} </Link>{' '}
              </li>
              <li className='menuItem'>
                <Link to='/dashboard'> DASHBOARD </Link>{' '}
              </li>
              <li className='menuItem'>
                <Link to='/manager'> Manager </Link>{' '}
              </li>
              <li className='menuItem'>
                <Link to='' onClick={this.props.logoutUser}>
                  {' '}
                  LOGOUT{' '}
                </Link>{' '}
              </li>
            </Fragment>
          ) : (
            <Fragment>
              <li className='menuItem'>
                <Link to='/login'> LOGIN </Link>{' '}
              </li>
              <li className='menuItem'>
                <Link to='/register'> REGISTER </Link>{' '}
              </li>
            </Fragment>
          )}
        </ul>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { logoutUser }
)(Header);
