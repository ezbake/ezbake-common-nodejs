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

var ZooKeeper = require ("node-zookeeper-client");
var logger = require('winston');

var NAMESPACE = "ezDiscovery";
var ENDPOINTS_ZK_PATH = "endpoints";
var COMMON_SERVICE_APP_NAME = "common_services";
var SECURITY_ZK_PATH = "security";
var SECURITY_ID_NODE = "security_id";

function ServiceDiscoveryClient(zookeeper) {
    this.zookeeper_string = zookeeper;
};

ServiceDiscoveryClient.prototype.makeZKPath = function makeZKPath() {
    var args = Array.prototype.slice.call(arguments);
    if (args.length == 0) {
        return "/";
    } else if (args.length == 1) {
        return "/" + args[0];
    }
    var zkPath = "/" + args[0];
    var len = args.length;

    if(zkPath.indexOf('/', 1) != -1) {
        throw Error("zookeeper parts should not contain '/' " + zkPath);
    }
    for(var i=1 ;i < len; ++i) {
        var child = args[i];

        if(child === null && i < len) {
            throw Error("parts should not be null");
        }

        if(child.indexOf("/") !== -1) {
            throw Error("zookeeper parts should not contain '/' " + child);
        }

        zkPath += "/" + child;
    }
    return zkPath;
};

ServiceDiscoveryClient.prototype.ls = function ls(path, cb) {
    if (!path instanceof String) {
        throw new Error("ServiceDiscoveryClient - path must be a string");
    } else if (path.indexOf("/") != 0) {
        path = "/" + path;
    }
    var zk = ZooKeeper.createClient(this.zookeeper_string,{sessionTimeout: 200000, debug_level: ZooKeeper.ZOO_LOG_LEVEL_WARN,host_order_deterministic: false });
    zk.once('connected', function (err) {
        if (err) throw err;
        logger.debug("zk session established, id=%s", zk.getSessionId());
        zk.exists(path, function(error, path) {
            if (error) {
                logger.error("zk error: %s, %s", error, path);
                cb(error, path);
            } else {
                if (path){
                    process.nextTick(function() {
                        zk.close();
                    });
                    cb(null, path);
                } else {
                    logger.error("exists node error: %s, stat: %j", error, path);
                    process.nextTick(function() {
                        zk.close();
                    });
                    cb(ZooKeeper.Exception.NO_NODE, path);
                }
            }
        });
    });
zk.connect(); 
};

ServiceDiscoveryClient.prototype.getApplications = function getApplications(cb) {
    var path = this.makeZKPath(NAMESPACE);
    var zk = ZooKeeper.createClient(this.zookeeper_string,{sessionTimeout: 200000, debug_level: ZooKeeper.ZOO_LOG_LEVEL_WARN,host_order_deterministic: false });
    zk.once('connected',function(err) {
        if (err) throw err;
        logger.debug("zk session established, id=%s", zk.getSessionId());
        zk.getChildren(path, false, function(err, children) {
            if (err) {
                rc = err.getCode()
                logger.error("zk error: %d, %s, %s", rc, err, path);
                if (rc === -101) {
                    // no children, just return empty list
                    cb(null, []);
                } else {
                    cb(err, children);
                }
            }
            else {
                logger.info("children for node: %s - %j", path, children);
                cb(null, children);
            }
            process.nextTick(function() {
                zk.close();
            });
        });
    });
    zk.connect();
};

ServiceDiscoveryClient.prototype.getServices = function getServices(appName, cb) {
    if (typeof appName === "function") {
        cb = appName;
        appName = COMMON_SERVICE_APP_NAME;
    }
    var path = this.makeZKPath(NAMESPACE, appName);
    var zk = ZooKeeper.createClient(this.zookeeper_string,{sessionTimeout: 200000, debug_level: ZooKeeper.ZOO_LOG_LEVEL_WARN,host_order_deterministic: false });
    zk.once('connected',function(err) {
        if (err) throw err;
        logger.debug("zk session established, id=%s", zk.getSessionId());
        zk.getChildren(path, false, function(err, children) {
            if (err) {
                rc = err.getCode();
                logger.error("zk error: %d, %s, %s", rc, err, path);
                if (rc === -101) {
                    // no children, just return empty list
                    cb(null, []);
                } else {
                    cb(err, children);
                }
            } else {
                logger.info("children for node: %s - %j", path, children);
                cb(null, children);
            }
            process.nextTick(function() {
                zk.close();
            });
        });
    });
    zk.connect();
};

