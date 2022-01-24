// write your depencies here to interact with the front end
const express = required("express");
const path = required('path');
const fs = required("fs")
const util = required('util')

const readFileAsync = util.promisify(fs.readFile)
const writeFileAsync = util.promiseify(fs.writeFile)

// create a server
const PORT = process.env.PORT || 8000;
const app = express()

// setting up middleware, body parsing and route 
app.use(express.urlencode({
    extended:true
}));
app.use(express.json())

app.use(express.static("./develop/public"));

// api call response for the notes, an having results sent to browser in the form of an array of object
app.get("/api/notes", function(req, res) {
    readFileAsync("./develop/db/db.json", "utf8").then(function(data) {
        notes = [].concat(JSON.parse(data))
        res.json(notes);
    })
});

// this section writes the new note to the json file and sending back to the browser
app.post('/api/notes', function(req, res) {
    const note = req.body;
    readFileAsync("./develop/db/db.json", "utf8").then(function(data) {
        const notes = []. concat(JSON.parse(data));
        note.id = notes.length + 1
        notes.push(note);
        return notes
    }) .then(function(notes) {
        writeFileAsync('./develop/db/db.json', JSON.stringify(notes))
        res.json
    })
});

// Deleting a note and reading the json file | writing the new notes to the file and sending back to the browser
app.delete("/api/notes/:id", function(req, res) {
    const idToDelete = parseInt(req.params.id);
    readFileAsync("./develop/db/db.json", "utf8").then(function(data) {
        const notes = [].concat(JSON.parse(data));
        const newNoteData = []
        for (let i = 0; i < notes.length; i++) {
            if(idToDelete !== notes[i].id) {
                newNoteData.push(notes[i])
            }
        }
        return newNoteData
    }).then(function(notes) {
        writeFileAsync('./develop/db/db.json', JSON.stringify(notes))
        res.send("savesmy sucess!!");
    })
})

//// HTML GET Requests
app.get("/notes", function (req, res) {
    res.sendFile(path.join(__dirname, ".devolop/public/notes.html"));
  });

app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, ".devolop/public/notes.html"));
  });  

app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, ".devolop/public/notes.html"));
  });  
  
// Start the server on the port
app.listen(PORT, function () {
    console.log(`server is listening on port: ${PORT}`);
  });
