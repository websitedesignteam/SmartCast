class SimpleTable:
    
    def __init__(self,tableName, partitionKey):
        self.tableName = tableName
        self.partitionKey = partitionKey
    
    

class CompositeTable:
    
    def __init__(self,tableName, partitionKey, sortKey):
        self.tableName = tableName
        self.partitionKey = partitionKey
        self.sortKey = sortKey
        