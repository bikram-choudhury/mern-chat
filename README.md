# mern-chat

This is a real time chat application generated using [Create React App](https://reactjs.org/docs/create-a-new-react-app.html), [expressjs](https://expressjs.com/) and [socket.io](https://socket.io/)

## Tools
Make sure you have installed:

1. [Node JS](https://nodejs.org/en/)


> ## Running on local

Navigate to server `client folder`. Then follow bellow available scripts

- Install dependecies: `npm install`

Navigate to server `server folder`. Then follow bellow available scripts

- Install dependecies: `npm install`
- Run both server & client in dev env:  `npm run dev`
- Run only server: `npm run server`
- Run only client: `npm run client`

> ## Deploy to server

Navigate client `client folder`. Then follow bellow available script

- Create prod build: `npm run build`

Navigate server `server folder`. Then follow bellow scripts

```
herkou login -i
heroku create - (Optional, Need to run if you are deploying the app for the 1st time).
git add .
git commit -am "new message"
git push heroku master 
```