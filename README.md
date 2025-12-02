# AWS S3 Static Portfolio Website
The website can be seen here: https://ron-mercier101.com

## Architecture

![Image](https://github.com/user-attachments/assets/f359508a-6dee-4fea-be19-c2faae87ea18)


### Step 1: Create an S3 Bucket

  1. Log in to the AWS Management Console.
  2. Navigate to the S3 service.
  3. Create a new bucket:
     - Give it a unique name (e.g., my-website-bucket).
     - Choose a region closest to your target audience (e.g., Asia Pacific (Mumbai) ap-south-1).
  4. Enable ACLs:
     - During bucket creation, under "Object Ownership," select ACLs enabled.
     - This allows fine-grained control over the permissions of individual objects in the bucket.

### Step 2: Upload Files

  1. Upload your website files:
     - Upload index.html and the unzipped folder to the S3 bucket.
     - Ensure the directory structure is preserved during the upload.


![Image](https://github.com/user-attachments/assets/f3b0767a-5387-4674-8585-4fcc86a84063)


### Step 3: Configure the Bucket for Static Website Hosting

  1. Go to the bucket properties in the S3 console.
  2. Enable static website hosting:
     - In the "Static website hosting" section, choose Enable.
     - Set index.html as the Index document.
     - Optionally, set a custom error document like error.html.

![Image](https://github.com/user-attachments/assets/7b2db8a6-1fe0-41db-bb90-d2f0a37b6bf4)

### Step 4: Access the Website
  Use the bucket's public URL to access the website. It typically looks like:

```
http://your-bucket-name.s3-website-region.amazonaws.com
```

![Image](https://github.com/user-attachments/assets/2b1ba8d4-986d-460c-8147-836d0491e2c3)

## Using ACLs
### Access Control Lists (ACLs)

ACLs are a set of rules that determine who can access your S3 resources. In this project, ACLs were used to manage public access to the website.

  - Why Use ACLs?: ACLs allow you to grant specific read/write permissions to different AWS accounts or make the content public. This provides more granular control compared to bucket policies.

  - Implementation:
    - After uploading your files, select them in the S3 console.
    - From the "Actions" dropdown, choose "Make public using ACL".
    - This action grants public read access to the website files, resolving any 403 errors when accessing the bucket endpoint.

### Troubleshooting

  - 403 Forbidden Error: If you encounter this error, ensure that the objects in your bucket are made public using ACLs.

### Project Architecture

The project uses Amazon S3 to host a static website, where the following steps were performed:

  - S3 Bucket: Created for storing the website files.
  - Website Hosting: Enabled to make the bucket's content publicly accessible.
  - ACLs: Configured to allow public access to the website.
