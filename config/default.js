const path = require('path');
module.exports = {
  port: 3000,
  session: {
    secret: 'tryfirst',
    key: 'tryfirst',
    maxAge: 2592000000
  },
  mongodb: 'mongodb://localhost:27017/test',
  upLoadDir:'../nodeUpload/'
};