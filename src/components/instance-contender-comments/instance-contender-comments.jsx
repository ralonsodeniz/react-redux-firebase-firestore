import React, { useState, useCallback, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import PropTypes from "prop-types";

import { selectUsersDisplayNamesById } from "../../redux/user/selectors";
import {
  addCommentToProofStarts,
  editCommentAtProofStarts,
  deleteCommentFromProofStarts,
  reportCommentAbuseAtProofStarts
} from "../../redux/firestore/challenges-instances/actions";

import FormTextarea from "../form-textarea/form-textarea";
import CustomButton from "../custom-button/custom-button";

import {
  InstanceContenderCommentsContainer,
  InstanceContenderCommentsScroll,
  InstanceContenderCommentContainer,
  InstanceContenderCommentsTitle,
  InstanceContenderCommentsText,
  InstanceContenderCommentEmoji,
  InstanceContenderCommentEmojiContainer
} from "./instance-contender-commetns.styles";

const InstanceContenderComments = ({
  challengeInstanceContenders,
  userProfileId,
  isUserValidator,
  instanceId,
  selectedContender
}) => {
  const dispatch = useDispatch();

  const [comment, setComment] = useState("");

  const [editCommentData, setEditCommentData] = useState({
    editComment: false,
    editedText: "",
    editCommentId: ""
  });

  const isUserContender = challengeInstanceContenders.some(
    contender => contender.id === userProfileId
  );

  const postersIdsArray = challengeInstanceContenders.reduce(
    (accumulator, contender) => {
      if (contender.id === selectedContender) {
        accumulator = contender.comments.map(comment => comment.posterId);
      }
      return accumulator;
    },
    []
  );

  const memoizedSelectUsersDisplayNamesById = useMemo(
    () => selectUsersDisplayNamesById,
    []
  );

  const postersDisplaynamesArray = useSelector(state =>
    memoizedSelectUsersDisplayNamesById(state, postersIdsArray)
  );

  const postersObj = postersIdsArray.reduce(
    (accumulator, poster, posterIndex) => {
      accumulator[poster] = postersDisplaynamesArray[posterIndex];
      return accumulator;
    },
    {}
  );

  const handleChange = useCallback(
    event => {
      const { name, value } = event.target;

      name === "comment"
        ? setComment(value)
        : setEditCommentData({
            ...editCommentData,
            editedText: value
          });
    },
    [editCommentData]
  );

  const handleSubmitComment = useCallback(
    (event, contenderId, text) => {
      event.preventDefault();
      dispatch(addCommentToProofStarts(contenderId, instanceId, text));
      setComment("");
    },
    [dispatch, instanceId]
  );

  const toggleEditComment = useCallback(
    (commentText, commentId) => {
      if (!editCommentData.editComment) {
        setEditCommentData({
          editedText: commentText,
          editComment: true,
          editCommentId: commentId
        });
      } else if (
        editCommentData.editComment &&
        commentId === editCommentData.editCommentId
      ) {
        setEditCommentData({
          editedText: "",
          editComment: false,
          editCommentId: ""
        });
      } else {
        return;
      }
    },
    [editCommentData]
  );

  const handleEditCommentAtProofsStarts = useCallback(
    (event, contenderId, text, commentId) => {
      event.preventDefault();
      dispatch(
        editCommentAtProofStarts(contenderId, instanceId, text, commentId)
      );
      setEditCommentData({
        editComment: false,
        editedText: "",
        editCommentId: ""
      });
    },
    [dispatch, instanceId]
  );

  const handleDeleteCommentFromProofStarts = useCallback(
    (contenderId, commentId) =>
      dispatch(
        deleteCommentFromProofStarts(contenderId, instanceId, commentId)
      ),
    [dispatch, instanceId]
  );

  const handleReportCommentAbuseAtProofStarts = useCallback(
    (contenderId, commentId) =>
      dispatch(
        reportCommentAbuseAtProofStarts(contenderId, instanceId, commentId)
      ),
    [dispatch, instanceId]
  );

  return (
    <InstanceContenderCommentsContainer>
      {challengeInstanceContenders.reduce(
        (accumulator, contender, contenderIndex) => {
          const isVisible =
            isUserValidator || isUserContender || contender.public
              ? true
              : false;
          const isVisibleAndAuthed =
            isUserValidator ||
            isUserContender ||
            (contender.public && userProfileId)
              ? true
              : false;
          if (contender.id === selectedContender) {
            const contenderId = contender.id;

            accumulator.push(
              <InstanceContenderCommentsContainer key={contenderIndex}>
                {isVisible && (
                  <InstanceContenderCommentsScroll>
                    {contender.comments.map((comment, commentIndex) => {
                      return (
                        <InstanceContenderCommentContainer key={commentIndex}>
                          <InstanceContenderCommentsTitle>
                            {postersObj[comment.posterId]} -{" "}
                            {comment.dateOfPost.toDate().toString()}
                          </InstanceContenderCommentsTitle>
                          {!editCommentData.editComment ||
                          editCommentData.editCommentId !==
                            comment.commentId ? (
                            <InstanceContenderCommentsText>
                              {comment.text}
                            </InstanceContenderCommentsText>
                          ) : (
                            <form
                              onSubmit={event =>
                                handleEditCommentAtProofsStarts(
                                  event,
                                  contenderId,
                                  editCommentData.editedText,
                                  comment.commentId
                                )
                              }
                            >
                              <FormTextarea
                                id="editComment"
                                name="editComment"
                                value={editCommentData.editedText}
                                handleChange={handleChange}
                                required
                                disabled={false}
                                maxLength={155}
                                label="Edit comment"
                              />
                              <CustomButton type="submit" text="edit comment" />
                            </form>
                          )}
                          <InstanceContenderCommentEmojiContainer>
                            {comment.posterId === userProfileId && (
                              <InstanceContenderCommentEmojiContainer>
                                {!comment.reportAbuse ? (
                                  <InstanceContenderCommentEmoji
                                    role="img"
                                    aria-label="edit comment"
                                    aria-labelledby="eddit comment"
                                    onClick={() =>
                                      toggleEditComment(
                                        comment.text,
                                        comment.commentId
                                      )
                                    }
                                  >
                                    &#128394;
                                  </InstanceContenderCommentEmoji>
                                ) : (
                                  <InstanceContenderCommentEmoji
                                    role="img"
                                    aria-label="abuse warning"
                                    aria-labelledby="abuse warning"
                                  >
                                    &#9940;
                                  </InstanceContenderCommentEmoji>
                                )}
                                <InstanceContenderCommentEmoji
                                  role="img"
                                  aria-label="delete comment"
                                  aria-labelledby="delete comment"
                                  onClick={() =>
                                    handleDeleteCommentFromProofStarts(
                                      contenderId,
                                      comment.commentId
                                    )
                                  }
                                >
                                  &#128465;
                                </InstanceContenderCommentEmoji>
                              </InstanceContenderCommentEmojiContainer>
                            )}
                            {contenderId === userProfileId && (
                              <InstanceContenderCommentEmojiContainer>
                                <InstanceContenderCommentEmoji
                                  role="img"
                                  aria-label="report abuse"
                                  aria-labelledby="report abuse"
                                  onClick={() =>
                                    handleReportCommentAbuseAtProofStarts(
                                      contenderId,
                                      comment.commentId
                                    )
                                  }
                                >
                                  &#129324;
                                </InstanceContenderCommentEmoji>
                              </InstanceContenderCommentEmojiContainer>
                            )}
                          </InstanceContenderCommentEmojiContainer>
                        </InstanceContenderCommentContainer>
                      );
                    })}
                  </InstanceContenderCommentsScroll>
                )}
                {isVisibleAndAuthed && contender.proof.url !== "" && (
                  <form
                    onSubmit={event =>
                      handleSubmitComment(event, contenderId, comment)
                    }
                  >
                    <FormTextarea
                      id="comment"
                      name="comment"
                      value={comment}
                      handleChange={handleChange}
                      required
                      disabled={false}
                      maxLength={155}
                      label="New comment"
                    />
                    <CustomButton type="submit" text="post new comment" />
                  </form>
                )}
              </InstanceContenderCommentsContainer>
            );
          }
          return accumulator;
        },
        []
      )}
    </InstanceContenderCommentsContainer>
  );
};

InstanceContenderComments.propTypes = {
  challengeInstanceContenders: PropTypes.array.isRequired,
  userProfileId: PropTypes.string.isRequired,
  isUserValidator: PropTypes.bool.isRequired,
  instanceId: PropTypes.string.isRequired,
  selectedContender: PropTypes.string.isRequired
};

export default InstanceContenderComments;
