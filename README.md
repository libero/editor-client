# Editor Client

A web app for editing article in JATS format. Built with react/redux and prosemirror.  

## Develop

Run the editor locally in dev mode in 3 simple steps

1. `git clone git@github.com:libero/editor-client.git && cd editor-client`
2. `npm install`
3. `npm start`

A new browser window with open automatically. 
If it doesn't simply navigate to [http://localhost:3000](http://localhost:3000)
in your favourite browser.

The page will reload automatically if you make edits.<br />
You will also see any lint errors in the console.

### Running all services in development mode with client reloading

This requires the [editor-article-store repo](https://github.com/libero/editor-article-store) being cloned to the same directory as the editor-client repo.

```
.
├── editor-article-store
├── editor-client
```

1. `make start_all`
2. Go to http://localhost:3000 or http://localhost:9000

### Test
`npm test` launches the test runner in the interactive watch mode.<br />
On any changes the tests will re-run automatically.

### Build

`npm run build` builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
