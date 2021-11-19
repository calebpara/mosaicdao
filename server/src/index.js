const { Web3Storage, File } = require("web3.storage");
const mergeImages = require("merge-images");
const probe = require("probe-image-size");
const Web3 = require("web3");
const axios = require("axios");
const express = require("express");
const jsdom = require("jsdom");
const { Canvas, Image } = require("canvas");
const atob = require("atob");
const app = express();

const HallOfFame = require("../../client/src/contracts/ThousandNFT.json");

var imgURL = "";

const API_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweGExN0U3MjFjOTNEN0NCOTFhQTI5RDg3ODRmODAwNkEzODQ0NTAyNTUiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2MzAyMjU0NDUyNjksIm5hbWUiOiJoYWxsb2ZmYW1lIn0._2Gp6-5tNmY8JPEyv4Wph1B1CpYD36DxqMBZkvp-T74";

const WALLET_KEY =
  "0x0b2b5ad1a40278a7def9beec3d653115368d76809444fe31834aa7b285504962";

const provider = new Web3.providers.HttpProvider("http://localhost:8545");

const networkId = 5777;

const web3 = new Web3(provider);

const account = web3.eth.accounts.privateKeyToAccount(WALLET_KEY);

const storageClient = new Web3Storage({ token: API_KEY });

let NFTContract;

function dataURLtoFile(dataurl, filename) {
  var arr = dataurl.split(","),
    mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[1], "base64"),
    n = bstr.length,
    u8arr = new Uint8Array(n);

  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }

  return new File([u8arr], filename, { type: mime });
}

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");
  next();
});

app.use(express.json());

app.post("/", async (req, res) => {
  try {
    const body = req.body;
    console.log(body);
    console.log(web3.eth.accounts);
    // TODO: verify that caller is the owner on smart contract
    if (!NFTContract)
      NFTContract = await new web3.eth.Contract(
        HallOfFame.abi,
        HallOfFame.networks[networkId].address,
        {
          from: account.address,
        }
      );

    const currentLength = await NFTContract.methods.chainLength(body.id).call();
    console.log(currentLength);

    const currentOwner = await NFTContract.methods.ownerOf(body.id).call();

    const updateMessage = "update " + body.id + " " + currentLength;

    console.log(updateMessage);

    const sender = await web3.eth.accounts.recover(updateMessage, body.verification);
    console.log(sender);
    if (sender !== currentOwner) {
      res
        .status(400)
        .send(
          "You do not have access to this token. Current owner: " + currentOwner
        );
      return;
    }
    const { window } = new jsdom.JSDOM(`<!DOCTYPE html>`, {
      runScripts: "dangerously",
    });
    global.window = window;

    const metadata = await probe(body.image_url);
    if (
      metadata.height !== 256 ||
      metadata.width !== 256 ||
      metadata.type !== "png"
    ) {
      res
        .status(400)
        .send(
          "incorrect image dimensions/type. Only PNG of 256x256 size is accepted"
        );
      return;
    }
    let mergedImage;
    const fileName = "image.png";
    if (imgURL === "") {
      mergedImage = await mergeImages([{ src: body.image_url, x: 0, y: 0 }], {
        Canvas: Canvas,
        Image: Image,
        width: 256,
        height: 256,
      });
    } else {
      console.log("already has image");
      mergedImage = await mergeImages(
        [
          { src: imgURL, x: 0, y: 0 },
          { src: body.image_url, x: 256, y: 0 },
        ],
        {
          Canvas: Canvas,
          Image: Image,
          width: 512,
          height: 256,
        }
      );
    }
    console.log("reached");
    mergedImage = dataURLtoFile(mergedImage, fileName);

    imgURL =
      "https://ipfs.io/ipfs/" +
      (await storageClient.put([mergedImage])) +
      "/" +
      fileName;
    console.log("merge image uploaded");

    console.log("uploaded to ipfs: ", imgURL);
    delete global.window;
    res.status(200).send("success");
  } catch (error) {
    res.status(400).send(error.toString());
  }
});

app.get("/", async function (req, res) {
  if (imgURL === "") {
    res.status(400).send("no picture uploaded");
  } else {
    (
      await axios({ method: "get", url: imgURL, responseType: "stream" })
    ).data.pipe(res);
  }
});

app.listen(3001, function () {});
