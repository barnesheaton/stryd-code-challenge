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
    const { positive, negative } = this.props.comment.analysis;
    const keywords = this.props.comment.keywords;
    let comment = this.props.comment.text;

    keywords.map(term => {
      comment = comment.replace(
        new RegExp(`\\b${term}\\b`, "ig"),
        string =>
          `<span class="text-highlighted text-blue">` + string + "</span>"
      );
    });

    positive.map(term => {
      comment = comment.replace(
        new RegExp(`\\b${term}\\b`, "ig"),
        string =>
          `<span class="text-highlighted text-green">` + string + "</span>"
      );
    });
    negative.map(term => {
      comment = comment.replace(
        new RegExp(`\\b${term}\\b`, "ig"),
        string =>
          `<span class="text-highlighted text-red">` + string + "</span>"
      );
    });

    return { __html: comment };
  }
}
