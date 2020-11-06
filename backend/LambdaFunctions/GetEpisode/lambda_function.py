import json
import requests
import os
import boto3


def getEpisode(podcastID,episodeID):
    
    tableName = os.environ.get("TableName")
    dynamoDB = boto3.resource('dynamodb')
    table = dynamoDB.Table(tableName)
    
    try:
        response = table.get_item(
            Key = {
                'podcastID': podcastID,
                'episodeID': episodeID
                
            }

        )
        if "Item" not in response:
            data = { "Data": {}
            }
        else:
            data = response["Item"]
            data = {
                "Data": data
            }
    
        url = 'https://listen-api.listennotes.com/api/v2/episodes/' + episodeID
        headers = {
          'X-ListenAPI-Key': os.environ.get("APIKEY"),
        }
        response = requests.request('GET', url, headers=headers)
        listenNotesData = response.json()
        
        returnData = {}
        returnData["episodeID"] = episodeID
        returnData["episodeAudioLink"] = listenNotesData["audio"]
        returnData["episodeImage"] = listenNotesData["image"]
        returnData["episodeThumbnail"] = listenNotesData["thumbnail"]
        returnData["episodeTitle"] = listenNotesData["title"]
        returnData["episodeDescription"] = listenNotesData["description"]
        returnData["episodeAudioLength"] = listenNotesData["audio_length_sec"]
        returnData["podcastID"] = podcastID
        returnData["podcastPublisher"] = listenNotesData["podcast"]["publisher"]
        returnData["podcastTitle"] = listenNotesData["podcast"]["title"]
        data = data["Data"]
        if len(data) == 0:
            returnData["transcribedStatus"] = "NOT TRANSCRIBED"
            returnData["transcribedText"] = ""
            returnData["tags"] = []
            returnData["genreIDs"] = []
            returnData["visitedCount"] = 0
        else:
            returnData["transcribedStatus"] = data["transcribedStatus"]
            if data["transcribedStatus"] == "COMPLETED":
                s3 = boto3.resource('s3')
                obj = s3.Object("files-after-transcribing",data["transcribedText"])
                text = obj.get()['Body'].read().decode('utf-8')
                returnData["transcribedText"] = text
            else:
                returnData["transcribedText"] = data["transcribedText"]
            returnData["tags"] = data["tags"]
            returnData["genreIDs"] = data["genreIDs"]
            returnData["visitedCount"] = int(data["visitedCount"])
    
        return { "Data": returnData}
    except Exception as e:
        body = {"Error": "Please provide a valid Podcast ID and Episode ID."}
        return body

def lambda_handler(event, context):
    
    try:
        #Extract the body from event
        
        body = event["body"]
        body = json.loads(body)
        
        #Extract values from GET request and initialize vars for function call
        episodeID = str(body["episodeID"])
        podcastID = str(body["podcastID"])
    except Exception as e:
        body = {
            "Error": "You must provide a Podcast ID and Episode ID."
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
        
    body = getEpisode(podcastID = podcastID, episodeID = episodeID)
    if "Error" in body:
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
    return{
        'statusCode': 200,
        'headers' : {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Headers': 'Content-Type,Origin,X-Amz-Date,Authorization,X-Api-Key,x-requested-with,Access-Control-Allow-Origin,Access-Control-Request-Method,Access-Control-Request-Headers',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': True,
            'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS'},
        'body': json.dumps(body)
    }