import axios from 'axios';
import React, { useState } from 'react';
import {Link} from 'react-router-dom';
import { Form, FormGroup, FormControl, ControlLabel, Schema , InputPicker, ButtonToolbar, Button, Notification, HelpBlock} from 'rsuite';
import { useUpdateStateContext } from '../../context/state';
import { useQuery } from '../useQueryHook/useQuery';
import './signup_form.css';

const { StringType } = Schema.Types;

function TextField(props) {
  const { name, label, accepter, ...rest } = props;
  return (
    <FormGroup>
      <ControlLabel>{label} </ControlLabel>
      <FormControl name={name} accepter={accepter} {...rest} />
    </FormGroup>
  );
}


function SignupForm(props) {
  const model = Schema.Model({
    password: StringType()
              .isRequired('Password is required.')
              .minLength(4, "Password Length should more than 4 characters long"),
    email: props.email ? null : StringType()
      .isEmail('Please enter a valid email address.')
      .isRequired('Email is required.'),
    firstname: StringType()
      .isRequired('Firstname is required.'),
    username: StringType()
      .isRequired('Username is required.'),
    lastname: StringType()
      .isRequired('Lastname is required.'),
    address: StringType()
      .isRequired('Address is required.')
  });

  const [updateState] =  useUpdateStateContext();
  const [genderError, setGenderError] = useState(false)
  const [loading, setLoading] = useState(false);
   const [formValues, setFormValues] = useState({
        email: '',
        username: '',
        firstname: '',
        lastname: '',
        address: '',
        gender: '',
        password: ''
    })

    const query = useQuery()
    const urlOrganizationID = query.get('organizationID');
    const urlOrgName = query.get('org');
    const urlInviteKey = query.get('inviteKey');

   const handleSubmit = (data)=>{
     if(!formValues.gender) return setGenderError(true);
     if(data){
       setGenderError(false)
       setLoading(true);
         axios.post('/signup', formValues)
         .then(function (response) {
           setLoading(false)
           if(response.data.message === 'user created successfully'){
             Notification['success']({
               title: 'Signup Success',
               description: 'You have successfully Signed Up'
             });
             updateState.setLoginDetails({
               is_current_user_logged_in: true
             })
             updateState.setUserDetails(response.data.user);
             window.localStorage.setItem('auth-token', JSON.stringify(response.data.token));
             setTimeout(()=>{
                   props.props.history.push(`${props.redirect_to}`);
             }, 3000)
           }
         })
         .catch(function (error) {
           setLoading(false)
           if(error.response && error.response.data.message === "email already taken"){
           return Notification['error']({
              title: 'Sigup Error',
              description: 'Email already taken'
            });
          }else if(error.response && error.response.data.message === "username already taken"){
            return Notification['error']({
              title: 'Sigup Error',
              description: 'username already taken'
            });
          }else if(error.message.indexOf('Network Error') !== -1){
              return Notification['warning']({
                 title: 'Network Error',
                 description: 'Looks Like you are not connected to the internet'
               });
           }else{
             return Notification['warning']({
               title: 'Server Error',
               description: 'Something went wrong'
             });
           }
         });
     }
    }

    return (
        <div className="signup_form_container">
             <div className="header_signup_text" style={{textAlign: 'center', fontSize: '40px'}}>Create An Account</div>
         <Form onChange={(values)=> setFormValues({ email: props.email ? props.email : values.email, gender: formValues.gender, ...values})} onSubmit={handleSubmit} model={model}>
            <TextField type="text" name="username" label="username"  />
            <TextField name="email" type="email" readOnly={props.email ? true : false} value={props.email && props.email} label="Email" />
            <TextField name="firstname" label="Firstname" />
            <TextField name="lastname" label="Lastname" />
            <TextField name="address" label="Address" />
            <TextField name="password" type="password" label="Password" />
            <FormGroup>
                <ControlLabel>Gender</ControlLabel>
                <InputPicker onSelect={(val)=> setFormValues({...formValues, gender: val})} name="gender" data={[{
                     value: 'male',
                     label: 'male',
                     groupBy: 'gender'
                },{
                    value: 'female',
                    label: 'female',
                    groupBy: 'gender'
               },
                ]}  style={{width: "100%"}}/>
                {genderError && <HelpBlock style={{color : 'red'}}>Gender is Required</HelpBlock>}
            </FormGroup>
            <ButtonToolbar style={{display: 'flex', justifyContent: 'center'}}>
                <Button loading={loading} style={{borderTopLeftRadius: '20px', borderBottomLeftRadius: '20px',
             borderTopRightRadius: '20px', width: '300px', background:' #160e1a'}} appearance="primary" type="submit">Submit</Button>
            </ButtonToolbar>
        </Form>
        <div classNamke="auth_link"><h5>Already have an account?</h5><Link to={props.email ? `/auth/login?entrypoint=invite&email=${props.email}&organizationID=${urlOrganizationID}&org=${urlOrgName}&inviteKey=${urlInviteKey}` : '/auth/login'}>login</Link></div>
        </div>
    )
}

export default SignupForm
