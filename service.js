// Tham chiếu đến Biến môi trường
require("dotenv").config();

// Tham chiếu đến thư viện http của NODE
const http = require("http");
// Khai báo cổng web service (Tham chiếu đến biến PORT tron file .env)
const port = process.env.PORT;

// Tham chiếu đên thư viện xử lý tập tin của NODE
const fs = require("fs");
// Khai báo thư viện MongoDB (Nhúng từ file ./mongDB)
const db = require("./mongoDB");
// Khai báo thư viện cloudinaryImages.js
const imgCloud = require("./cloudinaryImages");
// Khai báo thư viện sendMail.js
const sendMail = require("./sendMail");

// Xây dựng dịch vụ
const server = http.createServer((req, res) => {
  let method = req.method;
  let url = req.url;
  let result = `Service NODE - Method: ${method} - URL: ${url}`;

  // Cấp quyền
  res.setHeader("Access-Control-Allow-Origin", "*");
  if (method == `GET`) {
    if (url == `/tiviList`) {
      // // WriteHead Đoc tập tinh theo chuẩn (<Thành công code>,<{"Content-Type":"text/json;charset=utf-8"}>)
      res.writeHead(200, { "Content-Type": "text/json;charset=utf-8" });
      db.getAll("tivi")
        .then((result) => {
          res.end(JSON.stringify(result));
        })
        .catch((err) => {
          console.log(err);
        });
    } else if (url == `/mobileList`) {
      // // WriteHead Đoc tập tinh theo chuẩn (<Thành công code>,<{"Content-Type":"text/json;charset=utf-8"}>)
      res.writeHead(200, { "Content-Type": "text/json;charset=utf-8" });
      db.getAll("mobile")
        .then((result) => {
          res.end(JSON.stringify(result));
        })
        .catch((err) => {
          console.log(err);
        });
    } else if (url == `/foodList`) {
      // // WriteHead Đoc tập tinh theo chuẩn (<Thành công code>,<{"Content-Type":"text/json;charset=utf-8"}>)
      res.writeHead(200, { "Content-Type": "text/json;charset=utf-8" });
      db.getAll("food")
        .then((result) => {
          res.end(JSON.stringify(result));
        })
        .catch((err) => {
          console.log(err);
        });
    } else if (url == `/storeInfo`) {
      // WriteHead Đoc tập tinh theo chuẩn (<Thành công code>,<{"Content-Type":"text/json;charset=utf-8"}>)
      res.writeHead(200, { "Content-Type": "text/json;charset=utf-8" });
      db.getOne("store").then((result) => {
        res.end(JSON.stringify(result));
      });
    } else if (url == `/studentList`) {
      // // WriteHead Đoc tập tinh theo chuẩn (<Thành công code>,<{"Content-Type":"text/json;charset=utf-8"}>)
      res.writeHead(200, { "Content-Type": "text/json;charset=utf-8" });
      db.getAll("student")
        .then((result) => {
          res.end(JSON.stringify(result));
        })
        .catch((err) => {
          console.log(err);
        });
    } else if (url == `/userList`) {
      // // WriteHead Đoc tập tinh theo chuẩn (<Thành công code>,<{"Content-Type":"text/json;charset=utf-8"}>)
      res.writeHead(200, { "Content-Type": "text/json;charset=utf-8" });
      db.getAll("user")
        .then((result) => {
          res.end(JSON.stringify(result));
        })
        .catch((err) => {
          console.log(err);
        });
      // Get Images
    } else if (url.match(".png$")) {
      let imgPath = `./img${url}`;
      if (!fs.existsSync(imgPath)) {
        imgPath = `./img/noImage.png`;
      }
      // fileStream đọc hình ra mã
      let fileStream = fs.createReadStream(imgPath);
      res.writeHead(200, { "Content-Type": "image/png" });
      // Trả về lại hình
      fileStream.pipe(res);
    } else {
      res.end(result);
    }
  } else if (method == `POST`) {
    // Server nhận Dữ liệu từ Client gởi về
    let msg_receive = ``;
    req.on("data", (data) => {
      msg_receive += data;
    });

    // Server Xử lý và trả kết quả cho client
    if (url == `/deleteUser`) {
      req.on("end", function () {
        let user = JSON.parse(msg_receive);
        let rs = { msg: true };
        db.deleteOne("user", user)
          .then((result) => {
            console.log(result);
            res.writeHead(200, { "Content-Type": "text/json;charset=utf-8" });
            res.end(JSON.stringify(rs));
          })
          .catch((err) => {
            console.log(err);
            rs.msg = false;
            res.writeHead(200, { "Content-Type": "text/json;charset=utf-8" });
            res.end(JSON.stringify(rs));
          });
      });
    } else if (url == "/login") {
      req.on("end", () => {
        let rs = {
          msg: true,
        };
        let user = JSON.parse(msg_receive);
        let condition = {
          $and: [
            { Ten_Dang_nhap: user.Ten_Dang_nhap },
            { Mat_khau: user.Mat_khau },
          ],
        };
        db.getOne("user", condition)
          .then((result) => {
            console.log(result);
            rs.msg = {
              Ho_ten: result.Ho_ten,
              Nhom: {
                Ma_so: result.Nhom_Nguoi_dung.Ma_so,
                Ten: result.Nhom_Nguoi_dung.Ten,
              },
            };
            res.writeHead(200, { "Content-Type": "text/json;charset=utf-8" });
            res.end(JSON.stringify(rs));
          })
          .catch((err) => {
            console.log(err);
            rs.msg = false;
            res.writeHead(200, { "Content-Type": "text/json;charset=utf-8" });
            res.end(JSON.stringify(rs));
          });
      });
    } else if (url == "/insertMobile") {
      req.on("end", function () {
        let mobile = JSON.parse(msg_receive);
        let rs = { msg: true };
        db.insertOne("mobile", mobile)
          .then((result) => {
            console.log(result);
            res.writeHead(200, { "Content-Type": "text/json;charset=utf-8" });
            res.end(JSON.stringify(rs));
          })
          .catch((err) => {
            console.log(err);
            rs.msg = false;
            res.writeHead(200, { "Content-Type": "text/json;charset=utf-8" });
            res.end(JSON.stringify(rs));
          });
      });
    } else if (url == "/insertTivi") {
      req.on("end", function () {
        let tivi = JSON.parse(msg_receive);
        let rs = { msg: true };
        db.insertOne("tivi", tivi)
          .then((result) => {
            console.log(result);
            res.writeHead(200, { "Content-Type": "text/json;charset=utf-8" });
            res.end(JSON.stringify(rs));
          })
          .catch((err) => {
            console.log(err);
            rs.msg = false;
            res.writeHead(200, { "Content-Type": "text/json;charset=utf-8" });
            res.end(JSON.stringify(rs));
          });
      });
    } else if (url == "/insertFood") {
      req.on("end", function () {
        let food = JSON.parse(msg_receive);
        let rs = { msg: true };
        db.insertOne("food", food)
          .then((result) => {
            console.log(result);
            res.writeHead(200, { "Content-Type": "text/json;charset=utf-8" });
            res.end(JSON.stringify(rs));
          })
          .catch((err) => {
            console.log(err);
            rs.msg = false;
            res.writeHead(200, { "Content-Type": "text/json;charset=utf-8" });
            res.end(JSON.stringify(rs));
          });
      });
    }else if (url == "/insertUser") {
      req.on("end", function () {
        let user = JSON.parse(msg_receive);
        let rs = { msg: true };
        db.insertOne("user", user)
          .then((result) => {
            console.log(result);
            res.writeHead(200, { "Content-Type": "text/json;charset=utf-8" });
            res.end(JSON.stringify(rs));
          })
          .catch((err) => {
            console.log(err);
            rs.msg = false;
            res.writeHead(200, { "Content-Type": "text/json;charset=utf-8" });
            res.end(JSON.stringify(rs));
          });
      }); 
    }else if (url == "/imagesMobile") {
      req.on("end", function () {
        let img = JSON.parse(msg_receive);
        let rs = { msg: true };
        // upload img in images ------------------------------
        /*
        let kq = saveMedia(img.name, img.src);
        if (kq == "OK") {
          res.writeHead(200, { "Content-Type": "text/json; charset=utf-8" });
          res.end(JSON.stringify(rs));
        } else {
          rs.msg = false;
          res.writeHead(200, { "Content-Type": "text/json; charset=utf-8" });
          res.end(JSON.stringify(rs));
        }
        */

        // upload img host cloudinary ------------------------------

        imgCloud
          .UPLOAD_CLOUDINARY(img.name, img.src)
          .then((result) => {
            console.log(result);
            res.end(JSON.stringify(rs));
          })
          .catch((err) => {
            rs.msg = false;
            res.end(JSON.stringify(rs));
          });
      });
    } else if (url == "/imagesTivi") {
      req.on("end", function () {
        let img = JSON.parse(msg_receive);
        let rs = { msg: true };

        imgCloud
          .UPLOAD_CLOUDINARY(img.name, img.src)
          .then((result) => {
            console.log(result);
            res.end(JSON.stringify(rs));
          })
          .catch((err) => {
            rs.msg = false;
            res.end(JSON.stringify(rs));
          });
      });
    } else if (url == "/imagesFood") {
      req.on("end", function () {
        let img = JSON.parse(msg_receive);
        let rs = { msg: true };

        imgCloud
          .UPLOAD_CLOUDINARY(img.name, img.src)
          .then((result) => {
            console.log(result);
            res.end(JSON.stringify(rs));
          })
          .catch((err) => {
            rs.msg = false;
            res.end(JSON.stringify(rs));
          });
      });
    }else if (url == "/imagesUser") {
      req.on("end", function () {
        let img = JSON.parse(msg_receive);
        let rs = { msg: true };

        imgCloud
          .UPLOAD_CLOUDINARY(img.name, img.src)
          .then((result) => {
            console.log(result);
            res.end(JSON.stringify(rs));
          })
          .catch((err) => {
            rs.msg = false;
            res.end(JSON.stringify(rs));
          });
      });
    }
     else if (url == "/updateMobile") {
      req.on("end", function () {
        let mobile = JSON.parse(msg_receive);
        let rs = { msg: true };
        db.updateOne("mobile", mobile.condition, mobile.update)
          .then((result) => {
            console.log(result);
            res.writeHead(200, { "Content-Type": "text/json;charset=utf-8" });
            res.end(JSON.stringify(rs));
          })
          .catch((err) => {
            console.log(err);
            rs.msg = false;
            res.writeHead(200, { "Content-Type": "text/json;charset=utf-8" });
            res.end(JSON.stringify(rs));
          });
      });
    } else if (url == "/updateTivi") {
      req.on("end", function () {
        let tivi = JSON.parse(msg_receive);
        let rs = { msg: true };
        db.updateOne("tivi", tivi.condition, tivi.update)
          .then((result) => {
            console.log(result);
            res.writeHead(200, { "Content-Type": "text/json;charset=utf-8" });
            res.end(JSON.stringify(rs));
          })
          .catch((err) => {
            console.log(err);
            rs.msg = false;
            res.writeHead(200, { "Content-Type": "text/json;charset=utf-8" });
            res.end(JSON.stringify(rs));
          });
      });
    } else if (url == "/updateFood") {
      req.on("end", function () {
        let food = JSON.parse(msg_receive);
        let rs = { msg: true };
        db.updateOne("food", food.condition, food.update)
          .then((result) => {
            console.log(result);
            res.writeHead(200, { "Content-Type": "text/json;charset=utf-8" });
            res.end(JSON.stringify(rs));
          })
          .catch((err) => {
            console.log(err);
            rs.msg = false;
            res.writeHead(200, { "Content-Type": "text/json;charset=utf-8" });
            res.end(JSON.stringify(rs));
          });
      });
    } else if (url == "/updateUser") {
      req.on("end", function () {
        let user = JSON.parse(msg_receive);
        let rs = { msg: true };
        db.updateOne("user", user.condition, user.update)
          .then((result) => {
            console.log(result);
            res.writeHead(200, { "Content-Type": "text/json;charset=utf-8" });
            res.end(JSON.stringify(rs));
          })
          .catch((err) => {
            console.log(err);
            rs.msg = false;
            res.writeHead(200, { "Content-Type": "text/json;charset=utf-8" });
            res.end(JSON.stringify(rs));
          });
      });
    }
    
    else if (url == "/deleteMobile") {
      req.on("end", function () {
        let mobile = JSON.parse(msg_receive);
        let rs = { msg: true };
        db.deleteOne("mobile", mobile)
          .then((result) => {
            console.log(result);
            res.writeHead(200, { "Content-Type": "text/json;charset=utf-8" });
            res.end(JSON.stringify(rs));
          })
          .catch((err) => {
            console.log(err);
            rs.msg = false;
            res.writeHead(200, { "Content-Type": "text/json;charset=utf-8" });
            res.end(JSON.stringify(rs));
          });
      });
    } else if (url == "/deleteTivi") {
      req.on("end", function () {
        let tivi = JSON.parse(msg_receive);
        let rs = { msg: true };
        db.deleteOne("tivi", tivi)
          .then((result) => {
            console.log(result);
            res.writeHead(200, { "Content-Type": "text/json;charset=utf-8" });
            res.end(JSON.stringify(rs));
          })
          .catch((err) => {
            console.log(err);
            rs.msg = false;
            res.writeHead(200, { "Content-Type": "text/json;charset=utf-8" });
            res.end(JSON.stringify(rs));
          });
      });
    } else if (url == "/deleteFood") {
      req.on("end", function () {
        let food = JSON.parse(msg_receive);
        let rs = { msg: true };
        db.deleteOne("food", food)
          .then((result) => {
            console.log(result);
            res.writeHead(200, { "Content-Type": "text/json;charset=utf-8" });
            res.end(JSON.stringify(rs));
          })
          .catch((err) => {
            console.log(err);
            rs.msg = false;
            res.writeHead(200, { "Content-Type": "text/json;charset=utf-8" });
            res.end(JSON.stringify(rs));
          });
      });
    } else if (url == "/order") {
      req.on("end", () => {
        let orderList = JSON.parse(msg_receive);
        let resultOrder = { arrOrder: [] };
        orderList.forEach((item) => {
          let filter = {
            Ma_so: item.key,
          };
          let collectionName =
            item.manhom == 1 ? "tivi" : item.manhom == 2 ? "mobile" : "food";
          db.getOne(collectionName, filter)
            .then((result) => {
              item.dathang.So_Phieu_Dat = result.Danh_sach_Phieu_Dat.length + 1;
              result.Danh_sach_Phieu_Dat.push(item.dathang);
              // Update
              let update = {
                $set: { Danh_sach_Phieu_Dat: result.Danh_sach_Phieu_Dat },
              };
              let obj = {
                Ma_so: result.Ma_so,
                Update: true,
              };
              db.updateOne(collectionName, filter, update)
                .then((result) => {
                  if (result.modifiedCount == 0) {
                    obj.Update = false;
                  }
                  resultOrder.arrOrder.push(obj);
                  console.log(resultOrder.arrOrder);
                  if (resultOrder.arrOrder.length == orderList.length) {
                    res.end(JSON.stringify(resultOrder));
                  }
                })
                .catch((err) => {
                  console.log(err);
                });
            })
            .catch((err) => {
              console.log(err);
            });
        });
      });
    } else if (url == "/contact") {
      req.on("end", function () {
        let info = JSON.parse(msg_receive);
        let rs = { msg: true };
        let from = `huydanhtest0408@gmail.com`;
        let to = `huydanhtest0408@gmail.com`;
        let subject = info.title;
        let body = info.msg;
        console.log("info:", info);
        sendMail
          .call_sendMail(from, to, subject, body)
          .then((result) => {
            console.log(result);
            res.end(JSON.stringify(rs));
          })
          .catch((err) => {
            console.log(err);
            rs.msg = false;
            res.end(JSON.stringify(rs));
          });
      });
    } else {
      res.end(result);
    }
  } else {
    res.end(result);
  }
});

server.listen(port, () => {
  console.log(`Service run ... ip -> http://localhost: ${port}`);
});

// Upload Media -----------------------------------------------------------------
function decodeBase64Image(dataString) {
  var matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/),
    response = {};

  if (matches.length !== 3) {
    return new Error("Error ...");
  }

  response.type = matches[1];
  response.data = new Buffer(matches[2], "base64");

  return response;
}

function saveMedia(Ten, Chuoi_nhi_phan) {
  var Kq = "OK";
  try {
    var Nhi_phan = decodeBase64Image(Chuoi_nhi_phan);
    var Duong_dan = "img/" + Ten;
    fs.writeFileSync(Duong_dan, Nhi_phan.data);
  } catch (Loi) {
    Kq = Loi.toString();
  }
  return Kq;
}
