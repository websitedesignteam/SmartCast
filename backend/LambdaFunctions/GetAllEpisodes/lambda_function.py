import json
import requests
import os


#Main function call
def getAllEpisodes(podcastID,sortBy = None,nextPage = None):
    
    try: 
        if sortBy is None:
            sortBy = "recent_first"
        
        returnData = {}
        if nextPage is not None:
            nextPub = "next_episode_pub_date=" + str(nextPage) + "&"
        else:
            nextPub = ""
            
        url = 'https://listen-api.listennotes.com/api/v2/podcasts/'+podcastID+'?' + nextPub+ 'sort='+sortBy
        headers = {
          'X-ListenAPI-Key': os.environ.get("APIKEY"),
        }
        response = requests.request('GET', url, headers=headers)
        
        data = response.json()
        print(data)
        returnData["podcastID"] = data["id"]
        returnData["podcastTitle"] = data["title"]
        returnData["podcastPublisher"] = data["publisher"]
        returnData["podcastImage"] = data["image"]
        returnData["podcastThumbnail"] = data["thumbnail"]
        returnData["podcastTotalEpisdoes"] = data["total_episodes"]
        returnData["podcastDescription"] = data["description"]
        returnData["genreIDs"] = data["genre_ids"]
        returnData["nextPageNumber"] = data["next_episode_pub_date"]
        returnData["episodes"] = []
        podcasts = data["episodes"]
        for pod in podcasts:
            obj = {}
            obj["episodeID"] = pod["id"]
            obj["episodeTitle"] = pod["title"]
            obj["episodeImage"] = pod["image"]
            obj["episodeThumbnail"] = pod["thumbnail"]
            obj["episodeLengthSeconds"] = pod["audio_length_sec"]
            returnData["episodes"].append(obj)
        
        print(returnData)
        return {
            "Data": returnData
        }
    except Exception as e:
        body = {
            "Error": "You must provide a valid Podcast ID."
        }
        return body
            

def lambda_handler(event, context):
    
    try:
        #Extract the body from event
        body = event["body"]
        body = json.loads(body)
        
        #Extract values from GET request and initialize vars for function call
        if "podcastID" in body:
            podcastID =str(body["podcastID"])
        else:
            raise Exception("Fail")
        
        if "sortBy" in body:
            sortBy = str(body["sortBy"])
        else:
            sortBy = None
        
        if "nextPage" in body:
            nextPage = str(body["nextPage"])
        else:
            nextPage = None
    except Exception as e:
        body = {
            "Error": "You must provide a Podcast ID."
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
    


    # TODO implement
    data = getAllEpisodes(podcastID = podcastID, sortBy = sortBy, nextPage = nextPage)
    if "Data" in data:
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Headers': 'Content-Type,Origin,X-Amz-Date,Authorization,X-Api-Key,x-requested-with,Access-Control-Allow-Origin,Access-Control-Request-Method,Access-Control-Request-Headers',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': True,
                'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS'
            },
            'body': json.dumps(getAllEpisodes(podcastID = podcastID,sortBy = sortBy, nextPage = nextPage))
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
            'body': json.dumps(getAllEpisodes(podcastID = podcastID,sortBy = sortBy, nextPage = nextPage))
        }
        
