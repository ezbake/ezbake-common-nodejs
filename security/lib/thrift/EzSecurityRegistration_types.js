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

//
// Autogenerated by Thrift Compiler (0.9.1)
//
// DO NOT EDIT UNLESS YOU ARE SURE THAT YOU KNOW WHAT YOU ARE DOING
//
var Thrift = require('thrift').Thrift;
var ezbakeBaseTypes_ttypes = require('./ezbakeBaseTypes_types')
var ezbakeBaseService_ttypes = require('./ezbakeBaseService_types')


var ttypes = module.exports = {};
ttypes.RegistrationStatus = {
'PENDING' : 0,
'ACTIVE' : 1,
'INACTIVE' : 2,
'DENIED' : 3
};
ApplicationRegistration = module.exports.ApplicationRegistration = function(args) {
  this.id = null;
  this.owner = null;
  this.appName = null;
  this.classification = null;
  this.authorizations = null;
  this.status = null;
  this.admins = null;
  this.appDn = null;
  this.message = null;
  if (args) {
    if (args.id !== undefined) {
      this.id = args.id;
    }
    if (args.owner !== undefined) {
      this.owner = args.owner;
    }
    if (args.appName !== undefined) {
      this.appName = args.appName;
    }
    if (args.classification !== undefined) {
      this.classification = args.classification;
    }
    if (args.authorizations !== undefined) {
      this.authorizations = args.authorizations;
    }
    if (args.status !== undefined) {
      this.status = args.status;
    }
    if (args.admins !== undefined) {
      this.admins = args.admins;
    }
    if (args.appDn !== undefined) {
      this.appDn = args.appDn;
    }
    if (args.message !== undefined) {
      this.message = args.message;
    }
  }
};
ApplicationRegistration.prototype = {};
ApplicationRegistration.prototype.read = function(input) {
  input.readStructBegin();
  while (true)
  {
    var ret = input.readFieldBegin();
    var fname = ret.fname;
    var ftype = ret.ftype;
    var fid = ret.fid;
    if (ftype == Thrift.Type.STOP) {
      break;
    }
    switch (fid)
    {
      case 1:
      if (ftype == Thrift.Type.STRING) {
        this.id = input.readString();
      } else {
        input.skip(ftype);
      }
      break;
      case 2:
      if (ftype == Thrift.Type.STRING) {
        this.owner = input.readString();
      } else {
        input.skip(ftype);
      }
      break;
      case 3:
      if (ftype == Thrift.Type.STRING) {
        this.appName = input.readString();
      } else {
        input.skip(ftype);
      }
      break;
      case 4:
      if (ftype == Thrift.Type.STRING) {
        this.classification = input.readString();
      } else {
        input.skip(ftype);
      }
      break;
      case 5:
      if (ftype == Thrift.Type.LIST) {
        var _size0 = 0;
        var _rtmp34;
        this.authorizations = [];
        var _etype3 = 0;
        _rtmp34 = input.readListBegin();
        _etype3 = _rtmp34.etype;
        _size0 = _rtmp34.size;
        for (var _i5 = 0; _i5 < _size0; ++_i5)
        {
          var elem6 = null;
          elem6 = input.readString();
          this.authorizations.push(elem6);
        }
        input.readListEnd();
      } else {
        input.skip(ftype);
      }
      break;
      case 6:
      if (ftype == Thrift.Type.I32) {
        this.status = input.readI32();
      } else {
        input.skip(ftype);
      }
      break;
      case 7:
      if (ftype == Thrift.Type.SET) {
        var _size7 = 0;
        var _rtmp311;
        this.admins = [];
        var _etype10 = 0;
        _rtmp311 = input.readSetBegin();
        _etype10 = _rtmp311.etype;
        _size7 = _rtmp311.size;
        for (var _i12 = 0; _i12 < _size7; ++_i12)
        {
          var elem13 = null;
          elem13 = input.readString();
          this.admins.push(elem13);
        }
        input.readSetEnd();
      } else {
        input.skip(ftype);
      }
      break;
      case 8:
      if (ftype == Thrift.Type.STRING) {
        this.appDn = input.readString();
      } else {
        input.skip(ftype);
      }
      break;
      case 9:
      if (ftype == Thrift.Type.STRING) {
        this.message = input.readString();
      } else {
        input.skip(ftype);
      }
      break;
      default:
        input.skip(ftype);
    }
    input.readFieldEnd();
  }
  input.readStructEnd();
  return;
};

