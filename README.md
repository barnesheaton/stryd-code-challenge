This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Project URL

https://young-basin-24653.herokuapp.com/

## Available Scripts

1. `yarn start`
2. `yarn build`
3. `yarn test`
4. `yarn eject`

## Code and Data Structures

```
[ "Every comment was scraped from the site as a single string",
  "Inlcuding all-their special charecters!,
  "And put in an array", ]
```

### Organizing the data

Then the comments were "pre-processed" to convert them to a data structure that would be faster to search (I hope!)
This line converts the comment string into an Array of lowercase words with no special charecters

```
comment.toLowerCase().replace(/[^A-Z0-9]+/gi, " ").split(" ")...
```

And this reducer...

```
...reduce((acc, val) => {
    const category = acc[val[0]];
    if (category) {
      category.push(val);
    } else {
      acc[val[0]] = [val];
    }
    return acc;
   }, {})
```

Converts the array of comments into the following data structure

```
[
  {id: 0, t: ['the'] q: ['quick'] b: ['brown'] f: ['fox'] },
  {id: 1, j: ['jumps'] o: ['over'] t: ['the', 'twice'] l: ['lazy'] d: ['dog']}
]
```

### Searching
To search I first get the keywords from the text input
```
const keywords = this.state.value.replace(/ /, "").split(",");
```
And then I perform this filtering for each comment, and each keyword until a match hits
```
comments.filter(comment => {
  for (var i = 0; i < keywords.length; i++) {
    if (comment[keywords[i][0]] && comment[keywords[i][0]].includes(keywords[i])) {
      return comment;
    }
  }
})
```
This `comment[keywords[i][0]]` checks if there's even a word that starts with the same letter as the search term in the comment.
If not, that allows us to avoid executing the `includes()` method and hopefully save some time

And I used the [Sentiment](https://github.com/thisandagain/sentiment) package to calculate the "feeling" of each comment

```       
comments.map(comment => {
  const sentiment = new Sentiment();
  const analysis = sentiment.analyze(comments[comment.id]);
  switch (true) {
    case analysis.score >= 2:
       positiveComments.push(comment);
       break;
    case analysis.score <= 2:
       negativeComments.push(comment);
       break;
    default:
       neutralComments.push(comment);
    }
  });
```
