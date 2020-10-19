import json
import requests
import os
import boto3



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

def getEpisode(cls,podcastID,episodeID):
    
    dynamoDB = boto3.resource('dynamodb')
    table = dynamoDB.Table(cls._tableName)
    
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
    body = event["body"]
    body = json.loads(body)
    
    #Extract values from GET request and initialize vars for function call
    podcastID = str(body["podcastID"])
    episodeID = str(body["episodeID"])
    audioLink = str(body["audioLink"])
    
    #Define variables for eventual database update
    transcribedStatus = "COMPLETED"
    transcribedText = None
    tags = []
    genreIDs = None
    visitedCount = None
    
    #download the audiofile
    downloadmp3File = urllib.request.urlretrieve(audioLink,f"downloadedAudio.mp3")
    downloadedFileName = x[0]
    
    # store the url into s3
    s3 = boto.client('s3')
    s3.upload_file(downloadedFileName, 'transcribe-bucket-for-mp3', 'downloadedfile.mp3')
    os.remove(downloadedFileName)
    
    #at this point the downloadedfile.mp3 is the stored mp3 in the S3 bucket
    
    #Write the logic for transcribing the audio fetching it from s3
    transcribe = boto3.client('transcribe')
    
    #### TODO write a unique job name everytime
    job_name = "transcribe-episode-job"
    job_uri = "s3://transcribe-bucket-for-mp3/downloadedfile.mp3" #this is the s3 path
    
    transcribe.start_transcription_job(
        TranscriptionJobName=job_name,
        Media={'MediaFileUri': job_uri},
        MediaFormat='mp3',
        LanguageCode='en-US'
    )
    
    #while the transcription job is not complete yet, print status on the console
    while True:
        status = transcribe.get_transcription_job(TranscriptionJobName=job_name)
        if status['TranscriptionJob']['TranscriptionJobStatus'] in ['COMPLETED', 'FAILED']:
            break
        print("Not ready yet...")
        time.sleep(5)
        
    print(status)
    
    #once the transcription job is completed, delete the mp3 file from s3 bucket
    s3.Object('transcribe-bucket-for-mp3', 'downloadedfile.mp3').delete()
    
    #get the info for transcribed job once it is finished
    info = transcribe.get_transcription_job(TranscriptionJobName=job_name)
    
    #get the transcribed file and download it
    transcribedJsonFile = info['TranscriptionJob']['Transcript']['TranscriptFileUri']
    downloadableJsonFile = urllib.request.urlretrieve(transcribedJsonFile,f"transcribed.json")
    jsonName = downloadableJsonFile[0] #store the transcribed json file's name
    
    #Write the logic to STORE that transcribed into S3
    #upload that json to s3
    s3.upload_file(jsonName, 'files-after-transcribing', 'transcribed.json')
    
    #TODO: maybe before deleting local json, read the file and extract only the string
    #with this logic, transcribedtext variable does not contain the transcribed text, but it just contains the json downloadable link
    #this logic can be changed by using python files to extract the transcribed text
    transcribedText = info['TranscriptionJob']['Transcript']['TranscriptFileUri']
    
    #remove the json from local directory
    os.removed(jsonName)
    
    
    #MAKE SURE YOU GET THE KEYSTRING FOR S3
    #keystring is the object path in s3
    #TODO: one this api is tested go back and define these variables early-on and use instead of hardcoding
    bucketName = 'transcribe-bucket-for-mp3'
    filename = 'downloadedfile.mp3'
    
    #keystring is an S3 PATH, think of it like a unix path
    keyString = 'https://' + bucketName + '.s3.amazonaws.com/' + filename
    
    #Get past information of data you DO NOT WANT TO OVERWRITE
    data = getEpisode(podcastID = podcastID, episodeID = episodeID)
    data = data["Data"]
    
    genreIDs = data["genreIDs"]
    visitedCount = data["visitedCount"]
    
    
    #Update your entry
    putEpisode(podcastID = podcastID, episodeID =episodeID, transcribedStatus = transcribedStatus, transcribedText = keyString, tags = tags, genreIDs = genreIDs, visitedCount = visitedCount)
    
    
    
