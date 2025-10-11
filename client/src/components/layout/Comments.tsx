import React from 'react';

const dummyComments = [
  { id: 1, user: 'Alice', text: 'Great post! 👏' },
  { id: 2, user: 'Bob', text: 'I totally agree with you.' },
  { id: 3, user: 'Charlie', text: 'Nice picture!' },
];

export default function Comments() {
  return (
    <div className="comments-list">
      {dummyComments.map(comment => (
        <div key={comment.id} className="comment-item">
          <div className="comment-user">{comment.user}</div>
          <div className="comment-text">{comment.text}</div>
        </div>
      ))}
    </div>
  );
}