ServiceDiscoveryClient.prototype.getEndpoints = function getEndpoints(appName, serviceName, cb) {
    if (typeof serviceName === "function") {
        cb = serviceName;
        serviceName = appName;
        appName = COMMON_SERVICE_APP_NAME;
    }
    var path = this.makeZKPath(NAMESPACE, appName, serviceName, ENDPOINTS_ZK_PATH);
    var zk = ZooKeeper.createClient(this.zookeeper_string,{sessionTimeout: 200000, debug_level: ZooKeeper.ZOO_LOG_LEVEL_WARN,host_order_deterministic: false });
    zk.once('connected',function(err) {
        if (err) throw err;
        logger.debug("zk session established, id=%s", zk.getSessionId());
        zk.getChildren(path, false, function(err, children) {
            if (err) {
                rc = err.getCode();
                logger.error("zk error: %d, %s, %s", rc, err, path);
                if (rc === -101) {
                    // no children, just return empty list
                    cb(null, []);
                } else {
                    cb(err, children);
                }
            } else {
                logger.info("children for node: %s - %j", path, children);
                cb(null, children);
            }
            process.nextTick(function() {
                zk.close();
            });
        });
    });
    zk.connect();
};

ServiceDiscoveryClient.prototype.isCommonService = function isCommonService(serviceName, cb) {
    var path = this.makeZKPath(NAMESPACE, COMMON_SERVICE_APP_NAME, serviceName);
    var zk = ZooKeeper.createClient(this.zookeeper_string,{sessionTimeout: 200000, debug_level: ZooKeeper.ZOO_LOG_LEVEL_WARN,host_order_deterministic: false });
    zk.once('connected',function(err) {
        if (err) throw err;
        logger.debug("zk session established, id=%s", zk.getSessionId());
        zk.exists(path, function(err, path) {
            if (err) {
                rc = err.getCode();
                logger.error("zk error: %d, %s, %s", rc, err, path);
                if (rc === -101) {
                    cb(null, false);
                } else {
                    cb(err, false);
                }
            } else {
                if (path){
                    logger.debug("exists for path: %s", path);
                    cb(null, true);
                } else {
                    cb(null, false);
                }
            }
            process.nextTick(function() {
                zk.close();
            });
        });
    });
    zk.connect();
};

ServiceDiscoveryClient.prototype.registerEndpoint = function registerEndpoint(appName, serviceName, point, cb) {
    if (typeof point === "function") {
        cb = point;
        point = serviceName;
        serviceName = appName;
        appName = COMMON_SERVICE_APP_NAME;
    }
    var path = this.makeZKPath(NAMESPACE, appName, serviceName, ENDPOINTS_ZK_PATH, point);
    logger.info("Registering endpoint for app: %s, service: %s, endpoint: %s at path: %s", appName, serviceName, point, path);
    var zk = ZooKeeper.createClient(this.zookeeper_string,{sessionTimeout: 200000, debug_level: ZooKeeper.ZOO_LOG_LEVEL_WARN,host_order_deterministic: false });
    zk.once('connected',function(err) {
        if (err) throw err;
        logger.debug("zk session established, id=%s", zk.getSessionId());
        zk.mkdirp(path, function(err, success) {
            if (err) {
                logger.error("registerEndpoint error: %s", err);
            }
            cb(err, success);
            process.nextTick(function() {
                zk.close();
            });
        });
    });
    zk.connect();
};

ServiceDiscoveryClient.prototype.unregisterEndpoint = function unregisterEndpoint(appName, serviceName, point, cb) {
    if (typeof point === "function") {
        cb = point;
        point = serviceName;
        serviceName = appName;
        appName = COMMON_SERVICE_APP_NAME;
    }
    var path = this.makeZKPath(NAMESPACE, appName, serviceName, ENDPOINTS_ZK_PATH, point);
    logger.info("Unregistering endpoint for app: %s, service: %s, endpoint: %s at path: %s", appName, serviceName, point, path);
    var zk = ZooKeeper.createClient(this.zookeeper_string,{sessionTimeout: 200000, debug_level: ZooKeeper.ZOO_LOG_LEVEL_WARN,host_order_deterministic: false });
    zk.once('connected',function(err) {
        if (err) throw err;
        logger.debug("zk session established, id=%s", zk.getSessionId());
        zk.remove(path, -1, function(err) {
            if (err) {
                var rc = err.getCode();
                logger.error("zk error: %d, %s", rc, err);
                if (err && rc== ZooKeeper.Exception.NO_NODE) {
                    cb(null, true, err);
                } else {
                    cb(err);
                }
            } else {
                logger.debug("delete node: %s, error: %s", path);
                cb(null, true);
                process.nextTick(function() {
                    zk.close();
                });
            }
        });
    });
    zk.connect();
};

