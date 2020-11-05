import { logger } from "./log";
const fastcsv = require("fast-csv");
import { Configs } from "../configs";

const fs = require("fs");
import { decode as deBase64 } from 'js-base64';
import axios from 'axios';
import { param } from "express-validator/check";
import { AWS3 } from "../storages";

class Utils {
  static isHexColor(hex) {
    return /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/.test(hex);
  }
  static isURL(str) {
    const pattern = new RegExp("^(https?:\\/\\/)?" + // protocol
      "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // domain name
      "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
      "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
      "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
      "(\\#[-a-z\\d_]*)?$", "i"); // fragment locator
    return !!pattern.test(str);
  }
  static isEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }


  static uniqByKeepLast(a, key) {
    return [
      ...new Map(
        a.map(x => [key(x), x])
      ).values()
    ]
  }

  static coverCSVFileToArray(path) {
    return new Promise((resolve, reject) => {
      const fileRows = [];
      fastcsv.parseString(path.toString("utf8"), { objectMode: true, headers: true }).on("data", (data) => {
        fileRows.push(data);
      }).on("end", async (e) => {
        logger.info("end:", e);
        resolve(fileRows);
      }).on("error", (err => {
        logger.info("error");
        reject(err);
      }))
    });
  }
  static async coverArrayToCSVFileAndUploadToS3(data, fileName) {
    return new Promise((resolve, reject) => {
      const jsonData = JSON.parse(JSON.stringify(data));
      console.log("coverArrayToCSVFileAndUploadToS3");
      const ws = fs.createWriteStream(`${Configs.TMP_FOLDER_LAMBDA}/${fileName}`);
      const chunks = [];
      console.log("ws :",ws);
      fastcsv.write(jsonData, { headers: true }).on("data",(chunk)=>{
        chunks.push(chunk);
      }).on("end", () => {
        console.log("end chunks.length :",chunks.length );
          if (chunks.length === 0) {
            reject("error");
          }
          const buffer = Buffer.concat(chunks);
        console.log("end chunks.buffer :" );

        AWS3.uploadReadableStream(buffer,`${Configs.S3_FOLDER}${fileName}`).then(result => {
          console.log("end chunks.uploadReadableStream :" );

          resolve({url:result.url,path:ws.path})
          });
      }).on("error", (err => reject(err))).pipe(ws);
    })
  }

  static decodeBase64(str) {
    return deBase64(str)
  }

  /**
   *
   * @param {Object} otps axios options
   * @description func call http request
   * @template opt = {
  method: 'post',
  url: '/user/12345',
  data: {
    firstName: 'Fred',
    lastName: 'Flintstone'
  }
}
   */
  static requestAPI(otps) {
    return new Promise((resolve, reject) => {
      let { method, url, headers, data, params } = otps;
      return axios({ method, url, headers, data, params }).then(res => {
        resolve(res);
      }).catch(err => {
        reject(err);
      });
    })

  }
}

export default Utils;
/**
 * Returns the week number for this date.  dowOffset is the day of week the week
 * "starts" on for your locale - it can be from 0 to 6. If dowOffset is 1 (Monday),
 * the week returned is the ISO 8601 week number.
 * @param int dowOffset
 * @return int
 */


Array.prototype.subArray = function (start, size) {
  let sst = start;
  let end = start + size;
  if (sst === 1) {
    sst = 0;
    end -= 1;
  }
  return this.slice(sst, end);
}
Array.prototype.groupByKey = function(key){
  return this.reduce((rv, x) => {
    (rv[x[key]] = rv[x[key]] || []).push(x);
    return rv;
  }, {});
}
Array.prototype.sumWithKey = function(key){
  return this.reduce((a, b) => parseFloat(a) + (parseFloat(b[key]) || 0.0), 0.0);
}
Array.prototype.groupAndSumByKey = function(keyCheck , keyAdd,keyAdd2){
  let data = [];
  this.forEach((item) => {
    let found = 0;
    for(let i =0;i< data.length; i++){
      const check = data[i];
      if(check[keyCheck] === item[keyCheck]){
        check[keyAdd]  =  parseFloat(check[keyAdd])+ parseFloat(item[keyAdd]);
        keyAdd2?(check[keyAdd2]  = parseInt(check[keyAdd2])+ parseInt(item[keyAdd2])):"";
        found = 1;
        break;
      }}
    if(found === 0 && item[keyCheck]){
      data.push(item)
    }
  });
  return data;
}
// EXTENTION FOR DATE
Date.prototype.getDateBefore = function (days = 0) {
  return (this.getTime() - (days * 24 * 60 * 60 * 1000));
}
Date.prototype.getMonthYear = function (){
  const m =  (this.getMonth() + 1).toString();
  const mon = ("00" + m).substring(m.length);
  return  `${mon}${this.getFullYear()}`
}
Date.prototype.getBusinessDate= function(){
  const d =  this.getDate().toString();
  const m =  (this.getMonth() + 1).toString();
  const da = ("00"+d).substring(d.length);
  const mon = ("00" + m).substring(m.length);
  const year = this.getFullYear();
  return  `${year}-${mon}-${da}`
}

Date.prototype.getQuarter = function (){
  let m = Math.floor(this.getMonth() / 3) + 2;
  m -= m > 4 ? 4 : 0;
  return m;
}


String.prototype.deBase64 = function () {
  return deBase64(this.toString())
}

