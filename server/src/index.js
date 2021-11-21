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


const MosaicDAO = require("./MosaicDAO.json");

var currentVersion = [];
var imgURL = "";

const API_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweGExN0U3MjFjOTNEN0NCOTFhQTI5RDg3ODRmODAwNkEzODQ0NTAyNTUiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2MzAyMjU0NDUyNjksIm5hbWUiOiJoYWxsb2ZmYW1lIn0._2Gp6-5tNmY8JPEyv4Wph1B1CpYD36DxqMBZkvp-T74";

const WALLET_KEY =
  "0x0b2b5ad1a40278a7def9beec3d653115368d76809444fe31834aa7b285504962";

const provider = new Web3.providers.HttpProvider("http://localhost:7545");

const networkId = 5777;

const web3 = new Web3(provider);

const account = web3.eth.accounts.privateKeyToAccount(WALLET_KEY);

const storageClient = new Web3Storage({ token: API_KEY });

let DAOContract;

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

function arraysEqual(a, b) {
  if (a === b) return true;
  if (a == null || b == null) return false;
  if (a.length !== b.length) return false;

  // If you don't care about the order of the elements inside
  // the array, you should sort both arrays here.
  // Please note that calling sort on an array will modify that array.
  // you might want to clone your array first.

  for (var i = 0; i < a.length; ++i) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");
  next();
});

app.use(express.json());

// Anyone can trigger an update
app.post("/", async (req, res) => {
  try {
  } catch (error) {
    res.status(400).send(error.toString());
  }
});

app.get("/", async function (req, res) {
  if (req.query.update) {
    try {
      // compare latest version with current version

      if (!DAOContract)
        DAOContract = await new web3.eth.Contract(
          MosaicDAO.abi,
          MosaicDAO.networks[networkId].address,
          {
            from: account.address,
          }
        );

      const latestVersion = await DAOContract.methods.getGalleryList().call();
      const galleryWidth = await DAOContract.methods.galleryWidth().call();

      if (arraysEqual(latestVersion, currentVersion)) {
        res
          .status(400)
          .send("Gallery already reflects the latest on-chain state.");
        return;
      }

      const { window } = new jsdom.JSDOM(`<!DOCTYPE html>`, {
        runScripts: "dangerously",
      });
      global.window = window;

      // Future TODO: Add image properties check
      // const metadata = await probe(body.image_url);
      // if (
      //   metadata.height != 256 ||
      //   metadata.width != 256 ||
      //   metadata.type != "png"
      // ) {
      //   res
      //     .status(400)
      //     .send(
      //       "incorrect image dimensions/type. Only PNG of 256x256 size is accepted"
      //     );
      //   return;
      // }
      let mergedImage;
      const fileName = "image.png";

      gallerySpecification = [];
      for (let i = 0; i < latestVersion.length; i++) {
        gallerySpecification.push({
          src: latestVersion[i],
          x: 256 * (i % galleryWidth),
          y: 256 * Math.floor(i / galleryWidth),
        });
      }

      console.log(gallerySpecification);
      mergedImage = await mergeImages(gallerySpecification, {
        Canvas: Canvas,
        Image: Image,
        width: 256 * galleryWidth,
        height: 256 * Math.ceil(latestVersion.length / galleryWidth),
      });

      mergedImage = dataURLtoFile(mergedImage, fileName);

      imgURL =
        "https://ipfs.io/ipfs/" +
        (await storageClient.put([mergedImage])) +
        "/" +
        fileName;
      console.log("merge image uploaded");

      console.log("uploaded to ipfs: ", imgURL);

      currentVersion = latestVersion;
      delete global.window;
    } catch (error) {
      res.status(400).send(error.toString());
      return;
    }
  }
  if (imgURL == "") {
    res.status(400).send("no picture uploaded");
  } else {
    (
      await axios({ method: "get", url: imgURL, responseType: "stream" })
    ).data.pipe(res);
  }
});

const PORT = 3001
app.listen(PORT, function () {});
console.log(`server running on port ${PORT}`);