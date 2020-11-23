import json
import boto3


def lambda_handler(event, context):
    
    
    #----------------------------------------Retrieve the parameters from SSM store----------------------------------------#
    
    try:
        store = boto3.client('ssm')
        env = store.get_parameter(Name = "/smartcast/env", WithDecryption = True)
        env = json.loads(env["Parameter"]["Value"])
        
        AUTHORIZE_USER_LAMBDA = env["AUTHORIZE_USER_LAMBDA"]
    
    
    except Exception as e:
        print("Exception : ", e)
        body = {
            "Error": "Could not retrieve the parameters from SSM store"
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
    
    
    
    #----------------------------------------Check parameters----------------------------------------#

    try:
        #Get params from client
        body = event["body"]
        body = json.loads(body)
        token = str(body['access_token'])
        command = str(body['command'])
        podcastID = str(body['podcastID'])
        
        
    except Exception as e:
        print("Exception : ", e)
        body = {
            "Error": "You must provide a podcastID, command, and an access_token."
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
    
    
    #----------------------------------------Retrieve the user's email----------------------------------------#

    
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
        
        print("item : ", item)
        print("email : ", email)
        
        
    except Exception as e:
        body = {
            "Error": "Could not retrieve user's data."
        }
        print(str(e))
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
    
    #----------------------------------------Favorite/unfavorite a podcast----------------------------------------#

    try:
        body = event["body"]
        body = json.loads(body)
        
        if("podcastID" in body):
            podcastID = str(body["podcastID"])
        
        if("command" in body):
            command = str(body["command"]).lower()
        
        
        try: 
            dynamoDB = boto3.resource('dynamodb')
            Users_Table = dynamoDB.Table("Users")
            #fetch the user row from the database
            response = Users_Table.get_item(
                Key={
                    'username': email 
                }
            )
        except Exception as e:
            body = {
                "Error": "Could not retrieve user's data."
            }
            print(str(e))
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
        
        print("response --> ", response)
        
        if "Item" in response:
            item = response["Item"]
            
            #retrieve the existing favoritePodcasts list for this user
            favoritePodcasts = item["favoritePodcasts"]
            
            
            returnMessage = ""
            
            if (command == "add"):
                if (podcastID not in favoritePodcasts):
                    favoritePodcasts.append(podcastID)
                    returnMessage = "Success: The episode is added to the favorites list"
                else:
                    returnMessage = "Message: The episode is already in the favorites list"
                
                    
            elif (command == "remove"):
                if (podcastID in favoritePodcasts):
                    favoritePodcasts.remove(podcastID)
                    returnMessage = "Success: The episode is removed from the favorites list"
                else:
                    returnMessage = "Message:  The episode is already not in the favorites list"
            
            item["favoritePodcasts"] = favoritePodcasts
            
            
            #------------------------Add the items back to the database---------------------#
            try:
                #now simply put the item back into the database
                response = Users_Table.put_item(
                   Item = item
                )
                
                return {
                    'statusCode': 200,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Headers': 'Content-Type,Origin,X-Amz-Date,Authorization,X-Api-Key,x-requested-with,Access-Control-Allow-Origin,Access-Control-Request-Method,Access-Control-Request-Headers',
                        'Access-Control-Allow-Origin': '*',
                        'Access-Control-Allow-Credentials': True,
                        'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS'
                    },
                    'body': json.dumps({"Data" : returnMessage})
                }
                
                
            except Exception as e:
                print("Exception : ", e)
                body = {
                    "Error": "Could not update the database for user's FavoritePodcasts"
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
        print("Exception : ", e)
        body = {
            "Error": "An unknown error occured"
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
        
