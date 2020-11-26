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
        body = {
            "Error": "Could not 'get' item from the Podcast Table for given episodeID and podcastID"
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
    
    #if the database returns any item with ^ those primarykeys
    if "Item" in response:
        #get the item (i.e a row from table)
        item = response["Item"]
        return item
    
    #otherwise return None    
    else:
        body = {
            "Error": "Could not find the item in the Podcast Table"
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
        
#---------------UPDATE THE ENTRY IN PODCAST TABLE-----------------#
def updateItemInPodcastTable(table, item, keyString, editorsEmail):
    
    #if item is not none
    if item:
        #A precautionary step to see if the item's editorsEmail field is already populated, if it is already populated then should not overwrite and return
        if "editorsEmail" in item:
            
            #if some other user has already submitted the request for same transcription
            #note: this implementation allows the same user to submit editTranscription request more than once in a row
            if item["editorsEmail"] != editorsEmail:
                print("someone already has submitted a request")
                return "ERROR"
        
        
        #reach here if the editorsEmail field is empty
        #update the fields in item
        item["requestedEdit"] = keyString
        item["editorsEmail"] = editorsEmail
        item["transcribedStatus"] = "EDIT IN PROGRESS"
        
        print("Item : ", item)
        
        try:
            #now simply put the item back into the database
            response = table.put_item(
               Item = item
            )
            
            print("Success : updated requestedEdit, editorsEmail, and transcribedStatus fields in Podcast Table")
            return "SUCCESS"
            
            
            
        except Exception as e:
            print("Exception : ", e)
            body = {
                "Error": "Could not update requestedEdit, editorsEmail, and transcribedStatus fields in Podcast Table"
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
            
    #there was no such record to be updated      
    else:
        body = {
            "Error": "Could not update requestedEdit, editorsEmail, and transcribedStatus fields in Podcast Table"
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
        
        
        
        


def lambda_handler(event, context):
    
    print("started1")
    #----------------------------------------Retrieve the parameters from SSM store----------------------------------------#
    
    try:
        store = boto3.client('ssm')
        env = store.get_parameter(Name = "/smartcast/env", WithDecryption = True)
        env = json.loads(env["Parameter"]["Value"])
        
        AUTHORIZE_USER_LAMBDA = env["AUTHORIZE_USER_LAMBDA"]
        
    
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
        #Get params from frontend
        body = event["body"]
        body = json.loads(body)
        
        podcastID = str(body["podcastID"])
        episodeID = str(body["episodeID"])
        token = str(body["access_token"])
        editedTranscriptionText = str(body["editedTranscriptionText"])
        
        
    except Exception as e:
        print("Exception : ", e)
        body = {
            "Error": "You must provide the editedTranscriptionText, podcastID, episodeID, and an access_token."
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
        

        item = response["Item"]
        
        print("item : ", item)
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
    
    
    
    
    
    
    #----------------------------------------Request for editing transcription----------------------------------------#
    
    try:
        
        editorsEmail = email
        
        try:
            #open editedTranscriptionFile in /tmp directory
            editedTranscriptionFile = open("/tmp/editedTranscriptionFile.txt", "wt")
            
            #write the editedTranscriptionText from front-end into the editTranscriptionFile
            n = editedTranscriptionFile.write(editedTranscriptionText)
            
            #close the file after writing to it
            editedTranscriptionFile.close()
        
        except Exception as e:
            print("Exception : ", e)
            body = {
                "Error": "Could not open a file to write."
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
            
        
        #take this file and upload it to the S3 database
        
        #give a unique name to the file containing edited transcription text (in this case <episodeID>.txt)
        editedTranscriptionFileName = str(episodeID) + '.txt'
        
        #what is the S3 bucket name that we want to put this file into?            
        editedTranscriptionBucketName = 'edited-transcriptions'
        
        try:
            s3 = boto3.client('s3')
            #there are 3 parameters : (1)the file to upload, (2)the bucket, (3)the filename by which the file is being store
            s3.upload_file('/tmp/editedTranscriptionFile.txt', editedTranscriptionBucketName, editedTranscriptionFileName)

        except Exception as e:
            print("Exception : ", e)
            body = {
                "Error": "Could not upload the file to S3."
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
        
        
        #finally delete the local text file
        os.remove('/tmp/editedTranscriptionFile.txt')
        
        #the keyString is the actual name of editedTranscriptionFilename stored in S3
        keyString = editedTranscriptionFileName
        
        #get the Podcast Table
        dynamoDB = boto3.resource('dynamodb')
        PodcastTable = dynamoDB.Table("PodcastTable_DEV") 
        
        #retrieve the item(row) from the database
        item = getItemFromPodcastTable(PodcastTable, podcastID, episodeID)
        
        #update the item in the Podcast table
        response = updateItemInPodcastTable(PodcastTable, item, keyString, editorsEmail)
        
  
        if response == "ERROR":
            body = {
            "Error": "Cannot process your request. A user has already requested to edit this transcription. Please come back at a later time"
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
            
            
        elif response == "SUCCESS":
            #if everything goes well, return the message
            body = {
                "Success": "Your request for editing transcription has been received. Please wait for a decision."
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
        print("Exception : ", e)
        body = {
            "Error": "An unknown error occured."
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
    
    