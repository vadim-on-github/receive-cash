# Developing locally

This app consists of 2 parts, frontend and backend located under `rc-fe` and `rc-be`.
The backend is used for custom authentication and providing crypto logos.

## Prepare MySQL database

Use the following table name and structure

```
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `email` text NOT NULL,
  `password` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `verif_code` tinytext NOT NULL,
  `pass_reset_code` mediumtext,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=161 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
```

## Prepare Firestore database

Create 2 main collections under your root: `users` and `pages`

## Set environment variables

1. Clone the repo onto your local server, e.g. `/var/www/receive-cash`
2. Under `rc-fe/package.json` edit the `proxy` value entering your local server's host and port,
   e.g. http://localhost:80
3. Under `rc-fe/.env.development` for `REACT_APP_AUTH_HOST` value, enter the path to the backend of the app, e.g. if you
   cloned the repo to `/var/www/receive-cash`, enter `/receive-cash/rc-be`
4. Under `rc-fe/src/firebase-config.js`, fill in your Firebase credentials for the `firebaseConfig` constant
5. Rename file `rc-be/env_sample.php` to `rc-be/env.php` and edit it with either your development or production database
   as well as you email info
6. Under `rc-be/googleToken.php` enter values for variables `$service_account_email` and `$private_key`

## Develop

Develop the front-end by `cd`'ing into `rc-fe` and running `npm install`, then `npm start`.
Developing back-end is done from `rc-be` folder