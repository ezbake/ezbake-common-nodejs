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
    _ = require('lodash-node'),
    nconf = require('nconf');

// load environment variables
nconf.env();

// 
var dataTypes = {
    string: 'string',
    int: 'int',
    float: 'float',
    boolean: 'boolean'
}

function PropertyList(pathOrProperties) {

    // Java constants and property key-value pairs for standard configuration types, separated by configuration type.
    // (currently not using configuration type, but this list is separated just in case we do filter by config type in the future)
    // Configurations that use environment variables (such as OpenShift) are not included in this list.
    //
    // Options:
    // type (default=dataTypes.string): data type of configuration property.
    // isEnvKey (default=false): is the key value an environment variable?
    // envOverride (default=null): look for this environment variable first (if it exists), then use property if not found.
    // defaultValue (default=null): use this default value instead of the type's default falsy value.
    // validValueList (default=null): a list of values, where property values must be contained in this list.
    //     (RWP: defaultValue must also be contained in this list)
    // conversionFunction (default=null): a function called when-case values, usually contains a concatenation function with other property values.
    var propertyListObjByType = {
        "accumulo": {
            "accumulo.instance.name": {},
            "accumulo.zookeepers": {},
            "accumulo.use.mock": {type: dataTypes.boolean},
            "accumulo.username": {},
            "accumulo.password": {}
        },
        "application": {
            "application.name": {},
            "application.version": {},
            "service.name": {},
            "ezbake.security.app.id": {},
            "ezbake.security.ssl.dir": {conversionFunction: function(value) { 
                var repoDir = getPropertyValueWithoutConversion("OPENSHIFT_REPO_DIR");
                // check if repoDir was already prepended to the originally value string, and if so just return the value string.
                // This way, repeated calls of this conversion method only prepend the repo directory string once.
                if (value.indexOf(repoDir) === 0) {
                    return value;
                }
                return _.compact([repoDir, value]).join('/');
            }}
        },
        "elastic": {
            "elastic.host.name": {},
            "elastic.port": {type: dataTypes.int},
            "elastic.cluster.name": {},
            "elastic.force.refresh": {type: dataTypes.boolean}
        },
        "hadoop": {
            "fs.default.name": {},
            "fs.hdfs.impl": {},
            "fs.use.local": {type: dataTypes.boolean}
        },
        "kafka": {
            "zk.connect": {},
            "zookeeper.connect": {},
            "consumer.timeout.ms": {type: dataTypes.int},
            "metadata.broker.list": {}
        },
        "ofe": {
            "ofe.port": {type: dataTypes.int},
            "ofe.nginx_worker_username": {},
            "ofe.http_port": {type: dataTypes.int},
            "ofe.https_port": {type: dataTypes.int},
            "ofe.max_ca_depth": {type: dataTypes.int},
            "ofe.tester.port": {type: dataTypes.int}
        },
        "openshift": {
            "OPENSHIFT_APP_DNS": {isEnvKey: true},
            "OPENSHIFT_APP_NAME": {isEnvKey: true},
            "OPENSHIFT_APP_UUID": {isEnvKey: true},
            "OPENSHIFT_DATA_DIR": {isEnvKey: true},
            "OPENSHIFT_GEAR_DNS": {isEnvKey: true},
            "OPENSHIFT_GEAR_NAME": {isEnvKey: true},
            "OPENSHIFT_GEAR_UUID": {isEnvKey: true},
            "OPENSHIFT_HOMEDIR": {isEnvKey: true},
            "OPENSHIFT_REPO_DIR": {isEnvKey: true},
            "OPENSHIFT_TMP_DIR": {isEnvKey: true},
            "OPENSHIFT_JAVA_THRIFTRUNNER_IP": {isEnvKey: true},
            "OPENSHIFT_JAVA_THRIFTRUNNER_TCP_PORT": {isEnvKey: true},
            "OPENSHIFT_JAVA_THRIFTRUNNER_TCP_PROXY_PORT": {isEnvKey: true}
        },
        "postgres": {
            "postgres.host": {envOverride: "OPENSHIFT_POSTGRESQL_DB_HOST"},
            "postgres.port": {envOverride: "OPENSHIFT_POSTGRESQL_DB_PORT", type: dataTypes.int},
            "postgres.username": {envOverride: "OPENSHIFT_POSTGRESQL_DB_USERNAME"},
            "postgres.password": {envOverride: "OPENSHIFT_POSTGRESQL_DB_PASSWORD"},
            "postgres.db": {envOverride: "PGDATABASE"},
            "postgres.connectionUrl": {conversionFunction: function(value) { 
                var host = getPropertyValueWithoutConversion("postgres.host"),
                    port = getPropertyValueWithoutConversion("postgres.port");
                return "postgresql://" + host + ":" + port.toString();
            }}
        },
        "redis": {
            "redis.host": {},
            "redis.port": {type: dataTypes.int}
        },
        "security": {
            "ezbake.security.cache.type": {defaultValue: 'MEMORY', validValueList: ['MEMORY', 'REDIS']},
            "ezbake.security.cache.ttl": {type: dataTypes.int, defaultValue: 43200},
            "ezbake.security.cache.size": {type: dataTypes.int, defaultValue: 1000},
            "ezbake.security.request.expiration": {type: dataTypes.int, defaultValue: 60},
            "ezbake.security.token.ttl": {type: dataTypes.int, defaultValue: 7200},
            "ezbake.security.app.service.impl": {},
            "ezbake.security.admins.file": {},
            "ezbake.security.user.service.impl": {},
            "ezbake.security.server.mock": {type: dataTypes.boolean, defaultValue: false},
            "ezbake.frontend.use.forward.proxy": {type: dataTypes.boolean, defaultValue: false},
            "ezbake.ssl.keystore.file": {},
            "ezbake.ssl.keystore.type": {},
            "ezbake.ssl.keystore.pass": {},
            "ezbake.ssl.truststore.file": {},
            "ezbake.ssl.truststore.type": {},
            "ezbake.ssl.truststore.pass": {},
            "ezbake.ssl.protocol": {},
            "ezbake.ssl.ciphers": {},
            "ezbake.ssl.peer.validation": {type: dataTypes.boolean, defaultValue: true}
        },
        "thrift": {
            "thrift.use.ssl": {type: dataTypes.boolean, defaultValue: false},
            "thrift.server.mode": {},
            "thrift.max.idle.clients": {type: dataTypes.int, defaultValue: 10},
            "thrift.test.clients.while.idle": {type: dataTypes.boolean, defaultValue: true},
            "thrift.millis.between.client.eviction.checks": {type: dataTypes.int, defaultValue: (30 * 1000)},
            "thrift.millis.idle.before.eviction": {type: dataTypes.int, defaultValue: (120 * 1000)}

        },
        "webapplication": {
            "web.application.external.domain": {},
            "web.application.metrics.endpoint": {},
            "web.application.metrics.siteid": {}
        },
        "zookeeper": {
            "zookeeper.connection.string": {}
        }
    };

    // Merge all property key/options-value objects above into a single object.
    // (NOTE: duplicates get clobbered.  There should not be any duplicate keys above.)
    var propertyListObj = _(propertyListObjByType).values().reduce(function(memo, propertyObj) {
        return _.merge(memo, propertyObj);
    }, {});

    // List of all property name keys
    var allPropertyNames = _.keys(propertyListObj);

    // Collection of user-selected properties: <name> => <value>
    var properties = {};

    // returns object with 2 key-value pairs:
    // {error: <is data invalid and not null/undef?>, empty: <is value empty?>, value: <type-converted value>}
    var getValueOrDefaultWithValidation = function(dataType, value, conversionFunction) {
        dataType = dataType || dataTypes.string;

        if (_.isFunction(conversionFunction)) {
            value = conversionFunction.call(this, value);
        }

        var isNullorUndefined = (_.isNull(value) || _.isUndefined(value));

        switch(dataType) {
            case dataTypes.string:
                // keep null and undef from throwing errors; all other falsy values (such as 0) should be string-converted the standard way
                var stringValue = (isNullorUndefined ? '' : value).toString();
                return {error: false, empty: (stringValue === ''), value: stringValue};

            case dataTypes.int:
                var intValue = parseInt(value);
                var isInvalid = isNaN(intValue);
                return {error: (isInvalid && !isNullorUndefined), empty: isNullorUndefined, value: (isInvalid ? 0 : intValue)};
 
            case dataTypes.float:
                var floatValue = parseFloat(value);
                var isInvalid = !isNaN(floatValue);
                return {error: (isInvalid && !isNullorUndefined), empty: isNullorUndefined, value: (isInvalid ? 0.0 : floatValue)};

            case dataTypes.boolean:
                // return boolean value as is, and treat other values as stringified boolean values
                if (_.isBoolean(value)) {
                     return {error: false, empty: isNullorUndefined, value: value};
                 }
                 var isTrue = ((isNullorUndefined ? '' : value).toString().toLowerCase() === "true");
                 return {error: false, empty: isNullorUndefined, value: isTrue};

        }
        return {error: true, empty: true, value: ''};
    };

    // Type-converts, validates, and performs environment variable lookup on property values.
    var processPropertyValue = function(propertyKey, value, neverUseConversionFunction) {
        var resultObj, envValue;
        var propertyOptions = propertyListObj[propertyKey] || {};
        var conversionFunction = (!neverUseConversionFunction && propertyOptions.conversionFunction);
        propertyOptions.type = propertyOptions.type || dataTypes.string;

        // Resolve environment variables:
        // If the property key is the environment variable, then simply return the environment variable.
        // If the property has an environment variable override in the options hash, then check for the environment variable 
        //    and set property to environment variable if it exists.
        if (propertyOptions.isEnvKey) {
            envValue = nconf.get(propertyKey) || '';
        }
        else if (propertyOptions.envOverride) {
            envValue = nconf.get(propertyOptions.envOverride);
        }

        // Return the environment variable if it exists and is valid.
        if (!_.isUndefined(envValue)) {
            resultObj = getValueOrDefaultWithValidation(propertyOptions.type, envValue, conversionFunction);
            if (!resultObj.error) {
                return resultObj.value;
            }
        }

        resultObj = getValueOrDefaultWithValidation(propertyOptions.type, value, conversionFunction);

        // performing validation using internal list of valid values, and setting error state if invalid
        if (_.isArray(propertyOptions.validValueList) && !_.contains(propertyOptions.validValueList, resultObj.value)) {
            resultObj.error = true;
        }

        // throw exception on error??

        // If value passed in is empty or invalid, then return default value.  Currently, all values returned at this point are valid or default.
        // RWP TEMP: may change depending on how we handle invalid values
        if (resultObj.empty || resultObj.error) {
            var defaultValueObj = getValueOrDefaultWithValidation(propertyOptions.type, propertyOptions.defaultValue, conversionFunction);
            return defaultValueObj.value;
        }
        else {
            return resultObj.value;
        }
    };

    var getPropertyValue = function(key) {
        if (_.has(properties, key)) {
            return properties[key];
        }
        else {
            return processPropertyValue(key);
        }
    };

    // Use this method when getting property values inside of conversion functions or any other internal method, 
    // to avoid infinite recursion loops.
    var getPropertyValueWithoutConversion = function(key) {
        if (_.has(properties, key)) {
            return properties[key];
        }
        else {
            return processPropertyValue(key, null, true);
        }
    };

    var setPropertyValue = function(key, value) {
        if (_.has(properties, key)) {
            throw new Error("Configuration variables cannot be reassigned once set");
        }
        properties[key] = processPropertyValue(key, value);
    };

    return {
        selectedPropertyNames: function() { return _.keys(properties); },
        propertyNamesByType: function(type) { return _.clone(propertyListObjByType[type] || {}); },
        allPropertyNames: allPropertyNames,
        get: getPropertyValue,
        set: setPropertyValue
    };

}

module.exports = PropertyList;
