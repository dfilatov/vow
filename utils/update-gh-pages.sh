if [ "$TRAVIS_PULL_REQUEST" == "false" ]; then
    echo "gh-pages is updating..."

    git config --global user.email "travis@travis-ci.org"
    git config --global user.name "Travis"

    git clone -b gh-pages https://${GH_TOKEN}@github.com/dfilatov/vow.git gh-pages
    ./utils/gen-doc.js lib/vow.js gh-pages/index.html
    cd gh-pages
    git add -A
    git commit -m "Travis build $TRAVIS_BUILD_NUMBER has been pushed to gh-pages"
    git push origin gh-pages
    cd ..
    rm -rf gh-pages

    echo "gh-pages has been updated successfully"
fi