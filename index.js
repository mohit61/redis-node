const express = require("express");
const redis = require("redis");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();

var port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());

const temp = "JyCKOp1E8fUI5pI2hCVDHcNdEvl8xLkQ";

// connect to redis cloud
const client = redis.createClient({
  port: 13631,
  host: "redis-13631.c14.us-east-1-2.ec2.cloud.redislabs.com",
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
});

// get remaining time of key
app.get("/rem/:key", (req, res) => {
  let key = req.params.key;
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
  if (withscores == "true") {
    client.zrange(setName, start, stop, "withscores", (err, rst) => {
      if (err) {
        console.log(err);
      } else {
        if (rst.length != 0) {
          res.send(rst);
        } else {
          res.send(`empty set!`);
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
          res.send(`empty set!`);
        }
      }
    });
  }
});

// check if key exists
app.get("/checkKey/:key", (req, res) => {
  let key = req.params.key;
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
