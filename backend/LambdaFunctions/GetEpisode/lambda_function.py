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
        
    
    
        #----------------------------------------Retrieve the parameters from SSM store----------------------------------------#
        
        try:
            store = boto3.client('ssm')
            env = store.get_parameter(Name = "/smartcast/env", WithDecryption = True)
            env = json.loads(env["Parameter"]["Value"])
            
            GETALLREVIEWS_LAMBDA = env["GETALLREVIEWS_LAMBDA"]
        
        
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
        #----------------------------------------Get Review Data----------------------------------------#
        try:
            lambdaClient = boto3.client('lambda')
            
            event = {
                "body":{
                    "podcastID" : returnData["podcastID"],
                    "episodeID" : returnData["episodeID"]
                }
            }
            
            event["body"] = json.dumps(event["body"])
            response = lambdaClient.invoke(
                FunctionName = GETALLREVIEWS_LAMBDA,
                Payload = json.dumps(event)
                )
            
            responsePayload = response["Payload"].read()
            responsePayload = json.loads(responsePayload)
            print("responsepayload:",responsePayload)
            
            if "body" not in responsePayload:
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
            
            responsePayload = responsePayload["body"]
            reviewData = json.loads(responsePayload)
            print("reviewData:",reviewData)
            reviewData = reviewData["Data"]
            star = 0
            count = 0
            
            for reviewData in reviewData:
                star += float(reviewData["rating"])
                count += 1.
            
            average = 0
            if count > 0:
                average =  round(star/count,2)
            returnData["averageRating"] = average
            returnData["totalReviews"] = int(count)
            
            
        except Exception as e:
            print("Exception : ", e)
            body = {
                "Error": "Something we weren't able to get your episode data. Please try again"
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
        
        data = data["Data"]
        if len(data) == 0:
            returnData["transcribedStatus"] = "NOT TRANSCRIBED"
            returnData["transcribedText"] = ""
            returnData["tags"] = []
            returnData["genreIDs"] = []
            returnData["visitedCount"] = 0
        else:
            returnData["transcribedStatus"] = data["transcribedStatus"]
            if data["transcribedStatus"] == "COMPLETED" or data["transcribedStatus"] == "EDIT IN PROGRESS":
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
        body = json.loads(body) #uncomment this for /getEpisode to work
        
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