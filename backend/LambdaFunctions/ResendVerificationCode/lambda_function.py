import json
import boto3
import botocore.exceptions
import hmac
import hashlib
import base64
import uuid


def get_secret_hash(username,CLIENT_ID,CLIENT_SECRET):
    msg = username + CLIENT_ID
    dig = hmac.new(str(CLIENT_SECRET).encode('utf-8'), 
        msg = str(msg).encode('utf-8'),
        digestmod=hashlib.sha256).digest()
    d2 = base64.b64encode(dig).decode()
    return d2
    
def lambda_handler(event, context):
    
    #Get environment variables from SSM
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
        username = body["email"]
        
    except Exception as e:
        body = {
            "Error": "You must provide an email."
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
    
    
    try:
        response = client.resend_confirmation_code(
        ClientId=CLIENT_ID,
        SecretHash=get_secret_hash(username,CLIENT_ID,CLIENT_SECRET),
        Username=username,
    )
        body = {
            "Success": "Done. If your account exists, you will be receiving a verification code via email shortly."
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
    
    except Exception as e:
        if len(username) == 0:
            body = {
                "Error": "Please provide a valid email."
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
            body = {
                "Error": "Something went wrong.Please check back at a later time."
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