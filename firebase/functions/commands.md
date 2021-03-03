# config env

firebase functions:config:set elastic.host="" elastic.user="elastic" elastic.pwd=""

# create index

PUT /planning-poker
{
  "settings": {
    "index": {
      "number_of_shards": 1,  
      "number_of_replicas": 1 
    }
  }
}
