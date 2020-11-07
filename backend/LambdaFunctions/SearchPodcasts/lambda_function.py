import json
import requests
import os


def lambda_handler(event, context):
    
    try:
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
            
        print(currentPage)
        
    #search Function
        def searchPodcasts(searchString, currentPage, sortBy=None):
            
            if sortBy is None:
                sortBy = "recent_first"
                
            if currentPage is None:
                currentPage = 0
                
            
            try:
                url = "https://listen-api.listennotes.com/api/v2/search"
                querystring = {"sort_by_date":"0", "type":"podcast","offset":"0","len_min":"2","len_max":"10","only_in":"title","language":"English","safe_mode":"1","q":searchString}
                
                headers = {
                    'X-ListenAPI-Key': os.environ.get("APIKEY")
                }
                
                response = requests.request("GET", url, headers=headers, params=querystring)
                responseData = response.json()
                print(responseData)
            
                returnData = {}
                
                #generic data for the podcastsearch
                returnData["totalCount"] = responseData["count"]
                returnData["totalPodcasts"] = responseData["total"]
                
                if(currentPage == 0):
                    returnData["currentPage"] = 0
                    returnData["previousPage"] = 0
                    returnData["nextPage"] = int(currentPage) + 10
                
                else:
                    returnData["currentPage"] = int(currentPage)
                    returnData["previousPage"] = int(currentPage) - 10
                    returnData["nextPage"] = int(currentPage) + 10
                
                #specific data for each podcast
                returnData["podcasts"] = []
                podcastList = responseData["results"]
                
                for podcast in podcastList:
                    podcastObj = {}
                    podcastObj["podcastID"] = podcast["id"]
                    podcastObj["podcastTitle"] = podcast["title_original"]
                    podcastObj["totalEpisodes"] = podcast["total_episodes"]
                    podcastObj["podcastURL"] = podcast["listennotes_url"]
                    podcastObj["podcastPublisher"] = podcast["publisher_original"]
                    podcastObj["podcastDescription"] = podcast["description_original"]
                    podcastObj["podcastImage"] = podcast["image"]
                    podcastObj["podcastThumbnail"] = podcast["thumbnail"]
                    podcastObj["podcastGenreIDs"] = podcast["genre_ids"]
                    returnData["podcasts"].append(podcastObj)
                
                return {
                    "Data": returnData
                }
                
            except requests.exceptions.HTTPError as errh:
                print("HTTP Exception : ", errh)
            
            except requests.exceptions.ConnectionError as errc:
                print("Connection Exception : ", errc)
            
            except requests.exceptions.Timeout as errt:
                print("Timeout Exception : ", errt)
            
            except requests.exceptions.RequestException as err:
                print("Unknown Exception : ", err)

    

        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Headers': 'Content-Type,Origin,X-Amz-Date,Authorization,X-Api-Key,x-requested-with,Access-Control-Allow-Origin,Access-Control-Request-Method,Access-Control-Request-Headers',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': True,
                'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS'
            },
            'body': json.dumps(searchPodcasts(searchString, currentPage))
        }
        
        
    except IndexError as e:
        print("IndexError : ", e)
    
    except Exception as e:
        print("Exception : ", e)
    