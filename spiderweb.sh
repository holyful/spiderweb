#!/bin/bash

if [ $1 = 'start' ]
then
    node core/main.js 1>log/info.log 2>log/error.log &

fi

if [ $1 = 'debug' ]
then
    node core/main.js
fi

if [ $1 = 'stop' ]
then
    kill $(ps aux | grep 'core/main.js' | awk '{print $2}')
fi