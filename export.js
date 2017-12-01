'use strict';

var fs = require('fs');
var rp = require('request-promise');
var https = require('https');
var token = process.env.token;

if (!token) {
  console.error('Error: Set your slack test token');
  process.exit(1);
}

var usersListUrl = 'https://slack.com/api/users.list?token=' + token;
var channelsListUrl = 'https://slack.com/api/channels.list?token=' + token;
var teamInfoUrl = 'https://slack.com/api/team.info?token=' + token;

function saveAsFile(data, dest) {
  return new Promise((resolve, reject) => {
    fs.writeFile(dest, data, (err) => {
      if (err) {
        reject(err);
      } else {
        console.log('Saved: ' + dest);
        resolve();
      }
    });
  });
}

function download(url, dest) {
  return new Promise((resolve, reject) => {
    var file = fs.createWriteStream(dest);
    https.get(url, (response) => {
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        console.log('Saved: ' + dest);
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(dest);
      reject(err);
    });
  });
}

var requests = [rp(usersListUrl), rp(channelsListUrl), rp(teamInfoUrl)];
Promise.all(requests).then((values) => {
  var usersList = JSON.parse(values[0]);
  var channelsList = JSON.parse(values[1]);
  var teamInfo = JSON.parse(values[2]);
  if ( usersList.ok && channelsList.ok && teamInfo.ok ) {
    var tasks = [
      saveAsFile(values[0], 'src/userslist.json'),
      saveAsFile(values[1], 'src/channelslist.json'),
      saveAsFile(values[2], 'src/teaminfo.json'),
      download(teamInfo.team.icon.image_34, 'public/favicon.ico')
    ];
    return Promise.all(tasks);
  } else {
    return Promise.reject('Error: Slack API request failed. Check your slack test token.');
  }
}).then(() => {
  console.log('Exported successfully!');
}).catch((err) => {
  console.error(err);
  process.exit(1);
});
