#!/bin/bash
echo 'creating buckets'
awslocal s3 mb s3://kryia
awslocal s3 mb s3://editor
echo 'buckets created'