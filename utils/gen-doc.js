#!/usr/bin/env node

var jsdoc = require('bem-jsd'),
    path = require('path'),
    fs = require('fs'),
    md = require('marked'),
    mdOptions = {
        highlight : function hilight(code, lang) {
            lang === 'js' && (lang = 'javascript');
            return hljs.highlight(lang, code).value;
        }
    },
    jspath = require('jspath'),
    hljs = require('highlight.js'),
    yate = require('yate'),
    processMarkdown = function(json) {
        jspath('..*{.description}', json).forEach(function(obj) {
            obj.description = md(obj.description, mdOptions);
        });

        jspath('..*{.examples}', json).forEach(function(obj) {
            obj.examples = obj.examples.map(function(ex) {
                return md(ex, mdOptions);
            });
        });

        jspath('..*{.license}', json).forEach(function(obj) {
            obj.license = md(obj.license, mdOptions);
        });

        return json;
    };

fs.writeFileSync(
    process.argv[3],
    yate.run(
        path.join(__dirname, 'jsdoc2html.yate'),
        {
            data : processMarkdown(jsdoc(fs.readFileSync(process.argv[2], 'utf-8')))
        }));