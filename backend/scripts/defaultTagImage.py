import json
import boto3
import base64

def lambda_handler(event, context):
    tableName = "ML_Tag_Search"
    dynamoDB = boto3.resource('dynamodb')
    table = dynamoDB.Table(tableName)
    
    
    response = table.scan()
    
    items = response["Items"]
    

    for item in items:
        item["tagImage"] = "https://profilepicture-smartcast.s3.amazonaws.com/logo.png"
        response = table.put_item(
            Item = item
        )


lambda_handler(123,456)