import json
import requests
import os
import boto3
import json



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
    
    #download the audiofile using audioLink variable
    downloadmp3File = urllib.request.urlretrieve(audioLink,f"downloadedAudio.mp3")
    downloadedFileName = downloadmp3File[0] #fetch the mp3 file name
    
    # store the url into s3
    s3 = boto.client('s3')
    #take downloadedFileName, upload to 'transcribe-bucket-for-mp3' as 'downloadedfile.mp3'
    s3.upload_file(downloadedFileName, 'transcribe-bucket-for-mp3', 'downloadedfile.mp3')
    os.remove(downloadedFileName) #remove the mp3 from local directory after upload to s3
    
    #at this point the downloadedfile.mp3 is the stored mp3 in the S3 bucket
    
    #Write the logic for transcribing the audio fetching it from s3
    transcribe = boto3.client('transcribe')
    
    #### This will be the naming convention for every transcribe job
    job_name = "Transcribe-job-for-" + episodeID
    #this is the s3 path from where we are fetching the mp3 file we just stored above
    job_uri = "s3://transcribe-bucket-for-mp3/downloadedfile.mp3" 
    
    #starting the transcribe job in AWS Transcribe
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
    
    #we do not care about the mp3 file we stored in transcribe-bucket-for-mp3  
    #once the transcription job is completed, delete the mp3 file from s3 'transcribe-bucket-for-mp3'  bucket
    s3 = boto3.resource('s3')
    s3.Object('transcribe-bucket-for-mp3', 'downloadedfile.mp3').delete()
    
    #get the info for transcribed job once it is finished
    info = transcribe.get_transcription_job(TranscriptionJobName=job_name)
    
    #transcribeJsonFile is the unique link to access the jsonfile containing results from transcriptionjob
    transcribedJsonFile = info['TranscriptionJob']['Transcript']['TranscriptFileUri']
    
    #use the link to download the file as transcribed.json in local directory
    downloadableJsonFile = urllib.request.urlretrieve(transcribedJsonFile,f"transcribed.json")
    jsonFileName = downloadableJsonFile[0] #store the transcribed json file's name
    
    #at this point we have the JsonFile with all the results in our local directory
    #We will read the jsonFile and extract transcribed text from it
    with open(jsonFileName, 'r') as myfile:
        data = myfile.read()
    
    #after reading the file get the json object for the results
    jsonObject = json.loads(data)
    
    #remove the json from local directory
    os.removed(jsonFileName)
    
    #extract the transcribedText from the json object
    transcribedText = json_object['results']['transcripts'][0]['transcript']
    
    #write the transcribedText to a textfile
    transcribedTextFile = open("transcribedtext.txt", "wt")
    n = transcribedTextFile.write(transcribedText)
    transcribedTextFile.close()
    
    #upload the transcribedTextFile to the s3 bucket
    
    #create a unique transcribed text file name using episodeID
    transcribedTextFileName = episodeID + '.txt'
    #the bucket which will contain all the transcribed text files
    transcribedBucketName = 'files-after-transcribing'
    
    #wrote the transcribed text to 'transcribedtext.txt' i.e a local file
    #store the transcribed text to s3 bucket with the name as transcribedTextFileName var
    s3.upload_file('transcribedtext.txt', transcribedBucketName, transcribedTextFileName)
    
    #finally delete the local text file
    os.remove('transcribedtext.txt')
    
    #keystring is an S3 PATH, think of it like a unix path
    keyString = 'https://' + transcribedBucketName + '.s3.amazonaws.com/' + transcribedTextFileName
    
    #Get past information of data you DO NOT WANT TO OVERWRITE
    data = getEpisode(podcastID = podcastID, episodeID = episodeID)
    data = data["Data"]
    
    genreIDs = data["genreIDs"]
    visitedCount = data["visitedCount"]
    
    
    #Update your entry
    putEpisode(podcastID = podcastID, episodeID =episodeID, transcribedStatus = transcribedStatus, transcribedText = keyString, tags = tags, genreIDs = genreIDs, visitedCount = visitedCount)
    
    return {
        'statusCode': 200,
        'headers': {'Content-Type': 'application/json'},
        'body': 'Successfully Transcribed'
    }
    
