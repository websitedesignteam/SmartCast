import json
import boto3


def lambda_handler(event, context):
    # TODO implement
    
    try:
        body = event["body"]
        body = json.loads(body)
        
        if("username" in body):
            username = str(body["username"]).lower()
        
        if("podcastID" in body):
            podcastID = str(body["podcastID"])
        
        if("episodeID" in body):
            episodeID = str(body["episodeID"])
        
        if("isFavorite" in body):
            isFavorite = str(body["isFavorite"]).lower()
        
        
        dynamoDB = boto3.resource('dynamodb')
        Users_Table = dynamoDB.Table("Users")
        #fetch the user row from the database
        response = Users_Table.get_item(
            Key={
                'username': username 
            }
        )
        
        print("response --> ", response)
        
        if "Item" in response:
            item = response["Item"]
            
            #favoritePodcasts is a list of lists where each list in the favoritePodcasts list is a podcastID and EpisodeID
            #for example: [["432423", 324234], ["342453","3424323"]] contains two items
            
            episode = [podcastID, episodeID]
            favoritePodcasts = item["favoritePodcasts"]
            
            returnMessage = ""
            
            if (isFavorite == "true"):
                if (episode not in favoritePodcasts):
                    favoritePodcasts.append(episode)
                    returnMessage = "Success: The episode is added to the favorites list"
                else:
                    returnMessage = "Message: The episode is already in the favorites list"
                    
                    
            elif (isFavorite == "false"):
                if (episode in favoritePodcasts):
                    favoritePodcasts.remove(episode)
                    returnMessage = "Success: The episode is removed from the favorites list"
                else:
                    returnMessage = "Message:  The episode is already not in the favorites list"
            
            item["favoritePodcasts"] = favoritePodcasts
            
            try:
                #now simply put the item back into the database
                response = Users_Table.put_item(
                   Item = item
                )
                
            # print("Success : updated tags in the ML_Category_Table")
            except Exception as e:
                print(str(e))
    
        return{
            'statusCode': 200,
            'headers' : {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Headers': 'Content-Type,Origin,X-Amz-Date,Authorization,X-Api-Key,x-requested-with,Access-Control-Allow-Origin,Access-Control-Request-Method,Access-Control-Request-Headers',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': True,
                'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS'
            },
            'body': json.dumps({"Data" : returnMessage})
        }
        
    except Exception as e:
        return{
            'statusCode': 400,
            'headers' : {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Headers': 'Content-Type,Origin,X-Amz-Date,Authorization,X-Api-Key,x-requested-with,Access-Control-Allow-Origin,Access-Control-Request-Method,Access-Control-Request-Headers',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': True,
                'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS'
            },
            'body': json.dumps({"Exception" : e})
        }
        
