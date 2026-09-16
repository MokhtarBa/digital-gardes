#!/bin/sh
set -eu

if [ -z "${DIGITAL_GRADES_DB_PASSWORD:-}" ]; then
  printf "MySQL password for digitalgrades_app: "
  stty -echo
  IFS= read -r DIGITAL_GRADES_DB_PASSWORD
  stty echo
  printf "\n"
  export DIGITAL_GRADES_DB_PASSWORD
fi

if command -v mysql >/dev/null 2>&1; then
  if ! MYSQL_PWD="$DIGITAL_GRADES_DB_PASSWORD" mysql \
    --protocol=TCP \
    --host=localhost \
    --port=3306 \
    --user=digitalgrades_app \
    --database=digital_grades \
    --connect-timeout=5 \
    --execute='SELECT 1' >/dev/null; then
    printf 'MySQL rejected the password entered for digitalgrades_app. The Java app was not started.\n' >&2
    exit 1
  fi
fi

if [ -x /opt/homebrew/opt/openjdk/bin/java ]; then
  JAVA_COMMAND=/opt/homebrew/opt/openjdk/bin/java
elif [ -n "${JAVA_HOME:-}" ] && [ -x "$JAVA_HOME/bin/java" ]; then
  JAVA_COMMAND="$JAVA_HOME/bin/java"
elif command -v java >/dev/null 2>&1 && java -version >/dev/null 2>&1; then
  JAVA_COMMAND=java
else
  printf "Java 21 or newer was not found. Install a JDK, then try again.\n" >&2
  exit 1
fi

SPRING_PROFILES_ACTIVE=mysql \
SPRING_DATASOURCE_PASSWORD="$DIGITAL_GRADES_DB_PASSWORD" \
exec "$JAVA_COMMAND" -jar target/digital-grades-api-0.0.1-SNAPSHOT.jar