ApplicationRegistration.prototype.write = function(output) {
  output.writeStructBegin('ApplicationRegistration');
  if (this.id !== null && this.id !== undefined) {
    output.writeFieldBegin('id', Thrift.Type.STRING, 1);
    output.writeString(this.id);
    output.writeFieldEnd();
  }
  if (this.owner !== null && this.owner !== undefined) {
    output.writeFieldBegin('owner', Thrift.Type.STRING, 2);
    output.writeString(this.owner);
    output.writeFieldEnd();
  }
  if (this.appName !== null && this.appName !== undefined) {
    output.writeFieldBegin('appName', Thrift.Type.STRING, 3);
    output.writeString(this.appName);
    output.writeFieldEnd();
  }
  if (this.classification !== null && this.classification !== undefined) {
    output.writeFieldBegin('classification', Thrift.Type.STRING, 4);
    output.writeString(this.classification);
    output.writeFieldEnd();
  }
  if (this.authorizations !== null && this.authorizations !== undefined) {
    output.writeFieldBegin('authorizations', Thrift.Type.LIST, 5);
    output.writeListBegin(Thrift.Type.STRING, this.authorizations.length);
    for (var iter14 in this.authorizations)
    {
      if (this.authorizations.hasOwnProperty(iter14))
      {
        iter14 = this.authorizations[iter14];
        output.writeString(iter14);
      }
    }
    output.writeListEnd();
    output.writeFieldEnd();
  }
  if (this.status !== null && this.status !== undefined) {
    output.writeFieldBegin('status', Thrift.Type.I32, 6);
    output.writeI32(this.status);
    output.writeFieldEnd();
  }
  if (this.admins !== null && this.admins !== undefined) {
    output.writeFieldBegin('admins', Thrift.Type.SET, 7);
    output.writeSetBegin(Thrift.Type.STRING, this.admins.length);
    for (var iter15 in this.admins)
    {
      if (this.admins.hasOwnProperty(iter15))
      {
        iter15 = this.admins[iter15];
        output.writeString(iter15);
      }
    }
    output.writeSetEnd();
    output.writeFieldEnd();
  }
  if (this.appDn !== null && this.appDn !== undefined) {
    output.writeFieldBegin('appDn', Thrift.Type.STRING, 8);
    output.writeString(this.appDn);
    output.writeFieldEnd();
  }
  if (this.message !== null && this.message !== undefined) {
    output.writeFieldBegin('message', Thrift.Type.STRING, 9);
    output.writeString(this.message);
    output.writeFieldEnd();
  }
  output.writeFieldStop();
  output.writeStructEnd();
  return;
};

