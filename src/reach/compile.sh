#!/usr/bin/zsh

./_reach compile $1

for file in $(ls contracts/build); do
    mv contracts/build/$file artifacts/
done

rmdir contracts/build