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

module.exports = exports = {
    SECURITY_ID_KEY : "ezbake.security.app.id",
    SSL_DIR_KEY : "ezbake.security.ssl.dir",
    PRIVATE_KEY_FILE : "application.priv",
    PUBLIC_KEY_FILE : "application.pub",
    CERT_FILE : "application.crt",
    CA_FILE : "ezbakeca.crt",
    EZSECURITY_PUBLIC_KEY : "ezbakesecurityservice.pub",
    headers: {
        USER_DN: "ezb_verified_user_info",
        DN_EXPIRES: "ezb_verified_expires",
        DN_SIGNATURE: "ezb_verified_signature"
    },
    zookeeper: {
        connection_string : "zookeeper.connection.string"
    },
    thrift : {
        USE_SSL : "thrift.use.ssl"
    },
    mock : {
        MOCK_PROPERTY : "ezbake.security.client.use.mock",
        MOCKUSER_PROPERTY : "ezbake.security.client.mock.user.dn"
    }
};
