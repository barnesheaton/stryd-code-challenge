import React from "react";
import Sentiment from "sentiment";

import "./LandingView.css";
import Comment from "./comment.js";
import comments from "./assets/comments.js";

export default class Component extends React.Component {
  state = {
    positiveComments: [],
    neutralComments: [],
    negativeComments: [],
    comments: [],
    results: [],
    value: ""
  };

  componentDidMount() {
    const preProcessedComments = comments.map((comment, index) => {
      return {
        id: index,
        ...comment
          .toLowerCase()
          .replace(/[^A-Z0-9]+/gi, " ")
          .split(" ")
          .reduce((acc, val) => {
            const category = acc[val[0]];
            if (category) {
              category.push(val);
            } else {
              acc[val[0]] = [val];
            }
            return acc;
          }, {})
      };
    });
    this.setState({ comments: preProcessedComments });
  }

  render() {
    return (
      <div className="container">
        <header className="header">
          <p>Search through comments by comma separated keywords</p>
          <div>
            <input
              placeholder="stryd, awesome, running"
              className="input"
              type="text"
              value={this.state.value}
              onChange={event => {
                this.onChange(event);
              }}
            />
            <button className="button" onClick={() => this.onSearch()}>
              Search
            </button>
          </div>
        </header>
        <div className="results">
          <div className="comments-container">
            <p className="section-header">Positive Comments</p>
            <div className="comments-total">
              <p style={{ color: "white" }}>Total:</p>
              <p style={{ color: "blue", "padding-left": 6 }}>
                {this.state.positiveComments.length} (
                {this.percentage(this.state.positiveComments.length)})%
              </p>
              <p style={{ "padding-left": 6 }} />
            </div>
            <div className="comments">
              {this.state.positiveComments.map(comment => (
                <Comment comment={comment} />
              ))}
            </div>
          </div>
          <div className="comments-container">
            <p className="section-header">Neutral Comments</p>
            <div className="comments-total">
              <p style={{ color: "white" }}>Total:</p>
              <p style={{ color: "blue", "padding-left": 6 }}>
                {this.state.neutralComments.length} (
                {this.percentage(this.state.neutralComments.length)})%
              </p>
              <p style={{ "padding-left": 6 }} />
            </div>
            <div className="comments">
              {this.state.neutralComments.map(comment => (
                <Comment comment={comment} />
              ))}
            </div>
          </div>
          <div className="comments-container">
            <p className="section-header">Negative Comments</p>
            <div className="comments-total">
              <p style={{ color: "white" }}>Total:</p>
              <p style={{ color: "blue", "padding-left": 6 }}>
                {this.state.negativeComments.length} (
                {this.percentage(this.state.negativeComments.length)})%
              </p>
              <p style={{ "padding-left": 6 }} />
            </div>
            <div className="comments">
              {this.state.negativeComments.map(comment => (
                <Comment comment={comment} />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  percentage(value) {
    return Math.floor(
      (value /
        (this.state.positiveComments.length +
          this.state.negativeComments.length +
          this.state.neutralComments.length)) *
        100
    );
  }

  onSearch() {
    if (this.state.value) {
      this.filter();
    } else {
      window.alert("You must enter a search term");
    }
  }

  filter() {
    let positiveComments = [];
    let neutralComments = [];
    let negativeComments = [];
    const keywords = this.state.value.replace(/ /, "").split(",");
    this.state.comments
      .filter(comment => {
        for (var i = 0; i < keywords.length; i++) {
          if (
            comment[keywords[i][0]] &&
            comment[keywords[i][0]].includes(keywords[i])
          ) {
            return comment;
          }
        }
      })
      .map(comment => {
        const sentiment = new Sentiment();
        const score = sentiment.analyze(comments[comment.id]).score;

        switch (true) {
          case score >= 2:
            positiveComments.push({ comment: comments[comment.id], score });
            break;
          case score <= -2:
            negativeComments.push({ comment: comments[comment.id], score });
            break;
          default:
            neutralComments.push({ comment: comments[comment.id], score });
        }
      });
    this.setState({
      positiveComments,
      neutralComments,
      negativeComments
    });
  }

  onChange(event) {
    this.setState({ value: event.target.value });
  }
}
