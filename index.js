'use strict';
const fs = require('fs-extra');
const Plugin = require('broccoli-plugin');
const TreeSync = require('tree-sync');
const path = require('path');
const symlinkOrCopy = require('symlink-or-copy');
const rimraf = require('rimraf');

module.exports = class BroccoliCopy extends Plugin {
  constructor(node, options) {
    super([node], {
      name: 'Broccoli-Copy',
      annotation: `COPY`,
      persistentOutput: false
    });
     this.options = options;
     this._haveLinked = false;
  }

  build() {
    if (!this._haveLinked) {
      fs.rmdirSync(this.outputPath);
      symlinkOrCopy.sync(this.inputPaths[0], this.outputPath);
      this._haveLinked = true;
    }

    rimraf.sync(this.options.destPath);
    fs.copySync(this.inputPaths[0], this.options.destPath, { dereference: true });
    this.storeMetaData(this.options);
  }

   storeMetaData(options) {
    if(options.metaData) {
      fs.writeFileSync(path.join(path.dirname(options.destPath), 'metadata'), JSON.stringify(options.metaData, undefined, 2), 'utf8');
    }
   }
};