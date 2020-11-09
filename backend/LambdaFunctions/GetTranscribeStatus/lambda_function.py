import json
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
            raise Exception("Failure")
        else:
            data = response["Item"]
            data = {
                "Data": data
            }
    except Exception as e:
        body = {
            "Error": "Invalid Request. This episode never reached the transcription stage."
        }
        return body

    returnData = {}

    data = data["Data"]
    if len(data) == 0:
        returnData["transcribedStatus"] = "NOT TRANSCRIBED"
        returnData["transcribedText"] = ""
    else:
        returnData["transcribedStatus"] = data["transcribedStatus"]
        if data["transcribedStatus"] == "COMPLETED":
            s3 = boto3.resource('s3')
            obj = s3.Object("files-after-transcribing",data["transcribedText"])
            text = obj.get()['Body'].read().decode('utf-8')
            returnData["transcribedText"] = text
        else:
            returnData["transcribedText"] = data["transcribedText"]

    return { "Data": returnData}
    

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
    
    if "Data" in body:
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
    else:
        return{
            'statusCode': 400,
            'headers' : {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Headers': 'Content-Type,Origin,X-Amz-Date,Authorization,X-Api-Key,x-requested-with,Access-Control-Allow-Origin,Access-Control-Request-Method,Access-Control-Request-Headers',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': True,
                'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS'},
            'body': json.dumps(body)
        }
        