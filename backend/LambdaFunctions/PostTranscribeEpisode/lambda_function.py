import json
import requests
import boto3



#############-----------HELPER FUNCTIONS-----------###############

#------------GET ITEM FROM THE PODCAST TABLE-------------------------#
def getItemFromPodcastTable(table, podcastID, episodeID):

    #get the current item from the table
    #the primary key are podcastID and episodeID
    
    try: 
        response = table.get_item(
            Key={
                'podcastID': podcastID,
                'episodeID' : episodeID
            }
        )
    
    except Exception as e:
        print("Exception : ", e)
        return "ERROR"
        
    
    #if the database returns any item with ^ those primarykeys
    if "Item" in response:
        #get the item (i.e a row from table)
        item = response["Item"]
        return item
    
    #otherwise return None    
    else:
        print("Exception : ", e)
        return "ERROR"
        
    
    
    #---------------UPDATE THE ENTRY IN PODCAST TABLE-----------------#
def updateItemInPodcastTable(table, item, decision):
    
    decision = decision.lower()
        
    if decision == "accept":
        item["transcribedStatus"] = "IN PROGRESS"
    
    elif decision == "deny":
        item["transcribedStatus"] = "NOT ELIGIBLE FOR TRANSCRIPTION"
    
    try:
        #now simply put the item back into the database
        response = table.put_item(
           Item = item
        )
        
        print("Success : Successfully updated the transcribedStatus for the item in the Podcast Table")
        
        return "SUCCESS"
        
    except Exception as e:
        print("Exception : ", e)
        return "ERROR"
            
    #there was no such record to be updated      
    else:
        return "ERROR"
        
        

