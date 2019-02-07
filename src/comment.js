import React from "react";
import "./comment.css";

export default class Comment extends React.Component<{ comment: String }> {
  render() {
    return (
      <div className="comment">
        <div className="score">
          <p>{"Score:"}</p>
          <p style={{ color: "blue", "padding-left": 6 }}>
            {this.props.comment.score}
          </p>
        </div>
        <p className="comment-text">{this.props.comment.comment}</p>
      </div>
    );
  }
}
