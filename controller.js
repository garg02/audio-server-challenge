const util = require("util");
const wav = require("./middleware");
const fs = require("fs");
const { getAudioDurationInSeconds } = require('get-audio-duration')
const fpath = "http://localhost:8889/media/";


const wavUpload = async (req, res) => {
    let audioPath;
    try {
        await wav(req, res);
        if (req.file == undefined) {
            return res.status(400).send({ message: "No file was selected. Try again!" });
        }

        audioPath = directory + "/media/" + req.file.originalname;
        let duration = await getAudioDurationInSeconds(audioPath).then((duration) => {
            console.log(`duration ${duration}`)
            return duration;
        })
        console.log('Audio file is ' + duration + ' seconds long');
        metaMap.set(req.file.originalname, duration);
        console.log(`metaMap: ${metaMap.size}`);

        res.status(200).send({
            message: `Successfully uploaded audio file ${req.file.originalname}`
        });

    } catch (err) {
        console.log(err);

        if (err.code == "LIMIT_FILE_SIZE") {
            return res.status(400).send({
                message: `Audio file  ${req.file.originalname} is larger than 3MB!`,
            });
        }

        if (err.message == "Only wav files are allowed") {
            return res.status(400).send({
                message: err.message,
            });
        }

        // delete file if ffmpeg does not recognize file
        if (err.exitCode == 1) {
            fs.unlink(audioPath, (err) => {
                if (err) throw err;
                console.log(`${audioPath} was deleted`);
            });
            return res.status(400).send({
                message: `${err.message}. File was not uploaded.`,
            });
        }

        res.status(500).send({
            message: `Error ${err} occured while trying to upload audio file ${req.file.originalname}.`,
        });
    }
};

const wavList = (req, res) => {
    const mediaPath = directory + "/media/";
    filepaths = fs.readdirSync(mediaPath, function (err) {
        if (err) {
            res.status(500).send({
                message: "Cannot read media directory!",
            });
        }
    });

    let fileInfos = [];
    filepaths.forEach((file) => {
        let dur = 0;
        if (metaMap.has(file)){
            dur = metaMap.get(file)
        }
        fileInfos.push({
            name: file, url: fpath + file, duration: dur
        });
    });
    res.status(200).send(fileInfos);
};

const wavFilter = (req, res) => {
    let minduration = 0;
    let maxduration = Number.MAX_VALUE;

    if (req.query.minduration) {
        minduration = req.query.minduration;
    }
    if (req.query.maxduration) {
        maxduration = req.query.maxduration;
    }
    const mediaPath = directory + "/media/";

    filepaths = fs.readdirSync(mediaPath, function (err) {
        if (err) {
            res.status(500).send({
                message: "Cannot read media directory!",
            });
        }
    });

    let fileInfos = [];
    filepaths.forEach((file) => {
        let dur = 0;
        if (metaMap.has(file)){
            dur = metaMap.get(file)
        }
        if ((minduration <= dur) && (dur <= maxduration)){
            fileInfos.push({
                name: file, url: fpath + file, duration: dur
            });
        }
    });
    res.status(200).send(fileInfos);
};

const wavDownload = (req, res) => {
    const audioFile = req.params.name;
    const mediaPath = directory + "/media/";

    res.download(mediaPath + audioFile, audioFile, (err) => {
        if (err) {
            res.status(500).send({
                message: `Err ${err} occured while downloading audio file  ${req.file.originalname}!`,
            });
        }
    });
};

const wavDelete = (req, res) => {
    const audioFile = req.params.name;
    const mediaPath = directory + "/media/";
    metaMap.delete(audioFile)
    console.log(`metaMap: ${metaMap.size}`);
    fs.unlink(mediaPath + audioFile, (err) => {
        if (err) {
            res.status(500).send({
                message: `Err ${err} occured while deleting audio file!`,
            });
        }

        res.status(200).send({
            message: `Audio file succesfully deleted!`,
        });
    });
};

module.exports = {
    wavUpload,
    wavList,
    wavFilter,
    wavDownload,
    wavDelete,
};
