#! /bin/sh
# /etc/init.d/node-server

### BEGIN INIT INFO
# Provides:          node-server
# Required-Start:    $remote_fs $syslog
# Required-Stop:     $remote_fs $syslog
# Default-Start:     2 3 4 5
# Default-Stop:      0 1 6
### END INIT INFO

# change this to wherever your node app lives #
# change this to wherever your node app lives #
DIR=/home/pi/mean/
path_to_node_app=$DIR/server.js

cd $DIR

# Carry out specific functions when asked to by the system
case "$1" in
  start)
    echo "* starting node-server * "
    echo "* starting node-server * [`date`]" >> /var/log/node-server.log
    ./schlafei.sh >> /var/log/node-server.log 2>&1&
    ;;
  stop)
    echo "* stopping node-server * "
    echo "* stopping node-server * [`date`]" >> /var/log/node-server.log
    killall node
    ;;
  *)
    echo "Usage: /etc/init.d/node-server {start|stop}"
    exit 1
    ;;
esac

exit 0