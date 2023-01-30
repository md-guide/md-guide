# Welcome to md 
 This is an interactive coding environment for md and Typescript, similar to Jupyter Notebook. 
There are two types of cells 
 - a text cell, the cell you are reading right now. You can click to edit this cell via markdown syntax, and the content will automatically render to HTML once you click outside the cell. 
 - a code cell, where you may input some js or ts code for the browser to execute. 
You can click on either of the two following buttons to create a cell.

```javascript 
// The built-in show() helper function can be used to display values in the preview window on the right
// to execute, click the run button or hit ctrl + enter
const msg = { message: "hello world" };
show(msg);

```
You don't need to install third-party libraries locally to use them in this app. It will detect your `import` statement and try to fetch their source code from `unpkg.com`. For example, even if the react library is not installed, the following code will work

```javascript 
import React from "react";
import ReactDOM from "react-dom";
const App = () => <h1>greetings from React</h1>;

// once react and react-dom is imported, it is recommended to use show() to display React components instead of ReactDOM.render()
show(<App />);

```
```javascript 
// as another example of fetching third party packages, let's make an API call using axios
import axios from "axios";
const fetchPost = async () => {
  const res = await axios.get("https://jsonplaceholder.typicode.com/posts/1");
  show(res.data);
};
fetchPost();

```
You can also have a mix usage of JavaScript and TypeScript by toggling the language mode on the top left corner.
```typescript 
interface Person {
  name: string;
  job: string;
}
let ross: Person = {
  name: "Ross Geller",
  job: "Divorcer",
};
show(ross);

```
When you run javascript-notebook from the terminal, a notebook.js file is created under the root directory to save your progress every 1 minute. You can reopen the notebook via `npx javascript-notebook serve notebook.js`