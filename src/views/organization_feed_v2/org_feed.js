import React, { useEffect, useState } from 'react'
import { Link, Route, Switch, useHistory, useLocation, useParams, useRouteMatch } from 'react-router-dom';
import { Alert, Avatar, Badge, Button, Container, Content, ControlLabel, Drawer, FormGroup, HelpBlock, Icon, IconButton, Input, InputGroup, Loader, Message, Modal, Sidebar, Tooltip, Whisper } from 'rsuite';
import { Scrollbars } from 'react-custom-scrollbars';
import { LetterAvatar } from '../../components/Avatar/avatar';
import Logo from '../../components/logo/logo';
import Channel from '../channel/channel';
import './org_feed.css';
import Thread from '../thread/thread';
import { useStateContext, useUpdateStateContext } from '../../context/state';
import { useQuery } from '../../components/useQueryHook/useQuery';
import Profile from '../profile/profile';
import { checkToken, create_channel, fetch_all_org_for_logged_in_user, fetch_current_org_details, invite_user } from '../../api_requests/api_request';
import CustomLoader from '../../components/loader/loader';
// import { io } from 'socket.io-client';
// import { socket } from '../../App';
import useCurrentWindowWidth from '../../components/useCurrentWindowWidth/useCurrentWindowWidth';
import { Helmet } from 'react-helmet';



