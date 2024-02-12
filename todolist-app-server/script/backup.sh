#!/bin/bash
# Author: Nguyen Khac Trung Kien
# Use sqldump for backup database and for debug database
user=trungkieen
password=supersecret
database=todolist_app
database_folder=database
backup_file="$database_folder/database-struct.sql"

mkdir -p $database_folder

# mysqldump -u $user -p$password  $database > $backup_file
mysqldump -u $user -p$password  --all-databases > $backup_file


# Remove log line 
grep -v '^\/\*!.*' "$backup_file" > "${backup_file}.tmp"
mv "${backup_file}.tmp" "$backup_file"


cat $backup_file
