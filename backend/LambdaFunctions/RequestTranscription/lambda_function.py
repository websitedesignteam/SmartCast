import json
import boto3

def convertSeconds(seconds):
    
    h = seconds//(60*60)
    m = (seconds-h*60*60)//60
    s = seconds-(h*60*60)-(m*60)


    stringBuilder = str(h) + "Hours   " + str(m) + "Minutes   " + str(s) + "Seconds"
    return stringBuilder
    
    
def putEpisode(podcastID, episodeID, episodeLength, transcribedStatus=None, transcribedText=None, tags=None, genreIDs=None, visitedCount=None, requestedEdit=None, editorsEmail=None):
    
    dynamoDB = boto3.resource('dynamodb')
    table = dynamoDB.Table("PodcastTable_DEV")
    
    if transcribedStatus is None:
        transcribedStatus = "AWAITING TRANSCRIPTION APPROVAL"
    
    if transcribedText is None:
        transcribedText = ""
    
    if tags is None:
        tags = []
        
    if genreIDs is None:
        genreIDs = []
        
    if visitedCount is None:
        visitedCount = 0
        
    if requestedEdit is None:
        requestedEdit = ""
    
    if editorsEmail is None:
        editorsEmail = ""
    
    
    #convert episodeLength into hours and minutes
    episodeLengthConverted = convertSeconds(episodeLength)
    
    try:
        table.put_item(
            Item = {
            'podcastID' : podcastID,
            'episodeID' : episodeID,
            'episodeLength' : episodeLengthConverted,
            'transcribedStatus' : transcribedStatus,
            'transcribedText' : transcribedText,
            'tags' : tags,
            'genreIDs' : genreIDs,
            'visitedCount' : visitedCount,
            'requestedEdit' : requestedEdit,
            'editorsEmail' : editorsEmail
        })
        
        return "Success"
    
    except Exception as e:
        print("Exception : ", e)
        return "Error"
    


def lambda_handler(event, context):
    
    body = event["body"]
    body = json.loads(body)
    
    
    podcastID = str(body["podcastID"])
    episodeID = str(body["episodeID"])
    episodeLength = int(body["episodeLength"])
    
    try:
        print("here")
        putResponse = putEpisode(podcastID, episodeID, episodeLength)
        print("here2")
        if putResponse == "Error":
            return {
                'statusCode': 404,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Headers': 'Content-Type,Origin,X-Amz-Date,Authorization,X-Api-Key,x-requested-with,Access-Control-Allow-Origin,Access-Control-Request-Method,Access-Control-Request-Headers',
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Credentials': True,
                    'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS'
                },
                'body': json.dumps({
                    "Error": "Your request for transcription could not be completed. Try again!"
                })
            }
            
        elif putResponse == "Success":
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
                    "Success": "Your request for transcription has been received. Please wait for a decision!"
                })
            }
            
    except Exception as e:
        print("Exception : ", e)
        return {
                'statusCode': 404,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Headers': 'Content-Type,Origin,X-Amz-Date,Authorization,X-Api-Key,x-requested-with,Access-Control-Allow-Origin,Access-Control-Request-Method,Access-Control-Request-Headers',
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Credentials': True,
                    'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS'
                },
                'body': json.dumps({
                    "Exception": e
                })
            }
        