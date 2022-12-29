# Event Log REST API

## Features
1. Create event entries inside MongoDB
2. Retrieve event entry by object id. Sets TTL on entry configurable by EVENT_LOG_DELAY environment variable (Default 1 day)

## Technologies used
1. Mongoose
2. Express
3. Typescript
4. Swagger

# How to run tests
In order to successfully run tests you have 2 options

## First option
You need mongodb tools installed and have it in your $PATH. Specifically mongorestore v100.6.1 or later
If you already have mongorestore in your path check version with command below
```shell
mongorestore --version
```
You can download mongodb tools here: https://www.mongodb.com/try/download/database-tools

Or install it with your system package manager

If you completed requirements above you already set

## Step 1
Set environment variables in .env file inside project root directory

Environment variables for self-hosted mongodb
```.env
DATABASE_URL="mongodb://<username>:<password>@<hostname>:<port>/event_log?authSource=admin"
EVENT_LOG_DELAY=60000
```
Environment variables for atlas hosted mongodb
```.env
DATABASE_URL="mongodb+srv://<username>:<password>@<hostname>/event_log?retryWrites=true&w=majority"
EVENT_LOG_DELAY=60000
```

## Step 2 (Optional)
Prepare self-hosted database. (Skip this if you use atlas mongodb)

If you want to run tests on self-hosted database and you already set required environment variable run this docker compose command.

NOTE: default database credentials are 'root:root' unless you modified it

If docker compose is v2
```shell
docker compose -f dev-compose.yml up -d
```

if docker compose is v1
```
docker-compose -f dev-compose.yml up -d
```

## Step 3
Run tests in project root directory

```shell
npm run test:cov
```
NOTE: Last test runs 2 minutes it's by design. Read comments to know why

## Second option
Second option doesn't require you to have mongorestore. But requires mongosh or mongodb compass.

You can download these here: https://www.mongodb.com/try/download/shell

## Step 1 (Optional)
Prepare self-hosted database. (Skip this if you use atlas mongodb)

If you want to run tests on self-hosted database run this docker compose command.

NOTE: default database credentials are 'root:root' unless you modified it

If docker compose is v2
```shell
docker compose -f dev-compose.yml up -d
```

if docker compose is v1
```
docker-compose -f dev-compose.yml up -d
```

## Step 2
Connect to mongodb instance with mongosh or mongodb compass

Run commands in following order:

```mongosh
    use event_log;
    db.entries.createIndex({expireAt: 1}, {expireAfterSeconds: 0});
```
NOTE: if you use mongodb compass just open mongosh at bottom

## Step 3
Set environment variables in .env file inside project root directory

Environment variables for self-hosted mongodb
```.env
DATABASE_URL="mongodb://<username>:<password>@<hostname>:<port>/event_log?authSource=admin"
EVENT_LOG_DELAY=60000
SKIP_RESTORATION=1
```

Environment variables for atlas hosted mongodb
```.env
DATABASE_URL="mongodb+srv://<username>:<password>@<hostname>/event_log?retryWrites=true&w=majority"
EVENT_LOG_DELAY=60000
SKIP_RESTORATION=1
```

## Step 4
Run tests in project root directory
```shell
npm run test:cov
```
NOTE: Last test runs 2 minutes it's by design. Read comments to know why
