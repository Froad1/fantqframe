
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
			$('.image_container').append('<div class="images"><img src="' + item.thumbnailLink.split('=')[0] + '" class="image"><div class="image-info"><span class="material-symbols-outlined download" data-image-src="' + item.thumbnailLink.split('=')[0] + '" data-image-name="' + item.name + '" >download</span><a class="material-symbols-outlined max-size" href="' + item.thumbnailLink.split('=')[0] + '" target="_blank">open_in_full</a></div></div>')
			}
		}
		$('.image').ready(function(){
			$('.download').on('click', function() {
				var imageSrc = $(this).data('image-src');
				var filename = $(this).data('image-name');
				
				downloadImage(imageSrc, filename)
				function downloadImage(url, filename) {
					fetch(url)
					  .then(response => response.blob())
					  .then(blob => {
						const url = window.URL.createObjectURL(blob);
						const a = document.createElement('a');
						a.href = url;
						a.download = filename;
						document.body.appendChild(a);
						a.click();
						a.remove();
						window.URL.revokeObjectURL(url);
					  })
					  .catch(error => {
						console.error(`Error downloading image: ${error}`);
					  });
				  }
				  
			});
		})
	});
});

