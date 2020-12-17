function file_delete(id) {
	var c = document.getElementById(id).getAttribute("count"),
		selectAll = document.querySelectorAll('#upload_front tr:not(#toCopy) .uploadSort select');
	for (let i = 0; i < selectAll.length; i++) {
		selectAll[i].removeChild(selectAll[i].querySelector('[value="' + c + '"]'));
	}
	document.getElementById(id).remove();
}
function eventListenerAdd(el) {
	el.addEventListener('change', event => {
		const file = event.target.files[0];
		if (!file.type) {
			alert('Error: The File.type property does not appear to be supported on this browser.');
			return;
		}
		if (!file.type.match('image.*')) {
			alert('Error: The selected file does not appear to be an image.');
			return;
		}
		count++;
		var tr = event.target.closest("tr");
		tr.setAttribute("id", "tr_" + count);
		tr.setAttribute("count", count);
		tr.querySelector('.file-delete').setAttribute("onclick", "file_delete('tr_" + count + "');");
		tr.querySelector('.file-delete').style.display = "inline-block";			
		event.target.setAttribute("name", "image[" + count + "]");
		const reader = new FileReader();
		const img = tr.querySelector('img');
		reader.addEventListener('load', event => {
			img.src = event.target.result;
			img.style.display = "inline";										
		});
		reader.readAsDataURL(file);
		tr.querySelector('span.file-name').textContent = file.name;
		tr.querySelector('span.file-size').textContent = "(" + file.size + " байт)";	
		event.target.style.display = "none";
		tr.querySelector('.uploadSort select').setAttribute("name", "sort_order[" + count + "]");				
		var select = tr.querySelector('.uploadSort select'),
		opt = document.createElement('option');									
		opt.value = count;
		opt.innerHTML = count;
		opt.setAttribute("selected", "selected");
		select.innerHTML = '';
		select.append(opt);
		select.style.display = "inline";
		var trCopy = document.getElementById("toCopy").cloneNode(true);	
		trCopy.style.display = "table-row";
		document.getElementById("toBody").append(trCopy);
		eventListenerAdd(trCopy.querySelector('.uploadImage .input-image'));
		var selectAll = document.querySelectorAll('#upload_front tr:not(#toCopy) .uploadSort select'),
			selectAllValue = Array.from(selectAll).map(s => s.value);
		for (let i = 0; i < selectAll.length; i++) {
			for (let k = 0; k < selectAllValue.length; k++) {
				if(selectAll[i].value != selectAllValue[k] && !selectAll[i].querySelector('[value="' + selectAllValue[k] + '"]')) {
					var opt = document.createElement('option');
					opt.value = selectAllValue[k];
					opt.innerHTML = selectAllValue[k];
					selectAll[i].append(opt);
				}
			}
		}
	});
}
var count = 0;
if (window.FileList && window.File && window.FileReader) {
	eventListenerAdd(document.querySelector('#upload_front #tr_1 .input-image'));								
}
