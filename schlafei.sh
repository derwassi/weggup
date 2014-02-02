#!/bin/bash
#needed for pi-blaster
gpio  -g mode 18 out
gpio  -g mode 22 out
gpio  -g mode 23 out
gpio  -g mode 27 out

node server.js
echo "27=0" > /dev/pi-blaster
echo "18=0" > /dev/pi-blaster
echo "22=0" > /dev/pi-blaster
echo "23=0" > /dev/pi-blaster
