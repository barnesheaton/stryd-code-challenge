import React from "react";
import "./comment.css";

export default class Comment extends React.Component {
  render() {
    const comment = this.props.comment.text;
    const score = this.props.comment.analysis.score;

    return (
      <div className="comment">
        <span className="comment-header">
          Score:
          <span style={{ color: "blue", "padding-left": 6 }}>{score}</span>
        </span>
        {!this.props.revealTerms ? (
          <p className="comment-text">{comment}</p>
        ) : (
          <p
            className="comment-text"
            dangerouslySetInnerHTML={this.revealTerms()}
          />
        )}
      </div>
    );
  }

  revealTerms() {
    let comment = this.props.comment.text;
    const { positive, negative } = this.props.comment.analysis;

    positive.map(term => {
      var regEx = new RegExp(`\\b${term}\\b`, "ig");
      comment = comment.replace(
        regEx,
        string => `<span class="positive-text">` + string + "</span>"
      );
    });
    negative.map(term => {
      var regEx = new RegExp(`\\b${term}\\b`, "ig");
      comment = comment.replace(
        regEx,
        string => `<span class="negative-text">` + string + "</span>"
      );
    });

    return { __html: comment };
  }
}
