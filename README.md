# Editor Client

A web app for editing article in JATS format. Built with react/redux and prosemirror.  

### Develop

Run the editor locally in dev mode in 3 simple steps

1. `git clone git@github.com:libero/editor-client.git && cd editor-client`
2. `npm install`
3. `npm start`

A new browser window with open automatically. 
If it doesn't simply navigate to [http://localhost:3000](http://localhost:3000)
in your favourite browser.

The page will reload automatically if you make edits.<br />
You will also see any lint errors in the console.

### Running all services with client reloading
1. `make start_all`
2. Go to http://localhost:9000

This proxies `9000` to `http://localhost:3000` and any `/api/*` to `http://localhost:8080`. This works via the nginx proxy setup via the docker-compose file



### Test
`npm test` launches the test runner in the interactive watch mode.<br />
On any changes the tests will re-run automatically.

### Build

`npm run build` builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />

### Eject

`npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Getting this working with API

API: 
1. Get the API running - https://github.com/libero/editor-article-store - `make start_dev`
2. Ensure there is an article in the database - trigger SQS task  - `docker run --env ARTICLE_ROOT=/articles -v /path/to/articles/:/articles editor-article-store:local`

UI:
1. export REACT_APP_API_URL=http://localhost:8080
2. npm run start:localstack
3. Go to `http://localhost:3000/?articleId=54296`
