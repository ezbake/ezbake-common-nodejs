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

var assert = require('should');
var constants = require("..").constants;
var EzConfiguration = require("../lib");
var _ = require('lodash-node');

var properties = {};
properties[constants.ELASTICSEARCH_HOST] = 'localhost,127.0.0.1';
properties[constants.ELASTICSEARCH_PORT] = 9200;
properties[constants.ELASTICSEARCH_THRIFT_PORT] = 9500;
properties[constants.ELASTICSEARCH_CLUSTER_NAME] = "cluster name";
properties[constants.ELASTICSEARCH_FORCE_REFRESH_ON_PUT] = 'true';

var PropertyLoader = new EzConfiguration.loaders.PropertiesConfigurationLoader(properties);
var ezConfig = new EzConfiguration.EzConfiguration(PropertyLoader);


describe('Elasticsearch Configuration', function() {
  it('should get elasticsearch hosts', function() {
    var elasticsearchHelper = new EzConfiguration.helpers.ElasticsearchConfiguration(ezConfig);
    var intersect = _.intersection(elasticsearchHelper.getHost(), ["localhost", "127.0.0.1"]);
    assert(intersect.length == 2);
  });

  it("should get elasticsearch port", function() {
    var elasticsearchHelper = new EzConfiguration.helpers.ElasticsearchConfiguration(ezConfig);
    assert(elasticsearchHelper.getPort() === 9200);
  });

  it("should get elasticsearch Thrift port", function() {
    var elasticsearchHelper = new EzConfiguration.helpers.ElasticsearchConfiguration(ezConfig);
    assert(elasticsearchHelper.getThriftPort() === 9500);
  });

  it("should get elasticsearch cluster name", function() {
    var elasticsearchHelper = new EzConfiguration.helpers.ElasticsearchConfiguration(ezConfig);
    elasticsearchHelper.getClusterName().should.equal("cluster name");
  });

  it("should get elasticsearch force refresh on put", function() {
    var elasticsearchHelper = new EzConfiguration.helpers.ElasticsearchConfiguration(ezConfig);
    assert(elasticsearchHelper.getForceRefreshOnPut() === true);
  })
});

