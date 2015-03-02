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

var _ = require('lodash-node');
var BaseConfiguration = require('./baseConfiguration');

ElasticsearchConfiguration.prototype = new BaseConfiguration();
ElasticsearchConfiguration.prototype.constructor = ElasticsearchConfiguration;

/**
 * Constructor
 * @param ezConfiguration - the configuration object
 * @param namespace - namespace
 */
function ElasticsearchConfiguration(ezConfiguration, namespace) {
  BaseConfiguration.call(this, ezConfiguration, namespace);
}

/**
 * Get an array of elasticsearch hosts.
 * @return an array of hosts ["host1", "host2", ...], otherwise undefined.
 */
ElasticsearchConfiguration.prototype.getHost = function() {
  var host = this.get(this.constants.ELASTICSEARCH_HOST);

  if (!_valid(host)) {
    return undefined;
  }

  var hosts = host.split(",");

  if (!_valid(hosts)) {
    return undefined;
  }

  hosts.forEach(function(e, i, a) {
    hosts[i] = e.trim();
  });

  return hosts;
};


/**
 * Get the elasticsearch port number
 * @return the port, undefined otherwise.
 */
ElasticsearchConfiguration.prototype.getPort = function() {
  return this.getNumber(this.constants.ELASTICSEARCH_PORT);
};

/**
 * Get the elasticsearch Thrift port number
 * @return the port, undefined otherwise.
 */
ElasticsearchConfiguration.prototype.getThriftPort = function() {
  return this.getNumber(this.constants.ELASTICSEARCH_THRIFT_PORT);
};

/**
 * Get the elasticsearch cluster name.
 * @return string of es cluster name, undefined otherwise.
 */
ElasticsearchConfiguration.prototype.getClusterName = function() {
  return this.get(this.constants.ELASTICSEARCH_CLUSTER_NAME);
};


/**
 * Get the force refresh on put.
 * @return true if configured to force refresh on put, false otherwise.
 */
ElasticsearchConfiguration.prototype.getForceRefreshOnPut = function() {
  return this.getBoolean(this.constants.ELASTICSEARCH_FORCE_REFRESH_ON_PUT);
};

function _valid(v) {
  return !(_.isNull(v) || _.isUndefined(v));
}

module.exports = ElasticsearchConfiguration;