AppCerts = module.exports.AppCerts = function(args) {
  this.application_priv = null;
  this.application_pub = null;
  this.application_crt = null;
  this.application_p12 = null;
  this.ezbakeca_crt = null;
  this.ezbakeca_jks = null;
  this.ezbakesecurityservice_pub = null;
  if (args) {
    if (args.application_priv !== undefined) {
      this.application_priv = args.application_priv;
    }
    if (args.application_pub !== undefined) {
      this.application_pub = args.application_pub;
    }
    if (args.application_crt !== undefined) {
      this.application_crt = args.application_crt;
    }
    if (args.application_p12 !== undefined) {
      this.application_p12 = args.application_p12;
    }
    if (args.ezbakeca_crt !== undefined) {
      this.ezbakeca_crt = args.ezbakeca_crt;
    }
    if (args.ezbakeca_jks !== undefined) {
      this.ezbakeca_jks = args.ezbakeca_jks;
    }
    if (args.ezbakesecurityservice_pub !== undefined) {
      this.ezbakesecurityservice_pub = args.ezbakesecurityservice_pub;
    }
  }
};
AppCerts.prototype = {};
AppCerts.prototype.read = function(input) {
  input.readStructBegin();
  while (true)
  {
    var ret = input.readFieldBegin();
    var fname = ret.fname;
    var ftype = ret.ftype;
    var fid = ret.fid;
    if (ftype == Thrift.Type.STOP) {
      break;
    }
    switch (fid)
    {
      case 1:
      if (ftype == Thrift.Type.STRING) {
        this.application_priv = input.readString();
      } else {
        input.skip(ftype);
      }
      break;
      case 2:
      if (ftype == Thrift.Type.STRING) {
        this.application_pub = input.readString();
      } else {
        input.skip(ftype);
      }
      break;
      case 3:
      if (ftype == Thrift.Type.STRING) {
        this.application_crt = input.readString();
      } else {
        input.skip(ftype);
      }
      break;
      case 4:
      if (ftype == Thrift.Type.STRING) {
        this.application_p12 = input.readString();
      } else {
        input.skip(ftype);
      }
      break;
      case 5:
      if (ftype == Thrift.Type.STRING) {
        this.ezbakeca_crt = input.readString();
      } else {
        input.skip(ftype);
      }
      break;
      case 6:
      if (ftype == Thrift.Type.STRING) {
        this.ezbakeca_jks = input.readString();
      } else {
        input.skip(ftype);
      }
      break;
      case 7:
      if (ftype == Thrift.Type.STRING) {
        this.ezbakesecurityservice_pub = input.readString();
      } else {
        input.skip(ftype);
      }
      break;
      default:
        input.skip(ftype);
    }
    input.readFieldEnd();
  }
  input.readStructEnd();
  return;
};

AppCerts.prototype.write = function(output) {
  output.writeStructBegin('AppCerts');
  if (this.application_priv !== null && this.application_priv !== undefined) {
    output.writeFieldBegin('application_priv', Thrift.Type.STRING, 1);
    output.writeString(this.application_priv);
    output.writeFieldEnd();
  }
  if (this.application_pub !== null && this.application_pub !== undefined) {
    output.writeFieldBegin('application_pub', Thrift.Type.STRING, 2);
    output.writeString(this.application_pub);
    output.writeFieldEnd();
  }
  if (this.application_crt !== null && this.application_crt !== undefined) {
    output.writeFieldBegin('application_crt', Thrift.Type.STRING, 3);
    output.writeString(this.application_crt);
    output.writeFieldEnd();
  }
  if (this.application_p12 !== null && this.application_p12 !== undefined) {
    output.writeFieldBegin('application_p12', Thrift.Type.STRING, 4);
    output.writeString(this.application_p12);
    output.writeFieldEnd();
  }
  if (this.ezbakeca_crt !== null && this.ezbakeca_crt !== undefined) {
    output.writeFieldBegin('ezbakeca_crt', Thrift.Type.STRING, 5);
    output.writeString(this.ezbakeca_crt);
    output.writeFieldEnd();
  }
  if (this.ezbakeca_jks !== null && this.ezbakeca_jks !== undefined) {
    output.writeFieldBegin('ezbakeca_jks', Thrift.Type.STRING, 6);
    output.writeString(this.ezbakeca_jks);
    output.writeFieldEnd();
  }
  if (this.ezbakesecurityservice_pub !== null && this.ezbakesecurityservice_pub !== undefined) {
    output.writeFieldBegin('ezbakesecurityservice_pub', Thrift.Type.STRING, 7);
    output.writeString(this.ezbakesecurityservice_pub);
    output.writeFieldEnd();
  }
  output.writeFieldStop();
  output.writeStructEnd();
  return;
};

