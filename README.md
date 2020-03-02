# Challengator App Alpha

## Info

Work in progress social App conceived to be a hub for the users to challenge themselfs and their friends against the most popular viral challenges on the internet.
Users can register and access to a catalog of challenges distributed by categories, accept a challenge and send it to their friends to become challengees or validators. Challenges accepted can be turned into public so other users can check your progression and vote on them. Users can modify their data at the user page, check pending and completed challenges or view their and other users statistics...

## Technologies used

### Front-End

- [React](https://es.reactjs.org/) - JavaScript library for building user interfaces.
- [React Redux](https://react-redux.js.org/) - Predictable state container for JavaScript applications.
- [Redux Saga](https://react-redux.js.org/) - Side effects management with redux integration.
- [React Router](https://reacttraining.com/react-router/) - Handle React single page applications routes.
- [React Redux Firestor](http://react-redux-firebase.com/) - Redux bindings for Firebase and Firestore.
- [Reselect](https://github.com/reduxjs/reselect) - Simple “selector” library for Redux using memoization.
- [Styled Components](https://github.com/reduxjs/reselect) - Utilising tagged template literals and the power of CSS, allows you to write actual CSS code to style your components.

### Back-End

- [Firebase](https://firebase.google.com/)
  - Firebase Auth to control user registration and authentication.
  - Firestore NoSQL Database.
  - Firebase Storage to store the users files.
  - Google Cloud Functions to execute on demand backend functions, like image and video conversion before storaging using sharp and ffmpeg libraries, under node.js enviorment.
  - Google Cloud Tasks to dispatch functions in a certain time.
