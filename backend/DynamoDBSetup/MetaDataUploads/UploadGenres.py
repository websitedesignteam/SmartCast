import requests
import os
import boto3




def collectGenres():
    
    #Listennotes API CALL
    url = 'https://listen-api.listennotes.com/api/v2/genres?top_level_only=0'
    headers = {
      'X-ListenAPI-Key': os.environ.get("APIKEY"),
    }
    response = requests.request('GET', url, headers=headers)
    data = response.json()
    genres = data["genres"]
    
    #DynamoDB data upload
    dynamoDB = boto3.resource('dynamodb')
    tableNameGenres = "Podcast_Genres"
    table = dynamoDB.Table(tableNameGenres)
    for genre in genres:
        
        try:
            table.put_item(
                Item = {
                    "genre"     : genre["name"],
                    "id"        : genre["id"],
                    "parent_id" : genre["parent_id"]
                })
        except Exception as e:
            print({
                "CustomError": print(str(e))
            })
        


if __name__ == "__main__":
    
    collectGenres()