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
        msg = str(msg).encode('utf-8'),   digestmod=hashlib.sha256).digest()
    d2 = base64.b64encode(dig).decode()
    return d2
    
def lambda_handler(event, context):
    
    #Get params from ssm
    store = boto3.client('ssm')
    env = store.get_parameter(Name = "/smartcast/env", WithDecryption = True)
    env = json.loads(env["Parameter"]["Value"])
    
    USER_POOL_ID = env["USER_POOL_ID"]
    CLIENT_ID = env["CLIENT_ID"]
    CLIENT_SECRET = env["CLIENT_SECRET"]
    
    
    try:
        body = event["body"]
        body = json.loads(body)
        username = body["email"]
        password = body['password']
        code = str(body["code"])
        
    except Exception as e:
        body = {
            "Error": "You must provide an email, password, and your code."
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
        client.confirm_forgot_password(
            ClientId=CLIENT_ID,
            SecretHash=get_secret_hash(username,CLIENT_ID,CLIENT_SECRET),
            Username=username,
            ConfirmationCode=code,
            Password=password,
           )
        body = {
            "Success": "You have successfully changed your password. Please proceed to log in."
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
    except client.exceptions.CodeMismatchException as e:
        body = {
            "Error": "You have provided an invalid code."
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
    except botocore.exceptions.ParamValidationError as e:
        if len(username) == 0:
            body = {
                "Error": "Please provide a valid email address."
            }
        else:
            body = {
                "Error": "Please ensure that your new password has at least 8 characters and contains a mix of uppercase letters, lowercase letters, special characters and numbers."
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
    
    except Exception as e:
        body = {
            "Success": "Something went wrong. Please check back at a later time."
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