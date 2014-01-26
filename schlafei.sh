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
SOURCE="${BASH_SOURCE[0]}"
while [ -h "$SOURCE" ]; do # resolve $SOURCE until the file is no longer a symlink
  DIR="$( cd -P "$( dirname "$SOURCE" )" && pwd )"
  SOURCE="$(readlink "$SOURCE")"
  [[ $SOURCE != /* ]] && SOURCE="$DIR/$SOURCE" # if $SOURCE was a relative symlink, we need to resolve it relative to the path where the symlink file was located
done
DIR="$( cd -P "$( dirname "$SOURCE" )" && pwd )"
cd $DIR
path_to_node_app=$DIR/server.js

# Carry out specific functions when asked to by the system
case "$1" in
  start)
    echo "* starting node-server * "
    echo "* starting node-server * [`date`]" >> /var/log/node-server.log
    node server.js >> /var/log/node-server.log 2>&1&
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