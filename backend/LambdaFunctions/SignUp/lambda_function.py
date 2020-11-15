import boto3
import botocore.exceptions
import botocore.errorfactory
import hmac
import hashlib
import base64
import json


#Helpfer function for SecretHash
def get_secret_hash(username,CLIENT_ID,CLIENT_SECRET):
    msg = username + CLIENT_ID
    dig = hmac.new(str(CLIENT_SECRET).encode('utf-8'), msg = str(msg).encode('utf-8'), digestmod=hashlib.sha256).digest()
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
        email = body["email"]
        password = body['password']
        name = body["name"]  
        
    except Exception as e:
        body = {
            "Error": "You must provide an email, password, and your name."
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
        resp = client.sign_up(
            ClientId=CLIENT_ID,
            SecretHash=get_secret_hash(email,CLIENT_ID,CLIENT_SECRET),
            Username=email,
            Password=password, 
            UserAttributes=[
            {
                'Name': "name",
                'Value': name
            },
            {
                'Name': "email",
                'Value': email
            }
            ],
            ValidationData=[
            {
                'Name': "username",
                'Value': email
            }])
        body = {
            "Success": "Please check your email to retrieve the verification code."
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
        
    except client.exceptions.UsernameExistsException as e:
        body = {
            "Error": "This account already exists."
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
        if len(email) == 0:
            body = {
                "Error": "Please provide a valid email address."
            }
        else:
            body = {
                "Error": "Please ensure that your password has at least 8 characters and contains a mix of uppercase letters, lowercase letters, special characters and numbers."
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