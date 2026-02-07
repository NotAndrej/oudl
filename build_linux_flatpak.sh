echo 'OUDL Flatpak builder'
npm install
npm run dist
cd flatpak
flatpak-builder --force-clean build-dir io.oudl.fp.json
flatpak-builder --repo=repo --force-clean build-dir io.oudl.fp.json
flatpak build-bundle repo io.oudl.fp.flatpak io.oudl.fp
flatpak install --user io.oudl.fp.flatpak
cd ..
echo 'DONE'