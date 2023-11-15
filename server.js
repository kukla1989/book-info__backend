const express = require('express');
const path = require("path");
const fs = require("fs");
const fsP = require("fs").promises

const app = express();
const PORT = 3000;

app.use(express.json())

app.get('/comments', async (req, res) => {
  const comments = await getComments()
  res.send(comments);
});

app.post('/comments', (req, res) => {
  const { author, comment } = req.body;

  if (!author || !comment) {
    return res.status(400).json({ error: 'Author and comment are required.' });
  }

  addComment(author, comment);

  res.status(201).json({ author, comment });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

function addComment(author, comment) {
  const commentsFilePath = path.join(__dirname, 'comments.json');

  fs.readFile(commentsFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading file:', err);
      return;
    }

    try {
      const existingComments = JSON.parse(data);
      const newComment = {
        author,
        comment
      };

      existingComments.push(newComment);
      const updatedCommentsJSON = JSON.stringify(existingComments, null, 2);

      fs.writeFile(commentsFilePath, updatedCommentsJSON, 'utf8', (err) => {
        if (err) {
          console.error('Error writing file:', err);
        }
      });
    } catch (parseError) {
      console.error('Error parsing JSON:', parseError);
    }
  });
}

async function  getComments() {
  let comments;

  const commentsFilePath = path.join(__dirname, 'comments.json');

  try {
    const data = await fsP.readFile(commentsFilePath, 'utf8')
    comments = data;
  } catch (err) {
    console.error('Error reading file:', err);
    return;
  }

  return comments;
}

