#ESRPC 1.0 (Draft)

######Origin Date:
2014-12-17

######Author:
Andreas Olofsson (andreas@erisindustries.com)

###Introduction

The protocol Eris uses is called ESRPC - Eris Socket-based RPC. RPC stands for "Remote Procedure Call". It is derived from the JSON RPC 2.0 protocol, but adapted for socket-based (asynchronous) connections. It was originally designed for use with the Eris Industries DeCerver decentralized software platform.

**NOTE:** This protocol is just a draft. There are no expectations at this point that ESRPC (1.0) will be a standard protocol used by websocket endpoints. The ESRPC protocol will evolve into ESRPC2, ESRPC3, etc. based on what's needed and what's practical.

###Description

There are two types of objects being used - the request (sent by the client), and the response (sent by the server). Here are the request and response objects in JSON.

###Request:

``` javascript
{
	"Protocol" : string,
	"Method"   : string,
	"Params"   : any type,
	"Id"	   : any type,
	"Time"     : number
}
```

An ESRPC request expects the following:

######Protocol
The value of the 'Protocol' field must be a string. The only used protocol right now is "ESRPC".

######Method
The 'Method' name is a string. It is the name of the remote method.

######Params
Params can be of any type. It is the parameters passed to the function. It must match the parameters that the function expects to receive.

######Id
A general purpose field that can be used for binding a message to a particular session, or identify messages so that errors can be tracked down more efficiently. The value can be of any type.

######Time
Time should contain a milisecond timestamp. In browser script you would normally get 
that from the date object. The decerver javascript runtime does not check timestamps 
by default, but you should expect that backend javascript in Eris-made dapps might.

###Response:

``` javascript
{
	"Protocol" : string,
	"Method" : string,
	"Result" : any type,
	"Id" : any type,
	"Time" : number,
	"Error" : {
		"Code" : number,
		"Message" : string,
		"Data" : any type
	}
}
```

An ESRPC request expects the following:

######Protocol
See request.

######Method
See request. This is passed back to the caller unlike in JSON RPC

######Result
The result of the method call. It can be of any type.

######Id
See request. The value can be of any type.

######Time
See request.

######Error

This is an object containing 3 fields.

######Code
The error code. See the section on Errors.

######Message
A string that describes the error in more detail.

######Data
This is an optional field. It can be of any type.

###Errors

These are the standard error codes used. They are the same as in JSON RPC 2.0

######E_PARSE (-32700)
This is sent if the message could not be parsed as JSON.

######E_INVALID_REQ (-32600)
This is sent if the JSON is not a proper 'Response' object.

######E_NO_METHOD (-32601)
This is sent if the method is not sent, or is not available.

######E_BAD_PARAMS (-32602)
This is sent if the method parameters is invalid.

######E_INTERNAL (-32603)
This is sent if a proper request was received, but an error occured while evaluating the method.

######E_SERVER (-32000)
This is reserved for implementation-defined server-errors.
