'use strict';

var path = require('path');

var fs = require('graceful-fs');
var fse = require('fs-extra');

var publicDir = path.join(__dirname, '../server/public');
var modulesDir = path.join(__dirname, '../node_modules');

var copyVendor = function () {
  fse.copySync(path.join(modulesDir, 'fullpage.js'), path.join(publicDir, 'fullpage.js'));
  fse.copySync(path.join(modulesDir, 'jquery/dist'), path.join(publicDir, 'jquery'));
  fse.copySync(path.join(modulesDir, 'materialize-css/dist'), path.join(publicDir, 'materialize-css'));
  fse.copySync(path.join(modulesDir, 'vue/dist'), path.join(publicDir, 'vue'));
};

copyVendor();