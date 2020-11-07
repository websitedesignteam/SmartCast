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
        
    if "currentPage" in body:
        currentPage = int(body["currentPage"])
    else:
        currentPage = 0
    
    print("current page", currentPage)
        
        
    #search Function
    def searchEpisodes(searchString, currentPage, sortBy=None ):
        
        if sortBy is None:
            sortBy = "recent_first"
            
        if currentPage is None:
            currentPage = 0
            
            
        returnData = {}
        
        url = "https://listen-api.listennotes.com/api/v2/search"
        querystring = {"sort_by_date":"0", "type":"episode","offset":"0","len_min":"2","len_max":"10","only_in":"title","language":"English","safe_mode":"1","q":searchString}
        
        headers = {
            'X-ListenAPI-Key': os.environ.get("APIKEY")
        }
        
        response = requests.request("GET", url, headers=headers, params=querystring)
        responseData = response.json()
        print(responseData)
        
        returnData = {}
        
        #generic data for the search
        returnData["totalCount"] = responseData["count"]
        returnData["totalEpisodes"] = responseData["total"]
        
        if(currentPage == 0):
            returnData["currentPage"] = 0
            returnData["previousPage"] = 0
            returnData["nextPage"] = int(currentPage) + 10
        
        else:
            returnData["currentPage"] = int(currentPage)
            returnData["previousPage"] = int(currentPage) - 10
            returnData["nextPage"] = int(currentPage) + 10
        
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

    print("in the end")
    print(currentPage)
    print("in the end")
    return {
        'statusCode': 200,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Headers': 'Content-Type,Origin,X-Amz-Date,Authorization,X-Api-Key,x-requested-with,Access-Control-Allow-Origin,Access-Control-Request-Method,Access-Control-Request-Headers',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': True,
            'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS'
        },
        'body': json.dumps(searchEpisodes(searchString, currentPage))
    }
