import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { loginUser } from '../../actions/authActions';
import TextField from '../Layout/TextField';

import Logo from '../../images/eventhub-logo.png';
import M from 'materialize-css';

class Login extends Component {
  constructor() {
    super();
    this.state = {
      email: '',
      password: '',
      errors: {}
    };
  }

  componentWillMount() {
    if (this.props.match.params.email) {
      this.setState({ email: this.props.match.params.email });
    }
  }

  componentDidMount() {
    M.AutoInit();

    if (this.props.auth.isAuthenticated) {
      this.props.history.push('/dashboard');
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.auth.isAuthenticated) {
      this.props.history.push('/dashboard');
    }

    if (nextProps.errors) {
      this.setState({ errors: nextProps.errors });
    }
  }

  onChange = event => {
    this.setState({
      [event.target.name]: event.target.value
    });
  };

  onSubmit = event => {
    event.preventDefault();

    const userData = {
      email: this.state.email,
      password: this.state.password
    };

    this.props.loginUser(userData);
  };

  render() {
    const { email, password, errors } = this.state;
    const { feedback, loading } = this.props;

    return (
      <section className='loginForm box'>
        <div className='container'>
          <div className='row'>
            <div className='col s12'>
              <div className=''>
                <div className='center'>
                  <img className='logo-pg' alt='EventHub' src={Logo} />
                </div>

                <ul className='alert-box center'>
                  {feedback ? (
                    <li className='alert success-msg'> {feedback} </li>
                  ) : null}

                  {/* <li className='alert error-msg'> </li> */}
                </ul>

                <form id='login-register' noValidate onSubmit={this.onSubmit}>
                  <TextField
                    label='Email'
                    icon='account_box'
                    type='email'
                    name='email'
                    id='email'
                    value={email}
                    onChange={this.onChange}
                    error={errors.email}
                  />

                  <TextField
                    label='Password'
                    icon='lock_outline'
                    type='password'
                    name='password'
                    id='password'
                    value={password}
                    onChange={this.onChange}
                    error={errors.password}
                  />

                  {loading ? (
                    <div className='col s12'>
                      <div id='loadingElement' className='center'>
                        <div className='progress'>
                          <div className='indeterminate' />
                        </div>
                      </div>
                    </div>
                  ) : null}

                  <div className='right'>
                    <Link to='/register'>
                      <span> Don't have an account? </span>
                    </Link>
                  </div>

                  <div className='input-field col s12'>
                    <button
                      className='button-primary waves-effect waves-light'
                      type='submit'
                      id='register-btn-submit'
                    >
                      <span>Sign In</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }
}

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors,
  feedback: state.feedback,
  loading: state.loading
});

export default connect(
  mapStateToProps,
  { loginUser }
)(withRouter(Login));
