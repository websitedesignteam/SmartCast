import json
import boto3

def getAllEpisodesofATag(table, podcastID, episodeID):
    
    #get the current item from the table
    #the primary key are podcastID and episodeID
    response = table.get_item(
        Key={
            'podcastID': podcastID,
            'episodeID' : episodeID
        }
    )
    
    #if the database returns any item with ^ those primarykeys
    if "Item" in response:
        
        item = response["Item"]
        return {
            "Data" : item["tags"]
        }
        
    #otherwise return None   
    else:
        return None
    

def lambda_handler(event, context):
    # TODO implement
    
    try:
        dynamoDB = boto3.resource('dynamodb')
        PodcastTable = dynamoDB.Table("PodcastTable_DEV")
        
        print(event)
        body = event["body"]
        body = json.loads(body)
        
        
        if "podcastID" in body:
            podcastID = str(body["podcastID"])
            
        if "episodeID" in body:
            episodeID = str(body["episodeID"])
    
    
        data = getAllEpisodesofATag(PodcastTable, podcastID, episodeID)
        
        if "Data" in data:
            print(data)
            return{
                'statusCode': 200,
                'headers' : {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Headers': 'Content-Type,Origin,X-Amz-Date,Authorization,X-Api-Key,x-requested-with,Access-Control-Allow-Origin,Access-Control-Request-Method,Access-Control-Request-Headers',
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Credentials': True,
                    'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS'
                },
                'body': json.dumps(data)
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
                'body': json.dumps({
                    "Error": "No data found for this episodeID and podcastID"
                })
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
                "Error": e
                })
            }