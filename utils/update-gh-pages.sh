if [ "$TRAVIS_PULL_REQUEST" == "false" ]; then
    echo "gh-pages is updating...\n"

    git config --global user.email "travis@travis-ci.org"
    git config --global user.name "Travis"

    git clone -b gh-pages https://${GH_TOKEN}@github.com/dfilatov/vow.git gh-pages
    ./utils/gen-doc.js lib/vow.js gh-pages/index.html
    git add -A
    git commit -m "Travis build $TRAVIS_BUILD_NUMBER has been pushed to gh-pages"
    git push https://github.com/dfilatov/vow.git gh-pages
    rm -rf gh-pages

    echo "\ngh-pages has been updated successfully\n"
fi