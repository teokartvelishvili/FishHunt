import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { BadRequestException, Injectable } from '@nestjs/common';

@Injectable()
export class AwsS3Service {
  private bucketName
  private s3
  constructor(){
    this.bucketName = process.env.AWS_BUCKET_NAME
    this.s3 = new S3Client({
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
      },
      region: process.env.AWS_REGION
    })
  }

  async uploadImage(filePath: string, file){
    if(!filePath || !file) throw new BadRequestException('filepath or file require')
    const config = {
      Key: filePath, 
      Bucket: this.bucketName,
      Body: file
    }

    const uploadCommand = new PutObjectCommand(config)
    await this.s3.send(uploadCommand)
    return filePath

  }

}
