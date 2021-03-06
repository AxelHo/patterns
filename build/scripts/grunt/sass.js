'use strict';
var path = require('path');
var eachAsync = require('each-async');
var assign = require('object-assign');
var sass = require('node-sass');
var tilde_importer = require('grunt-sass-tilde-importer');

module.exports = function (grunt) {
    grunt.verbose.writeln('\n' + sass.info + '\n');

    grunt.registerMultiTask('sass', 'Compile Sass to CSS', function () {
        eachAsync(this.files, function (el, i, next) {
            var opts = this.options({
                precision: 10,
                importer: tilde_importer
            });

            var src = el.src[0];

            if (!src || path.basename(src)[0] === '_') {
                next();
                return;
            }

            sass.render(assign({}, opts, {
                file: src,
                outFile: el.dest
            }), function (err, res) {
                if (err) {
                    grunt.log.error(err.formatted + '\n');
                    grunt.warn('');
                    next(err);
                    return;
                }

                grunt.file.write(el.dest, res.css);

                if (opts.sourceMap) {
                    grunt.file.write(this.options.sourceMap, res.map);
                }

                next();
            });
        }.bind(this), this.async());
    });
};