import json
import boto3
import botocore.exceptions
import hmac
import hashlib
import base64
import uuid


def lambda_handler(event, context):
    
    store = boto3.client('ssm')
    env = store.get_parameter(Name = "/smartcast/env", WithDecryption = True)
    env = json.loads(env["Parameter"]["Value"])
    
    USER_POOL_ID = env["USER_POOL_ID"]
    CLIENT_ID = env["CLIENT_ID"]
    CLIENT_SECRET = env["CLIENT_SECRET"]
    
    
    try:
        #Get params from client
        body = event["body"]
        body = json.loads(body)
        token = str(body["access_token"])
    except Exception as e:
        body = {
            "Error": "You must provide an access token."
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
    try:
        client = boto3.client('cognito-idp')  
        resp = client.get_user(
            AccessToken = token
           )
        
        userAttributes = resp["UserAttributes"]
        
        body = {}
        
        for attribute in userAttributes:
            if attribute["Name"] == "name":
                body["name"] = attribute["Value"]
            elif attribute["Name"] == "email":
                body["email"] = attribute["Value"]
            elif attribute["Name"] == "sub":
                body["username"] = attribute["Value"]
        
        tableName = "Users"
        dynamoDB = boto3.resource('dynamodb')
        table = dynamoDB.Table(tableName)
        
        
        response = table.get_item(
            Key = {
                "username": body["email"]
            })
        

        item = response["Item"]
        body["favoritePodcasts"] = item["favoritePodcasts"]
        body["ratings"] = item["ratings"]
        body["profilePicture"] = item["profilePicture"]
        
        try:
            s3 = boto3.resource('s3')
            bucketName = "biographies-smartcast"
            bioKeystring = item["bio"]
            if len(item["bio"]) > 0:
                s3Obj = s3.Object(bucketName,bioKeystring)
                body["bio"] = s3Obj.get()["Body"].read().decode("utf-8")
            else:
                body["bio"] = ""
        except Exception as e:
            print(str(e))
            body = {
                "Error": "Unable to retrieve bio."
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
            
            
            
        
        body["status"] = item["status"]
        body["dateJoined"] = item["dateJoined"]
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

    except client.exceptions.NotAuthorizedException as e:
        errorMessage = str(e).lower()
        print(errorMessage)
        if "invalid" in errorMessage:
            body = {
                "Error": "You are not authorized to commit this action. Please log in to retrieve a valid access token."
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
        elif "expired" in errorMessage:
            body = {
                "Error": "Your session has expired."
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
        else:
            print(str(e))
            body = {
                "Error": "Something went wrong. We weren't able to validate your session. Please log in again."
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
                'body': json.dumps(errorMessage)
            }
    except Exception as e:
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
                'body': json.dumps(errorMessage)
            }