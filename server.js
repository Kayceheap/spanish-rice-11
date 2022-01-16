const express = require("express");
const path = require("path");
const fs = require("fs");

const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.static("public"));

app.use(express.urlencoded({ extended: true }));

app.use(express.json());

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './public/notes.html'));
});

app.get('/api/notes', (req, res) => {
    var rawData = fs.readFileSync('./db/db.json');
    var notes = JSON.parse(rawData);
    res.json(notes);
});

app.post('/api/notes', (req, res) => {
    var rawData = fs.readFileSync('./db/db.json');
    var notes = JSON.parse(rawData);

    var noteIds = notes.map(note => parseInt(note.id));

    const maxId = Math.max(...noteIds);
    console.log(maxId);

    if (maxId >= 0) {
        req.body.id = maxId + 1;
    } else {
        req.body.id = 0;
    }
    notes.push(req.body);
    fs.writeFileSync("./db/db.json", JSON.stringify(notes));

    res.json(req.body);
});

app.delete("/api/notes/:id",(req, res) => {
    var rawData = fs.readFileSync('./db/db.json');
    var notes = JSON.parse(rawData);

    const indexToDelete = notes.findIndex(note => {
        return note.id == req.params.id;
    });
    if (indexToDelete >= 0) {
        notes.splice(indexToDelete, 1);
        fs.writeFileSync("./db/db.json", JSON.stringify(notes));
    }
    res.json(notes);
});

app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
})