ServiceDiscoveryClient.prototype.getSecurityIdForApplication = function(applicationName, cb){
  var zkPath = this.makeZKPath(NAMESPACE, applicationName, SECURITY_ZK_PATH, SECURITY_ID_NODE);
  var zk = ZooKeeper.createClient(this.zookeeper_string,{sessionTimeout: 200000, debug_level: ZooKeeper.ZOO_LOG_LEVEL_WARN,host_order_deterministic: false });
  zk.once('connected', function(err) {
    if (err) throw err;
    logger.debug("zk session established, id=%s", zk.getSessionId());
    zk.getData(zkPath, function(err, data){
      if(err){
        cb(err);
      } else {
        cb(undefined, data.toString('utf8'));
      }
      process.nextTick(function() {
        zk.close();
      });
    });
  });
  zk.connect();
};

ServiceDiscoveryClient.prototype.setSecurityIdForCommonService = function(serviceName, securityId){
  var zkPath = this.makeZKPath(NAMESPACE, COMMON_SERVICE_APP_NAME, serviceName, SECURITY_ZK_PATH, SECURITY_ID_NODE);
  var zk = ZooKeeper.createClient(this.zookeeper_string,{sessionTimeout: 200000, debug_level: ZooKeeper.ZOO_LOG_LEVEL_WARN,host_order_deterministic: false });
  zk.once('connected',function(err) {
    if (err) throw err;
    logger.debug("zk session established, id=%s", zk.getSessionId());
    zk.mkdirp(zkPath, function(err, success) {
      if (err) {
        logger.error("registerEndpoint error: %s", err);
        throw err;
      }
      zk.setData(zkPath, new Buffer(securityId),function(err){
        if(err){
          throw err;
        }
        process.nextTick(function() {
          zk.close();
        });
      });
    });
  });
  zk.connect();
};

ServiceDiscoveryClient.prototype.setSecurityIdForApplication = function(applicationName, securityId){
  var zkPath = this.makeZKPath(NAMESPACE, applicationName, SECURITY_ZK_PATH, SECURITY_ID_NODE);
  var zk = ZooKeeper.createClient(this.zookeeper_string,{sessionTimeout: 200000, debug_level: ZooKeeper.ZOO_LOG_LEVEL_WARN,host_order_deterministic: false });
  zk.once('connected',function(err) {
    if (err) throw err;
    logger.debug("zk session established, id=%s", zk.getSessionId());
    zk.mkdirp(zkPath, function(err, success) {
      if (err) {
        logger.error("registerEndpoint error: %s", err);
        throw err;
      }
      zk.setData(zkPath, new Buffer(securityId),function(err){
        if(err){
          throw err;
        }
        process.nextTick(function() {
          zk.close();
        });
      });
    });
  });
  zk.connect();
};

ServiceDiscoveryClient.prototype.getSecurityIdForCommonService = function(serviceName, cb){
  var zkPath = this.makeZKPath(NAMESPACE, COMMON_SERVICE_APP_NAME, serviceName, SECURITY_ZK_PATH, SECURITY_ID_NODE);
  var zk = ZooKeeper.createClient(this.zookeeper_string,{sessionTimeout: 200000, debug_level: ZooKeeper.ZOO_LOG_LEVEL_WARN,host_order_deterministic: false });
  zk.once('connected', function(err) {
    if (err) throw err;
    logger.debug("zk session established, id=%s", zk.getSessionId());
    zk.getData(zkPath, function(err, data){
      if(err){
        cb(err);
      } else {
        cb(undefined, data.toString('utf8'));
      }
      process.nextTick(function() {
        zk.close();
      });
    });
  });
  zk.connect();
};


module.exports = exports = ServiceDiscoveryClient;
