npx nodemon --watch './**/*' \
  --ext 'html,css,go,templ' \
  --signal SIGTERM \
  --exec "tailwind -i 'input.css' -o './tailwind.css'"