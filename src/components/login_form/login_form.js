import axios from 'axios';
import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { Form, FormGroup, FormControl, ControlLabel, Schema, ButtonToolbar, Button, Notification } from 'rsuite';
import { useUpdateStateContext } from '../../context/state';
import { useQuery } from '../useQueryHook/useQuery';
import './login_form.css';

function TextField(props) {

  const { name, label, accepter, ...rest } = props;
  return (
    <FormGroup>
      <ControlLabel>{label} </ControlLabel>
      <FormControl name={name} accepter={accepter} {...rest} />
    </FormGroup>
  );
}

function LoginForm(props) {
  const { StringType } = Schema.Types;
  const model = Schema.Model({
    password: StringType()
      .isRequired('Password is required.')
      .minLength(4, "Password Length should more than 4 characters long"),
    email: props.email ? null : (StringType()
      .isEmail('Please enter a valid email address.')
      .isRequired('This field is required.'))
  });

  const [updateState] = useUpdateStateContext();
  const [loading, setLoading] = useState(false);
  const [formValues, setFormValues] = useState({
    email: '',
    password: ''
  })

  const query = useQuery()
  const urlOrganizationID = query.get('organizationID');
  const urlOrgName = query.get('org');
  const urlInviteKey = query.get('inviteKey');

  const handleSubmit = (data) => {
    if (data) {
      setLoading(true);
      axios.post('/login', formValues)
        .then(function (response) {
          setLoading(false)
          if (response.data.code === 200) {
            Notification['success']({
              title: 'Login Success',
              description: 'You have successfully Logged In'
            });
            updateState.setLoginDetails({
              is_current_user_logged_in: true
            })
            updateState.setUserDetails(response.data.user);
            window.localStorage.setItem('auth-token', JSON.stringify(response.data.token));
            axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
            setTimeout(() => {
              props.props.history.push(`${props.redirect_to}`);
            }, 3000)
          }
        })
        .catch(function (error) {
          setLoading(false)
          if (error.message.indexOf('403') !== -1) {
            Notification['error']({
              title: 'Login Error',
              description: 'Incorrect Username Or Password'
            });
          } else if (error.message.indexOf('Network Error') !== -1) {
            Notification['warning']({
              title: 'Network Error',
              description: 'Looks Like you are not connected to the internet'
            });
          } else {
            Notification['warning']({
              title: 'Server Error',
              description: 'Something went wrong'
            });
          }
        });
    }
  }

  return (
    <div className="login_form_container">
      <Helmet>
        <title>Login || Teamily</title>
      </Helmet>
      <div style={{ textAlign: 'center', fontSize: '40px' }}>Login</div>
      <Form onSubmit={handleSubmit} onChange={(values) => setFormValues({ email: props.email ? props.email : values.email, password: values.password })} model={model}>
        <TextField name="email" type="email" readOnly={props.email ? true : false} value={props.email} label="Email" />
        <TextField name="password" type="password" label="Password" />
        <ButtonToolbar style={{ display: 'flex', justifyContent: 'center' }}>
          <Button loading={loading} style={{ width: '300px', background: ' #160e1a' }} appearance="primary" type="submit">Submit</Button>
        </ButtonToolbar>
      </Form>
      <div className="auth_link"><h5>Dont have an account?</h5><Link to={props.email ? `/auth/signup?entrypoint=invite&email=${props.email}&organizationID=${urlOrganizationID}&org=${urlOrgName}&inviteKey=${urlInviteKey}` : '/auth/signup'}>create an account</Link></div>
    </div>
  )
}

export default LoginForm