function Org_feed() {
    const [state] = useStateContext();
    const [updateState] = useUpdateStateContext();
    let { path, url } = useRouteMatch();
    const { orgId } = useParams();
    const location = useLocation();
    const query = useQuery();
    const history = useHistory();
    const [orgDetails, setOrgDetails] = useState({})
    const [currentMember, setCurrentMember] = useState({});
    // const [onlineMembersInOrg, setOnlineMembersInOrg] = useState(0);
    const [channels, setChannels] = useState([]);
    const [OpenCreateChannelModal, setOpenCreateChannelModal] = useState(false);
    const [newChannelInputValue, setNewChannelInputValue] = useState('');
    const [isCreateChannelLoading, setCreateChannelLoading] = useState(false);
    const [showSideDrawerContent, setShowDrawerContent] = useState(false);
    const [currentWindowWidth] = useCurrentWindowWidth();
    const [openInvitationModal, setOpenInvitaionModal] = useState(false);
    const [apiError, setApiError] = useState(false);
    const [apiErrorMessage, setApiErrorMessage] = useState('')
    const [inviteUserValue, setInviteUserValue] = useState('');
    const [invitedUserLink, setInvitedUserLink] = useState('');
    const [inviteUserLoading, setInviteUserLoading] = useState(false);
    const [fullPageLoading, setFullPageLoading] = useState({
        isLoading: true,
        error: '',
        errorMessage: ''
    });

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

    const fetch_all_orgs = async () => {
        setFullPageLoading({
            isLoading: true,
            error: ''
        })

        const response = await checkToken(fetch_all_org_for_logged_in_user);
        if (response.error) {
            renderNotification(response);
            return setFullPageLoading({
                isLoading: true,
                error: true,
                errorMessage: response.description
            })
        }
        updateState.setAllUserOrganization(response.data.data)
    }


    const fetch_current_org = async () => {
        setFullPageLoading({ isLoading: true, error: false })

        const response = await checkToken(() => fetch_current_org_details(orgId));

        if (response.error) {
            renderNotification(response);
            return setFullPageLoading({
                isLoading: true,
                error: true,
                errorMessage: response.description
            })
        }

        if (response.data.data.currentUserMemberDetails[0] && response.data.data.orgDetails[0]) {
            setOrgDetails(response.data.data.orgDetails[0])
            setCurrentMember(response.data.data.currentUserMemberDetails[0])
            setChannels(response.data.data.channels)
            // socket.emit('join-organization', {
            //     orgId, userDetails: {
            //         firstname: response.data.data.currentUserMemberDetails[0].firstname,
            //         lastname: response.data.data.currentUserMemberDetails[0].lastname,
            //         user_id: response.data.data.currentUserMemberDetails[0].user_id
            //     }
            // });
            setFullPageLoading({ isLoading: false, error: false, errorMessage: '' })
        } else {
            history.push('/auth/login')
        }

    }

    const handleValidateNewChannelInput = (value) => {
        const valArr = value.split(' ');
        if (value[0] === '-') return
        setNewChannelInputValue(valArr.join('-'))
    }

    const handleCreateChannel = async () => {
        if (!newChannelInputValue) {
            return Alert.error('Input Cannot be empty', 2000)
        }
        else if (newChannelInputValue && !(/[^a-zA-Z0-9-]/.test(newChannelInputValue))) {
            setCreateChannelLoading(true)
            const response = await checkToken(() => create_channel(orgId, newChannelInputValue));
            if (response.error) {
                renderNotification(response);
                return setCreateChannelLoading(false)
            }
            setChannels([response.data.data, ...channels])
            setNewChannelInputValue('');
            setCreateChannelLoading(false)
            setOpenCreateChannelModal(false);
        } else {
            Alert.error('Only words are allowed', 5000)
        }
    }

    const handleInviteUser = async () => {
        let regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (!inviteUserValue) {
            return Alert.error('Email Field cannot be empty');
        } else if (!regex.test(inviteUserValue)) {
            return Alert.error('Invalid Email !');
        }
        setInviteUserLoading(true)

        const response = await checkToken(() => invite_user(orgId, inviteUserValue));

        if (response.error) {
            setInviteUserLoading(false)
            return renderNotification(response);
        }
        const linkArray = response.data.data.inviteLink.split(" ")
        setInviteUserLoading(false)
        setInviteUserValue('')
        return setInvitedUserLink(linkArray.join('%20'))
    }

    const handleLogout = () => {
        window.localStorage.removeItem('auth-token')
        window.location.href = '/auth/login'
    }

    useEffect(() => {
        fetch_all_orgs()
        fetch_current_org();
        // socket.on('online-members-count', (count) => {
        //     console.log("🚀 ~ file: org_feed.js ~ line 103 ~ socket.on ~ count", count)
        //     setOnlineMembersInOrg(count.count)
        // })
        // console.log({ socket })
        // return () => {
        //     console.log('leaving org ....');
        //     if(currentMember.id && orgId){
        //         socket.emit('leave-organization', { orgId, userId: currentMember.id });
        //     }
        // }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [orgId])

    const sideContent = () => {
        return (<>
            <div className="org_switch_div">
                <Helmet>
                    <title>organization || Teamily</title>
                </Helmet>
                {apiError && <Message style={{ zIndex: '1000000' }} full showIcon type="error" description={apiErrorMessage} />}
                <Logo removeLogoName={true} className="org_switch_logo" />
                <Scrollbars style={{ height: '558px' }} className="org_list">
                    {(state.allUserOrganization.all_active_organization && state.allUserOrganization.all_active_organization.length)
                        &&
                        state.allUserOrganization.all_active_organization.map((org, index) => {
                            return (
                                <>
                                    <Whisper
                                        trigger="hover"
                                        placement={"topStart"}
                                        speaker={<Tooltip>{org.name}</Tooltip>}>
                                        <div key={index} className='org_switch'>
                                            <Link onClick={() => setShowDrawerContent(false)} to={`/organization/${org.id}`}>
                                                {(org.org_img && !org.org_img === '{}') ? <Avatar className="org_avatar" src={org.org_img} /> : <LetterAvatar rounded={true} className="org_switch_profile_img switch_org_letter_avatar" letter={`${org.name}`} />}
                                            </Link>
                                        </div>
                                    </Whisper>
                                </>
                            )
                        })
                    }
                    <Link to="/organization/create">
                        <li className="create_org">
                            <svg className="create_org_svg w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                        </li>
                    </Link>
                </Scrollbars>

                <div className="user_profile">
                    <Link onClick={() => setShowDrawerContent(false)} to={`${location.pathname}?profile=${state.userDetails.id}`}>
                        <LetterAvatar letter={`${state.userDetails.firstname} ${state.userDetails.lastname}`} />
                        <Badge style={{
                            background: '#4caf50',
                            position: 'absolute',
                            bottom: '0',
                            right: '8px'
                        }} />
                    </Link>
                </div>
            </div>


            <Sidebar className="org_feed_sidebar">
                <div className="org_sidebar_dash_name ">
                    <Whisper placement="bottomStart" trigger="hover" speaker={<Tooltip>{orgDetails.name}</Tooltip>}>
                        <div className="org_dash_name org_feed_dash_name"><h5>{orgDetails.name}</h5></div>
                    </Whisper>
                    <div className="current_username">
                        <Badge style={{ background: '#4caf50', marginRight: '7px' }} /> <div className="dash_username">{state.userDetails.firstname} {state.userDetails.lastname}</div>
                    </div>
                </div>

                {/*channels arena  */}
                <div className="channels_container">
                    <div className="channel_title">
                        <h6>channels</h6>
                        <button className="add_channel_btn" onClick={() => setOpenCreateChannelModal(true)}><svg className="add_channel_svg w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg></button>
                    </div>

                    <Scrollbars style={{ height: '373px' }} className="channel_list_container">

                        {(channels && channels.length)
                            ?
                            channels.map((channel, index) => {
                                return (
                                    <>
                                        <Link onClick={() => setShowDrawerContent(false)} to={`${url}/channel/${channel.id}`}>
                                            <li key={index} className="channel_active">
                                                <span className="channel_hash">#</span>
                                                <Whisper trigger="hover" placement="right" speaker={<Tooltip>{channel.channel_name} </Tooltip>}>
                                                    <span className="org_channel_name">{channel.channel_name}</span>
                                                </Whisper>
                                            </li>
                                        </Link>
                                    </>
                                )
                            })
                            : <div style={{ textAlign: 'center', color: 'white' }}>No channel</div>
                        }

                    </Scrollbars>
                </div>

                <div className="invite_members_container">
                    {currentMember.isadmin && <Button onClick={() => setOpenInvitaionModal(true)}>Invite Members</Button>}
                    <Button color="red" style={{ marginTop: '5px' }} onClick={handleLogout}>Logout</Button>
                </div>
            </Sidebar>

        </>)
    }





    return (
        <div className="org_feed_container">
            { fullPageLoading.isLoading ? <CustomLoader errorMessage={fullPageLoading.errorMessage} error={fullPageLoading.error} /> :
                <Container className="org_feed_layout_container">


                    {currentWindowWidth > 800 ? sideContent() :
                        <>
                            <IconButton style={{ top: '0px' }} className="mobile_nav_bar" onClick={() => setShowDrawerContent(true)} icon={<Icon icon="bars" />}>Organization Menu</IconButton>
                            <Drawer className="mobile_sidebar_drawer" placement="left" show={showSideDrawerContent} onHide={() => setShowDrawerContent(false)}>
                                {/* <Drawer.Body> */}
                                {sideContent()}
                                {/* </Drawer.Body> */}

                            </Drawer>
                        </>
                    }



                    <Container className="org_content_container">
                        <Content className="org_content_feed">
                            <div style={{ width: '100%' }}>
                                <Switch>
                                    <Route exact path={path}>
                                        <div className="intro_org_container" style={{ height: '100%', width: '100%' }}>
                                            <div style={{ width: ' 100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>

                                                {(orgDetails && orgDetails.header_img) && <img style={{ width: '100%', height: '280px' }} src={orgDetails.header_img} alt="growth" />}

                                                <h1 className="org_welcome_text" style={{ textAlign: 'center' }}>
                                                    Welcome To &nbsp;{orgDetails.name}
                                                </h1>
                                                <h3 style={{ textAlign: 'center', fontSize: '20px' }}>Channels are where your team communicates.</h3>
                                            </div>

                                            {(channels && channels.length >= 1) && <div style={{ textAlign: 'center', fontSize: '19px' }}>Here are the list of avaliable channels, click on a channel to start communicating with your team</div>}
                                            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
                                                {(channels && channels.length >= 1)
                                                    ? channels.map((channel, index) => {
                                                        return (
                                                            <>
                                                                <Link style={{ margin: '5px' }} to={`${url}/channel/${channel.id}`}>
                                                                    <span style={{ display: 'flex', fontSize: '20px' }} key={index}>
                                                                        <span className="channel_hash">#</span>
                                                                        <span style={{ fontSize: '20px' }} >{channel.channel_name} </span>
                                                                    </span>
                                                                </Link>
                                                            </>
                                                        )
                                                    })
                                                    : <Button onClick={() => setOpenCreateChannelModal(true)}>Create a channel</Button>
                                                }</div>
                                        </div>
                                    </Route>
                                    <Route path={`${path}/channel/:channelId`}>
                                        <Channel org_members={orgDetails.org_members} orgId={orgId} />
                                    </Route>

                                </Switch>
                            </div>

                            <Thread threadId={query.get('thread')} />
                            <Profile profileId={query.get('profile')} />
                        </Content>
                    </Container>

                    {/* create channel modal */}
                    <Modal className="create_channel_modal" overflow={true} show={OpenCreateChannelModal} onHide={() => setOpenCreateChannelModal(false)}>
                        {isCreateChannelLoading && <Loader style={{ zIndex: 10, backgroundColor: "#e6007e" }} backdrop content="creating channel   please wait ......." vertical />}
                        <Modal.Header>
                            <Modal.Title style={{ fontSize: '30px' }}>Create Channel</Modal.Title>
                        </Modal.Header>
                        <h5>Channels are where your team communicates. They’re best when organized around a topic — #marketing, for example</h5>
                        <Modal.Body>
                            <Input value={newChannelInputValue} onChange={handleValidateNewChannelInput} placeholder="Channel Name" />
                        </Modal.Body>
                        <Modal.Footer>
                            <Button onClick={handleCreateChannel} appearance="primary">
                                Create Channel
                            </Button>
                            <Button onClick={() => setOpenCreateChannelModal(false)} appearance="subtle">
                                Cancel
                             </Button>
                        </Modal.Footer>
                    </Modal>

                    {/* Drawer for inviting users */}
                    <Drawer
                        size={"xs"}
                        placement="bottom"
                        show={openInvitationModal}
                        className="invitation_modal"
                        onHide={() => setOpenInvitaionModal(false)}
                    >
                        {inviteUserLoading && <Loader backdrop style={{ zIndex: '4' }} content="Inviting user please wait....." vertical />}
                        <Drawer.Header>
                            <Drawer.Title>Invite Members</Drawer.Title>
                        </Drawer.Header>
                        <Drawer.Body>
                            <FormGroup>
                                <ControlLabel>Email</ControlLabel>
                                <InputGroup>
                                    <InputGroup.Addon> @</InputGroup.Addon>
                                    <Input value={inviteUserValue} onChange={(e) => setInviteUserValue(e)} placeholder="Email of the user" />
                                    <HelpBlock tooltip style={{ marginRight: '5px' }}>Required</HelpBlock>
                                </InputGroup>
                            </FormGroup>
                            {invitedUserLink && <div className="invite_link_container">
                                <h3>Invite Link</h3>
                                <a rel="noreferrer" target={'_blank'} href={`https://${window.location.host}${invitedUserLink}`}>https://{window.location.host}{invitedUserLink}</a>
                                <div>An Invitation message has been sent to the user, you can also copy this link and send it to the user</div>
                            </div>}
                        </Drawer.Body>
                        <Drawer.Footer>
                            <Button onClick={handleInviteUser} appearance="primary">
                                send Invitation
                            </Button>
                            <Button onClick={() => setOpenInvitaionModal(false)} appearance="subtle">
                                Cancel
                            </Button>
                        </Drawer.Footer>
                    </Drawer>
                </Container>
            }
        </div>
    )
}

export default Org_feed;
