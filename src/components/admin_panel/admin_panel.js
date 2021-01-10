import axios from 'axios';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react'
import { Button, Icon, IconButton, Input, Modal, Notification, Panel, Tooltip, Whisper } from 'rsuite';
import emptySvg from '../../img/undraw_admin_empty.svg';
import './admin_panel.css'

export default function AdminPanel(props) {
    const { currentOrgId, props: componentProps } = props;
    const [emailToInvite, setEmailToInvite] = useState('');
    const [inviteUserLoading, setInviteUserLoading] = useState(false);
    const [invitedUserLink, setInvitedUserLink] = useState();
    const [showInviteUsersModal, setShowInviteUsersModal] = useState(false);
    const [flaggedPosts, setFlaggedPosts] = useState([]);
    // const [flaggedComments, setFlaggedComments] = useState([]);

    useEffect(() => {
        fetchFlaggedPost();
        // fetchFlaggedComment();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const inviteUser = () => {
        const authTokenFromLocalStorage = JSON.parse(window.localStorage.getItem('auth-token'));

        if (authTokenFromLocalStorage) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${authTokenFromLocalStorage}`;
            setInviteUserLoading(true)

            if (!emailToInvite) return Notification['error']({
                title: 'Invitation Error',
                description: 'Email Field is needed'
            })

            axios.post(`/org/${currentOrgId}/invite`, {
                email: emailToInvite
            })
                .then(function (response) {
                    setInviteUserLoading(false)
                    // handle success
                    if (response.status === 200) {
                        Notification['success']({
                            title: 'Invitivation Successful',
                            description: `You have invited ${emailToInvite}`
                        });
                        return setInvitedUserLink(response.data.data.inviteLink)
                    }
                })
                .catch(function (error) {
                    setInviteUserLoading(false)
                    if (error.message.indexOf('403') !== -1) {
                        Notification['error']({
                            title: 'Authentication Error',
                            description: 'You have to login'
                        });
                        setTimeout(() => {
                            componentProps.history.push('/auth/login')
                        }, 2000)
                    } else if (error.message.indexOf('Network Error') !== -1) {
                        Notification['warning']({
                            title: 'Network Error',
                            description: 'Looks Like you are not connected to the internet'
                        });
                    } else {
                        Notification['error']({
                            title: 'Task Error',
                            description: `${error.response.data.message} or has been invited`
                        });
                    }
                });
        } else {
            Notification['error']({
                title: 'Authentication Error',
                description: 'You have to login'
            });
            setTimeout(() => {
                componentProps.history.push('/auth/login')
            }, 2000)
        }
    }

    const fetchFlaggedPost = () =>{
        axios.get(`/post/${currentOrgId}/flagged`)
            .then(function (response) {
                // handle success
                if (response.status === 200) {
                    setFlaggedPosts(response.data.data)
                }
            })
            .catch(function (error) {
                // setInviteUserLoading(false)
                if (error.message.indexOf('403') !== -1) {
                    Notification['error']({
                        title: 'Authentication Error',
                        description: 'You have to login'
                    });
                    setTimeout(() => {
                        componentProps.history.push('/auth/login')
                    }, 2000)
                } else if (error.message.indexOf('Network Error') !== -1) {
                    Notification['warning']({
                        title: 'Network Error',
                        description: 'Looks Like you are not connected to the internet'
                    });
                } else {
                    Notification['error']({
                        title: 'Task Error',
                        description: `${error.response.data.message} or has been invited`
                    });
                }
            });
    }

    // const fetchFlaggedComment  = () => {
    //     axios.get(`/comment/${currentOrgId}/flagged`)
    //     .then(function (response) {
    //         console.log("flagged comment", { response })
    //         // setInviteUserLoading(false)
    //         // handle success
    //         if (response.status === 200) {
    //             setFlaggedComments(response.data.data);
    //             // Notification['success']({
    //             //     title: 'Success',
    //             //     description: `Flagged comment fetched Successful`
    //             // });
    //         }
    //     })
    //     .catch(function (error) {
    //         // setInviteUserLoading(false)
    //         if (error.message.indexOf('403') !== -1) {
    //             Notification['error']({
    //                 title: 'Authentication Error',
    //                 description: 'You have to login'
    //             });
    //             setTimeout(() => {
    //                 componentProps.history.push('/auth/login')
    //             }, 2000)
    //         } else if (error.message.indexOf('Network Error') !== -1) {
    //             Notification['warning']({
    //                 title: 'Network Error',
    //                 description: 'Looks Like you are not connected to the internet'
    //             });
    //         } else {
    //             Notification['error']({
    //                 title: 'Task Error',
    //                 description: `${error.response.data.message} or has been invited`
    //             });
    //         }
    //     });
    // }

    const handleDeletePost = (postId) => {
        axios.delete(`/post/${currentOrgId}/flagged/${postId}/delete`)
        .then(function (response) {
            console.log("Deleted Flagged Post", { response })
            // setInviteUserLoading(false)
            // handle success
            if (response.status === 200) {
                Notification['success']({
                    title: 'Success',
                    description: `Flagged post deleted Successful`
                });
            }
        })
        .catch(function (error) {
            // setInviteUserLoading(false)
            if (error.message.indexOf('403') !== -1) {
                Notification['error']({
                    title: 'Authentication Error',
                    description: 'You have to login'
                });
                setTimeout(() => {
                    componentProps.history.push('/auth/login')
                }, 2000)
            } else if (error.message.indexOf('Network Error') !== -1) {
                Notification['warning']({
                    title: 'Network Error',
                    description: 'Looks Like you are not connected to the internet'
                });
            } else {
                Notification['error']({
                    title: 'Task Error',
                    description: `${error.response.data.message} or has been invited`
                });
            }
        });
    }
    const goHome = () => {
        componentProps.history.push(props.props.match.url)
    }


    return (
        <div className="admin_container">
            <div className="top_nav">
                <div style={{ fontSize: '33px', cursor: 'pointer', backgroundColor: 'rgb(239 239 239)', color: '#160e1a' }} onClick={goHome}>
                    <Icon style={{ fontSize: '40px' }} icon="home" />
                </div>
                <IconButton onClick={setShowInviteUsersModal} style={{ backgroundColor: '#1a1417', color: '#d9d9d9' }} size="lg" icon={<Icon style={{ backgroundColor: '#1a1417' }} icon="plus" />}>Invite Members</IconButton>
            </div>

            {/* modal for inviting users */}
            <Modal backdrop={true} show={showInviteUsersModal} onHide={setShowInviteUsersModal}>
                <Modal.Header>
                    <Modal.Title>Invite Members</Modal.Title>
                    <div>Enter the email address of the member you want to invite</div>
                </Modal.Header>
                <Modal.Body>
                    <Whisper trigger="focus" speaker={<Tooltip>Required</Tooltip>}>
                        <Input onChange={(value) => {
                            setEmailToInvite(value)
                        }} style={{ width: '100%' }} placeholder="Email Address of the member" />
                    </Whisper>

                    {invitedUserLink && <div className="invite_link_container">
                        <h3>Invite Link</h3>
                        <a rel="noreferrer" target={'_blank'} href={`https://${invitedUserLink}`}>https://{window.location.host}{invitedUserLink}</a>
                    </div>}
                </Modal.Body>
                <Modal.Footer>
                    <Button loading={inviteUserLoading} onClick={() => inviteUser()} appearance="primary">
                        Invite
                    </Button>
                    <Button onClick={() => setShowInviteUsersModal(false)} appearance="subtle">
                        Cancel
                    </Button>
                </Modal.Footer>
            </Modal>

            <Panel header="Flagged Post" className="flagged_post_panel" collapsible bordered>
                <div className="flagged_post_container">

                    {flaggedPosts.length > 0 ?
                    flaggedPosts.map((post)=>
                        <div key={1} className="flagged_post">
                        <Icon className="warning_icon" icon="exclamation-circle"/>
                        <div className="poster_details">
                            <div className="poster_pics_and_name_container">
                                {post.profile_img ? 
                                <img alt="avatar" src={post.profile_img} /> :
                                 <img alt="avatar" src={`https://ui-avatars.com/api/?name=${post.firstname} ${post.lastname}`} />}
                                <div>
                                    <h5>{post.firstname} {post.lastname}</h5>
                                    <div className="post_time_and_privacy">{dayjs(post.createdat).fromNow()} <div className="dot"></div>{'public'}</div>
                                </div>
                            </div>
                        </div>

                        <div className="post_body">
                            {<p>{post.article}</p>}
                        </div>
                        {post.gif &&
                        <div className="post_gif_body">
                            <img src="https://cdn.dribbble.com/users/14268/screenshots/3244702/flip-flop.gif " alt="gif" />
                        </div> }
                        {/* <Link to={`${url}?post=${post.post_id || post.id}`}> */}
                        <div className="comment_count_container">
                            <img style={{ width: '24px', marginRight: '7px' }} src="https://img.icons8.com/doodle/48/000000/comments.png" alt="comment" />
                            <span className="comment_count">{post.comment_count}</span>
                        </div>

                        <Button onClick={() => handleDeletePost(post.post_id)} className="flagged_delete_btn" appearance="primary">Delete Post</Button>
                        {/* </Link> */}
                     </div>)
                    : <div style={{display: 'flex', justifyContent: 'center'}}>
                        <img src={emptySvg} alt="no data" width="30%"/>
                    </div>
                    }

                   </div>
            </Panel>



            <Panel header="Flagged Comments" className="flagged_post_panel" collapsible bordered>

                <div className="flagged_post_container">
                    {/* <div key={1} className="flagged_comment_container flagged_post">
                        <div className="poster_details">
                            <div className="poster_pics_and_name_container">
                            
                                <img alt="avatar" src={`https://ui-avatars.com/api/?name=Anani`} />
                                <div>
                                    <h5>Anani Tobi  </h5>
                                    <div className="post_time_and_privacy">{dayjs().fromNow()} <div className="dot"></div> {'public'}</div>
                                </div>
                            </div>
                        </div>

                        <div className="post_body">
                            {<p>Test Article !!!</p>}
                        </div>
                        <div className="post_gif_body flagged_comment_post_body">
                            <img src="https://cdn.dribbble.com/users/14268/screenshots/3244702/flip-flop.gif " alt="gif" />
                        </div>
                       <div className="flagged_comment">
                            <h5>Flagged Comment</h5>
                            <p>This is a sample comment</p>
                        </div>
                        <Button className="flagged_delete_btn" appearance="primary">Delete Comment</Button>
                    </div> */}

                    <img src={emptySvg} alt="no data" width="30%"/>
                </div>
            </Panel>
        </div>
    )
}
