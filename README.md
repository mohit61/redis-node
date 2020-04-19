# redis-unacademy
Server for basic implementation of Redis

### Installation 

- Clone the repo locally using `git clone https://github.com/mohit61/redis-unacademy.git`
- Go the the directory `cd redis-unacademy`
- Install the dependencies using `npm install`
- Start the server using  `node index.js`

### Deployed Server 

- The Server is deployed using heroku. [This](https://redis-unacademy.herokuapp.com/) is the endpoint for the api of the server.

- Below is the structure of various endpoints that it provides :

GET  - `https://redis-unacademy.herokuapp.com/getValue/${name_of_key}` 

SET -  `https://redis-unacademy.herokuapp.com/setValue` (the body contains the key-value pairs to be added)

CHECK - `https://redis-unacademy.herokuapp.com/checkKey/${name_of_key}` 

EXPIRE - `https://redis-unacademy.herokuapp.com/exp/${name_of_key}/${time}` 

TTL -  `https://redis-unacademy.herokuapp.com/rem/${name_of_key}` 

DELETE - `https://redis-unacademy.herokuapp.com/delKey/${name_of_key}` 

ZADD  - `https://redis-unacademy.herokuapp.com/zadd/${name_of_set}/${name_of_key}/${score}` 

ZRANK - `https://redis-unacademy.herokuapp.com/rank/${name_of_set}/${name_of_key}` 

ZRANGE - `https://redis-unacademy.herokuapp.com/zrange/${name_of_set}/${start_index}/${stop_index}/${true/false_value_for_withscores}` 


