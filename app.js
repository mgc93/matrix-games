/// load modules 
var express = require("express");
// instanitate the app
var app = express();

const subjects = {};
const starttime = Date.now();


const Dropbox = require("dropbox").Dropbox;
const fetch = require("node-fetch");
const body_parser = require("body-parser");


const dbx = new Dropbox({
    accessToken: 'sl.u.AFtd0DbUibq2t3g1ajxEZug2Z2645lAtr9qThTyVSDGw6wTRpnBKp-0kdYrQ4M8KNTaJ79iWLbGDHRT5E9-NAzjRxRprwR6uZ3ksJyVFj5cKaE-OVJgqoK-Br5O6qAyT9sjGazOwoXVkVcz5_Hm-O1mf5zV8DT19gP5KkxBUWUOoRt2P76nSFrgoHoee49_a5ZZ4K5DLzhe9pjvdHKizGyaQh5mwiZlIo7P5xnxOdQH6zUD8zhuO5hT0M-I3Zez7CBk8oBRktbwn3BgPpOELdAqfqrA4oYa4LYRdVjlA4LrCBwdeqsAi8qG3DIJ9hDF15uWp-8VxiWApyiKXP4nH2z2jYO3U6oxDchox2-u5RSXyN9mdCEpSm5bRYl1e_fiAytwS5b7oRB2PZ6G5_ZV7iRLadoJojDst_oiGZmbMzZi884sELRerP8bhpZKP0eF56ETNPVXUyZ8aoK1je10ekZfhVRsfg-UTnlsYH6N0VlQMeebI_s6HjoJPrHRSgcebXkqRiz_H2zpiadhqQYL1SG2UCbplZ9xoVcg_u6Om-j9FV_3TmRV9WZLaouqJfcFOAG50TFUGx6U1U1f3r24PzfFnt1tAFT7a8PY6iNDhqykG5CSUXUrxkV0VR-MDncVyoLJeK-aNfcWrDPjL6WymxVA9_O02Q_fqmpDpSYziouNRFZZgGeSkcWXI8lxXHrCBvut9_AaU83DlupQUuD8zgzHfhZ3J3EDZT7jas45jo4cuMGlurPzwb9yD7SyCRmgg8L7RlhDqaBIV23v_L8RhtKPEfROSbS7sPLIZWGMGnoon7twSPa3GiDeDgurjot3R3SlkeFkaBeHUMa1vkb7QJLabENsF_dQPWPZ1Tri06qRgys7mJRuVo1eCc1tjdvmNWHuhJBexwQh8FmJM-AbF7KK8zmBEu2kVRHPlVndHnFMo4tDMYsJbVNE8buo5v5tIjMZS4uoHSOhWzUFZ6KT-rkJ7LvzUJYNF_hUYHYyt0lhEr8sYJz_WOKhuF-He2X5VLNpAHzmsO54klItBfNqcQbuwgnprTgaiDOQ70i1256Jhib4s3_R2ReD02MOhK1JXLm1d5N5ZdQk8e3NvBs0VIuygff7e9ccem0a9jDrdlprgesnl36G0yVMsV0V10-pJLw5PZ9mv5SgMn4svGA2CZdnp6Wp4qiIjM-uwsyBqhL-Ij3HawrY5wJCITj2CQ8jj9DSV7AssBZEixBfnSI4GYCS5yS3Moykksq1L3ICHSlX3qic0i1gMAJh4PwlwVwNSliIIrFW-2RXePhTyoFlA0CgZ',
    fetch
});

// async function saveDropbox(content, filename, foldername) {
//     const uploadArgs = {
//       path: `/${foldername}/${filename}`,
//       contents: content,
//       mode: { ".tag": "overwrite" }
//     };
  
//     try {
//       // first attempt
//       return await dbx.filesUpload(uploadArgs);
//     } catch (err) {
//       // if the folder is missing, create it then retry
//       if (
//         err.error?.error?.[".tag"] === "path" &&
//         err.error.error.path[".tag"] === "not_found"
//       ) {
//         await dbx.filesCreateFolder({ path: `/${foldername}` });
//         return dbx.filesUpload(uploadArgs);
//       }
//       // rethrow any other error
//       throw err;
//     }
//   }
  
  
function saveDropbox(content, filename, foldername) {
    return dbx.filesGetMetadata({ path: `/${foldername}` })
        .catch(err => {
            // if the folder truly isn’t there, create it
            if (
                err.error?.error?.['.tag'] === 'path' &&
                err.error.error.path['.tag'] === 'not_found'
            ) {
                return dbx.filesCreateFolder({ 
                    path: `/${foldername}`, 
                    autorename: false 
                });
            }
            // otherwise re-throw for the outer catch to handle
            throw err;
        })
        .then(() =>
            dbx.filesUpload({
                path: `/${foldername}/${filename}`,
                contents: content,
                mode: { '.tag': 'overwrite' }
            })
        );
}


// // old
// saveDropbox = function (content, filename, foldername) {
//     return dbx.filesGetMetadata({
//         path: "/" + foldername,
//     }).catch(err => {
//         // //      console.log(err['error']['path'])
//         // if (err.error.error.path['.tag'] == 'not_found') {
//         //     return dbx.filesCreateFolder({
//         //         path: "/" + foldername,
//         //         autorename: false,
//         //     });
//         // } else {
//         //     throw err;
//         // }
//     }).then(() => {
//         return dbx.filesUpload({
//             path: "/" + foldername + "/" + filename,
//             contents: content
//         });
//     });
// };


saveDropboxSingleFile = function (content, filename) {
    return dbx.filesUpload({
        path: "/" + filename,
        contents: content,
        autorename: false,
        mode:  'overwrite'
    });
};


app.set('port', (process.env.PORT || 2000));

// static
app.use(express.static(__dirname + '/public'));
app.use(body_parser.json({ limit: "50mb" }));


app.get("/", function (request, response) {
    response.render("index.html");
})


app.post("/data", function (req, res) {
    req.setTimeout(0);

    const data = JSON.stringify(req.body);
    const id = req.body[0].subject.replace(/'/g, "");
    const filename = `${Date.now()}.json`;
    const foldername = id;

    saveDropbox(data, filename, foldername)
        .then(result => {
            // ← send a 200 success back
            res.json({ success: true, path: (result.result || result).path_display });
        })
        .catch(err => {
            console.error("Dropbox save error:", err);
            res.status(500).json({
                success: false,
                error: err.error?.error_summary || err.message
            });
        });
});



app.post("/subject-status", function (request, response) {
    subject_id = request.body.subject_id;
    status = request.body.status;
    subjects[subject_id] = status;
    saveDropboxSingleFile(JSON.stringify(subjects), `subject_status_${starttime}.json`)
    .then(() => console.log(`subject status recorded: ${subject_id},${status}`))
    .catch(err => console.log(err));
    //saveDropboxSingleFile(JSON.stringify(subjects), `subject_status_${starttime}.json`);
   // console.log(`subjuct status recorded: ${subject_id},${status}`);
});



app.listen(process.env.PORT, function() {
    console.log("listening to port")
});