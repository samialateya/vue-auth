## About Auth Starter

It's  a [Vue 3](https://vuejs.org/) authentication markdown that will help you to understand and grasp all the underlying functionality for setting up authentication on frontend web applications which include:
- Setup routes and create views and components
- Setup view router to handle navigation process
- Setup Vuex store to handle state management
- Caching user data in local storage to keep user logged in
- Setup environment files to controls environment variables
- Consuming restful API and share data between client and the server
- Setup social login components with all it's underlying functionality

feel free to use it as a startup for your next Vue project

## User Features

User has the following features provided as Web and API

- Routing
- Email & Password Authentication
- Login, Register, Update Profile
- Forget Password functionality
- Email Verification functionality
- Social Login with google and facebook login
- Protecting some routes against un verified emails
- Protecting some routes against guests
- File Upload
- UI is built with [Bootstrap 5](https://getbootstrap.com/docs/5.1/getting-started/introduction/)


## Installation

First clone this repository, install the dependencies, and setup your .env file.

```
git clone https://github.com/samialateya/vue-auth.git
npm i
cp .env.example .env
```

you are good to go now serve the application in ssl mode to be allowed to use facebook login
```
npm run serve:ssl
```
or if you want to use http mode
```
npm run serve
```

<b>Note:</b> You must restart the server every time you make changes to the ENV file.

## Contributing

Thank you for considering contributing to VueAuthStarter.
Feel free to fork this repo and submit a pull request with your updates

## Errors and Vulnerabilities

Please open an issue on Github if you discover a vulnerability or you face an error with this repo.
and feel free to contact me at [samialateya@hotmail.com](mailto:samialateya@hotmail.com)
