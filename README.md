# Chess Game

Chess game is an app to calculate possibles moviments for Knight on a chessboard. We use an api with express to call the requests. It's possible to see the website[https://chessgameapp.herokuapp.com/].

## Structure

- Express
- TypeScript
- Postgres
- Jest

## Scripts

- npm run install (install all the dependencies of your app)
- npm run build (build your app with statics files)
- npm run dev (locally run your app)
- npm run start (to deploy your app and run node without hot reload)
- npm run tsc (to transpile typescript into javascript)
- npm run test (test your app with the spec folder)

# Organization

- Your API is organize with the resource, so a resouce like User could have the route and model in a single folder. We have the shared and utils with store common functions.