RegistrationException = module.exports.RegistrationException = function(args) {
  Thrift.TException.call(this, "RegistrationException")
  this.name = "RegistrationException"
  this.message = null;
  if (args) {
    if (args.message !== undefined) {
      this.message = args.message;
    }
  }
};
Thrift.inherits(RegistrationException, Thrift.TException);
RegistrationException.prototype.name = 'RegistrationException';
RegistrationException.prototype.read = function(input) {
  input.readStructBegin();
  while (true)
  {
    var ret = input.readFieldBegin();
    var fname = ret.fname;
    var ftype = ret.ftype;
    var fid = ret.fid;
    if (ftype == Thrift.Type.STOP) {
      break;
    }
    switch (fid)
    {
      case 1:
      if (ftype == Thrift.Type.STRING) {
        this.message = input.readString();
      } else {
        input.skip(ftype);
      }
      break;
      case 0:
        input.skip(ftype);
        break;
      default:
        input.skip(ftype);
    }
    input.readFieldEnd();
  }
  input.readStructEnd();
  return;
};

RegistrationException.prototype.write = function(output) {
  output.writeStructBegin('RegistrationException');
  if (this.message !== null && this.message !== undefined) {
    output.writeFieldBegin('message', Thrift.Type.STRING, 1);
    output.writeString(this.message);
    output.writeFieldEnd();
  }
  output.writeFieldStop();
  output.writeStructEnd();
  return;
};

SecurityIDNotFoundException = module.exports.SecurityIDNotFoundException = function(args) {
  Thrift.TException.call(this, "SecurityIDNotFoundException")
  this.name = "SecurityIDNotFoundException"
  this.message = null;
  if (args) {
    if (args.message !== undefined) {
      this.message = args.message;
    }
  }
};
Thrift.inherits(SecurityIDNotFoundException, Thrift.TException);
SecurityIDNotFoundException.prototype.name = 'SecurityIDNotFoundException';
SecurityIDNotFoundException.prototype.read = function(input) {
  input.readStructBegin();
  while (true)
  {
    var ret = input.readFieldBegin();
    var fname = ret.fname;
    var ftype = ret.ftype;
    var fid = ret.fid;
    if (ftype == Thrift.Type.STOP) {
      break;
    }
    switch (fid)
    {
      case 1:
      if (ftype == Thrift.Type.STRING) {
        this.message = input.readString();
      } else {
        input.skip(ftype);
      }
      break;
      case 0:
        input.skip(ftype);
        break;
      default:
        input.skip(ftype);
    }
    input.readFieldEnd();
  }
  input.readStructEnd();
  return;
};

SecurityIDNotFoundException.prototype.write = function(output) {
  output.writeStructBegin('SecurityIDNotFoundException');
  if (this.message !== null && this.message !== undefined) {
    output.writeFieldBegin('message', Thrift.Type.STRING, 1);
    output.writeString(this.message);
    output.writeFieldEnd();
  }
  output.writeFieldStop();
  output.writeStructEnd();
  return;
};

SecurityIDExistsException = module.exports.SecurityIDExistsException = function(args) {
  Thrift.TException.call(this, "SecurityIDExistsException")
  this.name = "SecurityIDExistsException"
  this.message = null;
  if (args) {
    if (args.message !== undefined) {
      this.message = args.message;
    }
  }
};
Thrift.inherits(SecurityIDExistsException, Thrift.TException);
SecurityIDExistsException.prototype.name = 'SecurityIDExistsException';
SecurityIDExistsException.prototype.read = function(input) {
  input.readStructBegin();
  while (true)
  {
    var ret = input.readFieldBegin();
    var fname = ret.fname;
    var ftype = ret.ftype;
    var fid = ret.fid;
    if (ftype == Thrift.Type.STOP) {
      break;
    }
    switch (fid)
    {
      case 1:
      if (ftype == Thrift.Type.STRING) {
        this.message = input.readString();
      } else {
        input.skip(ftype);
      }
      break;
      case 0:
        input.skip(ftype);
        break;
      default:
        input.skip(ftype);
    }
    input.readFieldEnd();
  }
  input.readStructEnd();
  return;
};

