import React, { useEffect, useState } from 'react'
import './organization_feed.css';
import { Container, Header, Content, Sidebar, Placeholder, Whisper, Tooltip, Avatar, Icon, Badge, Modal, Button, Panel, Notification, Dropdown } from 'rsuite';
import Logo from '../../components/logo/logo';
import CustomLoader from '../../components/loader/loader';
import verifiedSvg from '../../img/verified.svg';
import { Route, Switch, useParams, useRouteMatch } from 'react-router-dom';
import axios from 'axios';
import AdminPanel from '../../components/admin_panel/admin_panel';
import Posts from '../../components/posts/posts';
const { Paragraph } = Placeholder;


export default function OrganizationFeed(props) {
    const { orgId } = useParams();
    const {url} = useRouteMatch();
    const [loading, setFullPageLoading] = useState({
        error: '',
        fullPageLoading: false
    });
    const [modalProfileView, setHandleModalProfileView] = useState(false);
    const [userAccount, setUserAccountDetails] = useState([])

    const [orgDetails, setOrgDetails] = useState([])
    const [currentUserMemberDetailsState, setCurrentUserMemberDetails] = useState([])

    function getUserAccount() {
        return axios.get('/user');
    }


    function getOrganizationDetails() {
        return axios.get(`/org/${orgId}/details`);
    }

    const authTokenFromLocalStorage = JSON.parse(window.localStorage.getItem('auth-token'));
    useEffect(() => {
        setFullPageLoading({
            fullPageLoading: true,
            error: ''
        })
        if (authTokenFromLocalStorage) {
            // setLoading(true)
            axios.defaults.headers.common['Authorization'] = `Bearer ${authTokenFromLocalStorage}`;
            Promise.all([getUserAccount(), getOrganizationDetails()])
                .then(function (results) {
                    const userAccount = results[0].data.data[0];
                    // const orgPostFeed = results[1];
                    const orgDetails = results[1].data.data.orgDetails[0];
                    const currentUserMemberDetails = results[1].data.data.currentUserMemberDetails[0];
                    console.log({ userAccount, orgDetails })

                    setUserAccountDetails(userAccount);
                    setOrgDetails(orgDetails);
                    setCurrentUserMemberDetails(currentUserMemberDetails)
                    setFullPageLoading({
                        fullPageLoading: false,
                        error: ''
                    })
                })
                .catch((error) => {
                 console.log(error);
                })

        } else {
            Notification['error']({
                title: 'Authentication Error',
                description: 'You have to login'
            });
            setTimeout(() => {
                props.history.push('/auth/login')
            }, 2000)
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [orgId])

    return (
        <Container className="create_organization_container">
            {loading.fullPageLoading ? <CustomLoader error={loading.error} /> :
            <>
            <Header className="header feed_header">
                <Logo className="org_logo" />

                <div className="org_lists"></div>

                <div className="current_logged_user_panel">
                    <Dropdown
                        placement="bottomEnd"
                        renderTitle={() => {
                            return (<Avatar
                                style={{ cursor: 'pointer' }}
                                circle
                                src={userAccount.profile_img
                                    ? userAccount.profile_img
                                    : `https://ui-avatars.com/api/?name=${userAccount.firstname} ${userAccount.lastname}`}
                            />);
                        }}
                    >
                        <Dropdown.Item panel style={{ padding: 10 }}>
                            <p>Signed in as</p>
                            <strong>{userAccount.email}</strong>
                        </Dropdown.Item>
                        <Dropdown.Item divider />
                        <Dropdown.Item onClick={() => setHandleModalProfileView(true)}>Your profile</Dropdown.Item>
                        <Dropdown.Item onClick={()=> window.location.href = '/user/organization'}>Your organizations</Dropdown.Item>
                        <Dropdown.Item>Edit profile</Dropdown.Item>
                        {currentUserMemberDetailsState.isadmin && <Dropdown.Item onClick={ () => props.history.push(`${url}/admin`)}>Admin Panel</Dropdown.Item>}
                        <Dropdown.Item divider />
                        <Dropdown.Item className="dropdown_signout">Sign out</Dropdown.Item>
                    </Dropdown>

                    {/* profile details modal */}
                    <Modal show={modalProfileView} onHide={() => setHandleModalProfileView(false)}>
                        <Modal.Header>
                            <Modal.Title>Your profile</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            {orgDetails ?
                                <Panel shaded bordered bodyFill style={{ display: 'block', width: '100%' }}>
                                    <img src={userAccount.profile_img
                                        ? userAccount.profile_img
                                        : `https://ui-avatars.com/api/?name=${userAccount.firstname} ${userAccount.lastname}`} alt="profile" height="155" />
                                    <Panel header={`Details`}>
                                        <p>
                                            <h5>Name</h5>
                                            <div>{userAccount.firstname} {userAccount.lastname}</div>
                                        </p>
                                        <p>
                                            <h5>Email</h5>
                                            <div>{userAccount.email}</div>
                                        </p>
                                    </Panel>
                                </Panel> :
                                <Paragraph />
                            }
                        </Modal.Body>
                        <Modal.Footer>
                            <Button appearance="primary">
                                Edit
                           </Button>
                            <Button onClick={() => setHandleModalProfileView(false)} appearance="subtle">
                                Cancel
                           </Button>
                        </Modal.Footer>
                    </Modal>
                </div>
            </Header>

            <Container>
                <Sidebar className="org_sidebar">
                    <div className="org_dash_name">
                        {orgDetails.name
                            ? <Whisper placement="top" trigger="hover" speaker={<Tooltip>{orgDetails.name}</Tooltip>}>
                                <p style={{ position: 'relative', cursor: 'pointer' }}>{orgDetails.name} </p>
                            </Whisper>
                            : <Paragraph className="org_dash_name_loader" rows={1} />
                        }
                    </div>

                    <div style={{ backgroundImage: `url(${orgDetails.header_img})`, backgroundSize: "100% 100%" }} className="org_dash_panel_details">
                        {orgDetails.is_verified && <img width="15px" className="verified_svg" alt="verified" src={verifiedSvg} />}
                        {orgDetails.org_img ? <Avatar className="org_profile_img org_profile_img_rounded" src={orgDetails.org_img} size="lg" />
                            :
                            <Avatar className="org_profile_img" src={`https://ui-avatars.com/api/?name=${orgDetails.name}`} style={{ marginTop: 30 }} />}
                        {orgDetails.isprivate ? <Icon className="privacy_icon" icon="lock" /> : <Icon className="privacy_icon privacy_globe" icon="globe2" />}
                        {/* {console.log({ private: formValues.isPrivate })} */}
                    </div>

                    <div className="org_dash_description">
                        <p>Description</p>
                        {orgDetails.description
                            ? <div className="org_dash_description_text">{orgDetails.description}</div>
                            :
                            <Paragraph className="org_dash_name_loader" rows={3} />
                        }
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', marginTop: '35px' }}>
                        <p style={{ marginBottom: '19px', fontWeight: 'bold', color: 'white' }}>Members</p>
                        <Badge content={`${orgDetails.org_members}`}>
                            <Avatar style={{ backgroundColor: '#62s829a' }}>
                                <Icon icon={'user-o'} />
                            </Avatar>
                        </Badge>
                    </div>

                    { currentUserMemberDetailsState.isadmin &&
                    <div style={{display: 'flex', justifyContent: 'center', marginTop: '20px'}}>
                        <Badge content={false}>
                            <Button>You are an Admin</Button>
                        </Badge>
                    </div>}
                </Sidebar>

                <Content className="org_content">
                        {/* SINGLE POSTS  */}
                        <Switch>
                            <Route exact path={`${url}`} >
                                <Posts props={props} url={url} userAccount={userAccount} currentOrgId={orgId}/>
                            </Route>
                            <Route path={`${url}/admin`} >
                                <AdminPanel props={props} url={url} userAccount={userAccount} currentOrgId={orgId} />
                            </Route>
                        </Switch>

                </Content>
            </Container>
            </>}
        </Container>
    )
}
