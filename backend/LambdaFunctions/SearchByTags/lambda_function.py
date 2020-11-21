import json
import boto3

def getAllEpisodesofATag(table, tag):
    
    try: 
        #run the query for a tag
        response = table.get_item(
            Key={
                'tag': tag
            }
        )
        print("response --> ", response)
        
        if "Item" in response:
            item = response["Item"]
            
            episodes = item["episodes"]
            
            print("Episodes : ", episodes)
            
            return {
                "Data" : episodes
            }
    
    except Exception as e:
        print("Exception : " , e)
        return{
            json.dumps({"Error : ", e})
        }
        


def getAllTags(table):
    
    #declare a list to store tags
    tagsList = []
    
    #scan the whole table
    response = table.scan()
    
    if "Items" in response:
        items = response["Items"]
        
        for item in items:
            #for each tag in the row append the tag into the tagsList
            tag = item["tag"]
            tagsList.append(tag)
            
        return {
            "Data" : tagsList
        }
    
    else:
        return{
            json.dumps({"Data" : "Error: No tags found"})
        }


def lambda_handler(event, context):
    
    try: 
    
        #Retrieve the environments variables via SSM
        ssm = boto3.client('ssm')
        parameter = ssm.get_parameter(Name='/smartcast/env', WithDecryption=True)
        parameter = parameter['Parameter']["Value"]
        parameter = json.loads(parameter)
        
        GET_EPISODE_SYNCHRONOUS_LAMBDA = parameter["GET_EPISODE_SYNCHRONOUS_LAMBDA"]
        
        #get the info from request body
        body = event["body"]
        body = json.loads(body)
        
        if ("searchQuery" in body):
            searchQuery = str(body["searchQuery"])
            
        #split the string into arrays where delimeter is whitespace
        searchQueryArray = searchQuery.split()
        
        #convert every string in the array to lower
        #this is the list of tags that we get from the frontend query
        searchQueryArray = [element.lower() for element in searchQueryArray] ; searchQueryArray
        
        #get all the tags from ML_Tag_Search Table
        dynamoDB = boto3.resource('dynamodb')
        ML_Tag_Search_Table = dynamoDB.Table("ML_Tag_Search")
        data = getAllTags(ML_Tag_Search_Table)
        
        
        if "Data" in data:
            #this is the tagsList that we get from the database
            tagsList = data["Data"]
            
        #declare a set
        returnSet = {}
        returnSet = set(returnSet)  
        
        
        #for every query in searchQuery (frontend)
        for query in searchQueryArray:
            
            #check if each query is a substring of anything in the tagsList (i.e a list of tags from the db)
            #store the results into a list
            result = [i for i in tagsList if query in i]
            for res in result:
                #for each item in result add it to the set
                returnSet.add(res)
                
        
        #now we have retrieved the set of tags(in our db) that are matching to the tags in searchQueryArray
        
        #this list will store the lists of [podcastID, episodeID]
        episodesList = []
        #iterate over the set of tags that were retrieved from the set
        for tag in returnSet:
            #for each tag, retrieve all the episodeIDs and podcastIDs associated with that tags
            data = getAllEpisodesofATag(ML_Tag_Search_Table, tag)
            
            if "Data" in data:
                episodes = data["Data"]
                
                #for each episode in the episodesList
                for episode in episodes:
                    #note: episode is a list here
                    if episode not in episodesList:
                        episodesList.append(episode)
            
        #since the list we obtain here might have duplicates
        #need to convert the inner lists to tuples so they are hashable
        episodesList = set(map(tuple,episodesList))  
        episodesList = map(list,episodesList) #Now convert tuples back into lists
    
        #declare the list which will store data to be returned to the frontend
        returnList = []
        
        #for each episode in the episodeList
        for episode in episodesList:
            
            #retrieve and store the podcastIDs and episodeIDs
            podcastID = episode[0]
            episodeID = episode[1]
            
            print("PODCAST ID: ",podcastID)
            print("EPISODE ID: ", episodeID)
            
            #create an event object to pass into the getEpisodeSynchronous function
            event = {
                "body" :{
                    "podcastID" : podcastID,
                    "episodeID" : episodeID
                }
            }
            
            lambdaClient = boto3.client('lambda')
                        
            response = lambdaClient.invoke(
                FunctionName= GET_EPISODE_SYNCHRONOUS_LAMBDA,
                Payload= json.dumps(event) #don't use json.dumps here becuase getEpisode expects a dict object (the way it is currently implemented)
            )
            
            print("Response Payload : ", response)
            responsePayload = response["Payload"]
            responsePayload = responsePayload.read()
            responsePayload = responsePayload.decode("utf-8")
            responsePayload = json.loads(responsePayload)
            
            body2 = responsePayload["body"]
            body2 = json.loads(body2)
            print("body2 == ",body2)
            returnList.append(body2["Data"])
            
        return{
            'statusCode': 200,
            'headers' : {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Headers': 'Content-Type,Origin,X-Amz-Date,Authorization,X-Api-Key,x-requested-with,Access-Control-Allow-Origin,Access-Control-Request-Method,Access-Control-Request-Headers',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': True,
                'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS'
            },
            'body': json.dumps({"Data" : returnList})
        }
        
    except Exception as e:
        return{
            'statusCode': 400,
            'headers' : {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Headers': 'Content-Type,Origin,X-Amz-Date,Authorization,X-Api-Key,x-requested-with,Access-Control-Allow-Origin,Access-Control-Request-Method,Access-Control-Request-Headers',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': True,
                'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS'
            },
            'body': json.dumps({"Exception" : e})
        }