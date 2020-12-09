import json
import boto3
import os

#############-----------HELPER FUNCTIONS-----------###############


#------------GET ITEM FROM THE PODCAST TABLE-------------------------#
def getAllItemsWithRequestedEdits(table):

    #get the current item from the table
    #the primary key are podcastID and episodeID
    
    returnList = []
    
    try: 
        #scan the whole table
        response = table.scan()
    
    except Exception as e:
        print("Exception : ", e)
        body = {
            "Error": "Could not scan the Podcast Table to retrieve all the rows with requested edits"
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
    
    
    #if the database returns any item with ^ those primarykeys
    if "Items" in response:
        #get the items
        items = response["Items"]
        
        for item in items:
            #if the item has transcribed status of "edit in progress"
            if item["transcribedStatus"] == "EDIT IN PROGRESS":
                returnList.append(item)
        
        return returnList
        
    #otherwise return None    
    else:
        print("Exception : ", e)
        body = {
            "Error": "Could not find the items in the Podcast Table"
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
        

def lambda_handler(event, context):
    
     #----------------------------------------Retrieve the parameters from SSM store----------------------------------------#
    
    try:
        store = boto3.client('ssm')
        env = store.get_parameter(Name = "/smartcast/env", WithDecryption = True)
        env = json.loads(env["Parameter"]["Value"])
        
        AUTHORIZE_ADMIN_OR_MODERATOR_LAMBDA = env["AUTHORIZE_ADMIN_OR_MODERATOR_LAMBDA"]
    
    
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
        
        
    except Exception as e:
        print("Exception : ", e)
        body = {
            "Error": "You must provide an access_token."
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
            FunctionName = AUTHORIZE_ADMIN_OR_MODERATOR_LAMBDA,
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
    
    
    #----------------------------------------Get Requested Edits----------------------------------------#
    
    try: 
        dynamoDB = boto3.resource('dynamodb')
        PodcastTable = dynamoDB.Table("PodcastTable_DEV")
        items = getAllItemsWithRequestedEdits(PodcastTable)
        
        s3 = boto3.resource('s3')
        
        returnJsonObjectList = []
        
        for item in items:
            
            print("ITEM : ", item)
            
            data = {}
            
            #get the transcribedText
            try:
                keyStringForTranscribedText = item["transcribedText"]
                s3Entry = s3.Object("files-after-transcribing", keyStringForTranscribedText)
                transcribedText = s3Entry.get()["Body"].read().decode("utf-8")
                
            except Exception as e:
                print("Exception : ", e)
                body = {
                    "Error": "Could not retrieve transcribedText from S3", 
                    "exception" : str(type(item))
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
                #get the requestedEdit
                keyStringForRequestedEdit = item["requestedEdit"]
                s3Entry = s3.Object("edited-transcriptions", keyStringForRequestedEdit)
                requestedEdit = s3Entry.get()["Body"].read().decode("utf-8")
                
            except Exception as e:
                print("Exception : ", e)
                body = {
                    "Error": "Could not retrieve requestedEdit from S3"
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
        
            
            data["podcastID"] = item["podcastID"]
            data["episodeID"] = item["episodeID"]
            data["transcribedText"] = transcribedText
            data["requestedEdit"] = requestedEdit
            
            
            returnJsonObjectList.append(data)
    
    
        if len(returnJsonObjectList) > 0:
            return {
                    'statusCode': 200,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Headers': 'Content-Type,Origin,X-Amz-Date,Authorization,X-Api-Key,x-requested-with,Access-Control-Allow-Origin,Access-Control-Request-Method,Access-Control-Request-Headers',
                        'Access-Control-Allow-Origin': '*',
                        'Access-Control-Allow-Credentials': True,
                        'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS'
                    },
                    'body': json.dumps({"Data" : returnJsonObjectList})
            }
        
        else:
            body = {
            "Message": "There are no EDIT TRANSCRIPTION requests at the moment"
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
    
    except Exception as e:
            print("Exception : ", e)
            body = {
                "Error": "An unknown error occured",
                "exception" : str(e)
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
    
