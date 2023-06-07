# WorkRight
Project for FSD-08 Web Services

REMEMBER node modules is in .gitignore - so new libraries WILL NOT be pushed to git
each one of us needs to set up the package.json locally
FOR SETTING UP NODE DEPENDENCIES:

in terminal:

npm init -y
npm install
npm i express body-parser mysql2 sequelize
npm i nodemon -D
-change script "start": "node server","dev": "nodemon server"
npm run dev
