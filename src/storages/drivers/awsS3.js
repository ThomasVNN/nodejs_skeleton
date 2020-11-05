import * as AWS from "aws-sdk";
import uuidv4 from "uuid/v4";
import { HeaderFile } from "../../constants";
import { S3_BUCKET, S3_API_VERSION } from "../../configs/configs";
import {Configs} from "../../configs";

function configAWS() {
  AWS.config.update({
    accessKeyId: Configs.S3_ACCESS_KEY,
    secretAccessKey: Configs.S3_SECRET_KEY
  });
}
const S3_AWS_ENDPOINT = "s3.amazonaws.com";
const s3 = new AWS.S3({
  accessKeyId: Configs.S3_ACCESS_KEY,
  secretAccessKey: Configs.S3_SECRET_KEY,
  apiVersion: S3_API_VERSION
});


export async function uploadReadableStream(stream,s3FileName) {
  return new Promise((resolve, reject) => {
    const params = {Bucket: Configs.S3_BUCKET, Key: s3FileName, Body: stream,ContentType: "text/csv",ACL: "public-read" };
    // return s3.upload(params).promise();
    s3.putObject(params, (err, data) => {
      if (err) {
        reject(err);
      } else {
        const fullUrl = `https://${S3_BUCKET}.${S3_AWS_ENDPOINT}/${s3FileName}`;
        resolve({ key: s3FileName, url: fullUrl });
      }
    });
  })
}

export async function uploadToS3(imageInput) {
  return new Promise((resolve, reject) => {
    configAWS();

    const key = `${imageInput.userId}/${uuidv4()}`;
    const metadata = {};
    metadata[HeaderFile.HEADER_FILENAME] = imageInput.fileName;
    const params = {
      Bucket: S3_BUCKET, /* required */
      Key: "key", /* required */
      Body: imageInput,
      ContentType: imageInput.contentType,
      Metadata: metadata,
      ACL: "public-read"
    };
    // Create S3 service object
    s3.putObject(params, (err, data) => {
      if (err) {
        reject(err);
      } else {
        const fullUrl = `https://${S3_BUCKET}.${S3_AWS_ENDPOINT}/${key}`;
        resolve({ key: key, url: fullUrl });
      }
    });
  });
}

export async function getFileFromS3(fileKey) {
  configAWS();
  const params = {
    Bucket: S3_BUCKET, /* required */
    Key: fileKey, /* required */
  }
  return new Promise((resolve, reject) => {
    s3.getObject(params, (err, data) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(data);
    });
  });
}

export async function getS3PublicUrl(fileKey) {
  configAWS();

  // Create S3 service object
  const params = {
    Bucket: S3_BUCKET,
    Key: fileKey
  };

  return new Promise((resolve, reject) => {
    s3.headObject(params, (err, data) => {
      if (err) {
        reject(err);
        return;
      }
      const fileName = data.Metadata[HeaderFile.HEADER_FILENAME];
      const getUrlParams = {
        Bucket: S3_BUCKET,
        Key: fileKey,
        ResponseContentDisposition: `attachment;filename*=UTF-8''${fileName}`
      };
      s3.getSignedUrl("getObject", getUrlParams, (err, publicUrl) => {
        if (err) {
          reject(err);
          return;
        }
        resolve({ key: fileKey, url: publicUrl });
      });
    });
  });
}

// fileKeys: String[]
export async function deleteFilesOnS3(fileKeys) {
  configAWS();
  const fileKeyObjects = [];
  for (const fileKey of fileKeys) {
    const fileKeyObject = {
      Key: fileKey
    }
    fileKeyObjects.push(fileKeyObject);
  }
  const params = {
    Bucket: S3_BUCKET, /* required */
    Delete: { /* required */
      Objects: fileKeyObjects /* required */
    }
  };
  return new Promise((resolve, reject) => {
    s3.deleteObjects(params, (err, data) => {
      if (err) {
        resolve(false);
        return;
      }
      resolve(true);
    });
  });
}
