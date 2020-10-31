import json
import os
import requests

def lambda_handler(event, context):
    
    #Main function call
    try:
        #Listennotes API CALL - GET /genres
        url = 'https://listen-api.listennotes.com/api/v2/genres?top_level_only=0'
        headers = {
          'X-ListenAPI-Key': os.environ.get("APIKEY"),
        }
        response = requests.request('GET', url, headers=headers)
        data = response.json()
        genres = data["genres"]
        
        hash_genres = {}
        for genre in genres:
            hash_genres[genre["name"]] = genre["id"]
            
        
        data = {
            "Data": hash_genres
        }

    except Exception as e:
        print(str(e))
        message = {
            "Error": "Unable to fetch data from Listen Notes"
        }
        return {
            'statusCode': 503,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Headers': 'Content-Type,Origin,X-Amz-Date,Authorization,X-Api-Key,x-requested-with,Access-Control-Allow-Origin,Access-Control-Request-Method,Access-Control-Request-Headers',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': True,
                'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS'},
            'body': json.dumps(message)
        }

    # TODO implement
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
