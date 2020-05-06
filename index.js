const express = require("express");
const redis = require("redis");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();

var port = process.env.PORT || 4000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());

const temp = "GET_NEW_PASSWORD";

// connect to redis cloud
const client = redis.createClient({
  port: 13631,
  host: "SET_NEW_END_POINT_IN_REDISLABS",
  password: temp,
});

client.on("error", (err) => {
  console.log("Error ", err);
});

client.on("connect", () => {
  console.log("connected");
});

app.get("/", (req, res) => {
  res.send("pong");
});

// getting value from key
app.get("/getValue/:key", (req, res) => {
  let key = req.params.key;
  if (!key) {
    res.send("Error : Please provide a valid key");
  }
  client.get(key, (err, rst) => {
    if (err) {
      console.log(err);
    } else {
      if (rst) {
        res.send(rst);
      } else {
        res.send("no key found");
      }
    }
  });
});

// setting value of key
app.post("/setValue", (req, res) => {
  let { key, value } = req.body;
  if (!key || !value) {
    res.send("Error : Please provide a valid key and value");
  }
  client.set(key, value, (err, rst) => {
    if (err) {
      console.log(err);
    } else {
      res.send(rst);
    }
  });
});

// set expiration of key
app.get("/exp/:key/:time", (req, res) => {
  let { key, time } = req.params;
  time = Number(time);
  if (isNaN(time)) {
    res.send("Error : Please provide integer value of time(in seconds)");
  }
  if (!key || !time) {
    res.send("Error : Please provide a valid key and time(in seconds)");
  } else {
    client.expire(key, time, (err, rst) => {
      if (err) {
        console.log(err);
      } else {
        if (rst) {
          res.send(`Done.`);
        } else {
          res.send("no key found!");
        }
      }
    });
  }
});

// get remaining time of key
app.get("/rem/:key", (req, res) => {
  let key = req.params.key;
  if (!key) {
    res.send("Error : Please provide a valid key");
  }
  client.ttl(key, (err, rst) => {
    if (err) {
      console.log(err);
    } else {
      if (rst == -2) {
        res.send(`Key does not exist!`);
      } else if (rst == -1) {
        res.send(`Key  does not any have expiry timeout.!`);
      } else {
        res.send(`Remaining time is ${rst}`);
      }
    }
  });
});

// add elements in sorted set
app.get("/zadd/:name/:value/:score", (req, res) => {
  let { name: setName, score, value } = req.params;
  score = Number(score);
  if (isNaN(score)) {
    res.send("Error : Please provide a float value for score");
  } else if (!setName || !score || !value) {
    res.send("Error : Please provide a valid set-name and score and element");
  }
  client.zadd(setName, score, value, (err, rst) => {
    if (err) {
      console.log(err);
    } else {
      if (rst == 0) {
        res.send("Updated element in the set!");
      } else {
        res.send(`Inserted ${rst} value in the set`);
      }
    }
  });
});

// get rank of element in sorted set
app.get("/rank/:name/:value", (req, res) => {
  let { name: setName, value } = req.params;
  if (!setName || !value) {
    res.send("Error : Please provide a valid set-name and element!");
  }
  client.zrank(setName, value, (err, rst) => {
    if (err) {
      console.log(err);
    } else {
      if (rst) {
        res.send(`The rank of ${value} is ${rst}(0-based)`);
      } else {
        res.send(`${value} does not exist in the set!`);
      }
    }
  });
});

// get the list of elements in sorted set
app.get("/zrange/:name/:start/:stop/:withscores", (req, res) => {
  let { name: setName, start, stop, withscores } = req.params;
  start = Number(start);
  stop = Number(stop);
  if (isNaN(start) || isNaN(stop)) {
    res.send("Error :  start and stop value must be integer");
  } else if (!setName) {
    res.send("Error : Please provide a valid set-name");
  } else if (withscores == "true") {
    client.zrange(setName, start, stop, "withscores", (err, rst) => {
      if (err) {
        console.log(err);
      } else {
        if (rst.length != 0) {
          res.send(rst);
        } else {
          res.send(`No elements found!`);
        }
      }
    });
  } else {
    client.zrange(setName, start, stop, (err, rst) => {
      if (err) {
        console.log(err);
      } else {
        if (rst.length != 0) {
          res.send(rst);
        } else {
          res.send(`No elements found!`);
        }
      }
    });
  }
});

// check if key exists
app.get("/checkKey/:key", (req, res) => {
  let key = req.params.key;
  if (!key) {
    res.send("Error : Please provide a valid key");
  }
  client.exists(key, (err, rst) => {
    if (err) {
      console.log(err);
    } else {
      if (rst == 0) {
        res.send(`Key does not exist!`);
      } else {
        res.send(`Key exists!`);
      }
    }
  });
});

// delete if key exists
app.get("/delKey/:key", (req, res) => {
  let key = req.params.key;
  if (!key) {
    res.send("Error : Please provide a valid key");
  }
  client.del(key, (err, rst) => {
    if (err) {
      console.log(err);
    } else {
      if (rst == 1) {
        res.send(`Key deleted!`);
      } else {
        res.send(`Key does not exist!`);
      }
    }
  });
});

app.listen(port, () => {
  console.log(`server is listening on port ${port}`);
});
