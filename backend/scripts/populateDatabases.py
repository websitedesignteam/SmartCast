import json
import os
import boto3



#################### HELPER FUNCTIONS #####################


#------------GET ITEM FROM THE PODCAST TABLE-------------------------#
def getItemFromPodcastTable(table, podcastID, episodeID):

    #get the current item from the table
    #the primary key are podcastID and episodeID
    response = table.get_item(
        Key={
            'podcastID': podcastID,
            'episodeID' : episodeID
        }
    )
    
    #if the database returns any item with ^ those primarykeys
    if "Item" in response:
        #get the item (i.e a row from table)
        item = response["Item"]
        return item
    
    #otherwise return None    
    else:
        return None



#-------------UPDATE THE ENTRY IN PODCAST TABLE------------------#
def updateItemInPodcastTable(table, item, tagsList):
    
    #if item is not none
    if item:
        
        #since the tags are initially empty
        #put the tagsList that is passed into the function, in the item["tags"]
        item["tags"] = tagsList
        # print(tagsList)
        try:
            #now simply put the item back into the database
            response = table.put_item(
               Item = item
            )
            
            print("Success : updated tags in the database")
        except Exception as e:
            print(str(e))
            
    #there was no such record to be updated      
    else:
        return "Error: No database entry found"



#---------------PUT TAGS IN THE ML CATEGORY TABLE------------------#
def putTagsinML_Category_Table(table, comprehendData):
    
    #iterate through the comprehendData which is a dictionary
    for key in comprehendData.keys():
        
        #tags associated with this one key
        tagsList = comprehendData[key]
        
        #the key might already be in the table
        #so get the response and see what is already in the table
        response = ML_Category_Table.get_item(
            Key={
                'category' : key
            }
        )   
        
        #if the item already exists
        if "Item" in response:
            
            #take the item
            item = response["Item"]
            
            #get the current tags in the database rn
            currentTags = item["tags"]
            
            #iterate through the tagsList that is passed in the function
            for tag in tagsList:
                
                #if the tag is not already in the list, append tag to the list
                if tag not in currentTags:
                    # print(tag)
                    currentTags.append(tag)
                    
            item["tags"] = currentTags
            
            try:
                #now simply put the item back into the database
                response2 = table.put_item(
                   Item = item
                )
                
                # print("Success : updated tags in the ML_Category_Table")
            except Exception as e:
                print(str(e))
            
            
        else:
            response3 = ML_Category_Table.put_item(
                Item={
                    'category': key,
                    'tags' : tagsList
                }
            )
            # print("Successfully added tags to ML_Category_Table")
                
                
                
                
#--------------PUT TAGS IN ML TAG SEARCH TABLE ---------------------#
def putTagsInML_Tag_Search_Table(table, tagsList, podcastID, episodeID, comprehendData):
    
    #iterate over the comprehendData dictionary
    for category in comprehendData.keys():    
        #put current podcastID and episodeID together as a list
        currentEpisode = [podcastID, episodeID]
        
        #the tagsList is passed into the function
        #go through the tagsList
        for tag in tagsList:
        
            #for every tag, see if the tag is already there or not
            response = table.get_item(
                Key={
                    'tag' : tag
                }
            )
            
            #check to see if the tag is already in the database
            if "Item" in response:
                
                #collect the item into variables
                item = response["Item"]
                episodes = item["episodes"]
                categories = item["categories"]
                # print("here")
                
                #if the current episode is not in the episodes list already
                if currentEpisode not in episodes:
                    #add the current episode to the List
                    episodes.append(currentEpisode)
                
                #if the category is not already in the categories column
                #and
                #if the tag in this iteration is mapping to the correct key in comprehendData
                if category not in categories and tag in comprehendData[category]:
                    #append that key into the categories
                    categories.append(category)
                
                
                #update the database
                item["categories"] = categories
                item["episodes"] =  episodes
                
                try:
                #now simply put the item back into the database
                    response2 = table.put_item(
                       Item = item
                    )
                    
                    # print("Success : updated tags in the ML_Tag_Search_Table")
                except Exception as e:
                    print(str(e))
                
            #if the tag does NOT already exist in the database
            else:
                #make an empty list
                categoriesList = []
                
                #if the tag in this iteration is mapping to the correct key in comprehendData
                if tag in comprehendData[category]:
                    #add the key (category) to the keyList
                    categoriesList.append(category)
                
                response3 = table.put_item(
                    Item={
                        'tag': tag,
                        'episodes' : [currentEpisode],
                        'categories' : categoriesList
                    }
                )
                # print("Success: Added a new tag to the ML_Tag_Search_Table")