SecurityIDExistsException.prototype.write = function(output) {
  output.writeStructBegin('SecurityIDExistsException');
  if (this.message !== null && this.message !== undefined) {
    output.writeFieldBegin('message', Thrift.Type.STRING, 1);
    output.writeString(this.message);
    output.writeFieldEnd();
  }
  output.writeFieldStop();
  output.writeStructEnd();
  return;
};

PermissionDeniedException = module.exports.PermissionDeniedException = function(args) {
  Thrift.TException.call(this, "PermissionDeniedException")
  this.name = "PermissionDeniedException"
  this.message = null;
  if (args) {
    if (args.message !== undefined) {
      this.message = args.message;
    }
  }
};
Thrift.inherits(PermissionDeniedException, Thrift.TException);
PermissionDeniedException.prototype.name = 'PermissionDeniedException';
PermissionDeniedException.prototype.read = function(input) {
  input.readStructBegin();
  while (true)
  {
    var ret = input.readFieldBegin();
    var fname = ret.fname;
    var ftype = ret.ftype;
    var fid = ret.fid;
    if (ftype == Thrift.Type.STOP) {
      break;
    }
    switch (fid)
    {
      case 1:
      if (ftype == Thrift.Type.STRING) {
        this.message = input.readString();
      } else {
        input.skip(ftype);
      }
      break;
      case 0:
        input.skip(ftype);
        break;
      default:
        input.skip(ftype);
    }
    input.readFieldEnd();
  }
  input.readStructEnd();
  return;
};

PermissionDeniedException.prototype.write = function(output) {
  output.writeStructBegin('PermissionDeniedException');
  if (this.message !== null && this.message !== undefined) {
    output.writeFieldBegin('message', Thrift.Type.STRING, 1);
    output.writeString(this.message);
    output.writeFieldEnd();
  }
  output.writeFieldStop();
  output.writeStructEnd();
  return;
};

AdminNotFoundException = module.exports.AdminNotFoundException = function(args) {
  Thrift.TException.call(this, "AdminNotFoundException")
  this.name = "AdminNotFoundException"
  this.message = null;
  if (args) {
    if (args.message !== undefined) {
      this.message = args.message;
    }
  }
};
Thrift.inherits(AdminNotFoundException, Thrift.TException);
AdminNotFoundException.prototype.name = 'AdminNotFoundException';
AdminNotFoundException.prototype.read = function(input) {
  input.readStructBegin();
  while (true)
  {
    var ret = input.readFieldBegin();
    var fname = ret.fname;
    var ftype = ret.ftype;
    var fid = ret.fid;
    if (ftype == Thrift.Type.STOP) {
      break;
    }
    switch (fid)
    {
      case 1:
      if (ftype == Thrift.Type.STRING) {
        this.message = input.readString();
      } else {
        input.skip(ftype);
      }
      break;
      case 0:
        input.skip(ftype);
        break;
      default:
        input.skip(ftype);
    }
    input.readFieldEnd();
  }
  input.readStructEnd();
  return;
};

AdminNotFoundException.prototype.write = function(output) {
  output.writeStructBegin('AdminNotFoundException');
  if (this.message !== null && this.message !== undefined) {
    output.writeFieldBegin('message', Thrift.Type.STRING, 1);
    output.writeString(this.message);
    output.writeFieldEnd();
  }
  output.writeFieldStop();
  output.writeStructEnd();
  return;
};

ttypes.SERVICE_NAME = 'EzSecurityRegistration';