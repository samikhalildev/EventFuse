import React, { Component } from 'react';
import Logo from '../../images/eventhub-logo.png';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { registerUser } from '../../actions/authActions';
import TextField from '../Layout/TextField';

class Register extends Component {
  constructor() {
    super();
    this.state = {
      name: '',
      email: '',
      password: '',
      password2: '',
      errors: {}
    };
  }

  componentDidMount() {
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

  // This method gets called when a user submits
  onSubmit = event => {
    event.preventDefault();

    const newUser = {
      name: this.state.name,
      email: this.state.email,
      password: this.state.password,
      password2: this.state.password2
    };
    this.props.registerUser(newUser, this.props.history);
  };

  render() {
    const { name, email, password, password2, errors } = this.state;
    const { loading } = this.props;

    return (
      <section class='loginForm box'>
        <div class='container'>
          <div class='row'>
            <div class='col s12'>
              <div class=''>
                <div class='center'>
                  <img className='logo-pg' alt='EventHub' src={Logo} />
                </div>

                <form id='login-register' noValidate onSubmit={this.onSubmit}>
                  <TextField
                    label='Name'
                    icon='sentiment_very_satisfied'
                    type='text'
                    name='name'
                    id='name'
                    value={name}
                    onChange={this.onChange}
                    error={errors.name}
                  />

                  <TextField
                    label='Email'
                    icon='email'
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
                    info='Password must be atleast 6 characters.'
                  />

                  <TextField
                    label='Confirm Password'
                    icon='lock_outline'
                    type='password'
                    name='password2'
                    id='password2'
                    value={password2}
                    onChange={this.onChange}
                    error={errors.password2}
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

                  <div class='input-field col s12 left'>
                    <button
                      class='waves-effect waves-light button-secondary'
                      type='submit'
                      id='register-btn-submit'
                    >
                      <span>Sign Up</span>
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
  loading: state.loading
});

export default connect(
  mapStateToProps,
  { registerUser }
)(withRouter(Register));
