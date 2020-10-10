import boto3
import json
from BaseClasses import CompositeTable,SimpleTable
from boto3.dynamodb.conditions import Key

def jsonPretty(data):
    return json.dumps(data,indent = 2)

def listTables():
    dynamoDB = boto3.client('dynamodb')
    
    response = dynamoDB.list_tables()
    tables = response["TableNames"]
    
    return tables

def createSimpleTable(tableList,dynamoDB,tableObj):
    if not dynamoDB:
        dynamoDB = boto3.client('dynamodb')
        
    if tableObj.tableName in tableList:
        print("Error:",tableObj.tableName, "already exists.")
        return
    table = dynamoDB.create_table(
        TableName= tableObj.tableName,
        KeySchema=[
            {
                'AttributeName': tableObj.partitionKey,
                'KeyType': 'HASH'  # Partition key
            },
        ],
        AttributeDefinitions=[
            {
                'AttributeName': tableObj.partitionKey,
                'AttributeType': 'S'
            },

        ],
        ProvisionedThroughput={
            'ReadCapacityUnits': 10,
            'WriteCapacityUnits': 10
        }
    )
    print("Created Table:",tableObj.tableName)

def createCompositeTable(tableList,dynamoDB,tableObj):
    if not dynamoDB:
        dynamoDB = boto3.client('dynamodb')
        
    if tableObj.tableName in tableList:
        print("Error:",tableObj.tableName, "already exists.")
        return
    table = dynamoDB.create_table(
        TableName= tableObj.tableName,
        KeySchema=[
            {
                'AttributeName': tableObj.partitionKey,
                'KeyType': 'HASH'  # Partition key
            },
            {
                'AttributeName' : tableObj.sortKey,
                'KeyType': 'RANGE'
            }
        ],
        AttributeDefinitions=[
            {
                'AttributeName': tableObj.partitionKey,
                'AttributeType': 'S'
            },
            {
                'AttributeName': tableObj.sortKey,
                'AttributeType': 'N'
            }

        ],
        ProvisionedThroughput={
            'ReadCapacityUnits': 10,
            'WriteCapacityUnits': 10
        }
    )
    print("Created Table:",tableObj.tableName)
    

if __name__ == "__main__":
    
    dynamoDB = boto3.resource("dynamodb")
    tableList = listTables()
    
    tableNamePodcast = "PodcastTable"
    tableNamePodcastDev = "PodcastTable_DEV"
    tableNameGenres = "Podcast_Genres"
    
    podcastDevObj = CompositeTable(tableName = tableNamePodcastDev, partitionKey = "Podcast Title", sortKey = "Episode Number")
    createCompositeTable(tableList = tableList, dynamoDB = dynamoDB, tableObj = podcastDevObj)
    
    podcastProdObj = CompositeTable(tableName = tableNamePodcast, partitionKey = "Podcast Title", sortKey = "Episode Number")
    createCompositeTable(tableList = tableList, dynamoDB = dynamoDB, tableObj = podcastProdObj)
    
    podcastGenresObj = SimpleTable(tableName = tableNameGenres, partitionKey = "genre")
    createSimpleTable(tableList = tableList, dynamoDB = dynamoDB, tableObj = podcastGenresObj)