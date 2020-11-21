import json
import boto3
import uuid

def lambda_handler(event, context):
    
    store = boto3.client('ssm')
    env = store.get_parameter(Name = "/smartcast/env", WithDecryption = True)
    env = json.loads(env["Parameter"]["Value"])
    
    CHECK_TOKEN_VALIDITY_LAMBDA =env["CHECK_TOKEN_VALIDITY_LAMBDA"]
    

    try:
        #Get params from client
        body = event["body"]
        body = json.loads(body)
        token = str(body['access_token'])

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
        lambdaClient = boto3.client('lambda')
        
        event = {
            "body":{
                "access_token" : token
            }
        }
        
        event["body"] = json.dumps(event["body"])
        response = lambdaClient.invoke(
            FunctionName = CHECK_TOKEN_VALIDITY_LAMBDA,
            Payload = json.dumps(event)
            )
        
        responsePayload = response["Payload"].read()
        responsePayload = json.loads(responsePayload)
        responseBody = json.loads(responsePayload["body"])

        if "Success" in responseBody:
            if responseBody["status"] == "admin" or responseBody["status"] == "moderator":
                body = {
                    "Success": "User is allowed to perform this method."
                }
            else:
                body = {
                    "Error": "You do not possess the permission to commit this action."
                }
                return body
        else:
            return responseBody
    except Exception as e:
        print(str(e))
        body = {
            "Error": "Something went wrong. We weren't able to validate your session. Please log in again."
        }
        