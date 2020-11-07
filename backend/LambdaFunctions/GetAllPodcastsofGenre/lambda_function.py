import json
import os
import requests


#Main function call
def getBestPodCastByGenre(genreID,page = None):
    
    try:
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
    except Exception as e:
        return {
            "Error": "You must provide a valid Genre ID"
        }

def lambda_handler(event, context):
    
    #Extract the body from event
    try:
        body = event["body"]
        body = json.loads(body)
        
        #Extract values from GET request and initialize vars for function call
        genreID = str(body["genreID"])
        if "page" in body:
            page = str(body["page"])
        else:
            page = None
    
    except Exception as e:
        body = {
            "Error": "You must provide a genre."
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
    

    
    data = getBestPodCastByGenre(genreID = genreID, page = page)
    if "Data" in data:
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Headers': 'Content-Type,Origin,X-Amz-Date,Authorization,X-Api-Key,x-requested-with,Access-Control-Allow-Origin,Access-Control-Request-Method,Access-Control-Request-Headers',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': True,
                'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS'},
            'body': json.dumps(data)
        }
    else:
        return {
            'statusCode': 400,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Headers': 'Content-Type,Origin,X-Amz-Date,Authorization,X-Api-Key,x-requested-with,Access-Control-Allow-Origin,Access-Control-Request-Method,Access-Control-Request-Headers',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': True,
                'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS'},
            'body': json.dumps(data)
        }
