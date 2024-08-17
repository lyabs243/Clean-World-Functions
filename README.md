# Clean World Functions

 The backend part of [Clean World mobile application](https://github.com/lyabs243/Clean-World) made with Firebase Cloud Functions. Clean World is an application that raises awareness about waste management, by detecting places that need to be cleaned up for a healthy environment.

## Features

- Send notifications to users
- Send scheduled news notifications

## Setup

1. Create a parent folder for the project
2. In the terminal, go to that folder
3. Clone the code in a folder named `functions`
4. Install Firebase CLI: `npm install -g firebase-tools` if not exist
5. Init Firebase: `firebase init`
6. In the configuration step use the `functions` folder and do not override it's content

### Tests

There is a unit test system to ensure that functions are working correctly, all tests are in the `tests` folder.

For security purpose, there is an access code token to put in request body when calling a test method. You can set your access code by creating a `.env` file at the root path and put your value like this:

```env
TEST_ACCESS_TOKEN=YOUR_TEST_TOKEN
```

Then you can call your test request like this:

```curl
curl --location 'YOUR_TEST_METHOD_LINK' \
--header 'Content-Type: application/json' \
--data-raw '{
    "accessToken": "YOUR_TEST_TOKEN"
}'
```