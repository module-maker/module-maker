var githubRepo = require('./repo.js');

// root is the github repo prefix, like "creationix/conquest"
// user is an object containing { name, email }
// files is an object with keys being filepaths (no leading slash) and values
// being text contents.  Folders are represented as nested objects.

// This function will create a tree/blob structure for the files, create a commit
// and update master to point to the new commit.
module.exports = function (module, callback) {
  console.log("module", module);
  var meta = module.metaData;
  //console.log(meta);
  var accessToken = localStorage.getItem("token");
  var root = meta.githubFragment;
  var user = { name: meta.githubUserName, email: meta.githubEmail };
  var files = meta.gitRepoFiles;
  var message = "Initial Commit Created by npm-the-wizard!";
  var description = meta.description;

  var name = root.substr(root.lastIndexOf("/") + 1);
  var repo = githubRepo(root, accessToken);

  return repo.apiPost("/user/repos", {
    name: name,
    description: description,
    auto_init: true
  }, function (err, result) {
    if (err) return callback(err);
    console.log("RESULT", result);
    return saveTree(files, onTree);
  });

  function onTree(err, treeHash) {
    if (err) return callback(err);
    console.log("tree hash", treeHash);
    return repo.saveAs("commit", {
      tree: treeHash,
      author: user,
      message: message
    }, onCommit);
  }

  function onCommit(err, commitHash) {
    console.log("onCommit", arguments);
    if (err) return callback(err);
    console.log("commit hash", commitHash);
    console.log("Updating HEAD to point to new commit");
    return repo.writeRef("refs/heads/master", commitHash, function (err) {
      if (err) return callback(err);
      callback(null, commitHash);
    });
  }

  function saveTree(files, callback) {
    var done = false;
    var names = Object.keys(files);
    var left = names.length;
    var entries = new Array(left);
    names.forEach(function (name, i) {
      var entry = entries[i] = { name: name };
      var value = files[name];
      if (typeof value === "string") {
        entry.mode = 0100644;
        repo.saveAs("blob", value, onSave);
      }
      else {
        entry.mode = 040000;
        saveTree(value, onSave);
      }

      function onSave(err, hash) {
        if (err) {
          if (done) return;
          done = true;
          return callback(err);
        }
        entry.hash = hash;
        if (--left) return;
        return repo.saveAs("tree", entries, callback);
      }
    });
  }
};
