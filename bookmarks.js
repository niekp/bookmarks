var bookmarks = [];

$(document).ready(function() {
	getBookmarks();

	keep_focus();
});

function keep_focus() {
	$("#search").focus();
}

function getBookmarks() {
	$.get("bookmarks.html", function (data) {
		parseBookmarks(data);
	}).fail(function () {
		$("#container").html("Error loading bookmarks");
	})
}

function parseBookmarks(bookmarks_html) {
	var bookmarks_raw = $(bookmarks_html).find("DL").find("dt").find("a");
	$.each(bookmarks_raw, function (key, value) {
		var a = $(value);

		var link = a[0].href;
		var text = a[0].innerHTML;
		var tags = a[0].getAttribute("TAGS");
		var comment = a.parent().find("DD").html();

		if (tags == null)
			tags = "";
		tags = tags.replace(/,/g, ', ');

		bookmarks.push({ link: link, text: text, tags: tags});
	});
	bookmarks.sort(compareBookmark);

	searchBookmark('');
}

function compareBookmark(a,b) {
	if (a.text < b.text)
		return -1;
	if (a.text > b.text)
		return 1;
	return 0;
}

var top_url = '';
function searchBookmark(search, e) {
	if (e != undefined) {
		if (e.keyCode == 13 && top_url != '') {
			window.open(top_url, '_blank');
		} else if (e.keyCode >= 49 && e.keyCode <= 57) {
			window.open($("#search-results").children().eq(e.keyCode - 49).find("a").attr("href"), "_blank");

			$("#search").val(search.substr(0, search.length - 1));
			return false;
		}

	}

	$("#search-results").children().remove();
	search = search.toLowerCase();
	top_url = '';

	var result_count;

	$.each(bookmarks, function (key, bookmark) {

		if (bookmark.link.toLowerCase().indexOf(search) >= 0 
			|| bookmark.text.toLowerCase().indexOf(search) >= 0
			|| bookmark.tags.toLowerCase().indexOf(search) >= 0 
			|| search == '') 
		{
			var li = "<li>"
			li += "<a href='" + bookmark.link + "' target='_blank'>" + bookmark.text + "</a>"
			if (bookmark.comment != '')
				li += "<br /><span class='tags'># " + bookmark.tags + "</span>"
			li += "</li>";
			$("#search-results").append(li);

			if (top_url == '')
				top_url = bookmark.link;

			result_count++;
		}
	});
}