#-------------GET THE JSON BLACKLIST FILE WHICH CONTAINS TAGS TO IGNORE-----------------------#
def getBlackListIgnoreJson():
    s3 = boto3.resource('s3')
    jsonFile = s3.Object("smartcast-metadata", "ignore.json")
    jsonFileText = jsonFile.get()["Body"].read().decode("utf-8")
    
    jsonObject = json.loads(jsonFileText)
    
    blackList = jsonObject["ignore"]
    # print(blackList)
    
    return blackList


############################################## MAIN #####################################################


#get the blackList for tags
blackListForTags = getBlackListIgnoreJson()
# blackListForTags.append("10 15 minutes")
# blackListForTags.append("10%")
# blackListForTags.append("com")
# blackListForTags.append("dot com")

# Get your tables from DynamoDB
dynamoDB = boto3.resource('dynamodb')
PodcastTable = dynamoDB.Table("PodcastTable_DEV") #using a test table for now, but will change it to Podcast_DEV table later which has all the transcriptions done
ML_Category_Table = dynamoDB.Table("ML_Category")
ML_Tag_Search_Table = dynamoDB.Table("ML_Tag_Search")

#get everything from the PodcastTable
response = PodcastTable.scan()
#store all the rows in a list
allRowsList = response["Items"]

#using s3 and comprehend resources
s3 = boto3.resource('s3')
comprehend = boto3.client(service_name='comprehend', region_name='us-east-1')


#for every row in the PodcastTable database
for row in allRowsList:
    
    #make a dictionary to store key value pairs like this
    # KEY : [data, data2, data,3]
    # "NAME" : ["name1", "name2", "name3"]
    # "LOCATION : ["location1", "location2"]"
    comprehendData = {}
    tagsList = []
    
    #from the PodcastTable pull out the keystring for the current row
    keyString = row["transcribedText"]
    
    #now search the keystring in s3 and store it as s3Entry
    s3Entry = s3.Object("files-after-transcribing", keyString)
    # s3Entry = s3.Object("files-after-transcribing", "52e7254095164fef9cce2e9372edc62d.txt")

    #read the s3 entry for transcribed text and store transcribed text into transcribedText variable
    transcribedText = s3Entry.get()["Body"].read().decode("utf-8")
    
    #Since our comprehend can only take 5000 bytes at max, we need to truncate any long transcribed text
    if (len(transcribedText) > 4800):
        # print(transcribedText)
        transcribedText = transcribedText[:4800]
    
    
    # print(transcribedText)
    
    #run AWS comprehend on the transcribedText and store the results into comprehendObject
    comprehendObject = comprehend.detect_entities(Text=transcribedText,
    LanguageCode='en')
    
    #we only care ablout comprehend entities from the comprehendObject i.e the response from running the service
    comprehendEntities = comprehendObject["Entities"]
    
    #now for every entity in the dictionary of entities
    for entity in comprehendEntities:
        # print(entity)
        #every entity looks like this: {"Score": 0.992189347743988, "Type": "TITLE", "Text": "Star Wars", "BeginOffset": 260, "EndOffset": 269}
        #for every entity type, pull out everything and sort it as a key dictionary
        if entity["Type"] not in comprehendData:
            comprehendData[entity["Type"]] = []
        
        
        if entity["Text"] not in comprehendData[entity["Type"]]:
            if entity["Text"] not in blackListForTags:
                comprehendData[entity["Type"]].append(entity["Text"].lower())
        
        #store all the tags into the list
        tag = entity["Text"]
        if tag not in tagsList:
            if tag not in blackListForTags:
                print(entity["Type"], tag)
                tagsList.append(tag.lower())
    
    
    #remove duplicates from the tagsList
    tagsList = list(set(tagsList))
    
    #get the podcastID and episodeID for the current row (which is current iteration)
    podcastID = row["podcastID"]
    episodeID = row["episodeID"]
    
    #get the current row
    item = getItemFromPodcastTable(PodcastTable, podcastID, episodeID)
    
    #update the current row by adding all the tags
    updateItemInPodcastTable(PodcastTable, item, tagsList)
    
    #populate the ML_Category_Table
    putTagsinML_Category_Table(ML_Category_Table, comprehendData)
    
    #populate the ML_Tag_Search_Table
    putTagsInML_Tag_Search_Table(ML_Tag_Search_Table, tagsList, podcastID, episodeID, comprehendData)
    
    
        
        
    
    
        
    
    #update the 


    