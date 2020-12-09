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
    totalSeconds = int((previousTime - currentTime).total_seconds())
    if totalSeconds < 60:
        calculatedTime = totalSeconds
        if calculatedTime == 1:
            return str(calculatedTime) + " second ago"
        return str(calculatedTime) + " seconds ago"
    elif totalSeconds < 3600:
        calculatedTime = totalSeconds //60
        if calculatedTime == 1:
            return str(calculatedTime) + " minute ago"
        return str(calculatedTime) + " minutes ago"
    elif totalSeconds < 86400:
        calculatedTime = totalSeconds//60//60
        if calculatedTime == 1:
            return str(calculatedTime) + " hour ago"
        return str(calculatedTime) + " hours ago"
    else:
        calculatedTime = totalSeconds//60//60//24
        if calculatedTime == 1:
            return str(calculatedTime) + " day ago"
        return str(calculatedTime) + " days ago"

def generateUUID():
    return str(uuid.uuid4())

def lambda_handler(event, context):
    
    #----------------------------------------Retrieve the parameters from SSM store----------------------------------------#
    try:
        
        store = boto3.client('ssm')
        env = store.get_parameter(Name = "/smartcast/env", WithDecryption = True)
        env = json.loads(env["Parameter"]["Value"])
        
        USER_POOL_ID = env["USER_POOL_ID"]
        CLIENT_ID = env["CLIENT_ID"]
        CLIENT_SECRET = env["CLIENT_SECRET"]
    
        AUTHORIZE_USER_LAMBDA = env["AUTHORIZE_USER_LAMBDA"]
    
    except Exception as e:
        body = {
            "Error": "Something went wrong. Please check back at a later time."
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
    

    #----------------------------------------Validate inputs----------------------------------------#
    try:
        #Get params from client
        body = event["body"]
        body = json.loads(body)
        review = body["review"]
        rating = int(body["rating"])
        token = body["access_token"]
        podcastID = str(body["podcastID"])
        episodeID = str(body["episodeID"])
        combinedID =podcastID+episodeID
        
        
    except Exception as e:
        body = {
            "Error": "You must provide an access_token, review, rating, podcastID, and episodeID."
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
        
        
    
    #----------------------------------------Authorize the user----------------------------------------#
    try:
        lambdaClient = boto3.client('lambda')
        
        event = {
            "body":{
                "access_token" : token
            }
        }
        
        event["body"] = json.dumps(event["body"])
        response = lambdaClient.invoke(
            FunctionName = AUTHORIZE_USER_LAMBDA,
            Payload = json.dumps(event)
            )
        
        responsePayload = response["Payload"].read()
        responsePayload = json.loads(responsePayload)
        if "Success" not in responsePayload:
            if  "Something" in responsePayload["Error"]:
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
                    'body': json.dumps(responsePayload)
                }
    except Exception as e:
        print("Exception : ", e)
        body = {
            "Error": "Something went wrong. We weren't able to validate your session. Please log in again."
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
        
    
    
    #----------------------------------------Submit Comment----------------------------------------#
    try:
        client = boto3.client('cognito-idp')  
        
        resp = client.get_user(
            AccessToken = token
           )
        
        userAttributes = resp["UserAttributes"]
        
        email = None
        username = None
        for attribute in userAttributes:
            if attribute["Name"] == "email":
                email = attribute["Value"]
            elif attribute["Name"] == "name":
                name = attribute["Value"]
            elif attribute["Name"] == "sub":
                username = attribute["Value"]
        
        tableName = "Users"
        dynamoDB = boto3.resource('dynamodb')
        table = dynamoDB.Table(tableName)
        
        
        response = table.get_item(
            Key = {
                "username": email
            })
        
        
        item = response["Item"]
        
        try:
            s3Resource = boto3.resource('s3')
            bucketName = "profileratings-smartcast"
            ratings = item["ratings"]
            if len(ratings) > 0:
                
                s3Obj = s3Resource.Object(bucketName,ratings)
                ratingsData = s3Obj.get()["Body"].read().decode("utf-8")
                ratingsData = json.loads(ratingsData)
            else:
                ratingsData = []
        except Exception as e:
            print(str(e))
            body = {
                "Error": "We were unable to retrieve your review history."
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
        
        #Terminate early if user already submitted review
        if combinedID in ratingsData:
            body = {
                "Error": "You've already submitted a review for this podcast."
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
        
        
        commentID = generateUUID()
        
        
        
        
        s3 = boto3.client('s3')
        
        #Save users entire rating history into their json file
        filePath = "/tmp/"+username+"ratings.txt"
        ratingKeystring = username+"ratings.txt"
        bucketName = "profileratings-smartcast"
        userRatingJsonDataFile = open(filePath,"wt")
        ratingsData.append(combinedID)
        ratingsData = json.dumps(ratingsData)
        userRatingJsonDataFile.write(ratingsData)
        userRatingJsonDataFile.close()
        
        #Store text file into S3
        s3.upload_file(filePath,bucketName,ratingKeystring)
        
        
        #Save users reviews into text file
        filePath = "/tmp/"+commentID+".txt"
        keystring = commentID+".txt"
        bucketName = "reviews-smartcast"
        reviewTextFile = open(filePath,"wt")
        reviewTextFile.write(review)
        reviewTextFile.close()
        
        #Store text file into S3
        s3.upload_file(filePath,bucketName,keystring)
        
        
        #Update user profile
        item["ratings"] = ratingKeystring
        response = table.put_item(
            Item = item
        )
        
        #Now go into comments database and register their review
        tableName = "Reviews"
        table = dynamoDB.Table(tableName)
        
        table.put_item(
            Item = {
                "combinedID": combinedID,
                "commentID": commentID,
                "review": keystring,
                "rating": rating,
                "date": convertDateToString(datetime.now()),
                "email": email,
                "name": name,
                "podcastID": podcastID,
                "episodeID": episodeID
            })
        body  = {
            "Success": "Your review has been submitted."
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
            "Error": "Something went wrong. We weren't to process your review."
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