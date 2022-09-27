var express = require('express');
var cors = require('./cors')
var router = express.Router();
let bodyParser = require('body-parser');
// const fs = require('fs')
const fsPromises = require('fs/promises')
const path = require('path')
// const FormData = require('form-data')
// const { instance } = require('../utils');

router.use(bodyParser.json())

router.route('/')
.options(cors.corsWithOptions, (req, res) => {
  res.sendStatus(200)
})
.get(cors.corsWithOptions, (req, res) => {
  res.status(200).json({
    code: 0,
    message: '',
    data: {}
  })
})
.post(cors.corsWithOptions, (req, res) => {
  res.status(200).json({
    code: 0,
    message: "ok",
    data: {},
  })
})
.put(cors.corsWithOptions, (req, res) => {
  res.send('put')
})
.delete(cors.corsWithOptions, (req, res) => {
  res.send('delete')
})

module.exports = router;
