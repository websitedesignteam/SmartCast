import boto3
from datetime import date
import json
import requests
import os


'''
Table Podcast Dev Schema

    Table Name: PodcastTable_DEV
    Table Composite Key:{
        ParitionKey: <string> Podcast Title </string>
        Sort Key : <integer> Episode Number </integer>
    }
    
    Attributes:{
        "episodeTitle": </string>,
        "Tags": </List>,
        "Genre": </string>,
        "mp3FileLocation": </string>,
        "transcribedText": </string>,
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
    
    
    '''CLASS METHODS'''
    
    @classmethod
    def getAllGenres(cls):
        
        dynamoDB = boto3.resource('dynamodb')
        table = dynamoDB.Table(cls._tableNameGenres)
        
        genres = []
        try:
            items = table.scan()["Items"]
            for item in items:
                if item["id"]:
                    item["id"] = int(str(item["id"]))
                if item["parent_id"]:
                    item["parent_id"] = int(str(item["parent_id"]))
                genres.append(item)
                
            return {
                "Data": genres
            }
        
        except Exception as e:
            print(str(e))
            return {
                "Data": []
            }
            
        
        
        
    
    @classmethod
    def getEpisode(cls,podcastTitle,episodeNumber):
        
        dynamoDB = boto3.resource('dynamodb')
        table = dynamoDB.Table(cls._tableName)
        
        try:
            response = table.get_item(
                Key = {
                    'Podcast Title': podcastTitle,
                    'Episode Number': episodeNumber
                    
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
            
