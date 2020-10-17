import json
import requests
import os
import boto3

def putEpisode(podcastID,episodeID, transcribedStatus = None,transcribedText = None,tags = None, genreIDs = None, visitedCount = None):
    
    tableName = os.environ.get("TableName")
    dynamoDB = boto3.resource('dynamodb')
    table = dynamoDB.Table(tableName)

    if transcribedText is None:
        transcribedText = ""

    #do the same for tags,genreIDs,visitedCount
    #note visited count default is 0
    
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
    
    #Extract the body from event
    body = event["body"]
    body = json.loads(body)
    
    #Extract values from GET request and initialize vars for function call
    podcastID = str(body["podcastID"])
    episodeID = str(body["episodeID"])
    audioLink = str(body["audioLink"])
    
    
    try: 
        putResponse = putEpisode(podcastID = podcastID, episodeID =episodeID)
        if putResponse == "Error":
            return {
                'statusCode': 404,
                'headers': {'Content-Type': 'application/json'},
                'body': json.dumps({
                    "Error": "put meaningful error"
                })
            }
        #call another lambda function to ASYNCHRONOUSLY begin the transcription of audio
        
        try:
            lambdaClient = boto3.client('lambda')
            
            event = {
                "podcastID": podcastID,
                "episodeID": episodeID,
                "audioLink": audioLink
            }
            
            client.invoke(
                Functionname = 'PUT ARN HERE', #TODO: put your ARN over here
                InvocationType = 'Event',
                Paylaod = json.dumps(event)
                )
        except:
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json'},
                'body': json.dumps({
                    "Error": "put meaningful error"
                })
            }
                    
    # TODO implement
    return {
        'statusCode': 200,
        'headers': {'Content-Type': 'application/json'},
        'body': json.dumps({
            "Success": "put meaningful message here"
        })
    }
