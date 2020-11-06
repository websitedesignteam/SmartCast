import json
import requests
import os
import boto3

#Main function call
def putEpisode(podcastID,episodeID, transcribedStatus = None,transcribedText = None,tags = None, genreIDs = None, visitedCount = None):
    tableName = os.environ.get("TableName")
    dynamoDB = boto3.resource('dynamodb')
    table = dynamoDB.Table(tableName)

    if transcribedStatus is None:
        transcribedStatus = "IN PROGRESS"

    if transcribedText is None:
        transcribedText = ""
    
    if tags is None:
        tags = []

    if genreIDs is None:
        genreIDs = []

    if visitedCount is None:
        visitedCount = 0
    
    try: 
        table.put_item(
            Item={
                'podcastID': podcastID,
                'episodeID': episodeID,
                'transcribedStatus': transcribedStatus,
                'transcribedText': transcribedText,
                'tags' : tags,
                'genreIDs': genreIDs,
                'visitedCount': visitedCount
            }
        )
        return 'Success'
    except Exception as e:
        print(str(e))
        return 'Error'

def lambda_handler(event, context):
    print(event)
    print(type(event))
    #Extract the body from event
    body = event["body"]
    body = json.loads(body)
    
    #Extract values from GET request and initialize vars for function call
    podcastID = str(body["podcastID"])
    episodeID = str(body["episodeID"])
    audioLink = str(body["audioLink"])
    
    
    try: 
        putResponse = putEpisode(podcastID, episodeID)
        if putResponse == "Error":
            return {
                'statusCode': 404,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Headers': 'Content-Type,Origin,X-Amz-Date,Authorization,X-Api-Key,x-requested-with,Access-Control-Allow-Origin,Access-Control-Request-Method,Access-Control-Request-Headers',
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Credentials': True,
                    'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS'
                },
                'body': json.dumps({
                    "Error": "Cannot connect to the database"
                })
            }
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
                FunctionName = 'arn:aws:lambda:us-east-1:838451841239:function:TranscribeAudio',
                InvocationType = 'Event',
                Payload = json.dumps(event)
                )
                
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
        except:
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
                    "Error": "Transcription Failed"
                })
            }
        
    except TypeError as e:
        print("Type Error", e)
        return{"Error" : "error"}
        # return {'body': json.dumps({"Error" : e})}
                
    except requests.exceptions.HTTPError as errh:
        return {'body': json.dumps({"HTTP Exception" : errh})}
        print("HTTP Exception : ", errh)
        
    except requests.exceptions.ConnectionError as errc:
        return {'body': json.dumps({"Connection Exception" : errc})}
        print("Connection Exception : ", errc)
        
    except requests.exceptions.Timeout as errt:
        return {'body': json.dumps({"Timeout Exception" : errt})}
        print("Timeout Exception : ", errt)
        
    except requests.exceptions.RequestException as err:
        return {'body': json.dumps({"Unknown exception" : err})}
        print("Unknown Exception : ", err)
        
    except:
        return {
            'statusCode': 404,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Headers': 'Content-Type,Origin,X-Amz-Date,Authorization,X-Api-Key,x-requested-with,Access-Control-Allow-Origin,Access-Control-Request-Method,Access-Control-Request-Headers',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': True,
                'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS'                
            },
            'body': json.dumps({
                "Error": "Cannot connect to the database"
            })
        }
