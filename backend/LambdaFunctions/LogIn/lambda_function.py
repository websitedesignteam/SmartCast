import boto3
import botocore.exceptions
import hmac
import hashlib
import base64
import json


def get_secret_hash(username,CLIENT_ID,CLIENT_SECRET):
  msg = username + CLIENT_ID 
  dig = hmac.new(str(CLIENT_SECRET).encode('utf-8'),
  msg = str(msg).encode('utf-8'), digestmod=hashlib.sha256).digest()
  d2 = base64.b64encode(dig).decode()
  return d2
  
def login(client, username, password,CLIENT_ID,CLIENT_SECRET):
    secret_hash = get_secret_hash(username,CLIENT_ID,CLIENT_SECRET)
    try:
        response = client.initiate_auth(
             ClientId=CLIENT_ID,
             AuthFlow='USER_PASSWORD_AUTH',
             AuthParameters={
                 'USERNAME': username,
                 'SECRET_HASH': secret_hash,
                 'PASSWORD': password,
              },
            ClientMetadata={
              'username': username,
              'password': password})
        
        return response,None
    except client.exceptions.NotAuthorizedException:
        return None, {
            "Error": "Invalid username/password combination."
        }
    except client.exceptions.UserNotConfirmedException:
        return None, {
            "Error": "Please ensure your account has been verfied via email first before signing in."
        }
    except Exception as e:
        print(str(e))
        return None,{
            "Error": "Something went wrong. Please check back at a later time."
        }
        
    
    
def lambda_handler(event, context):
    
    #Get environment variables from SSM
    store = boto3.client('ssm')
    env = store.get_parameter(Name = "/smartcast/env", WithDecryption = True)
    env = json.loads(env["Parameter"]["Value"])
    
    USER_POOL_ID = env["USER_POOL_ID"]
    CLIENT_ID = env["CLIENT_ID"]
    CLIENT_SECRET = env["CLIENT_SECRET"]
    client = boto3.client('cognito-idp')  
    
    
    try:
        #Get params from client
        body = event["body"]
        body = json.loads(body)
        username = str(body["email"])
        password = str(body['password'])
        
    except Exception as e:
        body = {
            "Error": "You must provide an email and password."
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
    
    response, errorMessage = login(client, username, password,CLIENT_ID,CLIENT_SECRET)
    
    if errorMessage != None:
        if "Something" in errorMessage["Error"]:
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
                'body': json.dumps(errorMessage)
            }
    if response.get("AuthenticationResult"):
        body = { 
               "id_token": response["AuthenticationResult"]["IdToken"],
               "refresh_token": response["AuthenticationResult"]["RefreshToken"],
               "access_token": response["AuthenticationResult"]["AccessToken"]
        }
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
    else:
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
        