import json
import boto3
import botocore.exceptions


def lambda_handler(event, context):

    
    #----------------------------------------Collect the episode metrics----------------------------------------#
        
    try:
        tableName = "Users"
        dynamoDB = boto3.resource('dynamodb')
        table = dynamoDB.Table(tableName)
        
        
        response = table.scan()
        data = response["Items"]
        users = len(data)
 
                

        tableName = "PodcastTable_DEV"
        table = dynamoDB.Table(tableName)
        
        
        response = table.scan()
        data = response["Items"]
        
        
        transcribed = 0
        inprogress = 0
        editing = 0
        requestTranscription = 0
        for episodeRow in data:
            if episodeRow["transcribedStatus"] == "COMPLETED" or episodeRow["transcribedStatus"] == "EDIT IN PROGRESS":
                transcribed += 1
            if episodeRow["transcribedStatus"] == "EDIT IN PROGRESS":
                editing += 1
            if episodeRow["transcribedStatus"] == "TRANSCRIBING":
                inprogress += 1
            if episodeRow["transcribedStatus"] == "AWAITING TRANSCRIPTION APPROVAL":
                requestTranscription += 1
        
        body = {
            "transcribed": transcribed,
            "beingTranscribed": inprogress,
            "beingEditedByCommunity": editing,
            "requestingTranscription": requestTranscription,
            "registeredUsers": users
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
            'body': json.dumps(body)
        }

    except Exception as e:
            body = {
                "Error": "Something went wrong. Please check back at a later time."
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