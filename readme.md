### Initialitation ###
    - npm init -y

### Install Library ###
    - express
    - sequelize 
    - sequelize-cli 
    - ejs 
    - pg pg-hstore 
    - express-session
    - dotenv
    - connect-flash
    - bcryptjs
    - jsonwebtoken
    - --save-dev nodemon

### Run ###
    - sequelize db:create
    - sequelize db:migrate
    - sequelize db:seed:all

### REST API player feature guide ###

#### route (method post) /register: user account register (role PlayerUser) 
    request body json like this 

    {
        "username": "username",
        "password": "password",
        "name": "name",
        "birth_date":"birth_date" ,
        "email": "email",
        "phone_number": "phone_number",
        "address": "address"

    }



#### route (method post) /login: user account register (role PlayerUser)  ####
    request body json like this 

    {
        "username": "username",
        "password": "password"
    }
    
    after get token from login, insert token in header(request header)


#### route (method post) /create-room: create room  ####
    request body json like this 

    {
        "room_name": "name",
    }

    user who create room becomes player 1

#### route (method put) /enter-room/:id : enter room by opponent ####
    request body json like this 

    {
        "room_name": "name",
    }

    user who create enter room becomes player 2


#### route (method post) /fight/:id : first player optoion ####
    request body json like this 

    {
        "player_one_option": "option",
    }

#### route (method put) /fight/:id : second player optoion ####
    request body json like this 

    {
        "player_two_option": "option",
    }

#### route (method get) /api/v1/gamehistories  ####
    Get history user game(player)

#### route (method get) /api/v1/getScores  ####
    Get user score game


#### route (method get) /api/v1/biodata  ####
    Get user biodata

#### route (method put) /api/v1/biodata  ####
    Update user biodata
    request body json like this 

    {
        "username": "username",
        "password": "password",
        "name": "name",
        "birth_date":"birth_date" ,
        "email": "email",
        "phone_number": "phone_number",
        "address": "address"

    }

#### route (method delete) /api/v1/biodata  ####
    Delete user biodata

#### route (method post) /api/v1/biodata  ####
    Add user biodata, if user dont have biodata
    request body json like this 

    {
        "username": "username",
        "password": "password",
        "name": "name",
        "birth_date":"birth_date" ,
        "email": "email",
        "phone_number": "phone_number",
        "address": "address"

    }

#### route (method put) /api/v1/users  ####
    Update username and password player
    request body json like this 

    {
        "username": "username",
        "password": "password"

    }

#### route (method delete) /api/v1/users  ####
    Delete user data

### Admin Feature ###
    Admin can access database using monolith dashboard, by access localhost url in the browser. Feature:
    - Login
    - Create, update, delete, read user and biodata
    - Access dashboard
    - Read game and game histories
    - Read user game score









