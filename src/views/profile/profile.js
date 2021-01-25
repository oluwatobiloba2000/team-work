import React, { useEffect, useState } from 'react'
import { useHistory, useLocation } from 'react-router-dom';
import { List, Message, Tooltip, Whisper } from 'rsuite';
import { useStateContext } from '../../context/state';
import { LetterAvatar } from '../../components/Avatar/avatar';
import './profile.css';
import { checkToken, fetch_current_loggedin_user } from '../../api_requests/api_request';
import { Helmet } from 'react-helmet';

export default function Profile(props) {
    const { profileId } = props;
    const [state] = useStateContext();
    const history = useHistory();
    // const {url, path}= useRouteMatch();
    const location = useLocation();
    // const [loading, setLoading] = useState(false);
    const [apiError, setApiError] = useState(false);
    const [apiErrorMessage, setApiErrorMessage] = useState('')
    const [profile, setProfile] = useState({
        id: '',
        username: '',
        profile_img: '',
        email: '',
        firstname: '',
        lastname: '',
        gender: '',
        createdat: '',
        is_owner_profile: ''
    })

    function renderNotification(response) {
        setApiError(true);
        setApiErrorMessage(response.detailedError ? response.detailedError : response.description);
        setTimeout(() => {
            setApiError(false)
        }, 3000)
        if (response.authError) {
            return setTimeout(() => {
                history.push('/auth/login')
            }, 1000)
        }
        return;
    }


    const fetch_user_profile = async () =>{
        const response = await checkToken(()=> fetch_current_loggedin_user(profileId));
        if (response.error) {
           return renderNotification(response);
        }
        if(response && response.data.data[0])
        setProfile({
            username: response.data.data[0].username,
            profile_img: response.data.data[0].profile_img,
            firstname: response.data.data[0].firstname,
            lastname: response.data.data[0].lastname,
            createdat: response.data.data[0].createdat,
            is_owner_profile: false
        })
    }


    useEffect(() => {
        if (state.userDetails && profileId === state.userDetails.id) {
            setProfile({
                id: state.userDetails.id,
                username: state.userDetails.username,
                profile_img: state.userDetails.profile_img,
                email: state.userDetails.email,
                firstname: state.userDetails.firstname,
                lastname: state.userDetails.lastname,
                gender: state.userDetails.gender,
                createdat: state.userDetails.createdat,
                is_owner_profile: true
            })
        }else{
            if(profileId){
                fetch_user_profile()
            }
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [profileId])

    return (
        <>
            {profileId &&
                <div className="profile_wrapper" style={{ width: '425px', height: '100%', borderLeft: '1px solid #80808080' }}>
                     <Helmet>
                        <title>{profile.firstname} {profile.lastname} profile || Teamily</title>
                    </Helmet>
                    {apiError && <Message type="error" description={apiErrorMessage ? apiErrorMessage : 'Something went wrong'} />}
                    <div className="profile_header">
                        <div>
                            <h5>Profile</h5>
                        </div>
                        <Whisper
                            trigger="hover"
                            placement={"autoVerticalEnd"}
                            speaker={<Tooltip>
                                Close
                              </Tooltip>}>
                            <button className="close_profile_btn" onClick={() => history.push(location.pathname)}>
                                <svg width="20px" className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </Whisper>

                    </div>
                    <div className="profile_pics_container">
                        <LetterAvatar className="profile_letter_view" letter={`${profile.firstname} ${profile.lastname}`} />
                    </div>
                    <div className="user_name">
                        <span className="profile_view_username">
                            {profile.firstname} {profile.lastname}
                        </span>

                       {profile.is_owner_profile && <Whisper
                            trigger="hover"
                            placement={"autoVerticalEnd"}
                            speaker={<Tooltip>
                                Edit Profile
                              </Tooltip>}>
                            <span className="edit_profile_btn">
                                <svg width="30px" className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                            </span>
                        </Whisper>}
                    </div>

                    <div className="other_details">
                        <List className="other_details_list" hover>
                            <List.Item key={3} index={3}>
                                <h5 style={{ fontWeight: 'bolder' }}>Username</h5>
                                <p style={{fontWeight: 'bolder', color: 'black', marginTop: '7px'}}>@{profile.username}</p>
                            </List.Item>
                            <List.Item key={1} index={1}>
                                <h5 style={{ fontWeight: 'bolder' }}>Display Name</h5>
                                <p>{profile.firstname} {profile.lastname}</p>
                            </List.Item>
                            {profile.email && <List.Item key={2} index={2}>
                                <h5 style={{ fontWeight: 'bolder' }}>Email Address</h5>
                                <p>{profile.email}</p>
                            </List.Item>}
                        </List>
                    </div>

                </div>
            }
        </>
    )
}
