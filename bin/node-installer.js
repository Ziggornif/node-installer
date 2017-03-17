#! /usr/bin/env node

const shell = require("shelljs");
const prompt = require('prompt');
const q = require('q');

let gitrepo;
let installtarget;
let appname;
let entrypoint;

let schema = {
    properties: {
        gitrepo: {
            required: true
        },
        installtarget: {
            default: '/var/www/nodeapps',
        },
        appname: {
            required: true
        },
        entrypoint: {
            default: 'app.js',
        }
    }
};

getUserInputs().then(function (inputs) {
    return install(inputs);
});


function getUserInputs() {
    let deferred = q.defer();
    prompt.start();
    prompt.get(schema, function (err, result) {
        gitrepo = result.gitrepo;
        installtarget = result.installtarget;
        appname = result.appname;
        entrypoint = result.entrypoint;
        if (err) {
            deferred.reject(new Error("User inputs error"));
        } else {
            deferred.resolve({
                gitrepo: result.gitrepo,
                installtarget: result.installtarget,
                appname: result.appname,
                entrypoint: result.entrypoint
            });
        }
    });
    return deferred.promise;
}

function install() {
    shell.cd(installtarget);
    shell.exec("git clone " + gitrepo);
    shell.cd(appname);
    shell.exec("npm install");
    shell.exec("pm2 start " + entrypoint)
    shell.exec("pm2 startup");
    shell.exec("pm2 save");
}