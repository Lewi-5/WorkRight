# WorkRight
Project for FSD-08 Web Services


DO NOTE COPY PASTE WITHOUT CLICKING THE EDIT BUTTON    TOP RIGHT OF THIS PAGE, LINE BREAKS ARE NOT PRESERVED OTHERWISE
REMEMBER node modules is in .gitignore - so new libraries WILL NOT be pushed to git
each one of us needs to set up the package.json locally
FOR SETTING UP NODE DEPENDENCIES:

in terminal:

npm init -y
npm install
npm i express body-parser mysql2 sequelize
npm i nodemon -D (on macOS: npm install nodemon --save-dev)
-change script "start": "node server","dev": "nodemon server"
npm run dev


DATABASE:
hostname=fsd08workright.mysql.database.azure.com
username=workright01
password=FYxskC0aeL1pjh9t
dbName=workrightdb
