/*   Copyright (C) 2013-2014 Computer Sciences Corporation
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License. */

/**
 * This File has been deprecated
 * Please use ezConfiguration
 */
    var fs = require("fs"),
        p = require("path"),
        _ = require('lodash-node'),
        nconf = require('nconf'),
        PropertyList = require("./propertyList");

var logger = require('winston');

var EZCONFIG_DIR_KEY = 'EZCONFIGURATION_DIR';
var EZCONFIG_DIR_DEF = '/etc/sysconfig/ezbake';

var SPLIT_ON_FIRST_EQUALS_REGEXP = /^([^\=]+)\=(.*)$/;
var propRegex = /\.properties/;

var DEBUG_LOGGING = false;

// helper function that merges key/value pairs of object type args (2..n) into arg 1 object
function extend(target) {
    var sources = [].slice.call(arguments, 1);
    sources.forEach(function (source) {
        if (_.isObject(source)) {
            for (var prop in source) {
                target[prop] = source[prop];
            }
        }
    });
    return target;
}

// Intialize configuration object based on parameter passed in:
// If pathOrProperties is an object, then just load that into properties.
function NoZConfig(pathOrProperties) {
    logger.warn('NoZConfig has been deprecated, use EzConfiguration');
    var initializationType = 'empty';
    this.propertyList = new PropertyList();

    // initializing NoZConfig based on parameter type:
    // If object, then treat object as property key/value pairs.
    // If string, then treat as filepath.
    // If a truthy value that is neither object nor string, then load all default values.
    // Otherwise, load nothing. (This happens if no parameter is passed in)
    if (_.isObject(pathOrProperties)) {
        initializationType = 'object';
        // assign each property in object to internal list, after performing type conversion and default checking.
        _.each(pathOrProperties, function(value, propertyName) { 
            this.propertyList.set(propertyName, value);
        }, this);
    }
    else if (_.isString(pathOrProperties)) {
        initializationType = 'filepath';
        this.propertyList.properties = {};
        this.loadEzConfig(pathOrProperties);
    } 

    if (DEBUG_LOGGING && initializationType) {
        console.log('>>> NoZConfig ' + initializationType  + ' initialization: loaded properties = ' + JSON.stringify(this.propertyList.selectedPropertyNames()));
    }
};

NoZConfig.prototype.loadEzConfig = function(dir) {
    var ezconf_dir = dir || process.env[EZCONFIG_DIR_KEY] || EZCONFIG_DIR_DEF;
    if (DEBUG_LOGGING) {
        console.log('loadEzConfig dir=' + ezconf_dir);
    }
    nconf.env();
    var propertiesFromFile = {};

     // Get all properties files from the directory
    var files = fs.readdirSync(ezconf_dir).filter(function(val, i, arr) {
        return propRegex.test(val);
    });

    for (f in files) {
        var propResult = this.loadPropertiesFromFile(ezconf_dir, files[f]);
    }

    _.each(propertiesFromFile, function(value, propertyName) {
        this.propertyList.set(propertyName, value);
    }, this);
};

NoZConfig.prototype.loadPropertiesFromFile = function(basePath, file) {
    if (file.indexOf(".properties") < 0) {
        file = file + ".properties";
    }
    // check if file is an absolute filepath
    var path = fs.existsSync(file) && file;
    // check if file is a valid relative filepath
    if (!path) {
        path = fs.existsSync(p.join(basePath, file)) && p.join(basePath, file);
    }
    // throw exception if file path passed in does not exist
    var file = fs.readFileSync(path, { encoding: "utf8" });
    var propList = this.propertyList;
    var selectedPropertyNames = this.propertyList.selectedPropertyNames();

    _.each(file.split("\n"), function(lineInput) {
        // RWP: removed split() call so that property values with equal signs (such as DB connection strings) don't get chopped up
        var entry = lineInput.match(SPLIT_ON_FIRST_EQUALS_REGEXP);
        if (_.isArray(entry) && (entry.length > 1)) {
            // remove first element of match result (the entire property string) before setting value in props
            entry.shift();

            if (!_.contains(selectedPropertyNames, entry[0])) {
                propList.set(entry[0], entry[1]);
            }
            if (DEBUG_LOGGING) {
                console.log('Loaded property from file: key="' + entry[0] + '", value="' + entry[1] + '"');
            }
        }
    });
};

NoZConfig.prototype.selectedPropertyNames = function() {
    return this.propertyList.selectedPropertyNames();
};

NoZConfig.prototype.get = function(key) {
    return this.propertyList.get(key);
};

NoZConfig.prototype.set = function(key, value) {
    this.propertyList.set(key, value);
};


module.exports = exports = NoZConfig;
exports.zookeeper_string = "zookeeper.connection.string";

