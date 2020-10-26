import json
import os
import requests

def lambda_handler(event, context):
    
    #Extract the body from event
    body = event["body"]
    body = json.loads(body)
    
    #Extract values from GET request and initialize vars for function call
    genreID = str(body["genreID"])
    if "page" in body:
        page = str(body["page"])
    else:
        page = None
    
    #Main function call
    def getBestPodCastByGenre(genreID,page = None):
    
        returnData = {}
        if page is None:
            page = "1"

        url = 'https://listen-api.listennotes.com/api/v2/best_podcasts?genre_id='+genreID+'&page='+page+'&region=us&safe_mode=0'
        headers = {
          'X-ListenAPI-Key': os.environ.get("APIKEY"),
        }
        response = requests.request('GET', url, headers=headers)
        
        data = response.json()
        podcasts = data["podcasts"]
        
        returnData["genreID"] = data["id"]
        returnData["genre"] = data["name"]
        returnData["currentPageNumber"] = data["page_number"]
        returnData["previousPageNumber"] = data["previous_page_number"]
        returnData["nextPageNumber"] = data["next_page_number"]
        
        returnData["podCasts"] = []
        for pod in podcasts:
            obj = {}
            obj["podcastID"] = pod["id"]
            obj["podcastImage"] = pod["image"]
            obj["podcastTitle"] = pod["title"]
            obj["podcastThumbnail"] = pod["thumbnail"]
            obj["podcastDescription"] = pod["description"]
            obj["podcastTotalEpisodes"] = pod["total_episodes"]
            returnData["podCasts"].append(obj)
        
        print(returnData)
        return {
            "Data": returnData
        }

    return {
        'statusCode': 200,
        'headers': {'Content-Type': 'application/json'},
        'body': json.dumps(getBestPodCastByGenre(genreID = genreID, page = page))
    }
