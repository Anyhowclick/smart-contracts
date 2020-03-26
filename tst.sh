#!/bin/sh
ALL=false

while getopts "f:a" arg; do
  case $arg in
    a) ALL=true;;
    f) FILE=$OPTARG;;
  esac
done

if [ -n "$FILE" ]; then
  npx buidler test --no-compile $FILE
elif [ "$ALL" = true ]; then
  echo "Running all tests..."
  npx buidler test --no-compile
else
  npx buidler test --no-compile --config ./buidlerConfigSol5.js
fi
