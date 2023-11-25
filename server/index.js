const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const { TextServiceClient } = require("@google-ai/generativelanguage").v1beta2;
const { GoogleAuth } = require("google-auth-library");

dotenv.config();

const MODEL_NAME = process.env.MODEL_NAME;
const API_KEY = process.env.API_KEY;

const app = express();
app.use(bodyParser.json());

const authClient = new GoogleAuth().fromAPIKey(API_KEY);
const client = new TextServiceClient({
  authClient: authClient,
});

let answer = null;
let prompt = "";

app.post("/api", (req, res) => {
  prompt = req.body.prompt;
  client
    .generateText({
      model: MODEL_NAME,
      prompt: {
        text: prompt,
      },
    })
    .then((result) => {
      answer = result[0].candidates[0].output;
      res.json(answer);
      console.log(JSON.stringify(result, null, 2));
    }).catch((err) => {
      console.log(err);
      res.send(err.details)
    });
});

app.listen(8080, () => {
  console.log("Server running on port 8080");
});