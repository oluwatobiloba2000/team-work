import axios from 'axios';
import React, { useEffect, useState } from 'react';
// import { Redirect, useParams } from 'react-router-dom';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { Button, Icon, Input, InputGroup, Loader, Modal, Notification } from 'rsuite';
import { useQuery } from '../useQueryHook/useQuery';
// import { Scrollbars } from 'react-custom-scrollbars';
import './view_post.css';
dayjs.extend(relativeTime);

function ViewPost(props) {
    // const { props: propsFromParent, currentOrgId } = props;
    const [open, setOpen] = useState(false);
    const [post, setPost] = useState({});
    const [comment, setComment] = useState([]);
    // const [commentCount, setCommentCount] = useState(0);
    const [loadingPost, setLoadingPost] = useState(false);
    const [commentInputValue, setCommentInputValue] = useState('');
    const [loadingComments, setLoadingComments] = useState(false);
    const query = useQuery();

    const postId = query.get('post');

    useEffect(() => {
        if (postId) {
            setOpen(true)
            fetchSinglePost()
        } else {
            setOpen(false)
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props, postId])

    const handleClose = () => {
        setOpen(false)
        props.props.props.history.push(props.props.props.url)
    }

    const fetchCommments = () => {
        setLoadingComments(true)
        axios.get(`/comment/${postId}/all`)
            .then(function (response) {

                setComment(response.data.data)
                return setLoadingComments(false)
                // handle success
                // if (response.status === 200) {
                //     return 
                // }
            })
            .catch(function (error) {
                setLoadingComments(false)
                // if (error.message.indexOf('403') !== -1) {
                //     Notification['error']({
                //         title: 'Authentication Error',
                //         description: 'You have to login'
                //     });
                //     setTimeout(() => {
                //         props.history.push('/auth/login')
                //     }, 2000)
                // } else 
                if (error.message.indexOf('Network Error') !== -1) {
                    Notification['warning']({
                        title: 'Network Error',
                        description: 'Looks Like you are not connected to the internet'
                    });
                } else {
                    Notification['error']({
                        title: 'Task Error',
                        description: `${error.response.data.message}`
                    });
                }
            })
    }

    const fetchSinglePost = () => {
        setLoadingPost(true)
        axios.get(`/post/${postId}`)
            .then(function (response) {
                setPost(response.data.data.comentCount.count);
                setPost(response.data.data.post[0]);
                fetchCommments();
                return setLoadingPost(false)
                // handle success
                // if (response.status === 200) {
                //     return 
                // }
            })
            .catch(function (error) {
                setLoadingPost(false)
                // if (error.message.indexOf('403') !== -1) {
                //     Notification['error']({
                //         title: 'Authentication Error',
                //         description: 'You have to login'
                //     });
                //     setTimeout(() => {
                //         props.history.push('/auth/login')
                //     }, 2000)
                // } else
                if (error.message.indexOf('Network Error') !== -1) {
                    Notification['warning']({
                        title: 'Network Error',
                        description: 'Looks Like you are not connected to the internet'
                    });
                } else {
                    Notification['error']({
                        title: 'Task Error',
                        description: `something went wrong`
                    });
                }
            })
    }

    const handlePostComment = () => {
        setLoadingComments(true)
        axios.post(`/comment/${postId}/create`, {
            comment: commentInputValue
        })
            .then(function (response) {
                setCommentInputValue('')
                return fetchCommments();
                // return setLoa(false)
                // handle success
                // if (response.status === 200) {
                //     return 
                // }
            })
            .catch(function (error) {
                setLoadingComments(false)
                // if (error.message.indexOf('403') !== -1) {
                //     Notification['error']({
                //         title: 'Authentication Error',
                //         description: 'You have to login'
                //     });
                //     setTimeout(() => {
                //         props.history.push('/auth/login')
                //     }, 2000)
                // } else
                if (error.message.indexOf('Network Error') !== -1) {
                    Notification['warning']({
                        title: 'Network Error',
                        description: 'Looks Like you are not connected to the internet'
                    });
                } else {
                    Notification['error']({
                        title: 'Task Error',
                        description: `${error.response.data.message}`
                    });
                }
            })
    }

    return (
        <> {
            open &&
            <Modal full className="comment_container" backdrop={'static'} show={open} onHide={handleClose}>
                <Modal.Header>
                    <Modal.Title>Post & comments</Modal.Title>
                </Modal.Header>
                <Modal.Body>

                    {loadingPost ? <Loader /> :
                        <div className="second_section_container">
                            <div className="single_post_container">

                                {(loadingPost && post) ? <Loader /> :
                                    <div style={{ padding: '10px' }}>
                                        <div style={{ marginTop: '15px' }} className="poster_pics_and_name_container">
                                            <img style={{ width: '29px' }} alt="avatar" src={`https://ui-avatars.com/api/?name=${post.firstname} ${post.lastname}`} />
                                            <div>
                                                <h6 style={{ fontSize: '12px' }}>{post.firstname} {post.lastname}</h6>
                                                {/* <div className="post_time_and_privacy">5 mins ago <div className="dot"></div> public</div> */}
                                            </div>
                                        </div>

                                        <div style={{ display: 'flex', justifyContent: 'center' }}>

                                            {post.article && <div className="single_post_body">
                                                <p style={{ border: '1px solid #d3d2d4', padding: '20px 10px', backgroundColor: '#f2f2f5', marginTop: '15px', marginBottom: '16px' }}>{post.article}</p>
                                            </div>}

                                            {post.gif && <div className="comment_gif_body post_gif_body">
                                                <img src={post.gif} alt="gif" />
                                            </div>}
                                        </div>

                                        <div className="time_and_privacy">
                                            <span>{dayjs(post.createdat).format('h:mm:a')}</span><div className="dot"></div><span>{dayjs(post.createdat).format('D MMM YYYY')}</span>
                                        </div>
                                    </div>
                                }

                                <div style={{ position: 'relative', padding: '10px' }}>
                                    <div className="single_post_comment_count comment_count_container">
                                        {/* <div style={{ display: 'flex' }}>
                                        <img src="https://img.icons8.com/doodle/48/000000/comments.png" alt="comment" />
                                        {/* <span className="comment_count">{commentCount}</span> */}
                                        {/* </div> */}
                                        <p>Tell Oluwatobiloba how you feel about the post</p>
                                    </div>


                                    <div className="comments">
                                        {loadingComments ? <Loader /> :
                                            <>
                                                {/* normal comment starts */}
                                                <div className="normal_comments">
                                                    {
                                                        (comment.comments && comment.comments.length > 0)
                                                            ? comment.comments.map((comment) =>
                                                                <div>
                                                                    <div style={{ marginTop: '15px' }} className="comment_pics_and_name poster_pics_and_name_container">
                                                                        {/* <div style={{display: 'flex', alignItems: 'center'}}> */}
                                                                        <img style={{ width: '29px' }} alt="avatar" src={comment.profile_img ? comment.profile_img : `https://ui-avatars.com/api/?name=${comment.firstname} ${comment.lastname}`} />
                                                                        <h6 style={{ fontSize: '12px' }}>{comment.firstname} {comment.lastname} </h6>
                                                                        <div className="dot"></div>
                                                                        <span className="comment_time">{dayjs(comment.createdat).fromNow()}</span>
                                                                        {/* </div> */}
                                                                    </div>
                                                                    <p>{comment.comment}</p>
                                                                </div>

                                                            )
                                                            : <h4 style={{ marginTop: '5px' }}>No comments </h4>
                                                    }

                                                </div>
                                            </>
                                        }

                                        <InputGroup className="comment_input_container" >
                                            <Input value={commentInputValue} onChange={(value) => setCommentInputValue(value)} placeholder="type a comment" />
                                            {
                                                (commentInputValue && commentInputValue.length > 3)
                                                &&
                                                <InputGroup.Button onClick={handlePostComment} style={{ backgroundColor: '#1b1722', color: 'white' }}>
                                                    <Icon icon="send" />
                                                </InputGroup.Button>
                                            }
                                        </InputGroup>
                                    </div>
                                </div>

                            </div>
                            {/* </Scrollbars> */}
                        </div>
                    }
                </Modal.Body>


                <Modal.Footer>
                    <Button onClick={handleClose} appearance="subtle">
                        Close
                 </Button>
                </Modal.Footer>
            </Modal>


        }
        </>
    )
}

export default ViewPost;
