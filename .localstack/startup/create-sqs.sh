echo 'creating SQS queue'
awslocal sqs create-queue --queue-name KryiaUploadQueue
echo 'SQS queue created'
echo 'setting up bucket notifications'
awslocal s3api put-bucket-notification-configuration --bucket kryia --notification-configuration file:///etc/localstackconf/notification.json
echo 'bucket notifications ready'
