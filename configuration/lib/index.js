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

exports.EzConfiguration = require('./ezConfiguration');

exports.constants = require('ezbake-configuration-constants/EzBakeProperty_types');

exports.loaders = {};
exports.loaders.DirectoryConfigurationLoader = require('./loaders/directoryConfigurationLoader');
exports.loaders.OpenShiftConfigurationLoader = require('./loaders/openShiftConfigurationLoader');
exports.loaders.PropertiesConfigurationLoader = require('./loaders/propertiesConfigurationLoader');

exports.utilities = {};
exports.utilities.EncryptionUtil = require('./utils/encryptionUtil');
exports.utilities.encryptionImplementations = {}
exports.utilities.encryptionImplementations.PBEWithMD5AndDES = require('./utils/pbewithmd5anddes');

exports.helpers = {};
exports.helpers.PostgresConfiguration = require('./helpers/postgresConfiguration');
exports.helpers.ZookeeperConfiguration = require('./helpers/zookeeperConfiguration');
exports.helpers.ElasticsearchConfiguration = require('./helpers/elasticsearchConfiguration');

//Deprecated: NoZConfig has been deprecated, ezConfiguration should be used instead.
exports.NoZConfig = require('./nozconfig');
