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
    except Exception as e:
        print(str(e))
        #LOG TO CLOUDWATCH HERE OR SET SOME KIND OF ALERT
        data =  {
            "Data" : {}
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
        returnData["transcribedText"] = data["transcribedText"]
        returnData["tags"] = data["tags"]
        returnData["genreIDs"] = data["genreIDs"]
        returnData["visitedCount"] = data["visitedCount"]

    return { "Data": returnData}

def lambda_handler(event, context):
    #Extract the body from event
    
    body = event["body"]
    body = json.loads(body)
    
    #Extract values from GET request and initialize vars for function call
    episodeID = str(body["episodeID"])
    podcastID = str(body["podcastID"])
    
    
    #Main function call

        
    
    return{
        'statusCode': 200,
        'headers' : {'Content-Type': 'application/json'},
        'body': json.dumps(getEpisode(podcastID = podcastID, episodeID = episodeID))
    }
