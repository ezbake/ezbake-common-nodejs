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

var assert = require('assert');
var Q = require('q');
var ZooKeeper = require('node-zookeeper-client');
var DiscoveryClient = require('../').DiscoveryClient;

var zookeeper_string = "localhost:2181";






describe("DiscoveryClient", function() {
    beforeEach(function(done) {
        this.timeout(5000);
        var zk = ZooKeeper.createClient(zookeeper_string,{sessionTimeout: 200000, debug_level: ZooKeeper.ZOO_LOG_LEVEL_WARN,host_order_deterministic: false });
        zk.once('connected',function(err) {
            if (err) {
                throw err;
            }
            console.log("zk session established, id=%s", zk.getSessionId().toString('hex'));
            deleteRecursive(zk, "/ezDiscovery", function() {
                done();
            });
        });
        zk.connect();
    });

    it("Should be a constructor", function() {
        var client = new DiscoveryClient(zookeeper_string);
    });

    it("Should have a simple ls function", function(done) {
        var client = new DiscoveryClient(zookeeper_string);
        client.ls("/test string", function(err, data) {
            if (err) {
                if (err == ZooKeeper.Exception.NO_NODE) {
                    // expected no node
                    assert(true, err);
                } else {
                    assert(false, err);
                }
            }
            done();
        });
    });

    describe("#makeZKPath", function() {
        it("should return root path for empty strings", function() {
            var client = new DiscoveryClient(zookeeper_string);
            var path = client.makeZKPath();
            assert.equal(path, "/");
        });
        it("should append slash for one argument paths", function() {
            var client = new DiscoveryClient(zookeeper_string);
            var path = client.makeZKPath("cookie");
            assert.equal(path, "/cookie");
        });
        it("should build path for vararg of strings", function() {
            var client = new DiscoveryClient(zookeeper_string);
            var path = client.makeZKPath("seasme", "street", "cookie", "monster", "is", "awesome");
            assert.equal(path, "/seasme/street/cookie/monster/is/awesome");
        });
        it("should throw an error if null passed", function() {
            var client = new DiscoveryClient(zookeeper_string);
            try {
                var path = client.makeZKPath("seasme", null, "cookie", "monster", "is", "awesome");
                assert(false);
            } catch(e) {
                if (e.message.indexOf("parts should not be null") != -1) {
                    assert(true);
                } else {
                    assert(false);
                }
            }
        });
    });

describe("#registerEndpoint", function() {
    it("should register common services under the common path", function(done) {
        var client = new DiscoveryClient(zookeeper_string);
        var serviceName = "cookie_monster";
        var endpoint = "bigbird:2181";
        var expectedPoint = client.makeZKPath("ezDiscovery", "common_services", serviceName, "endpoints", endpoint);

        client.registerEndpoint(serviceName, endpoint, function(err, success) {
            assert(success);
            client.ls(expectedPoint, function(err, stat) {
                assert(stat);
                done();
            });
        });
    });
    it("should register app services under the application path", function(done) {
        var client = new DiscoveryClient(zookeeper_string);
        var appName = "seasme_street";
        var serviceName = "cookie_monster";
        var endpoint = "cookie:2181";
        var expectedPoint = client.makeZKPath("ezDiscovery", appName, serviceName, "endpoints", endpoint);

        client.registerEndpoint(appName, serviceName, endpoint, function(err, success) {
            assert(success);
            client.ls(expectedPoint, function(err, stat) {
                if (err) {
                    console.error("%j", err);
                }
                assert(stat);
                done();
            });
        });
    });
});

describe("#unregisterEndpoint", function() {
    beforeEach(function(done) {
        var client = new DiscoveryClient(zookeeper_string);
        var serviceName = "cookie_monster";
        var endpoint = "bigbird:2181";
        client.registerEndpoint(serviceName, endpoint, function(err, success) {
            assert(success);
            done();
        });
    });
    it("should unregister common services", function(done) {
        var client = new DiscoveryClient(zookeeper_string);
        var serviceName = "cookie_monster";
        var endpoint = "bigbird:2181";
        var deletePoint = client.makeZKPath("ezDiscovery", "common_services", serviceName, "endpoints", endpoint);
        var expectedPoint = client.makeZKPath("ezDiscovery", "common_services", serviceName, "endpoints");

        client.unregisterEndpoint(serviceName, endpoint, function(err, success) {
            assert(success);
            client.ls(deletePoint, function(err, stat) {
                console.log("%s %j", err, stat);
                if (err || err == ZooKeeper.Exception.NO_NODE) {
                        // expected no node
                        assert(true, err);
                    } else {
                        assert(false, err);
                    }
                    client.ls(expectedPoint, function(err, stat) {
                        console.log("%s %j", err, stat);
                        if (err && err.getCode() == ZooKeeper.Exception.NO_NODE) {
                            assert(false, err);
                        } else {
                            assert(true, err);
                        }
                        done();
                    });
                });
        });
    });
it("should not throw an error if endpoint doesn't exist", function(done) {
    var client = new DiscoveryClient(zookeeper_string);
    var appName = "seasme_street";
    var serviceName = "cookie_monster";

    client.unregisterEndpoint(appName, serviceName, "does_not_exist:1234", function(err, success) {
        if (err) {
            console.error(err);
            assert(false);
        } else {
            assert(success);
        }
        done();
    });
});
});

describe("#getApplications", function() {
    it("should return registered applications", function(done) {
        var client = new DiscoveryClient(zookeeper_string);
        var app = "seasme_street";
        var service = "cookie_monster";
        var endpoint1 = "bigbird:2181";
        var endpoint2 = "elmo:2181";

        var deferred = Q.defer();
            // register two apps, then try get applications
            client.registerEndpoint(app, service, endpoint1, function(err, success) {
                if (err) {
                    deferred.reject(err);
                } else {
                    deferred.resolve(success);
                }
            });
            deferred.promise.then(function(valid) {
                var deferred = Q.defer();
                client.registerEndpoint(app, service, endpoint2, function(err, success) {
                    if (err) {
                        deferred.reject(err);
                    } else {
                        deferred.resolve(success);
                    }
                });
                return deferred.promise;
            }).then(function(valid) {
                client.getApplications(function(err, apps) {
                    assert(apps);
                    assert(apps.length == 1);
                    assert(apps.indexOf("seasme_street") != -1);
                    done();
                });
            }).done();
        });
it("should return empty list for no applications", function(done) {
    var client = new DiscoveryClient(zookeeper_string);
    client.getApplications(function(err, apps) {
        assert(apps);
        assert.equal(apps.length, 0);
        done();
    });
});
});

describe("#getServices", function() {
    it("should return registered services", function(done) {
        var client = new DiscoveryClient(zookeeper_string);
        var app = "seasme_street";
        var service1 = "cookie_monster";
        var service2 = "oscar_the_grouch";
        var endpoint1 = "bigbird:2181";
        var endpoint2 = "elmo:2181";

        var deferred = Q.defer();
            // register two apps, then try get applications
            client.registerEndpoint(app, service1, endpoint1, function(err, success) {
                if (err) {
                    deferred.reject(err);
                } else {
                    deferred.resolve(success);
                }
            });
            deferred.promise.then(function(valid) {
                var deferred = Q.defer();
                client.registerEndpoint(app, service2, endpoint2, function(err, success) {
                    if (err) {
                        deferred.reject(err);
                    } else {
                        deferred.resolve(success);
                    }
                });
                return deferred.promise;
            }).then(function(valid) {
                client.getServices(app, function(err, apps) {
                    assert(apps);
                    assert.equal(apps.length, 2);
                    assert(apps.indexOf(service1) != -1);
                    assert(apps.indexOf(service2) != -1);
                    done();
                });
            }).done();
        });
it("should return common services if no application name passed", function(done) {
    var client = new DiscoveryClient(zookeeper_string);
    var service1 = "cookie_monster";
    var service2 = "oscar_the_grouch";
    var endpoint1 = "bigbird:2181";
    var endpoint2 = "elmo:2181";

    var deferred = Q.defer();
            // register two apps, then try get applications
            client.registerEndpoint(service1, endpoint1, function(err, success) {
                if (err) {
                    deferred.reject(err);
                } else {
                    deferred.resolve(success);
                }
            });
            deferred.promise.then(function(valid) {
                var deferred = Q.defer();
                client.registerEndpoint(service2, endpoint2, function(err, success) {
                    if (err) {
                        deferred.reject(err);
                    } else {
                        deferred.resolve(success);
                    }
                });
                return deferred.promise;
            }).then(function(valid) {
                client.getServices(function(err, apps) {
                    assert(apps);
                    assert.equal(apps.length, 2);
                    assert(apps.indexOf(service1) != -1);
                    assert(apps.indexOf(service2) != -1);
                    done();
                });
            }).done();
        });
it("should return empty list for no services", function(done) {
    var client = new DiscoveryClient(zookeeper_string);
    var app = "seasme_street";
    client.getServices(app, function(err, apps) {
        assert(apps);
        assert.equal(apps.length, 0);
        done();
    });
});
});

describe("#getEndpoints", function() {
    var app = "winterfell";
    var appService = "stark";
    var appEndpoint = "bran:1010";
    var appEndpoint2 = "jonsnow:1818";
    var service = "stormlands";
    var serviceEndpoint = "durrandon:944";
    beforeEach(function(done) {
        var client = new DiscoveryClient(zookeeper_string);

        var promA = Q.defer();
        client.registerEndpoint(app, appService, appEndpoint, function(err, success) {
            if (success) {
                promA.resolve(success);
            } else {
             promA.reject(err);
         }
     });
        var promC = Q.defer();
        client.registerEndpoint(app, appService, appEndpoint2, function(err, success) {
            if (success) {
                promC.resolve(success);
            } else {
                promC.reject(err);
            }
        });
        var promB = Q.defer();
        client.registerEndpoint(service, serviceEndpoint, function(err, success) {
            if (success) {
                promB.resolve(success);
            } else {
             promB.reject(err);
         }
     });

        Q.all([promA.promise, promB.promise, promC.promise]).then(function() {
            done();
        }).done();

    });
    it("should return empty list for no endpoints", function(done) {
        var client = new DiscoveryClient(zookeeper_string);
        var nonservice = "NONEXISTENT_SERVICE";
        client.getEndpoints(nonservice, function(err, endpoints) {
            assert(endpoints);
            assert.equal(endpoints.length, 0);
            done();
        });
    });
    it("should return endpoints for common services", function(done) {
        var client = new DiscoveryClient(zookeeper_string);
        client.getEndpoints(service, function(err, endpoints) {
            assert(endpoints);
            assert.equal(endpoints.length, 1);
            assert.equal(endpoints.indexOf(serviceEndpoint), 0);
            done();
        });
    });
    it("should return endpoints for application services", function(done) {
        var client = new DiscoveryClient(zookeeper_string);
        client.getEndpoints(app, appService, function(err, endpoints) {
            assert(endpoints);
            assert.equal(endpoints.length, 2);
            assert(endpoints.indexOf(appEndpoint) > -1);
            assert(endpoints.indexOf(appEndpoint2)> -1);
            done();
        });
    });
});

describe("#isCommonService", function() {
    var app = "winterfell";
    var appService = "stark";
    var appEndpoint = "bran:1010";
    var appEndpoint2 = "jonsnow:1818";
    var service = "stormlands";
    var serviceEndpoint = "durrandon:944";
    beforeEach(function(done) {
        var client = new DiscoveryClient(zookeeper_string);
        var promA = Q.defer();
        client.registerEndpoint(app, appService, appEndpoint, function(err, success) {
            if (success) {
                promA.resolve(success);
            } else {
                promA.reject(err);
            }
        });
        var promC = Q.defer();
        client.registerEndpoint(app, appService, appEndpoint2, function(err, success) {
            if (success) {
                promC.resolve(success);
            } else {
                promC.reject(err);
            }
        });
        var promB = Q.defer();
        client.registerEndpoint(service, serviceEndpoint, function(err, success) {
            if (success) {
                promB.resolve(success);
            } else {
                promB.reject(err);
            }
        });
        Q.all([promA.promise, promB.promise, promC.promise]).then(function() {
            done();
        }).done();
    });
    it("should return false for non-common", function(done) {
        var client = new DiscoveryClient(zookeeper_string);
        client.isCommonService(appService, function(err, is) {
            assert(!is);
            done();
        });
    });
    it("should return true for common", function(done) {
        var client = new DiscoveryClient(zookeeper_string);
        client.isCommonService(service, function(err, is) {
            assert(is);
            done();
        });
    });
});

it("should register and unregister", function(done) {
    var client = new DiscoveryClient(zookeeper_string);
    var app = "seasme_street";
    var service = "cookie_monster";
    var endpoint1 = "bigbird:2181";
    var endpoint2 = "elmo:2181";

    var deferred = Q.defer();
    client.registerEndpoint(app, service, endpoint1, function(err, success) {
        if (err) {
            deferred.reject(err);
        } else {
            deferred.resolve(success);
        }
    });
    deferred.promise.then(function(valid) {
        var deferred = Q.defer();
        client.registerEndpoint(app, service, endpoint2, function(err, success) {
            if (err) {
                deferred.reject(err);
            } else {
                deferred.resolve(success);
            }
        });
        return deferred.promise;
    }).then(function(valid) {
        var deferred = Q.defer();
        client.unregisterEndpoint(app, service, endpoint1, function(err, success) {
            if (err) {
                deferred.reject(err);
            } else {
                deferred.resolve(success);
            }
        });
        return deferred.promise;
    }).then(function(valid) {
        var deferred = Q.defer();
        client.unregisterEndpoint(app, service, endpoint2, function(err, success) {
            if (err) {
                deferred.reject(err);
            } else {
                deferred.resolve(success);
            }
        });
        return deferred.promise;
    }).done(function() {
        console.log("done with chain");
        done();
    });
});
});



