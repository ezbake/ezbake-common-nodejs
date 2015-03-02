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
var ezbakeBaseService_ttypes = require('./ezbakeBaseService_types')
var ezbakeBaseTypes_ttypes = require('./ezbakeBaseTypes_types')


var ttypes = module.exports = {};
if (typeof ezsecurity === 'undefined') {
  ezsecurity = {};
}
ezsecurity.AppNotRegisteredException = module.exports.AppNotRegisteredException = function(args) {
  Thrift.TException.call(this, "ezsecurity.AppNotRegisteredException")
  this.name = "ezsecurity.AppNotRegisteredException"
  this.message = null;
  if (args) {
    if (args.message !== undefined) {
      this.message = args.message;
    }
  }
};
Thrift.inherits(ezsecurity.AppNotRegisteredException, Thrift.TException);
ezsecurity.AppNotRegisteredException.prototype.name = 'AppNotRegisteredException';
ezsecurity.AppNotRegisteredException.prototype.read = function(input) {
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

ezsecurity.AppNotRegisteredException.prototype.write = function(output) {
  output.writeStructBegin('AppNotRegisteredException');
  if (this.message !== null && this.message !== undefined) {
    output.writeFieldBegin('message', Thrift.Type.STRING, 1);
    output.writeString(this.message);
    output.writeFieldEnd();
  }
  output.writeFieldStop();
  output.writeStructEnd();
  return;
};

ezsecurity.UserNotFoundException = module.exports.UserNotFoundException = function(args) {
  Thrift.TException.call(this, "ezsecurity.UserNotFoundException")
  this.name = "ezsecurity.UserNotFoundException"
  this.message = null;
  if (args) {
    if (args.message !== undefined) {
      this.message = args.message;
    }
  }
};
Thrift.inherits(ezsecurity.UserNotFoundException, Thrift.TException);
ezsecurity.UserNotFoundException.prototype.name = 'UserNotFoundException';
ezsecurity.UserNotFoundException.prototype.read = function(input) {
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

ezsecurity.UserNotFoundException.prototype.write = function(output) {
  output.writeStructBegin('UserNotFoundException');
  if (this.message !== null && this.message !== undefined) {
    output.writeFieldBegin('message', Thrift.Type.STRING, 1);
    output.writeString(this.message);
    output.writeFieldEnd();
  }
  output.writeFieldStop();
  output.writeStructEnd();
  return;
};

ezsecurity.ProxyTokenRequest = module.exports.ProxyTokenRequest = function(args) {
  this.x509 = null;
  this.validity = null;
  if (args) {
    if (args.x509 !== undefined) {
      this.x509 = args.x509;
    }
    if (args.validity !== undefined) {
      this.validity = args.validity;
    }
  }
};
ezsecurity.ProxyTokenRequest.prototype = {};
ezsecurity.ProxyTokenRequest.prototype.read = function(input) {
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
      if (ftype == Thrift.Type.STRUCT) {
        this.x509 = new ezbakeBaseTypes_ttypes.X509Info();
        this.x509.read(input);
      } else {
        input.skip(ftype);
      }
      break;
      case 5:
      if (ftype == Thrift.Type.STRUCT) {
        this.validity = new ezbakeBaseTypes_ttypes.ValidityCaveats();
        this.validity.read(input);
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

ezsecurity.ProxyTokenRequest.prototype.write = function(output) {
  output.writeStructBegin('ProxyTokenRequest');
  if (this.x509 !== null && this.x509 !== undefined) {
    output.writeFieldBegin('x509', Thrift.Type.STRUCT, 1);
    this.x509.write(output);
    output.writeFieldEnd();
  }
  if (this.validity !== null && this.validity !== undefined) {
    output.writeFieldBegin('validity', Thrift.Type.STRUCT, 5);
    this.validity.write(output);
    output.writeFieldEnd();
  }
  output.writeFieldStop();
  output.writeStructEnd();
  return;
};

ezsecurity.ProxyTokenResponse = module.exports.ProxyTokenResponse = function(args) {
  this.token = null;
  this.signature = null;
  if (args) {
    if (args.token !== undefined) {
      this.token = args.token;
    }
    if (args.signature !== undefined) {
      this.signature = args.signature;
    }
  }
};
ezsecurity.ProxyTokenResponse.prototype = {};
ezsecurity.ProxyTokenResponse.prototype.read = function(input) {
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
        this.token = input.readString();
      } else {
        input.skip(ftype);
      }
      break;
      case 2:
      if (ftype == Thrift.Type.STRING) {
        this.signature = input.readString();
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

ezsecurity.ProxyTokenResponse.prototype.write = function(output) {
  output.writeStructBegin('ProxyTokenResponse');
  if (this.token !== null && this.token !== undefined) {
    output.writeFieldBegin('token', Thrift.Type.STRING, 1);
    output.writeString(this.token);
    output.writeFieldEnd();
  }
  if (this.signature !== null && this.signature !== undefined) {
    output.writeFieldBegin('signature', Thrift.Type.STRING, 2);
    output.writeString(this.signature);
    output.writeFieldEnd();
  }
  output.writeFieldStop();
  output.writeStructEnd();
  return;
};

ttypes.SERVICE_NAME = 'EzBakeSecurityService';