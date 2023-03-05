
  var GoogleAuth;
  var SCOPE = 'https://www.googleapis.com/auth/drive.metadata.readonly';
  function handleClientLoad() {
    // Load the API's client and auth2 modules.
    // Call the initClient function after the modules load.
    gapi.load('client:auth2', initClient);
  }

  function initClient() {
    // In practice, your app can retrieve one or more discovery documents.
    var discoveryUrl = 'https://www.googleapis.com/discovery/v1/apis/drive/v3/rest';

    // Initialize the gapi.client object, which app uses to make API requests.
    // Get API key and client ID from API Console.
    // 'scope' field specifies space-delimited list of access scopes.
    gapi.client.init({
        'apiKey': 'AIzaSyBuLq-_gvpC4zfYS8tSZytyjvHwqHYfSdI',
        'clientId': '140996188319-gf4fe797cnc2513iehvf4cqf729mqm0c.apps.googleusercontent.com',
        'discoveryDocs': [discoveryUrl],
        'scope': SCOPE
    }).then(function () {
      GoogleAuth = gapi.auth2.getAuthInstance();

      // Listen for sign-in state changes.
      GoogleAuth.isSignedIn.listen(updateSigninStatus);

      // Handle initial sign-in state. (Determine if user is already signed in.)
      var user = GoogleAuth.currentUser.get();
      setSigninStatus();

      // Call handleAuthClick function when user clicks on
      //      "Sign In/Authorize" button.
      $('#sign-in-or-out-button').click(function() {
        handleAuthClick();
      });
      $('#revoke-access-button').click(function() {
        revokeAccess();
      });
    });
  }

  function handleAuthClick() {
    if (GoogleAuth.isSignedIn.get()) {
      // User is authorized and has clicked "Sign out" button.
      GoogleAuth.signOut();
    } else {
      // User is not signed in. Start Google auth flow.
      GoogleAuth.signIn();
    }
  }

  function revokeAccess() {
    GoogleAuth.disconnect();
  }

  function setSigninStatus() {
    var user = GoogleAuth.currentUser.get();
    var isAuthorized = user.hasGrantedScopes(SCOPE);
    if (isAuthorized) {
      $('#sign-in-or-out-button').html('Sign out');
      $('#revoke-access-button').css('display', 'inline-block');
      $('#auth-status').html('You are currently signed in and have granted ' +
          'access to this app.');
    } else {
      $('#sign-in-or-out-button').html('Sign In/Authorize');
      $('#revoke-access-button').css('display', 'none');
      $('#auth-status').html('You have not authorized this app or you are ' +
          'signed out.');
    }
  }

  function updateSigninStatus() {
    setSigninStatus();
  }





$(document).ready(function() {
  var apiKey = 'AIzaSyBuLq-_gvpC4zfYS8tSZytyjvHwqHYfSdI';
  var folderId = '1NGDYGtIxD5z2eRpHhBgIAUqZTbp4JYOJ';
  var url = 'https://www.googleapis.com/drive/v3/files?q=' +
            '"' + folderId + '"+in+parents&fields=*' +
            '&key=' + apiKey;
  $.getJSON(url, function(data) {
      var items = data.files;
      for (var i = 0; i < items.length; i++) {
          var item = items[i];
          if (item.mimeType.indexOf('image') !== -1) {
              $('body').append('<img src="' + item.thumbnailLink + '">');
          }
      }
  });
});


$('input[type="file"]').on('change', function(event) {
  var file = event.target.files[0];
  var folderId = '1NGDYGtIxD5z2eRpHhBgIAUqZTbp4JYOJ';
  var accessToken = 'AIzaSyBuLq-_gvpC4zfYS8tSZytyjvHwqHYfSdI';

  var metadata = {
      name: file.name,
      parents: [folderId]
  };

  var formData = new FormData();
  formData.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
  formData.append('file', file);

  $.ajax({
      url: 'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart',
      type: 'POST',
      headers: {
          'Authorization': 'Bearer ' + accessToken
      },
      data: formData,
      processData: false,
      contentType: false
  }).done(function(response) {
      console.log('File uploaded:', response);
  }).fail(function(error) {
      console.error(error);
  });
});

