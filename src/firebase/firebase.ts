/**
 * @fileoverview This module initializes Firebase, Firestore and Google Cloud Compute services.
 */

import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import serviceAccount from './config/.private_key.json';

const { NODE_ENV } = process.env;

let app: admin.app.App;

/**
 * Initialize Firebase admin SDK.
 * @param {object} serviceAccount - The private key of the Firebase service account.
 */
app = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount)
});

const db = app.firestore();

export {
  admin,
  app,
  db,
  functions,
};