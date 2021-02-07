import React, { useEffect, useState } from 'react'
import { Link, useHistory } from 'react-router-dom';
import { Avatar, Button, Icon, IconButton, Loader, Notification, Tooltip, Whisper } from 'rsuite';
import Logo from '../../components/logo/logo'
import { useStateContext, useUpdateStateContext } from '../../context/state';
import facedoodle from '../../img/face_doodle.png';
import verifiedSvg from '../../img/verified.svg';
import emptySvg from '../../img/empty.svg';
import './view_organizations.css';
import CustomLoader from '../../components/loader/loader';
import { checkToken, fetch_all_org_for_logged_in_user } from '../../api_requests/api_request';
import { Helmet } from 'react-helmet';


function renderNotification(response){
  Notification[response.status]({
    title: response.title,
    description: response.description
  })
}

function ViewOrganizations(props) {
  const [loading, setLoading] = useState(false);
  const [fullPageLoading, setFullPageLoading] = useState({
    fullPageLoading: true,
    error: '',
    errorMessage: ''
  });
  const [updateState] = useUpdateStateContext();
  const [state] = useStateContext();
  const history = useHistory();

  const fetch_all_orgs = async () =>{
    setLoading(true)
    setFullPageLoading({
      fullPageLoading: true,
      error: ''
    })

    const response = await checkToken(fetch_all_org_for_logged_in_user);

    if(response.authError){
      renderNotification(response);
    return setTimeout(()=>{
      history.push('/auth/login')
    }, 2000)
    }
    else if(response.error){
      renderNotification(response);
     return setFullPageLoading({
        fullPageLoading: true,
        error: true,
        errorMessage: response.description
      })
    }

    setFullPageLoading({
      fullPageLoading: false,
      error: '',
      errorMessage: ''
    })
     if(response.data.data){
       updateState.setAllUserOrganization(response.data.data)
     }
     setTimeout(()=>{
        setLoading(false)
     }, 1000)
    }


  useEffect( () => {
    fetch_all_orgs()

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

return (
  <div className="view_organization_container">
     <Helmet>
            <title>{`${state.userDetails && state.userDetails.email} organizations || teamily`}</title>
    </Helmet>
    {fullPageLoading.fullPageLoading
      ? <CustomLoader errorMessage={fullPageLoading.errorMessage} error={fullPageLoading.error} />
      :
      <>
        <div className="view_org_nav"><Logo /></div>
        <div className="welcome_message_container">
          <span className="welcome_back_text">Welcome, </span>
          <span className="welcome-email">{state.userDetails && state.userDetails.email}</span>
        </div>

        <div className="all_org_container">
          <div className="tooltip_org_container">Organizations You Signed In</div>

          {loading
            ? <div className="loader_view_org_container"><Loader size="md" /></div>
            : (state.allUserOrganization.all_active_organization && state.allUserOrganization.all_active_organization.length)
              ?
              state.allUserOrganization.all_active_organization.map((org) => {
                return (
                  <div key={org.id} className="org">
                    {org.img ? <Avatar className="org_avatar" src={org.img} /> : <Avatar className="org_avatar" src={`https://ui-avatars.com/api/?name=${org.name}`} />}
                    {org.isprivate &&
                      <Whisper placement="topEnd" trigger="hover" speaker={<Tooltip>
                        Private
                              </Tooltip>}>
                        <Icon style={{ position: 'absolute', left: '29px', top: '20px', backgroundColor: '#fd9401', color: 'white', padding: '3px 5px', borderRadius: '15px' }} icon="lock" />
                      </Whisper>
                    }
                    <div className="org_details">
                      <div className="org_name"><span className="org_name_span">{org.name}</span> {org.is_verified && <img width="15px" style={{ position: 'absolute', top: '3px' }} alt="verified" src={verifiedSvg} />}</div>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <span className="org_description_span">{org.description}</span>
                      </div>
                    </div>
                    <Link to={`/organization/${org.id}`}>
                      <Whisper placement="topEnd" trigger="hover" speaker={<Tooltip>
                        Sign In to this organization
                              </Tooltip>}>
                        <IconButton className="launch_org_btn" size="lg" icon={<Icon size="lg" icon="arrow-circle-right" />}></IconButton>
                      </Whisper>
                    </Link>
                  </div>)
              })
              : <div style={{ textAlign: 'center', color: '#e6007e', padding: '33px' }}>
                <h5>You have not signed in to any organization</h5>
                <img width="70%" alt="empty" src={emptySvg} />
              </div>
          }

        </div>

        <div className="created_org">
          <Avatar className="created_org_avatar" src={facedoodle} />
          <div style={{ textAlign: 'center' }}>Want to have a new team? <br /> You can create an organization</div>
          <Link to="/organization/create"><Button className="create_org_btn">Create an organization</Button></Link>
        </div>

        <div className="pending_invite_text">Pending Invites</div>
        <div className="all_org_container">
          <div className="tooltip_org_container">Invitation for you</div>
          {loading
            ? <div className="loader_view_org_container"><Loader size="md" /></div>
            :
            Array.isArray(state.allUserOrganization.all_pending_org) ?
              state.allUserOrganization.all_pending_org.map((org) => {
                return (
                  <div className="org">
                    {org.img ? <Avatar className="org_avatar" src={org.img} />
                      : <Avatar className="org_avatar" src={`https://ui-avatars.com/api/?name=${org.name}`} />}
                    {org.isprivate &&
                      <Whisper placement="topEnd" trigger="hover" speaker={<Tooltip>
                        Private
                              </Tooltip>}>
                        <Icon style={{ position: 'absolute', left: '29px', top: '20px', backgroundColor: '#fd9401', color: 'white', padding: '3px 5px', borderRadius: '15px' }} icon="lock" />
                      </Whisper>
                    }
                    <div className="org_details">
                      <div className="org_name">{org.name} {org.is_verified && <img width="15px" style={{ position: 'absolute', top: '3px' }} alt="verified" src={verifiedSvg} />}</div>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <span className="org_description_span">{org.description}</span>
                      </div>
                    </div>
                    <Link to={`/accept/invite?email=${org.email}&organizationID=${org.id}&org=${org.name}&inviteKey=${org.invite_key}`}>
                      <Whisper placement="topEnd" trigger="hover" speaker={<Tooltip>
                        Accept Invitation to join this organization
                           </Tooltip>}>
                        <Button className="launch_org_btn" >Accept</Button>
                      </Whisper>
                    </Link>
                  </div>
                )
              }) : <div style={{ textAlign: 'center', color: '#e6007e', padding: '33px' }}>
                <h5>You have not been invited to any organization</h5>
                <img width="70%" alt="empty" src={emptySvg} />
              </div>
          }
        </div>
      </>
    }
  </div>
)
}

export default ViewOrganizations
