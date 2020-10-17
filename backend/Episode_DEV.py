import boto3
from datetime import date
import json
import requests
import os


'''
Table Podcast Dev Schema

    Table Name: PodcastTable_DEV
    Table Composite Key:{
        ParitionKey: <string> podcastID </string>
        Sort Key : <integer> episodeID </integer>
    }
    
    Attributes:{
        "transcribedStatus" : </string>,
        "transcribedText" : </string>,
        "tags" : </List>,
        "genreIDs": </List>,
        "visitedCount": </integer>
    }
'''

class Episode:
    
    '''STATIC VARIABLES'''
    _tableName = "PodcastTable_DEV"
    _tableNameGenres = "Podcast_Genres"
    
    
    '''INSTANCE METHODS'''
    
    def __init__(self, podcastTitle, episodeNumber, episodeTitle = None, tags = None, mp3FileLocation = None, genre = None, transcribedText = None):
        self.podcastTitle = podcastTitle
        self.episodeNumber = episodeNumber
        self.episodeTitle = episodeTitle
        self.tags = tags
        self.genre = genre
        self.mp3FileLocation = mp3FileLocation
        self.transcribedText = transcribedText
        self.visitedCount = 0
    
    
    
    
    
    '''STATIC METHODS'''
    
    @staticmethod
    def getObject(fileName):

        client = boto3.client('s3')
        
        response = client.list_buckets()
        
        buckets = None
        if "Buckets" in response:
            buckets = response["Buckets"]
        
        data = None
        for bucket in buckets:
            if bucket["Name"] == os.environ.get("bucket"):
                data = bucket
        
        
        paginator = client.get_paginator('list_objects_v2')
        result = paginator.paginate(BUacket = os.environ.get("bucket"))
        
        for index,page in enumerate(result):
            
            if "Contents" in page:
                for index,key in enumerate(page["Contents"]):
                    
                    keyString = key["key"] #Fix this since keystring has bucket in there as well
                    if keyString == fileName: #FIX THIS
                        #do stuff here
                        response = client.get_object(Bucket = os.environ.get("bucket"), Key = keyString)
                        #need to test with mp3 files now
                        pass
    

    
    @staticmethod
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
                
            
            print(hash_genres)
            return {
                "Data": hash_genres
            }
        except Exception as e:
            print(str(e))
            return {
                "Data": {}
            }
    
    @staticmethod
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
        
        
    @staticmethod
    def getAllEpisodes(podcastID,sortBy = None,nextPage = None):
        if sortBy is None:
            sortBy = "recent_first"
        
        returnData = {}
        if nextPage is not None:
            nextPub = "next_episode_pub_date=" + str(nextPage) + "&"
        else:
            nextPub = ""
            
        url = 'https://listen-api.listennotes.com/api/v2/podcasts/'+podcastID+'?' + nextPub+ 'sort='+sortBy
        headers = {
          'X-ListenAPI-Key': os.environ.get("APIKEY"),
        }
        response = requests.request('GET', url, headers=headers)
        
        data = response.json()
        print(data)
        returnData["podcastID"] = data["id"]
        returnData["podcastTitle"] = data["title"]
        returnData["podcastPublisher"] = data["publisher"]
        returnData["podcastImage"] = data["image"]
        returnData["podcastThumbnail"] = data["thumbnail"]
        returnData["podcastTotalEpisdoes"] = data["total_episodes"]
        returnData["podcastDescription"] = data["description"]
        returnData["genreIDs"] = data["genre_ids"]
        returnData["nextPageNumber"] = data["next_episode_pub_date"]
        returnData["episodes"] = []
        podcasts = data["episodes"]
        for pod in podcasts:
            obj = {}
            obj["episodeID"] = pod["id"]
            obj["episodeTitle"] = pod["title"]
            obj["episodeImage"] = pod["image"]
            obj["episodeThumbnail"] = pod["thumbnail"]
            obj["episodeLengthSeconds"] = pod["audio_length_sec"]
            returnData["episodes"].append(obj)
        
        print(returnData)
        return {
            "Data": returnData
        }
    # @classmethod
    # def getAllTranscribedEpisodesByGenre(cls,genreID):
        
    #     dynamoDB = boto3.resource('dynamodb')
    #     table = dynamoDB.Table(cls._tableNameGenres)
        


    #     collection = []
    #     try:
    #         items = table.scan()["Items"]
    #         for item in items:
    #             genreID = int(str(item["id"])
                
    #             obj = {
    #                 hash_genres[genreID] = {}
    #             }
                
    #             for episodeID in item["episodes"]:
    #                 #Listennotes API CALL - GET /episodes/{id}

    #                 url = 'https://listen-api.listennotes.com/api/v2/episodes/' + episodeID
    #                 headers = {
    #                   'X-ListenAPI-Key': os.environ.get("APIKEY"),
    #                 }
    #                 episodeObj = 
    #                 response = requests.request('GET', url, headers=headers)
    #                 print(response.json())

                    
                
    #             collection.append({
    #                 hash_genres[genreID] = item["episodes"]
    #             })
                
    #         return {
    #             "Data": genres
    #         }
        
    #     except Exception as e:
    #         print(str(e))
    #         return {
    #             "Data": []
    #         }
            
    
    @classmethod
    def putEpisode(cls,podcastID,episodeID, transcribedStatus = None,transcribedText = None,tags = None, genreIDs = None, visitedCount = None):
    
        dynamoDB = boto3.resource('dynamodb')
        table = dynamoDB.Table(cls._tableName)
    
        if transcribedText is None:
            transcribedText = ""
    
        #do the same for tags,genreIDs,visitedCount
        #note visited count default is 0
    
        table.put_item(
           Item={
                'podcastID': podcastID,
                'episodeID': episodeID,
                'transcribedStatus': transcribedStatus,
                'transcribedText': transcribedText,
                'tags' : tags,
                'genreIDs': genreIDs,
                'visitedCount': visitedCount
            }
        )
        return response
        
    
    @classmethod
    def getEpisode(cls,podcastID,episodeID):
        
        dynamoDB = boto3.resource('dynamodb')
        table = dynamoDB.Table(cls._tableName)
        
        try:
            response = table.get_item(
                Key = {
                    'podcastID': podcastID,
                    'episodeID': episodeID
                    
                }

            )
            if "Item" not in response:
                return{
                    "Data": {}
                }
            else:
                data = response["Item"]
                return{
                    "Data": data
                }
        except Exception as e:
            print(str(e))
            #LOG TO CLOUDWATCH HERE OR SET SOME KIND OF ALERT
            return {
                "Data" : {}
            }
 
print(Episode.getAllGenres())

data = Episode.getAllGenres()
data = data["Data"]

print(json.dumps(data,indent = 2))