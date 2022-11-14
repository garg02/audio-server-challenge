## Setup
```
npm install express multer get-audio-duration
```

### Run
```
node server.js
```

### List all audio files and duration metadata
```
GET http://localhost:8889/media
```

### Upload a File
```
POST http://localhost:8889/upload
```

### Download a File
```
GET http://localhost:8889/download/[filename]
```

### Delete a File
```
DELETE http://localhost:8889/remove/[filename]
```

### Filter by Query key-value pairs minduration and maxduration
```
GET http://localhost:8889/filter?
```
