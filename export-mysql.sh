#!/bin/sh
set -eu

SCRIPT_DIR=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
OUTPUT_FILE="$SCRIPT_DIR/digital_grades.sql"
TEMP_FILE=$(mktemp "$SCRIPT_DIR/digital_grades.sql.tmp.XXXXXX")

cleanup() {
  rm -f "$TEMP_FILE"
}
trap cleanup EXIT HUP INT TERM

printf 'Enter the MySQL password for digitalgrades_app when prompted.\n'
mysqldump \
  --skip-lock-tables \
  --skip-add-locks \
  --skip-masking-policies \
  --set-gtid-purged=OFF \
  --routines \
  --events \
  --no-tablespaces \
  --host=localhost \
  --user=digitalgrades_app \
  --password \
  digital_grades > "$TEMP_FILE"

mv "$TEMP_FILE" "$OUTPUT_FILE"
trap - EXIT HUP INT TERM
printf 'Database export created: %s\n' "$OUTPUT_FILE"
