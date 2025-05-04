/// load modules 
var express = require("express");
// instanitate the app
var app = express();

const subjects = {};
const starttime = Date.now();


//const BoxSDK = require("box-node-sdk");
//const fs = require('fs');
const Dropbox = require("dropbox").Dropbox;
const fetch = require("node-fetch");
const body_parser = require("body-parser");
//require("dotenv").config();

//var config = require('./config.json');


//var sdk = BoxSDK.getPreconfiguredInstance(config);
//var client = sdk.getAppAuthClient('enterprise');


// var sdk = new BoxSDK( {
//     clientID: '6y1owyz4gjq33hvjhknvl3ny6x6y685j',
//     clientSecret: 'FBbc8CMZKoj2wwcnw321txdZw3mSBc3V'
// });

// Create a basic API client, which does not automatically refresh the access token
//var client = sdk.getBasicClient('JKfo9lWcymRSQVTVZcjm97eAybxHzvNr');

//var folderID = '0';



// var saveBox = function(content, filename) {
//     client.files.uploadFile( folderID, filename,content)

// };

const dbx = new Dropbox({
    accessToken: 'sl.u.AFtnpJV1S6bgdc-bMwCZ9x7-bE-DGX_k55wmTTWK8xansy0ZAZIdJt6stZGOeLgPtn9QB7KYG8liXJtN0viQSFCDq6yMfRadIzFBA81h_1kCh79Rx6drVPR0gnpRVRTrkzE-9pSAwfhKBxFkXqOoyPRs8lgFtlOAdKZzN5bdHmaXwRuhAGHsCb1N-CePMA0D2BQJysV7LUiz-PnelFuoVIbCz801rUtlcTPyNCeMNvkHb-HFJ1J3aY7Oro9wE2Xt8fM46-VPG7OWXFYf6HYM98mnryaMk38tDkXW7S13ooBxCM5blAoVrpDpJsiKooMAE_aOufSJ5t6iNdxu-A5aghzYIu-I97pWA5JRp40ph8DB1GfOBKjtSTzq1kC46_D58LrmKo5XjIGBk9lrfCTxO-VSYxpiTrJod9dl1SldrBEnQ9Ls5Ft_i7Snv9LU_nhdkWim0h1v_2VqWt50f_cOIPLw7kiB92usmBUZ0W3ymNI8PVa2BnZXfgBwXSloNb5KxroOo6T9nTDNrwvhx5T09aebg6X0bz8RV8pnfTZNm48KET1QQt9ebZAkHVwF7DEArQenlI5lEQtegLN9qoOdzJjhaAiaiXXIhy_iifPb-3ph-mc-B5j8ps-uNBKJyPggYdhO0CotbNGQYWfrcfa3ZI68Q-zxVJUe6RlaRLHymBXo2V4_IwFggPnjd5CmYHrUg6SXQ7l4mdTey4JWwg8tOHtH1IAZssAwy4jZjthSGe-CdQwWQZUzqJVV2YX6wysVCILm8X5T1SeTqu18A3p4TOUhMA981LxQMncS4z6MorrvzzDrqyeNS_gaovYa-HArWjsr5lQ8FQNXVNXMSWzhy2aY4HhPjtDVrgQSEC-fX2zfoNrEqFkOXcuhoARnRVHMeogSWgBe1qrAS9ZgNS4rVxEAauai7LWXTndoSL2KKncWVzUepm6oOO4oNFbIIl15pV_Wf1alMynJTdt2oul4JAz7to2tPagyNJRkdTliEQg8INpodWlITTwu35LpSYd182b4asUAwMfEvmRxvfagBSfVOIkw_l8eYPws8pYK_OTtgbmG24MgkEZ6XBGKkTt9QU0539_7y2aKFbp2g4zcR1nmbYoY8KOap_iiagGyco-yzAKiptGySx8HAToSM-AQniNJaM8LOWuQ2Uo5fLDzKjXowbKu7LcrITbigNT-AXKRLc65k9IBj6EZfCeG4y9iEdLIYlW0aoqWFOe-w3fPbKR61E-HoFMDQovxUjJ9VxcRtG6AzFS7PPCn70Z4XuvbrsU',
    fetch
});


saveDropbox = function (content, filename, foldername) {
    return dbx.filesGetMetadata({
        path: "/" + foldername,
    }).catch(err => {
        // //      console.log(err['error']['path'])
        // if (err.error.error.path['.tag'] == 'not_found') {
        //     return dbx.filesCreateFolder({
        //         path: "/" + foldername,
        //         autorename: false,
        //     });
        // } else {
        //     throw err;
        // }
    }).then(() => {
        return dbx.filesUpload({
            path: "/" + foldername + "/" + filename,
            contents: content
        });
    });
};


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
app.post("/data", function (request, response) {
    //convert json to csv
    request.setTimeout(0);
    // DATA_CSV = json2csv(request.body);
    data = request.body;
    id = data[0].subject;
    // id = row[1].split(",")[Id_index];
    id = id.replace(/'/g, "");
    var currentdate = new Date();
    filename = Number(currentdate) + ".json";
    foldername = id;
    data = JSON.stringify(data);
    saveDropbox(data, filename, foldername).catch(err => console.log(err))
}
);

app.post("/subject-status", function (request, response) {
    subject_id = request.body.subject_id;
    status = request.body.status;
    subjects[subject_id] = status;
    saveDropboxSingleFile(JSON.stringify(subjects), `subject_status_${starttime}.json`)
    .then(() => console.log(`subjuct status recorded: ${subject_id},${status}`))
    .catch(err => console.log(err));
    //saveDropboxSingleFile(JSON.stringify(subjects), `subject_status_${starttime}.json`);
   // console.log(`subjuct status recorded: ${subject_id},${status}`);
});


// //start the server
// app.listen(app.get('port'), function () {
//     console.log("listening to port");
// });

app.listen(process.env.PORT, function() {
    console.log("listening to port")
});