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

PostgresConfiguration.prototype = new BaseConfiguration();
PostgresConfiguration.prototype.constructor = PostgresConfiguration;

function PostgresConfiguration(ezConfiguration, namespace) {
  BaseConfiguration.call(this, ezConfiguration, namespace);
}

PostgresConfiguration.prototype.getHost = function() {
  return this.get(this.constants.POSTGRES_HOST);
};

PostgresConfiguration.prototype.getPort = function() {
  return this.get(this.constants.POSTGRES_PORT);
};

PostgresConfiguration.prototype.getUsername = function() {
  return this.get(this.constants.POSTGRES_USERNAME);
};

PostgresConfiguration.prototype.getPassword = function() {
  return this.get(this.constants.POSTGRES_PASSWORD);
};

PostgresConfiguration.prototype.getDatabase = function() {
  return this.get(this.constants.POSTGRES_DB);
};

PostgresConfiguration.prototype.getConnectionUrl = function() {
  return 'postgresql://' + this.getHost() + ':' + this.getPort() + '/' + this.getDatabase();
};

module.exports = PostgresConfiguration;

