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
    
    #Retrieve the environments variables via SSM
    ssm = boto3.client('ssm')
    parameter = ssm.get_parameter(Name='/smartcast/env', WithDecryption=True)
    parameter = parameter['Parameter']["Value"]
    parameter = json.loads(parameter)
    
    GET_EPISODE_SYNCHRONOUS_LAMBDA = parameter["GET_EPISODE_SYNCHRONOUS_LAMBDA"]
    
    try:
        dynamoDB = boto3.resource('dynamodb')
        ML_Tag_Search_Table = dynamoDB.Table("ML_Tag_Search")
        
        # print(event)
        body = event["body"]
        body = json.loads(body)
        
        
        if ("tag" in body):
            tag = str(body["tag"])
            tag = tag.lower()
            
        data = getAllEpisodesofATag(ML_Tag_Search_Table, tag)
        
        print("data --> ml table ", data)
        if "Data" in data:
            
            returnList = []
            
            episodes = data["Data"]
            
            #iterate through the list of episodes
            for episode in episodes:
                #each episode here itself is a list that contains two items
                #episode[0] = podcastID
                #episode[1] = episodeID
                #how do we know? the logic is written in TranscribeAudio lambda in putTagsInML_Tag_Search_Table() function
                
                podcastID = episode[0]
                episodeID = episode[1]
                print("PODCAST ID: ",podcastID)
                print("EPISODE ID: ", episodeID)
                event = {
                    "body" :{
                        "podcastID" : podcastID,
                        "episodeID" : episodeID
                    }
                }
                
                lambdaClient = boto3.client('lambda')
                
                response = lambdaClient.invoke(
                    FunctionName= GET_EPISODE_SYNCHRONOUS_LAMBDA,
                    Payload= json.dumps(event) #don't use json.dumps here becuase getEpisode expects a dict object (the way it is currently implemented)
                )
                
                print("response payload: ", response)
                responsePayload = response["Payload"]
                responsePayload = responsePayload.read()
                responsePayload = responsePayload.decode("utf-8")
                responsePayload = json.loads(responsePayload)
                
                body2 = responsePayload["body"]
                body2 = json.loads(body2)
                print("body2 == ",body2)
                returnList.append(body2["Data"])
            
            print("hereeee")
            return{
                'statusCode': 200,
                'headers' : {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Headers': 'Content-Type,Origin,X-Amz-Date,Authorization,X-Api-Key,x-requested-with,Access-Control-Allow-Origin,Access-Control-Request-Method,Access-Control-Request-Headers',
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Credentials': True,
                    'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS'
                },
                'body': json.dumps({"Data" : returnList})
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