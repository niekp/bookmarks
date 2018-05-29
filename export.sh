cd ~/.local/share/buku/
rm bookmarks.html
buku -e bookmarks.html
rsync bookmarks.html webserver:/var/www/html/bookmarks.html