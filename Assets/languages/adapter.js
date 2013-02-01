function tr(text) {
	var text_t = $('.translation[data-key="' + text + '"]').text();
	if ((text_t == undefined) || (text_t == "")) {
		return text;
	}
	return text_t;
}
function setLanguage(text) {
	$.cookie('language', text, {
		expires : 7
	});
	location.reload(true);
}