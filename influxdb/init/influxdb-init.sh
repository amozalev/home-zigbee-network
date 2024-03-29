#!/bin/bash

influx -username $INFLUXDB_ADMIN_USER -password $INFLUXDB_ADMIN_PASSWORD -execute "CREATE DATABASE $INFLUXDB_DATABASE WITH DURATION 31d
        CREATE USER $INFLUXDB_TELEGRAF_USER WITH PASSWORD '$INFLUXDB_TELEGRAF_PASSWORD'
        CREATE USER $INFLUXDB_GRAFANA_USER WITH PASSWORD '$INFLUXDB_GRAFANA_PASSWORD'
        GRANT WRITE ON telegraf to $INFLUXDB_TELEGRAF_USER
        GRANT READ ON telegraf to $INFLUXDB_GRAFANA_USER"
