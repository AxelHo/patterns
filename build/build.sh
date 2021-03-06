#!/usr/bin/env bash

# Init env variables
export RootPath=$(pwd)
export COMPOSER_HOME=$RootPath
export COMPOSER_CACHE_DIR="/var/cache/composer/"
export COMPOSER_ALLOW_SUPERUSER="1"

echo "$(date): Start building"
echo "RootPath: ${RootPath}"

# Build the theme: Download PHP libs and build styleguide
echo "$(date): Start building PHP"
composer install > /dev/null
echo "$(date): End building PHP"

# Update path in config file
TARGET=${RootPath}/dist/
sed -i "s|/var/www/html/|${TARGET}|g" config/config.yml

# Generate the styleguide
echo "$(date): Start generating the styleguide"
composer generate
echo "$(date): End generating the styleguide"

# Build the theme: Download JS libs and build webfont and compile CSS
echo "$(date): Start building JS"
bower install --allow-root > /dev/null
npm i -g icon-font-generator grunt
yarn install > /dev/null
yarn upgrade > /dev/null
grunt
echo "$(date): End building JS"

# Compress source code to generate the arctifact
echo "$(date): Start building artifact"
tar -cvzf artifact.tar.gz . --exclude=artifact.tar.gz --warning=no-file-changed > /dev/null
echo "$(date): End building artifact"
