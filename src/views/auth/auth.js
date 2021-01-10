import React, {useEffect, useState } from 'react';
import LoginForm from '../../components/login_form/login_form';
import Logo from '../../components/logo/logo';
import SignupForm from '../../components/signup_form/signup_form';
import samji_illustrator from '../../img/samji_illustrator.jpeg';
import './auth.css';
import { useStateContext } from '../../context/state';
import { useQuery } from '../../components/useQueryHook/useQuery';




function Auth(props) {
    const state = useStateContext();
    const [authType, setAuthType] = useState('login');
    const query = useQuery()

    useEffect(()=>{
        console.log(state);
        if(props.match.params && props.match.params.type === 'login'){
            setAuthType('login');
        }else if(props.match.params && props.match.params.type === 'signup'){
            setAuthType('signup');
        }else{
            props.history.push('/auth/login')
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.match.params.type])

    return (
        <div className="auth_container">
            { (query.get('entrypoint') === 'invite'  && query.get('email') && query.get('inviteKey')) && query.get('org') ?
             <div>
                 {/* <h3>login and signup container from organization Invite</h3> */}
                 <div className="auth_nav"><Logo/></div>
                  <h4 style={{textAlign: 'center', fontSize: '33px'}}>{authType.toUpperCase()} To Join {query.get('org')}</h4>
                   {authType === 'login'
                    ? <div>
                        <LoginForm props={props} email={query.get('email')} redirect_to={`/accept/invite?email=${query.get('email')}&organizationID=${query.get('organizationID')}&org=${query.get('org')}&inviteKey=${query.get('inviteKey')}`}/>
                     </div>

                    :  <div>
                       <SignupForm props={props} email={query.get('email')} redirect_to={`/accept/invite?email=${query.get('email')}&organizationID=${query.get('organizationID')}&org=${query.get('org')}&inviteKey=${query.get('inviteKey')}`}/>
                     </div>
                   }
             </div>
             :
             <div className="second_design">
                <div className="first_section">
                    <div className="auth_nav"><Logo/></div>
                    {/* <h3>login and signup container from homepage, after login or signup
                        redirect to /me/organizations and tell the user to pick an organization to Join</h3> */}

                     {authType === 'login'
                        ? <div>
                            <LoginForm props={props} redirect_to="/user/organization"/>
                        </div>
                        :  <div className="signup_form_scroll">
                            <SignupForm props={props} redirect_to="/user/organization"/>
                        </div>
                    }
                </div>
                <div className="second_section">
                    <img width="800px" height="100%" src={samji_illustrator} alt=""/>
                </div>
             </div>
            }
        </div>
    )
}

export default Auth