/******** Test Helpers **********/
function deleteRecursive(zk, path, cb) {
    var myPath = path;
    zk.getChildren(path, false, function(err, children) {
        if (err) {
            var rc = err.getCode();
            console.error("deleteRecursive: received: %d getting children. error: %s", rc, err);
            if (rc == -101) {
                console.error("deleteRecursive: ignoring %d, no need to delete", rc);
                cb();
                return;
            } else {
                throw err;
            }
        }
        if (children.length == 0) {
            zk.remove(path, -1, function(err) {
                if (err) {
                    var rc = err.getCode();
                    console.log("Child Error deleting path: %s, rc: %s, err: %s", path, rc, err);
                    throw err
                } else {
                    cb();
                }
            });
        } else {
            var promises = [];
            for (var ind in children) {
                var child = path + "/" + children[ind];
                var prom = Q.defer();
                (function(prom) {
                    deleteRecursive(zk, child, function() {
                        console.log("Resolving promise %s", child);
                        prom.resolve();
                    });
                })(prom);
                promises.push(prom.promise);
            }
            Q.all(promises).then(function() {
                zk.remove(myPath, -1, function(err) {
                    if (err) {
                        var rc = err.getCode();
                        console.log("Parent Error deleting path: %s, rc: %s, err: %s", myPath, rc, err);
                        throw err
                    } else {
                        cb();
                    }
                });
            }).done();
        }
    });
}

