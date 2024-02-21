#!/bin/bash
# Author: Nguyen Khac Trung Kien

user=trungkieen
password=supersecret
database=todolist_app
database_folder=database
mkdir -p $database_folder

backup_file="$database_folder/database-struct.sql"


mysqldump -u $user -p$password  --no-data --all-databases > $backup_file
mysqldump -u $user -p$password  --no-data $database > $backup_file

# Remove log line 
grep -v '^\/\*!.*' "$backup_file" > "${backup_file}.tmp"
mv "${backup_file}.tmp" "$backup_file"

cat $backup_file

