import React from "react";
import Sentiment from "sentiment";
import ReactMarkdown from "react-markdown";

import "./LandingView.css";
import Comment from "./comment.js";
import comments from "./assets/comments.js";

export default class Component extends React.Component {
  state = {
    comments: [],
    neutralComments: [],
    negativeComments: [],
    positiveComments: [],
    results: [],
    revealTerms: true,
    searchTime: null,
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
          <p className="header">
            Search through comments by comma separated keywords
          </p>
          <div>
            <div className="input-container">
              <form onSubmit={event => this.onSearch(event)}>
                <input
                  placeholder="stryd, awesome, running"
                  className="input"
                  type="text"
                  value={this.state.value}
                  onChange={event => {
                    this.onChange(event);
                  }}
                />
              </form>
              <button
                className="button"
                onClick={event => this.onSearch(event)}
              >
                Search
              </button>
              <button
                className="button"
                onClick={() =>
                  this.setState({ revealTerms: !this.state.revealTerms })
                }
              >
                Show Sentiment Words
              </button>
            </div>
            {this.state.searchTime && (
              <p>{`Got ${this.numberOfResults()} results in ${
                this.state.searchTime
              } milliseconds`}</p>
            )}
          </div>
        </header>
        {(this.state.neutralComments.length ||
          this.state.negativeComments.length ||
          this.state.positiveComments.length) &&
          this.rendeResults()}
        <ReactMarkdown
          source={`
          ${"```"}
          js
          var React = require('react');
          var Markdown = require('react-markdown');

          React.render(
            <Markdown source="# Your markdown here" />,
            document.getElementById('content')
          );
          ${"```"}
          `}
        />
      </div>
    );
  }

  rendeResults() {
    const sections = [
      { title: "Positive", stateKey: "positiveComments" },
      { title: "Neutral", stateKey: "neutralComments" },
      { title: "Negative", stateKey: "negativeComments" }
    ];

    return (
      <div className="results">
        {sections.map(section => {
          return (
            <div className="comments-container">
              <div className="section-header">
                {section.title} Comments
                <span style={{ color: "blue", "padding-left": 6 }}>
                  {this.state[section.stateKey].length} (
                  {this.percentage(this.state[section.stateKey].length)})%
                </span>
              </div>
              <div className="comments">
                {this.state[section.stateKey].map(comment => (
                  <Comment
                    comment={comment}
                    revealTerms={this.state.revealTerms}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  filter() {
    return new Promise(resolve => {
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
          const analysis = sentiment.analyze(comments[comment.id]);

          switch (true) {
            case analysis.score >= 2:
              positiveComments.push({
                text: comments[comment.id],
                analysis,
                id: comment.id
              });
              break;
            case analysis.score <= -2:
              negativeComments.push({
                text: comments[comment.id],
                analysis,
                id: comment.id
              });
              break;
            default:
              neutralComments.push({
                text: comments[comment.id],
                analysis,
                id: comment.id
              });
          }
        });
      this.setState({
        positiveComments,
        neutralComments,
        negativeComments
      });
      resolve();
    });
  }

  numberOfResults() {
    return (
      this.state.positiveComments.length +
      this.state.negativeComments.length +
      this.state.neutralComments.length
    );
  }

  onChange(event) {
    this.setState({ value: event.target.value });
  }

  onSearch(event) {
    event.preventDefault();
    if (this.state.value) {
      const t0 = performance.now();
      this.filter().then(() => {
        const t1 = performance.now();
        this.setState({ searchTime: (t1 - t0).toFixed(2) });
      });
    } else {
      window.alert("You need to enter a search term!");
    }
  }

  percentage(value) {
    return Math.floor((value / this.numberOfResults()) * 100);
  }
}
