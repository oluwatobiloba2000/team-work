import React, { useEffect, useState } from 'react'
import { useHistory, useLocation } from 'react-router-dom';
import { Divider, Icon, Input, InputGroup, List, Placeholder, Notification, Badge, Loader } from 'rsuite';
import { checkToken, fetch_single_post, fetch_comments, post_comment } from '../../api_requests/api_request';
import { LetterAvatar } from '../../components/Avatar/avatar';
import './thread.css';
import dayjs from 'dayjs';
import { Helmet } from 'react-helmet';
var relativeTime = require('dayjs/plugin/relativeTime')
dayjs.extend(relativeTime)

export default function Thread(props) {
    const { threadId } = props;
    const history = useHistory();
    const location = useLocation();
    const [commentCount, setCommentCount] = useState(0);
    const [post, setPost] = useState({});
    const [comments, setComments] = useState([]);
    const [loadingPost, setLoadingPost] = useState(false);
    const [loadingComment, setLoadingComment] = useState(false);
    const [isPostingComment, setIsPostingComment] = useState(false);
    const [commentInputValue, setCommentInputValue] = useState('');

    function renderNotification(response) {
        Notification[response.status]({
            title: response.title,
            description: response.detailedError
        })
        if (response.authError) {
            setTimeout(() => {
                history.push('/auth/login')
            }, 2000)
        }
    }

    const fetch_single_post_fn = async () => {
        setLoadingPost(true);
        const response = await checkToken(() => fetch_single_post(threadId))

        if (response.error) {
            return renderNotification(response);
        }
        setCommentCount(response.data.data.commentCount.count);
        setPost(response.data.data.post[0])
        setTimeout(() => {
            setLoadingPost(false)
        }, 1000)
    }

    const fetch_comments_fn = async () => {
        setLoadingComment(true);
        const response = await checkToken(() => fetch_comments(threadId))

        if (response.error) {
            return renderNotification(response);
        }

        setComments(response.data.data.comments);
        setTimeout(() => {
            setLoadingComment(false)
        }, 1000)
    }

    const handlePostComment = async () => {
        if (commentInputValue.length > 1) {
            setIsPostingComment(true);
            setCommentInputValue('')
            const response = await checkToken(() => post_comment(threadId, commentInputValue))

            if (response.error) {
                setIsPostingComment(false);
                return renderNotification(response);
            }

            setCommentCount(parseInt(commentCount) + 1);
            setComments([response.data.data, ...comments]);
            setIsPostingComment(false);
        }
    }

    useEffect(() => {
        if (threadId) {
            fetch_single_post_fn();
            fetch_comments_fn();
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [threadId])

    return (
        <>
            {threadId &&
                <div className="thread_wrapper" style={{ width: '425px', height: '100%', borderLeft: '1px solid #80808080' }}>
                    <Helmet>
                        <title>Thread || Teamily</title>
                    </Helmet>
                    <div className="thread_header">
                        <div>
                            <h5>Thread</h5>
                        </div>
                        <button className="close_thread_btn" onClick={() => history.push(location.pathname)}>
                            <svg width="20px" className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                    </div>

                    <div className="thread_container">
                        {loadingPost ? <>
                            <Placeholder.Paragraph active style={{ margin: '30px 0px 22px 26px' }} graph="square" />
                        </> :
                            <div className="thread_post">
                                <div className="poster_details">
                                    <LetterAvatar letter={`${post.firstname} ${post.lastname}`} />
                                    <span className="username">{post.firstname} {post.lastname}</span>
                                </div>
                                <div className="post_body_content">
                                    {post.article}
                                    {post.gif && <div className="post_pics">
                                        <img src={post.gif} alt={`posted by ${post.firstname}`} />
                                    </div>}
                                </div>
                                <Divider className="thread_divider">{dayjs(post.createdat).format('D MMM YYYY [at] h[:]m a')}</Divider>
                            </div>}


                        <p className="replies_title">
                            <span>Replies</span>
                            <svg width="18px" style={{ marginRight: '7px' }} className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" /></svg>
                            {parseInt(commentCount) >= 1 && <Badge content={commentCount} />}
                        </p>
                        <List className="replies_list post_list_container">

                            {loadingComment ? <>
                                <Placeholder.Paragraph active style={{ margin: '30px 0px 22px 26px' }} graph="square" />
                                <Placeholder.Paragraph active style={{ margin: '30px 0px 22px 26px' }} graph="square" />
                            </>
                                : (comments && comments.length) ? comments.map((singleComment, index) => {
                                    return (
                                        <List.Item className="post" key={index} index={index}>
                                            <div className="poster_details">
                                                <LetterAvatar letter="Anani oluwatobi" />
                                                <span className="thread_username">{singleComment.firstname} {singleComment.lastname}</span>
                                                <span className="thread_reply_time">{dayjs(singleComment.createdat).fromNow()}</span>
                                            </div>
                                            <div className="post_body_content">
                                                {singleComment.comment}
                                            </div>
                                        </List.Item>
                                    )
                                }) : <div>No Replies</div>

                            }


                        </List>

                        <div className="thread_input_container">
                            {isPostingComment && <Loader style={{ zIndex: 10, backgroundColor: "#e6007e" }} backdrop content="sending your commment please wait..." vertical />}
                            <InputGroup inside>
                                <Input className="thread_input" value={commentInputValue} onChange={(value) => setCommentInputValue(value)} placeholder="write a comment" />
                                <InputGroup.Button className="thread_post_btn" onClick={() => handlePostComment()}>
                                    <Icon icon="send" />
                                </InputGroup.Button>
                            </InputGroup>
                        </div>
                    </div>

                </div>
            }
        </>
    )
}
