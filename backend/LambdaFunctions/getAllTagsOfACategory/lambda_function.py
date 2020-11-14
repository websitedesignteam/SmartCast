import json
import boto3

def getAllEpisodesofATag(table, tag):
    
    try: 
        #run the query for a tag
        response = table.get_item(
            Key={
                'tag': tag
            }
        )
        print("response --> ", response)
        
        if "Item" in response:
            item = response["Item"]
            
            episodes = item["episodes"]
            
            print(episodes)
            return {
                "Data" : episodes
            }
    
    except Exception as e:
        print("Exception : " , e)
        return{
            json.dumps({"Error : ", e})
        }
    

def lambda_handler(event, context):
    # TODO implement
    print("event" , event)
    
    
    try:
        dynamoDB = boto3.resource('dynamodb')
        ML_Tag_Search_Table = dynamoDB.Table("ML_Tag_Search")
        
        # print(event)
        body = event["body"]
        body = json.loads(body)
        
        
        if ("tag" in body):
            tag = str(body["tag"])
            
        data = getAllEpisodesofATag(ML_Tag_Search_Table, tag)
        
        if "Data" in data:
            episodes = data["Data"]
            
            #iterate through the list of episodes
            for episode in episodes:
                
                #set body from the event in every iteration
                body = event["body"]
                body = json.loads(body)
                
                #each episode here itself is a list that contains two items
                #episode[0] = podcastID
                #episode[1] = episodeID
                #how do we know? the logic is written in TranscribeAudio lambda in putTagsInML_Tag_Search_Table() function
                
                podcastID = episode[1]
                episodeID = episode[0]
                
                #now that we have retrieved the episodeID and podcastID
                body["podcastID"] = podcastID
                body["episodeID"] = episodeID
                
                
                # print("\n before: ")
                # print(type(event["body"]))
                # print(event["body"])
                # print("Event before : ",event)
                event["body"] =  body
                print("==========", event)
                # print("\n after: ")
                # print(type(event["body"]))
                # print(event["body"])
                # print("Event after : ",event)
                
                lambdaClient = boto3.client('lambda')
                print("event", event)
                response = lambdaClient.invoke(
                    FunctionName='arn:aws:lambda:us-east-1:838451841239:function:getEpisode',
                    Payload= json.dumps(event)
                )
                
                print("response payload: ", response)
                responsePayload = response["Payload"].read()
                print(responsePayload)
                
            
            return{
                'statusCode': 200,
                'headers' : {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Headers': 'Content-Type,Origin,X-Amz-Date,Authorization,X-Api-Key,x-requested-with,Access-Control-Allow-Origin,Access-Control-Request-Method,Access-Control-Request-Headers',
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Credentials': True,
                    'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS'
                },
                'body': json.dumps(episodes)
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