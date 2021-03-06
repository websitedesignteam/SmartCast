import json
import requests
import boto3


def getEpisode(podcastID,episodeID):
    
    #Retrieve the environments variables via SSM
    ssm = boto3.client('ssm')
    parameter = ssm.get_parameter(Name='/smartcast/env', WithDecryption=True)
    parameter = parameter['Parameter']["Value"]
    parameter = json.loads(parameter)
    
    API_KEY = parameter["API_KEY"]
    GETALLREVIEWS_LAMBDA = parameter["GETALLREVIEWS_LAMBDA"]
    print("API_KEY = ", API_KEY)
    dynamoDB = boto3.resource('dynamodb')
    table = dynamoDB.Table("PodcastTable_DEV")
    
    print(table)
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
          'X-ListenAPI-Key': API_KEY
        }
        response = requests.request('GET', url, headers=headers)
        listenNotesData = response.json()
        print("listennotesdata--> ", listenNotesData)
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
        
        
        lambdaClient = boto3.client('lambda')
        
        event = {
            "body":{
                "podcastID" : returnData["podcastID"],
                "episodeID" : returnData["episodeID"]
            }
        }
        
        event["body"] = json.dumps(event["body"])
        lambdaResponse = lambdaClient.invoke(
            FunctionName = GETALLREVIEWS_LAMBDA,
            Payload = json.dumps(event)
            )
        
        responsePayload = lambdaResponse["Payload"].read()
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
        
        print("Data -->", data)
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
                returnData["tags"] = data["tags"]
                returnData["genreIDs"] = data["genreIDs"]
                returnData["visitedCount"] = int(data["visitedCount"])
            else:
                returnData["transcribedText"] = data["transcribedText"]
                returnData["tags"] = data["tags"]
                returnData["genreIDs"] = data["genreIDs"]
                returnData["visitedCount"] = int(data["visitedCount"])
                
        return { "Data": returnData}
    except Exception as e:
        print("Exception in function : ", e)
        body = {"Error": "Please provide a valid Podcast ID and Episode ID."}
        return body

def lambda_handler(event, context):
    
    try:
        #Extract the body from event
        print(event)
        body = event["body"]
        # body = json.loads(body) #uncomment this for /getEpisode to work
        
        #Extract values from GET request and initialize vars for function call
        episodeID = str(body["episodeID"])
        podcastID = str(body["podcastID"])
    except Exception as e:
        print("Exception : ", e)
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
    print("bodyy ---> ", body)
    if "Error" in body:
        print("Error")
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