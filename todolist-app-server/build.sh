#!/bin/bash
# Author: Nguyen Khac Trung Kien

# Flush independence 
mvn clean install 
mvn package 
# Run debug mode 
mvn spring-boot:run -X 
