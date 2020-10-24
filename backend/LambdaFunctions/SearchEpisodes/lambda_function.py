import json
import requests
import os


def lambda_handler(event, context):
    
    #Extract the body from event
    body = event["body"]
    body = json.loads(body)
    
    #Extract values from GET request and initialize vars for function call
    searchString =str(body["searchString"])
    
    if "sortBy" in body:
        sortBy = str(body["sortBy"])
    else:
        sortBy = None
        
        
    #search Function
    def searchEpisodes(searchString, sortBy=None):
        
        if sortBy is None:
            sortBy = "recent_first"
            
        returnData = {}
        
        url = "https://listen-api.listennotes.com/api/v2/search"
        querystring = {"sort_by_date":"0", "type":"episode","offset":"0","len_min":"2","len_max":"10","genre_ids":"68%2C82","published_before":"1490190241000","published_after":"1390190241000","only_in":"title","language":"English","safe_mode":"1","q":searchString}
        
        headers = {
            'X-ListenAPI-Key': os.environ.get("APIKEY")
        }
        
        response = requests.request("GET", url, headers=headers, params=querystring)
        responseData = response.json()
        print(responseData)
        #generic data for the search
        returnData["totalCount"] = responseData["count"]
        returnData["totalEpisodes"] = responseData["total"]
        # returnData["nextPageNumber"] = responseData["next_episode_pub_date"]
        
        #specific data for each episode
        returnData["episodes"] = []
        episodeList = responseData["results"]
        
        for episode in episodeList:
            episodeObj = {}
            episodeObj["episodeID"] = episode["id"]
            episodeObj["episodeTitle"] = episode["title_original"]
            episodeObj["podcastID"] = episode["podcast"]["id"]
            episodeObj["podcastTitle"] = episode["podcast"]["title_original"]
            episodeObj["episodeDescription"] = episode["description_original"]
            episodeObj["episodeImage"] = episode["image"]
            episodeObj["episodeAudioLink"] = episode["audio"]
            episodeObj["audioLength"] = episode["audio_length_sec"]
            returnData["episodes"].append(episodeObj)
        
        print(returnData)
        return {
            "Data": returnData
        }


    return {
        'statusCode': 200,
        'headers': {'Content-Type': 'application/json'},
        'body': json.dumps(searchEpisodes(searchString))
    }
