$(function() {
    const apiKey = 'AIzaSyBuLq-_gvpC4zfYS8tSZytyjvHwqHYfSdI';
    const folderId = ['1NGDYGtIxD5z2eRpHhBgIAUqZTbp4JYOJ','1zeKtRexBUZJYWH85Ellvj8cIjVh90P8J'];
    const url = `https://www.googleapis.com/drive/v3/files?q="${folderId[0]}"+in+parents&fields=*&key=${apiKey}`;
    const url2 = `https://www.googleapis.com/drive/v3/files?q="${folderId[1]}"+in+parents&fields=*&key=${apiKey}`;

	$.when(
		$.getJSON(url),
		$.getJSON(url2)
	)
	.then( function(data1, data2) {
      const items1 = data1[0].files.filter(item => item.mimeType.indexOf('image') !== -1);
      const items2 = data2[0].files.filter(item => item.mimeType.indexOf('image') !== -1);
	  const items = items2.concat(items1);
      const loctArr = [];
      var i=0;
      items.forEach(item => {
		
        let descript = item.description ? item.description.split(' ') : '';
        let loc = descript.length === 1 ? descript[0] : descript[2];
        if (!loctArr.includes(loc) && loc!=undefined)
        loctArr.push(loc);
        $('.image_container').append(`<div class="images ${loc}"><img src="${item.thumbnailLink.split('=')[0]}" class="image"><div class="image-info"><span class="material-symbols-outlined download" data-image-src="${item.thumbnailLink.split('=')[0]}" data-image-name="${item.name}" >download</span><a class="material-symbols-outlined max-size" href="${item.thumbnailLink.split('=')[0]}" target="_blank">open_in_full</a><span class="material-symbols-outlined more_horiz" data-img-metadans="${i}">more_horiz</span></div></div>`);
		i+=1;
      });
      loctArr.forEach(loc => $('#location-filter').append(`<option value="${loc}">${loc}</option>`));
		$('.image').ready(function () {
			if (window.innerWidth > 600) {
				$('.image').on('click', function () {
					$('.big-image_container').html('');
					var imageSrc = $(this).attr('src');
					$('.big-image_container').show(500, function () {
						$('.big-image_container').css("display", "flex");
					})
					$('.big-image_container').append('<div class="big-background"> <span class="big-close material-symbols-outlined">close</span> <img src="' + imageSrc + '" class="big-image"></div>')
				})

				$('.big-image_container').on('click', function (e) {
					if (e.target === document.querySelector(".big-image_container")) {
						closeBig();
					}
					else if (e.target === document.querySelector(".big-close")) closeBig();
				});
				$(document).keydown(function (event) {
					if (event.keyCode === 27) { // 27 - код клавіші "Esc"
						closeBig();
					}
				});
				$('.big-close').on('click', function () {
					console.log(123);
					closeBig();
				});


				function closeBig() {
					$('.big-image_container').hide(500, function () {
						$('.big-image_container').html('');
					})
				}
			}
			$('.download').on('click', function () {
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

			$('.more_horiz').on('click', function () {
				$('.detail-image-info').html('');
				$('.detail-image-info').show(500, function () {
					$('.detail-image-info').css("display", "flex");
				})

				var metadans = $(this).data('img-metadans');
				console.log(metadans,'metadans');
				console.log(items[metadans].imageMediaMetadata);
				var descript;
				items[metadans].description ? descript = items[metadans].description.split(' ') : "";
				console.log(descript)
				if (items[metadans].imageMediaMetadata.location) console.log(true)
				else console.log(false);
				var camera
				if (items[metadans].imageMediaMetadata.cameraModel == "Canon EOS 1300D") {
					camera = '<img src="./assets/A034.png" class="detail-img"><div class="camera-info"><p class="camera-model">Камера: ' + items[metadans].imageMediaMetadata.cameraModel + '</p><p>Обʼєктив: ' + items[metadans].imageMediaMetadata.lens + '</p></div>'
				}
				else if (items[metadans].imageMediaMetadata.cameraModel == "Pixel 4 XL") {
					camera = '<img src="./assets/pixel4.jpeg" class="detail-img"><div class="camera-info"><p class="camera-model">Камера: ' + items[metadans].imageMediaMetadata.cameraModel + '</p></div>'
				}
				else if (items[metadans].imageMediaMetadata.cameraModel == "Pixel 6 Pro") {
					camera = '<img src="./assets/pixel6.png" class="detail-img"><div class="camera-info"><p class="camera-model">Камера: ' + items[metadans].imageMediaMetadata.cameraModel + '</p></div>'
				}
				else {
					camera = '<p>Невідомо</p>'
				}

				$('.detail-image-info').append('<div class="detail-info">' + camera + '</div>')
				items[metadans].imageMediaMetadata.location ? $('.camera-info').append('<p>Місце зйомки:</p><img src="https://maps.googleapis.com/maps/api/staticmap?center=' + items[metadans].imageMediaMetadata.location.latitude + ',' + items[metadans].imageMediaMetadata.location.longitude + '&zoom=12&size=300x300&markers=color:red%7C' + items[metadans].imageMediaMetadata.location.latitude + ',' + items[metadans].imageMediaMetadata.location.longitude + '&maptype=roadmap&key=AIzaSyCSb_Cp8WHrUORs07iAZy4S4DruUsFHPw0&map_id=4be591a3da52b40f" alt="" srcset="" class="map">') : items[metadans].description ? $('.camera-info').append('<p>Місце зйомки:</p><img src="https://maps.googleapis.com/maps/api/staticmap?center=' + descript[0] + ',' + descript[1] + '&zoom=12&size=300x300&markers=color:red%7C' + descript[0] + ',' + descript[1] + '&maptype=roadmap&key=AIzaSyCSb_Cp8WHrUORs07iAZy4S4DruUsFHPw0&map_id=4be591a3da52b40f" alt="" srcset="" class="map">') : "";
				//AIzaSyCSb_Cp8WHrUORs07iAZy4S4DruUsFHPw0

			});

			$('.detail-image-info').on('click', function () {
				closeDet();
			});
			$(document).keydown(function (event) {
				if (event.keyCode === 27) { // 27 - код клавіші "Esc"
					closeDet();
				}
			});


			function closeDet() {
				$('.detail-image-info').hide(500, function () {
					$('.detail-image-info').html('');
				})
			}


			document.querySelector("#location-filter").addEventListener('change', (event) => {
				const selectedValue = event.target.value;
				if (selectedValue == "all") {
					console.log('ALL')
					for (var i = 0; i < loctArr.length; i++) {
						$('.' + loctArr[i] + '').show()
					}
					$('.undefined').show()
				} else if (loctArr.includes(selectedValue)) {
					console.log(selectedValue)
					for (var i = 0; i < loctArr.length; i++) {
						$('.' + loctArr[i] + '').hide()
					}
					$('.undefined').hide()
					$('.' + selectedValue + '').show()
				}
			});
		});
	});
	$('.big-wrap').hide();
	$('.small-wrap').on('click', function () {
		$('.image').css('max-height', '35vh', 500);
		$('.small-wrap').hide(500);
		$('.big-wrap').show(500);
	})
	$('.big-wrap').on('click', function () {
		$('.image').css('max-height', '60vh', 500)
		$('.big-wrap').hide(500);
		$('.small-wrap').show(500);
	})
	$('.light_mode').hide();
	$('.light_mode').on('click', function () {
		$('body').css('background-color', 'var(--light_mode)').fadeIn(500);
		$('header').css('color', 'var(--dark_mode)').fadeIn(500);

		// $('body').css('background-color', 'var(--light_mode)',500);
		// $('header').css('color','var(--dark_mode)',500);
        $('.small-wrap').css('color', 'black');
		$('.detail-image-info').css('--backround_mode', 'rgb(231, 231, 231)');
		$('.detail-image-info').css('--backround_mode_color', '#1f1f1f');
		$('.dark_mode').show(500);
		$('.light_mode').hide(500);
	})
	$('.dark_mode').on('click', function () {

		$('body').css('background-color', 'var(--dark_mode)').fadeIn(500);
		$('header').css('color', 'var(--light_mode)').fadeIn(500);

		// $('body').css('background-color', 'var(--dark_mode)',500);
		// $('header').css('color','var(--light_mode)',500);
        $('.small-wrap').css('color', 'white');
		$('.detail-image-info').css('--backround_mode', '#1f1f1f');
		$('.detail-image-info').css('--backround_mode_color', 'rgb(231, 231, 231)');
		$('.light_mode').show(500);
		$('.dark_mode').hide(500);
	})
});