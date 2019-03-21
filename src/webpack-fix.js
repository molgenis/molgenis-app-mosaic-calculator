/*
 * This file is a copy of `https://github.com/mozilla/pdfjs-dist/blob/master/webpack.js`
 *
 * The original version uses an inline declaration of the worker-loader which
 * overrides the configuration of the loader in our webpack config and does not
 * put the resulting chunk in the js dir.
 *
 * This is unfortunate because the app store serves files based on the directory
 * they sit in.
 *
 * In main.ts we first import module pdfvuer which imports the original webpack.js
 * and sets the `pdfjs.GlobalWorkerOptions.workerPort` to a source file chunk that
 * will be created using the unconfigured loader and written to `publicPath`.
 *
 * Then we import this fixed file that overwrites `pdfjs.GlobalWorkerOptions.workerPort`
 * to a source file chunk that will be created using the loader configured in
 * `vue.config.js` and written to `publicPath/js`.
 */
'use strict'

var pdfjs = require('pdfjs-dist/build/pdf.js');
var PdfjsWorker = require('pdfjs-dist/build/pdf.worker.js');

if (typeof window !== 'undefined' && 'Worker' in window) {
  pdfjs.GlobalWorkerOptions.workerPort = new PdfjsWorker();
}

module.exports = pdfjs;
