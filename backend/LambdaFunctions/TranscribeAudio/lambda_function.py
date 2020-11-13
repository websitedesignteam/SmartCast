import json
import requests
import os
import boto3
import time
import urllib.request
import uuid


#################### HELPER FUNCTIONS #####################


#------------GET ITEM FROM THE PODCAST TABLE-------------------------#
def getItemFromPodcastTable(table, podcastID, episodeID):

    #get the current item from the table
    #the primary key are podcastID and episodeID
    response = table.get_item(
        Key={
            'podcastID': podcastID,
            'episodeID' : episodeID
        }
    )
    
    #if the database returns any item with ^ those primarykeys
    if "Item" in response:
        #get the item (i.e a row from table)
        item = response["Item"]
        return item
    
    #otherwise return None    
    else:
        return None
        
#-------------UPDATE THE ENTRY IN PODCAST TABLE------------------#
def updateItemInPodcastTable(table, item, tagsList):
    
    #if item is not none
    if item:
        
        #since the tags are initially empty
        #put the tagsList that is passed into the function, in the item["tags"]
        item["tags"] = tagsList
        # print(tagsList)
        try:
            #now simply put the item back into the database
            response = table.put_item(
               Item = item
            )
            
            print("Success : updated tags in the database")
        except Exception as e:
            print(str(e))
            
    #there was no such record to be updated      
    else:
        return "Error: No database entry found"
        

#---------------PUT TAGS IN THE ML CATEGORY TABLE------------------#
def putTagsinML_Category_Table(table, comprehendData):
    
    #iterate through the comprehendData which is a dictionary
    for key in comprehendData.keys():
        
        #tags associated with this one key
        tagsList = comprehendData[key]
        
        #the key might already be in the table
        #so get the response and see what is already in the table
        response = ML_Category_Table.get_item(
            Key={
                'category' : key
            }
        )   
        
        #if the item already exists
        if "Item" in response:
            
            #take the item
            item = response["Item"]
            
            #get the current tags in the database rn
            currentTags = item["tags"]
            
            #iterate through the tagsList that is passed in the function
            for tag in tagsList:
                
                #if the tag is not already in the list, append tag to the list
                if tag not in currentTags:
                    # print(tag)
                    currentTags.append(tag)
                    
            item["tags"] = currentTags
            
            try:
                #now simply put the item back into the database
                response2 = table.put_item(
                   Item = item
                )
                
                # print("Success : updated tags in the ML_Category_Table")
            except Exception as e:
                print(str(e))
            
            
        else:
            response3 = ML_Category_Table.put_item(
                Item={
                    'category': key,
                    'tags' : tagsList
                }
            )
            # print("Successfully added tags to ML_Category_Table")
            
            
            
            
            

def putEpisode(podcastID,episodeID, transcribedStatus = None,transcribedText = None,tags = None, genreIDs = None, visitedCount = None):
    
    tableName = os.environ.get("TableName")
    dynamoDB = boto3.resource('dynamodb')
    table = dynamoDB.Table(tableName)

    if transcribedStatus is None:
        transcribedStatus = ""

    if transcribedText is None:
        transcribedText = ""
    
    if tags is None:
        tags = []

    if genreIDs is None:
        genreIDs = []

    if visitedCount is None:
        visitedCount = 0

    try: 
        table.put_item(
            Item={
                'podcastID': podcastID,
                'episodeID': episodeID,
                'transcribedStatus': transcribedStatus,
                'transcribedText': transcribedText,
                'tags' : tags,
                'genreIDs': genreIDs,
                'visitedCount': visitedCount
            }
        )
        return 'Success'
        
    except Exception as e:
        print(str(e))
        return 'Error'

def getEpisode(podcastID,episodeID):
    
    tableName = os.environ.get("TableName")
    dynamoDB = boto3.resource('dynamodb')
    table = dynamoDB.Table(tableName)
    
    try:
        response = table.get_item(
            Key = {
                'podcastID': podcastID,
                'episodeID': episodeID
                
            }

        )
        if "Item" not in response:
            return{
                "Data": {}
            }
        else:
            data = response["Item"]
            return{
                "Data": data
            }
    except Exception as e:
        print(str(e))
        #LOG TO CLOUDWATCH HERE OR SET SOME KIND OF ALERT
        return {
            "Data" : {}
        }
        



