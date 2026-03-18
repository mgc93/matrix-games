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
    clientId: process.env.DROPBOX_APP_KEY,
    clientSecret: process.env.DROPBOX_APP_SECRET,
    refreshToken: process.env.DROPBOX_REFRESH_TOKEN,
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
  

async function saveDropbox(content, filename, foldername) {
    const uploadArgs = {
        path: `/${foldername}/${filename}`,
        contents: content,
        mode: { ".tag": "overwrite" }
    };

    try {
        // 1st attempt: upload directly
        return await dbx.filesUpload(uploadArgs);
    } catch (err) {
        // If the only failure was "folder not found", create it then retry
        if (
            err.error?.error?.[".tag"] === "path" &&
            err.error.error.path[".tag"] === "not_found"
        ) {
            // create the folder
            await dbx.filesCreateFolderV2({ path: `/${foldername}` });
            // then upload again
            return await dbx.filesUpload(uploadArgs);
        }
        // for any other error, rethrow so your route's .catch will handle it
        throw err;
    }
}

  
// function saveDropbox(content, filename, foldername) {
//     return dbx.filesGetMetadata({ path: `/${foldername}` })
//         .catch(err => {
//             // if the folder truly isn’t there, create it
//             if (
//                 err.error?.error?.['.tag'] === 'path' &&
//                 err.error.error.path['.tag'] === 'not_found'
//             ) {
//                 return dbx.filesCreateFolder({ 
//                     path: `/${foldername}`, 
//                     autorename: false 
//                 });
//             }
//             // otherwise re-throw for the outer catch to handle
//             throw err;
//         })
//         .then(() =>
//             dbx.filesUpload({
//                 path: `/${foldername}/${filename}`,
//                 contents: content,
//                 mode: { '.tag': 'overwrite' }
//             })
//         );
// }


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


app.post("/data", (req, res) => {
    req.setTimeout(0);

    const payload = JSON.stringify(req.body);
    const id = req.body[0].subject.replace(/'/g, "");
    const filename = `${Date.now()}.json`;
    const foldername = id;

    saveDropbox(payload, filename, foldername)
        .then(dropboxRes => {
            // Dropbox SDK v4/5 returns metadata directly; v10+ wraps it in `.result`
            const meta = dropboxRes.result || dropboxRes;

            // send 200 OK with the Dropbox path
            res.json({
                success: true,
                path: meta.path_display
            });
        })
        .catch(err => {
            console.error("Dropbox save error:", err);
            // send 500 with the real error summary
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