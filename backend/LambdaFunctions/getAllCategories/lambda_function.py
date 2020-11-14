import json
import boto3

def getAllCategories(table):
    
    categoriesList = []
    
    #scan the whole table
    response = table.scan()
    
    
    if "Items" in response:
        items = response["Items"]
        
        for item in items:
            category = item["category"]
            categoriesList.append(category)
            
        return {
            "Data" : categoriesList
        }
    
    else:
        return{
            json.dumps({"Error: No categories found"})
        }
    

def lambda_handler(event, context):
    
    try: 
        dynamoDB = boto3.resource('dynamodb')
        ML_Category_Table = dynamoDB.Table("ML_Category")
        
        data = getAllCategories(ML_Category_Table)
        
        if "Data" in data:
            categoriesList = data["Data"]
            
            return{
                'statusCode': 200,
                'headers' : {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Headers': 'Content-Type,Origin,X-Amz-Date,Authorization,X-Api-Key,x-requested-with,Access-Control-Allow-Origin,Access-Control-Request-Method,Access-Control-Request-Headers',
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Credentials': True,
                    'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS'
                },
                'body': json.dumps(categoriesList)
                }
        
        else:
            return{
                'statusCode': 400,
                'headers' : {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Headers': 'Content-Type,Origin,X-Amz-Date,Authorization,X-Api-Key,x-requested-with,Access-Control-Allow-Origin,Access-Control-Request-Method,Access-Control-Request-Headers',
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Credentials': True,
                    'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS'
                },
                'body': json.dumps({"Error: No categories found"})
                }
            
    except Exception as e:
        print(str(e))
        return{
                'statusCode': 400,
                'headers' : {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Headers': 'Content-Type,Origin,X-Amz-Date,Authorization,X-Api-Key,x-requested-with,Access-Control-Allow-Origin,Access-Control-Request-Method,Access-Control-Request-Headers',
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Credentials': True,
                    'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS'
                },
                'body': json.dumps({"Error" : e})
                }
