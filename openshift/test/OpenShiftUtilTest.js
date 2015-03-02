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
 * @author Gary Drocella
 * @date 02/12/15
 * @file OpenShiftUtilTest.js
 */

var OpenShiftUtil = require('../lib/OpenShiftUtil'),
	assert = require('assert'),
	_ = require("lodash");

describe("Openshift Util Test", function() {
   it("Should determine it's not in an open shift container when the OPENSHIFT_REPO_DIR is null.", function() {
      delete process.env.OPENSHIFT_REPO_DIR;  
      assert(OpenShiftUtil.isInOpenShiftContainer() === false);
   });

   it("Should determine it's in an open shift container when the OPENSHIFT_REPO_DIR is not null.", function() {
      process.env.OPENSHIFT_REPO_DIR="/path/to/repo";
      assert(OpenShiftUtil.isInOpenShiftContainer());
   });

   it("Should return undefined when unset getrepo defined.", function() {
      delete process.env.OPENSHIFT_REPO_DIR;   
      assert(_.isUndefined(OpenShiftUtil.getRepoDir()));
   });

   it("Should return repo dir when it's defined.", function() {
      process.env.OPENSHIFT_REPO_DIR="/path/to/repo";
      assert(process.env.OPENSHIFT_REPO_DIR == OpenShiftUtil.getRepoDir());
   });

   it("Should return config dir when repo dir is defined and contains trailing /.", function() {
      process.env.OPENSHIFT_REPO_DIR="/path/to/repo/";
      assert(OpenShiftUtil.getConfigurationDir() == "/path/to/repo/config");

      process.env.OPENSHIFT_REPO_DIR="/path/to/repo";
      assert(OpenShiftUtil.getConfigurationDir() == "/path/to/repo/config");
   });

   it("Should return undefined for config when the repo is undefined.", function() {
      delete process.env.OPENSHIFT_REPO_DIR;
      assert(_.isUndefined(OpenShiftUtil.getConfigurationDir()));
   });
});