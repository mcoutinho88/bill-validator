# Bill Validator

## Requirements

This application was built on Node.JS v12.14 using Typescript and Express API. It has not been tested on other versions. You will also need a package manager (npm or yarn).

## Running

First, clone this repository, then, you need to install all dependencies

    $ npm install // or yarn

Second, you need to start the project by using the following command:

    $ npm start // or yarn start

The application will by default run on port 3000. To execute it on another port, use the command:

    $ SERVER_PORT=[port] npm start

To run the tests, use:

    $ npm test


# API

The application has only one route: `GET /boleto/:payload`

It expects one parameters:

  - `boleto` number (length 47)

For example:

`/boleto/21290001192110001210904475617405975870000002000`

It will verify the number and validate it. It will return the bar code, the amount value related to that bill and the expiration date in the format:

  - `barCode` - string (length 44)
  - `amount` - float
  - `expirationDate` - date
