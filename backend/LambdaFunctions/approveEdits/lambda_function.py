import json
import boto3
import os
import uuid

#############-----------HELPER FUNCTIONS-----------###############

#------------GET ITEM FROM THE PODCAST TABLE-------------------------#
def getItemFromPodcastTable(table, podcastID, episodeID):

    #get the current item from the table
    #the primary key are podcastID and episodeID
    
    try: 
        response = table.get_item(
            Key={
                'podcastID': podcastID,
                'episodeID' : episodeID
            }
        )
    
    except Exception as e:
        print("Exception : ", e)
        return "ERROR"
        
    
    #if the database returns any item with ^ those primarykeys
    if "Item" in response:
        #get the item (i.e a row from table)
        item = response["Item"]
        return item
    
    #otherwise return None    
    else:
        print("Exception : ", e)
        return "ERROR"
        
#---------------UPDATE THE ENTRY IN PODCAST TABLE-----------------#
def updateItemInPodcastTable(table, item, decision):
    
    print("ITEM 1 :" ,item)
    decision = decision.lower()
    
    s3 =  boto3.resource('s3')
    dynamoDB = boto3.resource('dynamodb')
    PodcastTable = dynamoDB.Table("PodcastTable_DEV")
        
        
    if decision == "accept":
        print("never entered here")
        requestedEditKeyString = item["requestedEdit"]
        requestedEditBucketName = 'edited-transcriptions'
        
        s3Object = s3.Object(requestedEditBucketName, requestedEditKeyString)
        requestedEditText = s3Object.get()["Body"].read().decode("utf-8")
        
        
        transcribedtextKeyString = item["transcribedText"]
        transcribedtextBucketName = "files-after-transcribing"
        
        #fetch the newtranscribed text from requested edit
        newTranscribedText = requestedEditText
        
        #put it into a file
        newTranscribedTextFile = open("/tmp/newTranscribedTextFile.txt", "wt")
        
        #write the newTranscribedText into the newTranscribedTextFile
        n = newTranscribedTextFile.write(newTranscribedText)
        
        #close the file after writing to it
        newTranscribedTextFile.close()
        
        s3 = boto3.client('s3')
        
        #there are 3 parameters : (1)the file to upload, (2)the bucket, (3)the filename by which the file is being store
        s3.upload_file('/tmp/newTranscribedTextFile.txt', transcribedtextBucketName, transcribedtextKeyString)
        
        os.remove('/tmp/newTranscribedTextFile.txt')
    
        
    
    #do this anyway
    item["transcribedStatus"] = "COMPLETED"
    item["editorsEmail"] = ""
    item["requestedEdit"] = ""
    
    print("ITEM 2 :" ,item)
    try:
        #now simply put the item back into the database
        
        response = PodcastTable.put_item(
           Item = item
        )
        
        print("Success : Successfully updated the database and S3")
        
        return "SUCCESS"
        
    except Exception as e:
        print("Exception : ", e)
        return "ERROR"
            
    #there was no such record to be updated      
    else:
        return "ERROR"
        

        
        

def lambda_handler(event, context):
    
    #----------------------------------------Retrieve the parameters from SSM store----------------------------------------#
    
    try:
        store = boto3.client('ssm')
        env = store.get_parameter(Name = "/smartcast/env", WithDecryption = True)
        env = json.loads(env["Parameter"]["Value"])
        
        AUTHORIZE_ADMIN_OR_MODERATOR_LAMBDA = env["AUTHORIZE_ADMIN_OR_MODERATOR_LAMBDA"]
    
    
    except Exception as e:
        print("Exception : ", e)
        body = {
            "Error": "Could not retrieve the parameters from SSM store"
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
        
        
        
    #----------------------------------------Check parameters----------------------------------------#

    try:
        #Get params from client
        body = event["body"]
        body = json.loads(body)
        token = str(body['access_token'])
        decision = str(body['decision'])
        podcastID = str(body['podcastID'])
        episodeID = str(body['episodeID'])
        
        
    except Exception as e:
        print("Exception : ", e)
        body = {
            "Error": "You must provide a podcastID, podcastName, decision, and an access_token."
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
            FunctionName = AUTHORIZE_ADMIN_OR_MODERATOR_LAMBDA,
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
        
        
        
        
    #----------------------------------------Retrieve the user's email----------------------------------------#

    
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
            elif attribute["Name"] == "sub":
                username = attribute["Value"]
        
        tableName = "Users"
        dynamoDB = boto3.resource('dynamodb')
        table = dynamoDB.Table(tableName)
        
        
        response = table.get_item(
            Key = {
                "username": email
            })
        

        userItem = response["Item"]
        
        print("item : ", userItem)
        print("email : ", email)
        
        
    except Exception as e:
        body = {
            "Error": "Could not retrieve user's data."
        }
        print(str(e))
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



        
    #----------------------------------------Approve/Reject a transcription edit request----------------------------------------#


    try:
        
        #get the Podcast Table
        dynamoDB = boto3.resource('dynamodb')
        PodcastTable = dynamoDB.Table("PodcastTable_DEV") 
        
        #get the item from the Podcast Table
        PodcastItem = getItemFromPodcastTable(PodcastTable, podcastID, episodeID)
        
        #if anything goes wrong while retrieving the row from the table
        if PodcastItem == "ERROR":
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
                    "Error": "Could not retrieve the corresponding row from the Podcast Table"
                })
            }
            
        
        s3 = boto3.resource('s3')
        
        if (decision == "accept"):
            updateResponse = updateItemInPodcastTable(table, PodcastItem, decision)
            
            if updateResponse == "ERROR":
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
                        "Error": "Could not update the corresponding row in the Podcast Table"
                    })
                }
                
            
            approvedEdits = userItem["approvedEdits"]
            approvedEdits += 1
            userItem["approvedEdits"] = approvedEdits
            
            try:
                #now simply put the item back into the database
                dynamoDB = boto3.resource('dynamodb')
                usersTable = dynamoDB.Table(tableName)
                response = usersTable.put_item(
                   Item = userItem
                )
                
                return {
                    'statusCode': 200,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Headers': 'Content-Type,Origin,X-Amz-Date,Authorization,X-Api-Key,x-requested-with,Access-Control-Allow-Origin,Access-Control-Request-Method,Access-Control-Request-Headers',
                        'Access-Control-Allow-Origin': '*',
                        'Access-Control-Allow-Credentials': True,
                        'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS'
                    },
                    'body': json.dumps({"Success": "The request for EDIT TRANSCRIPTION has been approved. The db is updated"})
                }
            
            except Exception as e:
                print("Exception : ", e)
                body = {
                    "Error": "Could not update the database for user's approvedEdits"
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
            
        
        elif (decision == "deny"):
            
            updateResponse = updateItemInPodcastTable(table, PodcastItem, decision)
            
            if updateResponse == "ERROR":
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
                        "Error": "Could not update the corresponding row in the Podcast Table"
                    })
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
                'body': json.dumps({
                    "Message": "The request for EDIT TRANSCRIPTION is DENIED."
                })
            }
            
    
    except Exception as e:
        print("Exception : ", e)
        body = {
            "Error": "An unknown error occured"
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