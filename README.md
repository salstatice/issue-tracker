# [Issue Tracker](https://www.freecodecamp.org/learn/quality-assurance/quality-assurance-projects/issue-tracker)

### About the project

This project is an assignment project created by FCC for Quality Assurance Certification.

Issue Tracker organizes issues by project name. Each issue ticket has the following attributes:
* _id (assigned by database system)
* issue_title
* issue_text
* created_on (time default by server)
* updated_on (time default by server)
* created_by
* assigned_to (optional)
* open (default to `true`)
* status_text (optional)

Users can add, update or delete issues for `apitest` project using the index page at route(`/`), view and add new issues for project of their choice using the issue page at route(`/{project_name}`), or perform all actions for project of their choice using the API endpoint at (`/api/issue/{project_name}`)

### Getting Started

[Express](https://expressjs.com/) is used as the Node.js web application framework in this project. See [hello-world example](https://expressjs.com/en/starter/hello-world.html).

#### Installing Node and NPM
This project depends on Nodejs and Node Package Manager (NPM). To install Node, go to https://nodejs.org and select the appropriate installation package depending on your computer's platform (Windows, MacOS or Linux).

`Note: On Windows machines, you may need to configure your PATH environmental variable in case you forgot to turn on the add to PATH during the installation steps.`

#### Verifying the Node Installation
To ensure that your NodeJS setup is working correctly, open the terminal and type the following to check for the version of Node and NPM
```
$ node -v
$ npm -v
```

#### Installing project dependencies
This project uses NPM to manage software dependencies. NPM Relies on the package.json file. To install dependencies, open the terminal, cd to the project directory and run:
```
$ npm install
```

#### Database setup
This project uses [MongoDB](https://www.mongodb.com/) as data framework and uses [Mongoose](https://mongoosejs.com/) for MongoDB object modeling. Model schema can be found in the `model.js` file.

To setup the database, assign your own database URL as the following environment variable, or put the following variable in a .env file:
```bash
DB="mongodb://localhost/test"
# or
DB=mongodb+srv://test@cluster0.mongodb.net/testdb
# or
DB="your connection URI here"

```

### Running the server

To run locally, cd to the project directory and type the following command:
```
$ node server.js
```
Then, load http://localhost:3000/ in a browser to see the output.

### Routes

This project has two main routes. One is `/{project}`, which displays all the issue tickets for a given project with the oldest one at top. The other one is the API enpoints at `/api/issues/{project}`

#### API endpoints

Project name are case sensitive for all endpoints.

#### GET /api/issues/{project}

When query is not provided with GET request, this endpoint returns a list of all issues for the requested project in JSON format. The list can be filtered by the these criteria (case sensitive):
* issue_title
* issue_text
* created_from (in date format)
* created_to (in date format)
* created_by 
* assigned_to
* open (either `true` or `false`)
* status_text

Sample usage:
`/api/issues/{project}`
`/api/issues/{project}?open=true&assigned_to=Joe`

Sample return:
```json
[
    { 
        "_id": "5871dda29faedc3491ff93bb",
        "issue_title": "Fix error in posting data",
        "issue_text": "When we post data it has an error.",
        "created_on": "2017-01-08T06:35:14.240Z",
        "updated_on": "2017-01-08T06:35:14.240Z",
        "created_by": "Joe",
        "assigned_to": "Joe",
        "open": true,
        "status_text": "In QA"
    },
    ...
]
```

#### POST /api/issues/{project}

This endpoint adds a new issue ticket to a project. If this is the first time a project has an issue ticket, a project collection will be created in the database. An issue ticket has these required fields:
* issue_title
* issue_text
* created_by

Sample request:
```json
{ 
  issue_title: "Missing alpaca",
  issue_text: "Ran away last Monday.",
  created_by: "Baby Shark"
}
```

Sample response:
```json
// if required field(s) is/are missing
{ error: "required field(s) missing" }

// successful request
{
  "issue_title":"test",
  "issue_text":"test",
  "created_by":"test",
  "assigned_to":"",
  "open":true,
  "status_text":"",
  "_id":"6051138ad9b53f0085489f6c",
  "created_on":"2021-03-16T20:22:34.270Z",
  "updated_on":"2021-03-16T20:22:34.271Z",
  "__v":0
}

```

#### PUT /api/issues/{project}

This endpoint edits an issue ticket with new information. The only immutable field is `created_on`. All other fields are overwritten by the new information including blank fields. This endpoint requires a valid ticket id. Optional fields are:
* issue_title
* issue_text
* created_by 
* assigned_to
* open (either `true` or `false`)
* status_text

Sample request:
```json
{ 
  _id: "6051138ad9b53f0085489f6c"
  issue_title: "Found alpaca, need follow-up",
  issue_text: "A baby alpaca is found near the pond",
  assigned_to: "Big Llama"
}
```

Sample response:
```json
// if id is Missing
{ error: "missing _id" }

// if id is invalid or non-existing in the database
// or other errors
{ error: "could not update", "_id": id }

// if all fields beside id are missing
{ error: "no update field(s) sent", "_id": id }

// successful request
{ result: "successfully updated", "_id": id }
```

#### DELETE /api/issues/{project}

This endpoint deletes an issue ticket from a requested project. The only required field is `_id`.

Sample request:
```json
{ _id: "6051138ad9b53f0085489f6c" }
```

Sample response:
```json
// if id is Missing
{ error: "missing _id" }

// if id is invalid or non-existing in the database
// or other errors
{ error: "could not delete", "_id": id }

// successful request
{ result: "successfully deleted", "_id": id }
```
### Testing

Functional testes are located in the `/tests` folder. 

To run test, set up the following environment variable, or put the following variable in a `.env` file:
```
NODE_ENV=test
```

Then, run the app with the following command:
```
$ node server.js
```