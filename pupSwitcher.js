var fs = require('fs')
var Regex = require('regex')

module.exports = {
  getNextPupper : function getNextPupper(currentFileName, cb) {
    var error = null
    var ret = getNextOldestFile(currentFileName, "./client/public/uploads/", /^queued-pupper.*/)
    if(ret == null) { error = "No pupper file could be found."}
    cb(error, ret)
  },
  deleteLastPupper : function deleteLastPupper(filename){

  }
}

function getNextOldestFile(currentFileName, dir, regexPattern) {
    //grab and sort files by date
    var files = fs.readdirSync(dir)
      .map(function(v) {
        return { name:v,
          time:fs.statSync(dir + v).mtime.getTime()
        };
      })
      .sort(function(a, b) { return a.time - b.time; })
      .map(function(v) { return v.name; });

    //check that there are any files at all...
    var numFiles = files.length;
    if(numFiles <= 0) {
      return null;
    }


    var nextFileName;
    //if there was no current file or the current file isn't in the list,
    //then just return the first one
    if(currentFileName == null || files.indexOf(currentFileName) == -1) {
      nextFileName = files[0];
    } else if(numFiles > 1) {
      //otherwise, if there are more files then  go through the list until
      //we find the current file, then return the next one (if it exists)
      for (i = 0; i < numFiles; i++) {
        if (regexPattern.test(files[i]) == true) {

          if(files[i] == currentFileName) {
            if(i+1 < numFiles){
              nextFileName = files[i+1];
            }
            break;
          }
        }
      }
    }

    if(nextFileName != null) {
      return dir + nextFileName;
    }
    else {
      return null;
    }
}
