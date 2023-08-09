import React, { useState, useEffect } from "react";
import { Comment, Form, Header } from "semantic-ui-react";
import { Button } from "react-bootstrap";
import "semantic-ui-css/semantic.min.css";
import "./CommentSection.css";
import axios from "axios";

const CommentSection = ({ comments, commentData }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(null);
  const [authorInfo, setAuthorInfo] = useState({ data: null, error: false });
  const [replyMessage, setReplyMessage] = useState(null);

  const submitHandler = (e) => {
    e.preventDefault();
  };

  const getLoginInfo = () => {
    axios
      .get("/api/auth/user")
      .then((res) => {
        setIsLoggedIn(res.data.isLoggedIn);
        setAuthorInfo({
          data: res.data.user,
          error: false,
        });
      })
      .catch(() => setAuthorInfo({ error: true }));
  };

  const postComments = async () => {
    await axios.post("/api/comments", {
      comment_type: commentData.comment_type,
      foreign_id: commentData.foreign_id,
      comment_detail: replyMessage,
      author_name: authorInfo.data.username,
      author_profile_pic_url: authorInfo.data.avatar,
      comment_time: `${new Date().toLocaleDateString(
        "en-CA"
      )} ${new Date().toLocaleTimeString("en-CA", {
        hour: "2-digit",
        minute: "2-digit",
      })}`,
    });
    window.location.reload(false);
  };

  useEffect(() => {
    getLoginInfo();
  }, []);

  if (isLoggedIn === null) {
    return <p>Loading</p>;
  }
  if (isLoggedIn === true && authorInfo.data === null) {
    return <p>Loading</p>;
  }
  return (
    <Comment.Group size="large">
      <Header as="h1" dividing>
        Comments
      </Header>

      {comments &&
        comments.map((comment, i) => (
          <Comment className="comment_block" key={i}>
            <Comment.Avatar
              src={`/api/images?image_name=${comment.author_profile_pic_url}`}
            />
            <Comment.Content>
              <Comment.Author as="a">{comment.author_name}</Comment.Author>
              <Comment.Metadata>
                <div>{comment.comment_time}</div>
              </Comment.Metadata>
              <Comment.Text>
                <p>{comment.comment_detail}</p>
              </Comment.Text>
            </Comment.Content>
            {comment.comment_replies &&
              comment.comment_replies.map((replies, i) => (
                <Comment.Group>
                  <Comment>
                    <Comment.Avatar
                      src={`/api/images?image_name=${replies.reply_avatar_url}`}
                    />
                    <Comment.Content>
                      <Comment.Author as="a">
                        {replies.reply_user_name}
                      </Comment.Author>
                      <Comment.Metadata>
                        <div>{replies.reply_time}</div>
                      </Comment.Metadata>
                      <Comment.Text>{replies.reply_detail}</Comment.Text>
                    </Comment.Content>
                  </Comment>
                </Comment.Group>
              ))}
          </Comment>
        ))}

      {isLoggedIn && (
        <Form onSubmit={submitHandler}>
          <Form.TextArea
            onInput={(e) => {
              setReplyMessage(e.target.value);
            }}
          />

          <Button variant="primary" type="submit" onClick={postComments}>
            Submit
          </Button>
        </Form>
      )}
    </Comment.Group>
  );
};

export default CommentSection;
