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
 


def refreshToken(client, username, refresh_token,CLIENT_ID,CLIENT_SECRET):
    secret_hash = get_secret_hash(username,CLIENT_ID,CLIENT_SECRET)
    try:
        response = client.initiate_auth(
             ClientId=CLIENT_ID,
             AuthFlow='REFRESH_TOKEN',
             AuthParameters={
                 'USERNAME': username,
                 'REFRESH_TOKEN': refresh_token,
                 'SECRET_HASH': secret_hash
              },
            ClientMetadata={
              'username': username}) 
        return 200,response,None
    except client.exceptions.UserNotFoundException as e:
        return 400,None, {
            "Error": "This user doesn't exist. Please sign up to obtain a valid refresh token."
        }
        
    except client.exceptions.NotAuthorizedException as e:
        errorMessage = str(e).lower()
        print(errorMessage)
        if "invalid refresh token" in errorMessage:
            body = {
                "Error": "You have provided an invalid refresh token. Please log in again."
            }
            return 400,None,body
        else:
            body = {
                "Error": "The username you have provided is incorrect."
            }
            return 400,None,body
    except client.exceptions.UserNotConfirmedException:
        return 400,None, {
            "Error": "This user has not verified their account."
        }
    except Exception as e:
        print(str(e))
        return 500,None, {
            "Error": "Something went wrong. Please check back at a later time."
        }
    
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
        username = str(body["username"])
        refresh_token = str(body['refresh_token'])
        
    except Exception as e:
        body = {
            "Error": "You must provide a username and refresh token."
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
    
    
    client = boto3.client('cognito-idp')  
    code,resp, errorMessage = refreshToken(client, username,refresh_token,CLIENT_ID,CLIENT_SECRET)


    if errorMessage != None:
        if code == 400:
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
        else:
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
            
    if resp.get("AuthenticationResult"):
        authparam = resp["AuthenticationResult"]
        body = {
            "JWT": {
                "access_token": resp["AuthenticationResult"]["AccessToken"],
                "refresh_token": resp["AuthenticationResult"]["IdToken"]
            }
        }
        return{
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
        return{
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