def lambda_handler(event, context):
    
    #Extract the body from event
    print("eventtype ", type(event))
    print(event)
    json.dumps(event)
    body = event["body"]
    print("body1: ",body)
    
    print(type(body))
    print("============")
    json.dumps(body)
    print("body2: ",body)
    print(type(body))
    
    # body = json.loads(body)
    
    #Extract values from GET request and initialize vars for function call
    podcastID = str(body["podcastID"])
    episodeID = str(body["episodeID"])
    audioLink = str(body["audioLink"])
    print(podcastID)
    print(episodeID)
    print(audioLink)
    
    #Define variables for eventual database update
    transcribedStatus = "COMPLETED"
    transcribedText = None
    tags = []
    genreIDs = None
    visitedCount = None
    
    try:
        #download the audiofile using audioLink variable
        downloadmp3File = urllib.request.urlretrieve(audioLink,f"/tmp/downloadedAudio.mp3")
        downloadedFileName = downloadmp3File[0] #fetch the mp3 file name
        
        # store the url into s3
        s3 = boto3.client('s3')
        #take downloadedFileName, upload to 'transcribe-bucket-for-mp3' as 'downloadedfile.mp3'
        s3.upload_file(downloadedFileName, 'transcribe-bucket-for-mp3', 'downloadedfile.mp3')
        os.remove(downloadedFileName) #remove the mp3 from local directory after upload to s3
        
        #at this point the downloadedfile.mp3 is the stored mp3 in the S3 bucket
        
        #Write the logic for transcribing the audio fetching it from s3
        transcribe = boto3.client('transcribe')
        
        #### This will be the naming convention for every transcribe job
        job_name = "Transcription-job-" + str(uuid.uuid1())
        
        #this is the s3 path from where we are fetching the mp3 file we just stored above
        job_uri = "s3://transcribe-bucket-for-mp3/downloadedfile.mp3" 
        
        try: 
            #starting the transcribe job in AWS Transcribe
            transcribe.start_transcription_job(
                TranscriptionJobName=job_name,
                Media={'MediaFileUri': job_uri},
                MediaFormat='mp3',
                LanguageCode='en-US'
            )
        
        except:
            return {
            'statusCode': 404,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Headers': 'Content-Type,Origin,X-Amz-Date,Authorization,X-Api-Key,x-requested-with,Access-Control-Allow-Origin,Access-Control-Request-Method,Access-Control-Request-Headers',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': True,
                'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS'
            },
            'body': 'Failed to invoke the transcription job'
        }
            
        
        #while the transcription job is not complete yet, print status on the console
        while True:
            status = transcribe.get_transcription_job(TranscriptionJobName=job_name)
            if status['TranscriptionJob']['TranscriptionJobStatus'] in ['COMPLETED', 'FAILED']:
                break
            print("Not ready yet...")
            time.sleep(5)
            
        print(status)
        
        if(status['TranscriptionJob']['TranscriptionJobStatus'] == 'COMPLETED'):
        
            #we do not care about the mp3 file we stored in transcribe-bucket-for-mp3  
            #once the transcription job is completed, delete the mp3 file from s3 'transcribe-bucket-for-mp3'  bucket
            s3 = boto3.resource('s3')
            s3.Object('transcribe-bucket-for-mp3', 'downloadedfile.mp3').delete()
            
            #get the info for transcribed job once it is finished
            info = transcribe.get_transcription_job(TranscriptionJobName=job_name)
            
            #transcribeJsonFile is the unique link to access the jsonfile containing results from transcriptionjob
            transcribedJsonFile = info['TranscriptionJob']['Transcript']['TranscriptFileUri']
            
            #use the link to download the file as transcribed.json in local directory
            downloadableJsonFile = urllib.request.urlretrieve(transcribedJsonFile,f"/tmp/transcribed.json")
            jsonFileName = downloadableJsonFile[0] #store the transcribed json file's name
            
            #at this point we have the JsonFile with all the results in our local directory
            #We will read the jsonFile and extract transcribed text from it
            with open(jsonFileName, 'r') as myfile:
                data = myfile.read()
            
            #after reading the file get the json object for the results
            jsonObject = json.loads(data)
            
            #remove the json from local directory
            os.remove(jsonFileName)
            
            #extract the transcribedText from the json object
            transcribedText = jsonObject['results']['transcripts'][0]['transcript']
            
            #write the transcribedText to a textfile
            transcribedTextFile = open("/tmp/transcribedtext.txt", "wt")
            n = transcribedTextFile.write(transcribedText)
            transcribedTextFile.close()
            
            #upload the transcribedTextFile to the s3 bucket
            
            #create a unique transcribed text file name using episodeID
            transcribedTextFileName = str(episodeID) + '.txt'
            #the bucket which will contain all the transcribed text files
            transcribedBucketName = 'files-after-transcribing'
            
            #wrote the transcribed text to 'transcribedtext.txt' i.e a local file
            #store the transcribed text to s3 bucket with the name as transcribedTextFileName var
            s3 = boto3.client('s3')
            s3.upload_file('/tmp/transcribedtext.txt', transcribedBucketName, transcribedTextFileName)
            
            #finally delete the local text file
            os.remove('/tmp/transcribedtext.txt')
            
            #keystring is an S3 PATH, think of it like a unix path
            keyString = transcribedTextFileName
            
            #Get past information of data you DO NOT WANT TO OVERWRITE
            data = getEpisode(podcastID = podcastID, episodeID = episodeID)
            data = data["Data"]
            
            genreIDs = data["genreIDs"]
            visitedCount = data["visitedCount"]
            
            print(transcribedText)
            #Update your entry
            putEpisode(podcastID = podcastID, episodeID =episodeID, transcribedStatus = transcribedStatus, transcribedText = keyString, tags = tags, genreIDs = genreIDs, visitedCount = visitedCount)
            
            #write the code to update all 3 databases once this transcription job is completed
            
            
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Headers': 'Content-Type,Origin,X-Amz-Date,Authorization,X-Api-Key,x-requested-with,Access-Control-Allow-Origin,Access-Control-Request-Method,Access-Control-Request-Headers',
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Credentials': True,
                    'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS'
                },
                'body': 'Successfully Transcribed'
            }
            
        else:
            return {
                'statusCode': 404,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Headers': 'Content-Type,Origin,X-Amz-Date,Authorization,X-Api-Key,x-requested-with,Access-Control-Allow-Origin,Access-Control-Request-Method,Access-Control-Request-Headers',
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Credentials': True,
                    'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS'
                },
                'body': 'Transcription Job FAILED'
            }
            
        
    except:
        return {
            'statusCode': 404,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Headers': 'Content-Type,Origin,X-Amz-Date,Authorization,X-Api-Key,x-requested-with,Access-Control-Allow-Origin,Access-Control-Request-Method,Access-Control-Request-Headers',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': True,
                'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS'
            },
            'body': 'Transcription Failed'
        }
        
    
