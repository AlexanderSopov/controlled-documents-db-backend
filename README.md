# Controlled Document Database + Backend 

## Description
This repo is intended for the creation of a database with migration files for creating database schemas and seeding them with data, as well as a serverless backend to serve the database.

### Purpose
Qamcoms intranet uses a plugin that stores this data in Confluence Data Center's Bandana Storage Adapter which, to be blunt, is not very good and very error prone. This has caused headaches for a long time, and at the end, Atlassian is sun-setting this old and clunky technology.

This repo intends to replace the functionality of that plugin's backend and storage with something that will be hosted off-platform.


### Requirements
This work is intended as precursor to a larger migration from Confluence Data Center to Confluence Cloud and as such, this repo is intended to mimic that environemnt as much as possible which is why the following technical decisions have been made:

 - AWS Lambda type serverless functions will expose CRUD functionality and Business Logic to the DATABASE
 - MySQL compliant database (in development mode we've gone with MariaDB hosted by Docker)


## Getting Started

### Docker
1. Install Docker
2. Run `docker-compose up -d` on the root of this project.
3. Go to [http://localhost:2330/adminer](http://localhost:2330/adminer) and see that you can log into the database using credentials (host: `cd_mariadb`, username: `myuser`, password: (see docker-compose.yml file), database: `controlled_documents`)


### Seeding Database
This step is pretty clunky, and WORK_IN_PROGRESS (See "What to do" below). You will need to first find the name of the docker container.
1. Run `docker ps`
2. Find a container called something like: `controlled-documents-cd_migrations-1`
3. Run `docker exec -it controlled-documents-cd_migrations-1 /bin/bash`
4. Once you're in the docker terminal do: `cd /home/node/app`
5. Run `npm run migrations:run`


### What to do:
1. Get set up with Docker.
2. Ask Mortne for an introduction of the plugin and what it does. Get to know its features and why it's for.
3. Ask Morten to explain what an "intendedFor" is (There are projects like "PD010" and products like "ABC0010" he'll explain the difference)
4. Ask Morten about different Document Types and how they relate to templates
5. Study the database schema ![Database Diagram](/docs/images/DatabaseSchema.jpg)
6. Study the JSON file inside of `/migrations/seed/cd.json`. This is a JSON export of the Bandana Storage (only a few entries)
7. Finish the migration file `/migrations/migrations/1749344057759-SeedTablesWithData.ts` to parse the old data in the json and match it onto the new database schema above.

#### OPTIONAL:
1. If you can create a way to run the migration on the docker container without having to SSH into it, that would be great. Essentially something like `docker exec controlled-documents-cd_migrations-1 npm run migrations:run` should work but the working dir is `/home/node/app` and so it cannot run. Didn't have time to figure it out but should be pretty straight forward
2. Feel free to push this repo to qamcom's gitlab. I have not yet managed to solve my access to it but at some point I should. At the moment, this repo is free of any sensitive information, but at some point there will be sensitive info and should therefore be exclusively hosted on Qamcoms own gitlab