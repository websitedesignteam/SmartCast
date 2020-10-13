import json
import os
import requests

def lambda_handler(event, context):
    body = event["body"]
    print(body)
    body = json.loads(body)
    genreID = str(body["genreID"])
    if "page" in body:
        page = str(body["page"])
    else:
        page = None
    
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
        returnData["page_number"] = data["page_number"]
        returnData["previous_page_number"] = data["previous_page_number"]
        returnData["next_page_number"] = data["next_page_number"]
        
        returnData["podCasts"] = []
        for pod in podcasts:
            obj = {}
            obj["id"] = pod["id"]
            obj["image"] = pod["image"]
            obj["title"] = pod["title"]
            obj["thumbnail"] = pod["thumbnail"]
            obj["description"] = pod["description"]
            obj["total_episodes"] = pod["total_episodes"]
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
