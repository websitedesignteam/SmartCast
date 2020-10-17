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
    return response

def getEpisode(cls,podcastID,episodeID):
    
    dynamoDB = boto3.resource('dynamodb')
    table = dynamoDB.Table(cls._tableName)
    
    try:
        response = table.get_item(
            Key = {
                'podcastID': podcastID,
                'episodeID': episodeID
                
            }

        )
        if "Item" not in response:
            return{
                "Data": {}
            }
        else:
            data = response["Item"]
            return{
                "Data": data
            }
    except Exception as e:
        print(str(e))
        #LOG TO CLOUDWATCH HERE OR SET SOME KIND OF ALERT
        return {
            "Data" : {}
        }
        



def lambda_handler(event, context):
    
    #Extract the body from event
    body = event["body"]
    body = json.loads(body)
    
    #Extract values from GET request and initialize vars for function call
    podcastID = str(body["podcastID"])
    episodeID = str(body["episodeID"])
    audioLink = str(body["audioLink"])
    
    #Define variables for eventual database update
    transcribedStatus = "COMPLETED"
    transcribedText = None
    tags = []
    genreIDs = None
    visitedCount = None
    
    
    #Write the logic for transcribing the audio, use audioLinkHere
    
    transcribedText = "WHATEVER YOU TRANSCRIBED"
    
    #Write the logic to STORE that transcribed into S3
    #MAKE SURE YOU GET THE KEYSTRING FOR S3
    
    #Use transcribedText variable 
    
    #keystring is an S3 PATH, think of it like a unix path
    keyString = "WHATEVER KEYSTRING YOU USED TO STORE" #MAKE SURE YOU GET THE KEYSTRING BACK!!!!
    
    #Get past information of data you DO NOT WANT TO OVERWRITE
    data = getEpisode(podcastID = podcastID, episodeID = episodeID)
    data = data["Data"]
    
    genreIDs = data["genreIDs"]
    visitedCount = data["visitedCount"]
    
    
    #Update your entry
    putEpisode(podcastID = podcastID, episodeID =episodeID, transcribedStatus = transcribedStatus, transcribedText = keyString, tags = tags, genreIDs = genreIDs, visitedCount = visitedCount)
    
    
    
