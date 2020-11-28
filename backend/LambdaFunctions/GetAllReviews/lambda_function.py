import json
import boto3
import botocore.exceptions
import uuid
from datetime import datetime

#----------------------------------------Helper Functions----------------------------------------#
def convertDateToString(date):
    return date.strftime("%d/%m/%Y %H:%M:%S")
    
def convertStringToDate(date):
    return datetime.strptime(date, "%d/%m/%Y %H:%M:%S")
    

def deltaTime(previousTime,currentTime):
    return int((previousTime-currentTime).total_seconds())

def deltaTimeString(previousTime,currentTime):
    totalSeconds = int((previousTime - currentTime).total_seconds())
    if totalSeconds < 60:
        calculatedTime = totalSeconds
        calculatedTime = str(calculatedTime)
        if calculatedTime == "1":
            return calculatedTime + " second ago"
        return calculatedTime + " seconds ago"
    elif totalSeconds < 3600:
        calculatedTime = totalSeconds //60
        calculatedTime = str(calculatedTime)
        if calculatedTime == "1":
            return calculatedTime + " minute ago"
        return calculatedTime + " minutes ago"
    elif totalSeconds < 86400:
        calculatedTime = totalSeconds//60//60
        calculatedTime = str(calculatedTime)
        if calculatedTime == "1":
            return calculatedTime + " hour ago"
        return calculatedTime + " hours ago"
    else:
        calculatedTime = totalSeconds//60//60//24
        calculatedTime = str(calculatedTime)
        if calculatedTime == "1":
            return calculatedTime + " day ago"
        return calculatedTime + " days ago"

def generateUUID():
    return str(uuid.uuid4())

def lambda_handler(event, context):
    s3Resource = boto3.resource('s3')


    #----------------------------------------Validate inputs----------------------------------------#
    try:
        #Get params from client
        body = event["body"]
        body = json.loads(body)
        podcastID = str(body["podcastID"])
        episodeID = str(body["episodeID"])
        combinedID =podcastID+episodeID
        
        
    except Exception as e:
        body = {
            "Error": "You must provide a podcastID, and episodeID."
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
        
    #----------------------------------------Retrieve Data----------------------------------------#
    try:
        now = datetime.now()
        def getUserData(email):
            tableName = "Users"
            dynamoDB = boto3.resource('dynamodb')
            table = dynamoDB.Table(tableName)
            
            
            response = table.get_item(
                Key = {
                    "username": email
                })
            
            
            item = response["Item"]
            
            return item["profilePicture"]
        
        try:
            tableName = "Reviews"
            dynamoDB = boto3.resource('dynamodb')
            table = dynamoDB.Table(tableName)
            
            response = table.scan()
            
            reviewData = []
            items = response["Items"]
            for item in items:
                if item["combinedID"] == combinedID:
                    reviewData.append(item)
        
        except Exception as e:
            print(str(e))
            body = {
                "Error": "Something went wrong. Please try again later."
            }
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
        
        #Get all the review data + user's profile picture
        for index,review in enumerate(reviewData):
            try:
                bucketName = "reviews-smartcast"
                keyString = review["review"]
                s3Obj = s3Resource.Object(bucketName,keyString)
                review["review"] = s3Obj.get()["Body"].read().decode("utf-8")
                review["profilePicture"] = getUserData(review["email"])
                reviewDate = review["date"]
                reviewDate = convertStringToDate(reviewDate)
                now = convertDateToString(now)
                now = convertStringToDate(now)
                elapsedTime = deltaTimeString(now,reviewDate)
                review["rating"] = int(review["rating"])
                review["commentAge"] = elapsedTime
                review["sortAge"] = deltaTime(now,reviewDate)
                reviewData[index] = review
            except Exception as e:
                print(str(e))
                body = {
                    "Error": "Something went wrong. Please try again later."
                }
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
        
        reviewData = sorted(reviewData, key = lambda x: x["sortAge"])
        
        body  = {
            "Data": reviewData
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
            "Error": "Something went wrong. Please check back later."
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