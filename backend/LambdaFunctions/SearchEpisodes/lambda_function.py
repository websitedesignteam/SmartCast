import json
import requests
import os
import boto3
import time


def lambda_handler(event, context):
    
    #Extract the body from event
    body = event["body"]
    body = json.loads(body)
    
    #Extract values from GET request and initialize vars for function call
    queryString =str(body["queryString"])
    
    if "sortBy" in body:
        sortBy = str(body["sortBy"])
    else:
        sortBy = None
    
    if "nextPage" in body:
        nextPage = str(body["nextPage"])
    else:
        nextPage = None
        
        
        
    #search Function
    def searchEpisodes(queryString):
        
        if sortBy is None:
            sortBy = "recent_first"
        
        returnData = {}
        
        if nextPage is not None:
            nextPub = "next_episode_pub_date=" + str(nextPage) + "&"
            
        else:
            nextPub = ""
            
            
        url = "https://listennotes.p.rapidapi.com/api/v1/search"
        querystring = {"sort_by_date":"0","type":"episode","offset":"0","len_min":"2","len_max":"10","genre_ids":"68%2C82","published_before":"1490190241000","published_after":"1390190241000","only_in":"title","language":"English","safe_mode":"1","q":queryString}
        
        headers = {
            'x-rapidapi-host': "listennotes.p.rapidapi.com",
            'X-ListenAPI-Key': os.environ.get("APIKEY")
        }
        response = requests.request("GET", url, headers=headers, params=querystring)
        
        data = response.json()
        print(response)
        
        
        
        
        
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

    # TODO implement
    return {
        'statusCode': 200,
        'headers': {'Content-Type': 'application/json'},
        'body': json.dumps(getAllEpisodes(podcastID = podcastID,sortBy = sortBy, nextPage = nextPage))
    }
