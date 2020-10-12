import json
import os
import requests

def lambda_handler(event, context):
    
    def getAllGenres():
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
                
            
            return {
                "Data": hash_genres
            }
        except Exception as e:
            print(str(e))
            return {
                "Data": {}
            }
    # TODO implement
    return getAllGenres()
