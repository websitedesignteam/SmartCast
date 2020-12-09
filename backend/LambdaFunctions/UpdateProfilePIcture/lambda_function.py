import json
import boto3
import base64

def lambda_handler(event, context):
    
    #----------------------------------------Retrieve the parameters from SSM store----------------------------------------#
    try:
        
        store = boto3.client('ssm')
        env = store.get_parameter(Name = "/smartcast/env", WithDecryption = True)
        env = json.loads(env["Parameter"]["Value"])
        
        USER_POOL_ID = env["USER_POOL_ID"]
        CLIENT_ID = env["CLIENT_ID"]
        CLIENT_SECRET = env["CLIENT_SECRET"]
    
        AUTHORIZE_USER_LAMBDA = env["AUTHORIZE_USER_LAMBDA"]
    
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
        token = body["access_token"]
        b64image = body["b64image"]
        extension = body["extension"]
        
    except Exception as e:
        body = {
            "Error": "You must provide an access_token, image, and extension."
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
            FunctionName = AUTHORIZE_USER_LAMBDA,
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
        
        
    
    #----------------------------------------Update their profile picture----------------------------------------#
    try:
        client = boto3.client('cognito-idp')  
            
        resp = client.get_user(
            AccessToken = token
           )
        
        userAttributes = resp["UserAttributes"]
        
        
        
        email = None
        username = None
        for attribute in userAttributes:
            if attribute["Name"] == "email":
                email = attribute["Value"]
            elif attribute["Name"] == "sub":
                username = attribute["Value"]
        
        tableName = "Users"
        dynamoDB = boto3.resource('dynamodb')
        table = dynamoDB.Table(tableName)
        
        
        response = table.get_item(
            Key = {
                "username": email
            })
        

        item = response["Item"]
         
    
        s3 = boto3.resource('s3')
        bucket_name = 'profilepicture-smartcast'
        fileName = username+"profilepicture"+ extension
        
        obj = s3.Object(bucket_name,fileName)
        if extension == ".jpg":
            obj.put(Body = base64.b64decode(b64image),ContentType = "image/jpeg")
        elif extension == ".png":
            obj.put(Body = base64.b64decode(b64image),ContentType = "image/png")
        
        #get bucket location
        # location = boto3.client('s3').get_bucket_location(Bucket=bucket_name)['LocationConstraint']
        #get object url
        object_url = "https://%s.s3.amazonaws.com/%s" % (bucket_name, fileName)
        print(object_url)
        
        
        item["profilePicture"] = object_url
        
        response = table.put_item(
            Item = item
        )
        
        body = {
            "Success": "Your profile picture has been updated!"
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
        body = {
            "Error": "Something went wrong. We weren't able to update your profile picture."
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