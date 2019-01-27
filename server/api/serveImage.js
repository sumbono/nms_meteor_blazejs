// ==============================================================================//
// IMPORT MODULE //
// ==============================================================================//
import { Meteor } from 'meteor/meteor';
import express from 'express';
import bodyParser from 'body-parser';

// ==============================================================================//
// CREATE ROUTES & HTTP REQUEST FUNCTION EXPORT //
// ==============================================================================//
export function imageServe() {
  const app = express();
  app.use(bodyParser.urlencoded({ extended: false }));
  // app.use('/camera', express.static( `/var/www/nms2/nms_v2/fe/public/camera/` ) );
  app.use('/camera', express.static( `/home/nms2/public/` ) );
  /* Create WebApp API handler */
  WebApp.connectHandlers.use(app);
}