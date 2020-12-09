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
        return body
    
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
            if responseBody["status"] == "admin":
                body = {
                    "Success": "User is allowed to perform this method."
                }
                return body
            else:
                body = {
                    "Error": "You do not possess the permission to commit this action."
                }
                return body
        else:
            return responseBody
    except Exception as e:
        body = {
            "Error": "Something went wrong. We weren't able to validate your session. Please log in again."
        }
        return body
        