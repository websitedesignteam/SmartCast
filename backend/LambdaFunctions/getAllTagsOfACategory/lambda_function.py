import json
import boto3

def getAllTagsOfACategory(ML_Category_Table, ML_Tag_Search_Table, category):
    
    try: 
        #run the query for a category
        response = ML_Category_Table.get_item(
            Key={
                'category': category
            }
        )
        
        if "Item" in response:
            item = response["Item"]
            tagsList = item["tags"]
            
            returnList = []
            
            for tag in tagsList:
                
                response2 = ML_Tag_Search_Table.get_item(
                    Key={
                        'tag' : tag
                    }
                ) 
                
                if "Item" in response2:
                    item2 = response2["Item"]
                    episodes = item2["episodes"]
    
                    tagObject = {}
                    tagObject["tag"] = tag
                    tagObject["image"] = ""
                    tagObject["episodeCount"] = len(episodes)
                    returnList.append(tagObject)
                
            print(returnList)
            
            return {
                "Data" : returnList
            }
    
    except Exception as e:
        print("Exception : " , e)
        return{
            json.dumps({"Error : ", e})
        }
    

def lambda_handler(event, context):
    
    try: 
        body = event["body"]
        body = json.loads(body)
        
        print("body: ", body)
        if "category" in body:
            category = body["category"]
            if category == "COMMERCIAL ITEM":
                category = "COMMERCIAL_ITEM"
                
            print("Category == ", category)
        
            dynamoDB = boto3.resource('dynamodb')
            ML_Category_Table = dynamoDB.Table("ML_Category")
            ML_Tag_Search_Table = dynamoDB.Table("ML_Tag_Search")
                
            data = getAllTagsOfACategory(ML_Category_Table, ML_Tag_Search_Table, category)
            print("data -->", data)
            
            if "Data" in data:
                tagsList = data["Data"]
                
                return{
                    'statusCode': 200,
                    'headers' : {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Headers': 'Content-Type,Origin,X-Amz-Date,Authorization,X-Api-Key,x-requested-with,Access-Control-Allow-Origin,Access-Control-Request-Method,Access-Control-Request-Headers',
                        'Access-Control-Allow-Origin': '*',
                        'Access-Control-Allow-Credentials': True,
                        'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS'
                    },
                    'body': json.dumps({"Data" : tagsList})
                }
            
    except Exception as e:
        print("Exception : " , e)
        return{
            'statusCode': 200,
            'headers' : {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Headers': 'Content-Type,Origin,X-Amz-Date,Authorization,X-Api-Key,x-requested-with,Access-Control-Allow-Origin,Access-Control-Request-Method,Access-Control-Request-Headers',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': True,
                'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS'
            },
            'body': json.dumps({"Error : ", e})
        }
