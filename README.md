# Issue with redux-router

```bash
# Install dependencies
npm install

# Start the webpack-dev-server
npm run webpack-dev-server

# start the application server
npm run server
```

To reproduce the issue:

1. Go to [http://0.0.0.0:8000/#/1](http://0.0.0.0:8000/#/1) in your browser
2. Click on link "two"
3. See the error in your browser's JS console:

<pre>
Uncaught Invariant Violation: findComponentRoot(..., .0.$1.0): Unable to find element. This probably means the DOM was unexpectedly mutated (e.g., by the browser), usually due to forgetting a <tbody> when using tables, nesting tags like <form>, <p>, or <a>, or using non-SVG elements in an <svg> parent. Try inspecting the child nodes of the element with React ID ``.
</pre>
