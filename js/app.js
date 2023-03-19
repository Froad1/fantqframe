
$(document).ready(function() {
  var apiKey = 'AIzaSyBuLq-_gvpC4zfYS8tSZytyjvHwqHYfSdI';
  var folderId = '1NGDYGtIxD5z2eRpHhBgIAUqZTbp4JYOJ';
  var url = 'https://www.googleapis.com/drive/v3/files?q=' +
            '"' + folderId + '"+in+parents&fields=*' +
            '&key=' + apiKey;
  $.getJSON(url, function(data) {
      var items = data.files;
	  console.log(items);
      for (var i = 0; i < items.length; i++) {
          var item = items[i];
          if (item.mimeType.indexOf('image') !== -1) {
			$('.image_container').append('<div class="images"><img src="' + item.thumbnailLink.split('=')[0] + '" class="image"><div class="image-info"><span class="material-symbols-outlined download" data-image-src="' + item.thumbnailLink.split('=')[0] + '" data-image-name="' + item.name + '" >download</span><a class="material-symbols-outlined max-size" href="' + item.thumbnailLink.split('=')[0] + '" target="_blank">open_in_full</a><span class="material-symbols-outlined more_horiz" data-img-metadans="' + i + '">more_horiz</span></div></div>')
			}
		}
		$('.image').ready(function(){
			if(window.innerWidth>600){
			$('.image').on('click', function(){
				$('.big-image_container').html('');
				var imageSrc = $(this).attr('src');
				$('.big-image_container').show(500, function(){
					$('.big-image_container').css("display", "flex");
				})
				$('.big-image_container').append('<div class="big-background"> <img src="'+ imageSrc +'" class="big-image"> <span class="material-symbols-outlined big-close">close</span></div>')
			})

			$('.big-image_container').on('click', function(e){
				if(e.target === document.querySelector(".big-image_container")){
					closeBig();
				}
			});
			$(document).keydown(function(event) {
				if (event.keyCode === 27) { // 27 - код клавіші "Esc"
				  closeBig();
				}
			  });
			$('.big-close').on('click', function(){
				closeBig();
			});


			function closeBig(){
				$('.big-image_container').hide(500, function(){
					$('.big-image_container').html('');
				})
			}}
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

			$('.more_horiz').on('click',function(){
				$('.detail-image-info').html('');
				$('.detail-image-info').show(500, function(){
					$('.detail-image-info').css("display", "flex");
				})

				var metadans = $(this).data('img-metadans');
				console.log(items[metadans].imageMediaMetadata);
				var camera 
				if(items[metadans].imageMediaMetadata.cameraModel == "Canon EOS 1300D"){
					camera = '<img src="./assets/A034.png" class="detail-img"><div class="camera-info"><p class="camera-model">Камера: '+ items[metadans].imageMediaMetadata.cameraModel +'</p><p>Обʼєктив: '+ items[metadans].imageMediaMetadata.lens +'</p></div>'
				}
				else if(items[metadans].imageMediaMetadata.cameraModel == "Pixel 4 XL"){
					camera = '<img src="./assets/pixel4.jpeg" class="detail-img"><div class="camera-info"><p class="camera-model">Камера: '+ items[metadans].imageMediaMetadata.cameraModel +'</p></div>'
				}
				else{
					camera = '<p>Невідомо</p>'
				} 

				$('.detail-image-info').append('<div class="detail-info">' +camera+'</div>')
				items[metadans].imageMediaMetadata.location.latitude ? $('.camera-info').append('<p>Місце зйомки:</p><img src="https://maps.googleapis.com/maps/api/staticmap?center='+ items[metadans].imageMediaMetadata.location.latitude +',' + items[metadans].imageMediaMetadata.location.longitude +'&zoom=12&size=300x300&markers=color:red%7C48.14255555555555,17.10073888888889&maptype=roadmap&key=AIzaSyCSb_Cp8WHrUORs07iAZy4S4DruUsFHPw0&map_id=4be591a3da52b40f" alt="" srcset="" class="map">') :"";
					//AIzaSyCSb_Cp8WHrUORs07iAZy4S4DruUsFHPw0
				
			});

			$('.detail-image-info').on('click', function(){
				closeDet();
			});
			$(document).keydown(function(event) {
				if (event.keyCode === 27) { // 27 - код клавіші "Esc"
				  closeDet();
				}
			  });
			$('.big-close').on('click', function(){
				closeDet();
			});


			function closeDet(){
				$('.detail-image-info').hide(500, function(){
					$('.detail-image-info').html('');
				})
			}
		});
	});
	$('.small-wrap').on('click',function(){
		$('.image').css('max-height', '35vh')
	})
	$('.big-wrap').on('click',function(){
		$('.image').css('max-height', '60vh')
	})
});