def lambda_handler(event, context):
    
    
    
    #----------------------------------------Retrieve the parameters from SSM store----------------------------------------#
    
    try:
        #Retrieve the environments variables via SSM
        ssm = boto3.client('ssm')
        parameter = ssm.get_parameter(Name='/smartcast/env', WithDecryption=True)
        parameter = parameter['Parameter']["Value"]
        parameter = json.loads(parameter)
        
        AUTHORIZE_ADMIN_OR_MODERATOR_LAMBDA = parameter["AUTHORIZE_ADMIN_OR_MODERATOR_LAMBDA"]
        TRANSCRIBE_AUDIO_LAMBDA = parameter["TRANSCRIBE_AUDIO_LAMBDA"]
        GET_EPISODE_SYNCHRONOUS_LAMBDA = parameter["GET_EPISODE_SYNCHRONOUS_LAMBDA"]

    
    
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
        
        token = str(body["access_token"])
        podcastID = str(body["podcastID"])
        episodeID = str(body["episodeID"])
        decision = str(body["decision"])
        
        
    except Exception as e:
        print("Exception : ", e)
        body = {
            "Error": "You must provide a podcastID, an episodeID, a decision, and an access_token."
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
        
        
        
    #----------------------------------------Post Transcribe Episode----------------------------------------#

    
    try: 
        
        #get the Podcast Table
        dynamoDB = boto3.resource('dynamodb')
        PodcastTable = dynamoDB.Table("PodcastTable_DEV") 
            
        #get the item from the Podcast Table
        item = getItemFromPodcastTable(PodcastTable, podcastID, episodeID)
        
        #if anything goes wrong while retrieving the row from the table
        if item == "ERROR":
            return {
                'statusCode': 400,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Headers': 'Content-Type,Origin,X-Amz-Date,Authorization,X-Api-Key,x-requested-with,Access-Control-Allow-Origin,Access-Control-Request-Method,Access-Control-Request-Headers',
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Credentials': True,
                    'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS'
                },
                'body': json.dumps({
                    "Error": "Could not retrieve the corresponding row from the Podcast Table"
                })
            }
        
            
        if decision == "deny":
            print("Decision : ", decision)
            updateResponse = updateItemInPodcastTable(PodcastTable, item, decision)
            
            if updateResponse == "ERROR":
                return {
                    'statusCode': 400,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Headers': 'Content-Type,Origin,X-Amz-Date,Authorization,X-Api-Key,x-requested-with,Access-Control-Allow-Origin,Access-Control-Request-Method,Access-Control-Request-Headers',
                        'Access-Control-Allow-Origin': '*',
                        'Access-Control-Allow-Credentials': True,
                        'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS'
                    },
                    'body': json.dumps({
                        "Error": "Could not update the corresponding row in the Podcast Table"
                    })
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
            'body': json.dumps({
                "Message": "Marked this episode as NOT ELIGIBLE FOR TRANSCRIPTION. Therefore, could not start a Transcription Job."
            })
        }
            
            
        #the decision is accept
        elif decision == "accept":
            #now call the listennotes API to get the audioLink
            
            event = {
                "body" :{
                    "podcastID" : podcastID,
                    "episodeID" : episodeID
                }
            }
            
            lambdaClient = boto3.client('lambda')
            
            try: 
                response = lambdaClient.invoke(
                    FunctionName= GET_EPISODE_SYNCHRONOUS_LAMBDA,
                    Payload= json.dumps(event) #don't use json.dumps here because getEpisode expects a dict object (the way it is currently implemented)
                )
                
            except Exception as e:
                print("Exception : ",e)
                return {
                    'statusCode': 400,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Headers': 'Content-Type,Origin,X-Amz-Date,Authorization,X-Api-Key,x-requested-with,Access-Control-Allow-Origin,Access-Control-Request-Method,Access-Control-Request-Headers',
                        'Access-Control-Allow-Origin': '*',
                        'Access-Control-Allow-Credentials': True,
                        'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS'
                    },
                    'body': json.dumps({
                        "Error": "Could not call GET_EPISODE_SYNCHRONOUS_LAMBDA"
                    })
                }
                
            
            responsePayload = response["Payload"]
            responsePayload = responsePayload.read()
            responsePayload = responsePayload.decode("utf-8")
            responsePayload = json.loads(responsePayload)
            
            body = responsePayload["body"]
            body = json.loads(body)
            print("body -> ", body)
            print("bodytype : ", type(body))
            data = body["Data"]
            
            print("data : ", data)
            print("datatype : ", type(data))
            audioLink = data["episodeAudioLink"]
            
            print("Audio Link : ", audioLink)                

            #call another lambda function to ASYNCHRONOUSLY begin the transcription of audio
    
            try:
                lambdaClient = boto3.client('lambda')
                
                event = {
                    "body": {
                        "podcastID": podcastID,
                        "episodeID": episodeID,
                        "audioLink": audioLink
                    }
                }
                
                lambdaClient.invoke(
                    FunctionName = TRANSCRIBE_AUDIO_LAMBDA,
                    InvocationType = 'Event',
                    Payload = json.dumps(event)
                    )
                    
                print("Decision accept: ", decision)
                
                updateResponse = updateItemInPodcastTable(PodcastTable, item, decision)
                
                if updateResponse == "ERROR":
                    return {
                        'statusCode': 400,
                        'headers': {
                            'Content-Type': 'application/json',
                            'Access-Control-Allow-Headers': 'Content-Type,Origin,X-Amz-Date,Authorization,X-Api-Key,x-requested-with,Access-Control-Allow-Origin,Access-Control-Request-Method,Access-Control-Request-Headers',
                            'Access-Control-Allow-Origin': '*',
                            'Access-Control-Allow-Credentials': True,
                            'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS'
                        },
                        'body': json.dumps({
                            "Error": "Could not update the corresponding row in the Podcast Table"
                        })
                    }
                
                
                return{
                    'statusCode': 200,
                    'headers' : {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Headers': 'Content-Type,Origin,X-Amz-Date,Authorization,X-Api-Key,x-requested-with,Access-Control-Allow-Origin,Access-Control-Request-Method,Access-Control-Request-Headers',
                        'Access-Control-Allow-Origin': '*',
                        'Access-Control-Allow-Credentials': True,
                        'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS'
                    },
                    'body': json.dumps({"Success" : "Transcription Job Started"})
                }
            except Exception as e:
                print("Exception : ",e)
                return {
                    'statusCode': 400,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Headers': 'Content-Type,Origin,X-Amz-Date,Authorization,X-Api-Key,x-requested-with,Access-Control-Allow-Origin,Access-Control-Request-Method,Access-Control-Request-Headers',
                        'Access-Control-Allow-Origin': '*',
                        'Access-Control-Allow-Credentials': True,
                        'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS'
                    },
                    'body': json.dumps({
                        "Error": "Transcription Failed"
                    })
                }
        
    except TypeError as e:
        print("TypeError")
        return {
            'statusCode': 400,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Headers': 'Content-Type,Origin,X-Amz-Date,Authorization,X-Api-Key,x-requested-with,Access-Control-Allow-Origin,Access-Control-Request-Method,Access-Control-Request-Headers',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': True,
                'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS'                
            },
            'body': json.dumps({
                "Error": "TypeError"
            })
        }
                
    except requests.exceptions.HTTPError as errh:
        print("HTTP Error", errh)
        return {
            'statusCode': 400,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Headers': 'Content-Type,Origin,X-Amz-Date,Authorization,X-Api-Key,x-requested-with,Access-Control-Allow-Origin,Access-Control-Request-Method,Access-Control-Request-Headers',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': True,
                'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS'                
            },
            'body': json.dumps({
                "HTTP Exception": errh
            })
        }
        
    except requests.exceptions.ConnectionError as errc:
        print("Connection Error", errc)
        return {
            'statusCode': 400,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Headers': 'Content-Type,Origin,X-Amz-Date,Authorization,X-Api-Key,x-requested-with,Access-Control-Allow-Origin,Access-Control-Request-Method,Access-Control-Request-Headers',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': True,
                'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS'                
            },
            'body': json.dumps({
                "Connection Exception": errc
            })
        }
        
    except requests.exceptions.Timeout as errt:
        print("Timeout", errt)
        return {
            'statusCode': 400,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Headers': 'Content-Type,Origin,X-Amz-Date,Authorization,X-Api-Key,x-requested-with,Access-Control-Allow-Origin,Access-Control-Request-Method,Access-Control-Request-Headers',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': True,
                'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS'                
            },
            'body': json.dumps({
                "Timeout Exception": errt
            })
        }
        
    except requests.exceptions.RequestException as err:
        print("TypeError", e)
        return {
            'statusCode': 400,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Headers': 'Content-Type,Origin,X-Amz-Date,Authorization,X-Api-Key,x-requested-with,Access-Control-Allow-Origin,Access-Control-Request-Method,Access-Control-Request-Headers',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': True,
                'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS'                
            },
            'body': json.dumps({
                "Request Exception": err
            })
        }
        
    except Exception as e:
        print("An unknown error occured : ", e)
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Headers': 'Content-Type,Origin,X-Amz-Date,Authorization,X-Api-Key,x-requested-with,Access-Control-Allow-Origin,Access-Control-Request-Method,Access-Control-Request-Headers',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': True,
                'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS'                
            },
            'body': json.dumps({
                "Error": "An unknown error occured",
                "Exception" : e
            })
        }
