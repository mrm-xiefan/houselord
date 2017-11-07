# houselord

frontend use jquery, adminlte(not vue-adminlte), vue-router(to make SPA). with out vuex.(i don't like flux.)

backend use node.js, express, mongodb. with rest api example.

socket.io is enabled only when backend is served.

# installation

## 1. install git, node.js, python, mongodb, mongodb IDE

google and install git

google and install node.js(version >= 8.4)

google and install python (version must be 2.7.x)

install mongodb from https://www.mongodb.com/download-center#community

i recommend to use this IDE: https://studio3t.com/

## 2. use git and npm to download all library

``` bash
# clone source from github
git clone https://github.com/mrm-xiefan/houselord

# install frontend dependencies
cd houselord/client
npm install
# take care of these packages
# npm install admin-lte@2.4.0
# npm install bootstrap-fileinput@4.4.2
# npm install socket.io@1.7.4

# install backend dependencies
cd houselord/server
# if your system is 32bit
# delete sharp in package.json!!!
# take care of these packages
# npm install socket.io@1.7.4
# and install others
npm install

# install pm2 in global
npm install -g pm2
```

# start project

## 1. boot frontend

``` bash
cd houselord/client
npm run dev
```

## 2. boot backend

## 2.1. if linux

``` bash
cd houselord/server
NODE_ENV=development ./node_modules/.bin/babel-node app.js
```

## 2.2. if windows

add `NODE_ENV`(value should be development or production) to your system environment. and then add /yourpath/houselord/server/node_modules/.bin/ to `PATH`.

``` bash
cd houselord/server
babel-node app.js
```

## 3. deploy

change **cors** in [client/src/store/controller.js](./client/src/store/controller.js) to **false**.

``` bash
cd houselord/client
npm run build
# then houselord/dist folder will be created.

# use pm2 to deamon
# install pm2
npm install -g pm2
# start first time
pm2 start pm2config.json
# confirm status
pm2 list
pm2 show dl
# tail log
pm2 logs dl
# restart
pm2 restart dl
# stop
pm2 stop dl
# delete
pm2 delete dl
```