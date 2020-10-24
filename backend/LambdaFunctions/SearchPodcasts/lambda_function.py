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
    def searchPodcasts(searchString, sortBy=None):
        
        if sortBy is None:
            sortBy = "recent_first"
            
        returnData = {}
        
        url = "https://listen-api.listennotes.com/api/v2/search"
        querystring = {"sort_by_date":"0", "type":"podcast","offset":"0","len_min":"2","len_max":"10","genre_ids":"68%2C82","published_before":"1490190241000","published_after":"1390190241000","only_in":"title","language":"English","safe_mode":"1","q":searchString}
        
        headers = {
            'X-ListenAPI-Key': os.environ.get("APIKEY")
        }
        
        response = requests.request("GET", url, headers=headers, params=querystring)
        responseData = response.json()
        print(responseData)
        return {
            "Data": responseData
        }


    return {
        'statusCode': 200,
        'headers': {'Content-Type': 'application/json'},
        'body': json.dumps(searchPodcasts(searchString))
    }
