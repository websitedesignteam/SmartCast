import json
import boto3
import botocore.exceptions
import hmac
import hashlib
import base64
import uuid


def lambda_handler(event, context):
    
    #----------------------------------------Retrieve the parameters from SSM store----------------------------------------#
    try:
        
        store = boto3.client('ssm')
        env = store.get_parameter(Name = "/smartcast/env", WithDecryption = True)
        env = json.loads(env["Parameter"]["Value"])
        
        USER_POOL_ID = env["USER_POOL_ID"]
        CLIENT_ID = env["CLIENT_ID"]
        CLIENT_SECRET = env["CLIENT_SECRET"]
        
        AUTHORIZE_ADMIN_ONLY_LAMBDA = env["AUTHORIZE_ADMIN_ONLY_LAMBDA"]
    
    except Exception as e:
        body = {
            "Error": "Something went wrong. Please check back at a later time."
        }
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Headers': 'Content-Type,Origin,X-Amz-Date,Authorization,X-Api-Key,x-requested-with,Access-Control-Allow-Origin,Access-Control-Request-Method,Access-Control-Request-Headers',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': True,
                'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS'
            },
            'body': json.dumps(body)
        }
    

    #----------------------------------------Validate inputs----------------------------------------#
    try:
        #Get params from client
        body = event["body"]
        body = json.loads(body)
        token = body["token"]
    except Exception as e:
        body = {
            "Error": "You must provide a token."
        }
        return {
            'statusCode': 400,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Headers': 'Content-Type,Origin,X-Amz-Date,Authorization,X-Api-Key,x-requested-with,Access-Control-Allow-Origin,Access-Control-Request-Method,Access-Control-Request-Headers',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': True,
                'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS'
            },
            'body': json.dumps(body)
        }
        
        
    
    #----------------------------------------Authorize the user----------------------------------------#
    try:
        lambdaClient = boto3.client('lambda')
        
        event = {
            "body":{
                "access_token" : token
            }
        }
        
        event["body"] = json.dumps(event["body"])
        response = lambdaClient.invoke(
            FunctionName = AUTHORIZE_ADMIN_ONLY_LAMBDA,
            Payload = json.dumps(event)
            )
        
        responsePayload = response["Payload"].read()
        responsePayload = json.loads(responsePayload)
        if "Success" not in responsePayload:
            if  "Something" in responsePayload["Error"]:
                return {
                    'statusCode': 500,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Headers': 'Content-Type,Origin,X-Amz-Date,Authorization,X-Api-Key,x-requested-with,Access-Control-Allow-Origin,Access-Control-Request-Method,Access-Control-Request-Headers',
                        'Access-Control-Allow-Origin': '*',
                        'Access-Control-Allow-Credentials': True,
                        'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS'
                    },
                    'body': json.dumps(responsePayload)
                }
            else:
                return {
                    'statusCode': 400,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Headers': 'Content-Type,Origin,X-Amz-Date,Authorization,X-Api-Key,x-requested-with,Access-Control-Allow-Origin,Access-Control-Request-Method,Access-Control-Request-Headers',
                        'Access-Control-Allow-Origin': '*',
                        'Access-Control-Allow-Credentials': True,
                        'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS'
                    },
                    'body': json.dumps(responsePayload)
                }
    except Exception as e:
        print("Exception : ", e)
        body = {
            "Error": "Something went wrong. We weren't able to validate your session. Please log in again."
        }
        print(str(e))
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Headers': 'Content-Type,Origin,X-Amz-Date,Authorization,X-Api-Key,x-requested-with,Access-Control-Allow-Origin,Access-Control-Request-Method,Access-Control-Request-Headers',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': True,
                'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS'
            },
            'body': json.dumps(body)
        }
        
        
    
    #----------------------------------------Collect the data----------------------------------------#
    
    def createUserObj(status,email,profilePicture,editCount):
        if status == "standard":
            return {
                "email": email,
                "profilePicture": profilePicture,
                "status": status,
                "editCount": editCount,
                "command": "PROMOTE"
            }
        else:
            return {
                "email": email,
                "profilePicture": profilePicture,
                "status": status,
                "editCount":editCount,
                "command": "DEMOTE"
            }
            
        
    try:
        tableName = "Users"
        dynamoDB = boto3.resource('dynamodb')
        table = dynamoDB.Table(tableName)
        
        
        response = table.scan()
        data = response["Items"]
        
        
        response = table.get_item(
            Key = {
                "username": body["email"]
            })
        
        output = []
        body = {
            "Data": output
        }
        for userRow in data:
            if userRow["status"] == "admin":
                continue
            else:
                output.append(createUserObj(status = userRow["status"],email = userRow["email"],profilePicture = userRow["profilePicture"],editCount = userRow["editCount"]))
                
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Headers': 'Content-Type,Origin,X-Amz-Date,Authorization,X-Api-Key,x-requested-with,Access-Control-Allow-Origin,Access-Control-Request-Method,Access-Control-Request-Headers',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': True,
                'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS'
            },
            'body': json.dumps(body)
        }

    except Exception as e:
            body = {
                "Error": "Something went wrong. Please check back at a later time."
            }
            print(str(e))
            return {
                'statusCode': 500,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Headers': 'Content-Type,Origin,X-Amz-Date,Authorization,X-Api-Key,x-requested-with,Access-Control-Allow-Origin,Access-Control-Request-Method,Access-Control-Request-Headers',
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Credentials': True,
                    'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS'
                },
                'body': json.dumps(body)
            }