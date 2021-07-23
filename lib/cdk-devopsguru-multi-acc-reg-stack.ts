import * as cdk from '@aws-cdk/core';
import devopsguru = require('@aws-cdk/aws-devopsguru');
import { config } from 'process';
import * as sns from '@aws-cdk/aws-sns';
import * as kms from "@aws-cdk/aws-kms";
import * as subscriptions from '@aws-cdk/aws-sns-subscriptions';
import * as CfnParameter from '@aws-cdk/aws-ssm';
import stackset = require('@aws-cdk/aws-cloudformation');
import { create } from 'domain';
import * as iam from '@aws-cdk/aws-iam';

export class CdkDevopsGuruStackMultiAccReg extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);    

    const admin_account_id = new cdk.CfnParameter(this, 'AdministratorAccountId',{
      description : 'Administrator Account Id',
    });

    const target_account_id = new cdk.CfnParameter(this, 'TargetAccountId',{
      description : 'Target Account Id',
    });

    const region_id = new cdk.CfnParameter(this, 'RegionIds',{
      type: 'List<String>',
      description : 'Region Ids to deploy StackSet',
    });

    new stackset.CfnStackSet(this, 'DevopsGuruStackSet', {
      permissionModel : 'SELF_MANAGED',
      stackSetName : 'EnableDevOpsGuruStackSetMultiAccReg',
      description : 'CDK Stack Instance to Enable DevOpsGuru Across multiple accounts and regions',
      stackInstancesGroup: [
      {
        deploymentTargets: {
        accounts : [admin_account_id.valueAsString,target_account_id.valueAsString],
        },
        regions: region_id.valueAsList,
      }],
      operationPreferences: {
        failureToleranceCount: 0,
        maxConcurrentCount: 1
      },
      templateBody: `
        Resources:
          DevOpsGuruMonitoring:
            Type: AWS::DevOpsGuru::ResourceCollection
            Properties:
              ResourceCollectionFilter:
                CloudFormation:
                  StackNames: ['*']

          DevOpsGuruTopic: 
            Type: AWS::SNS::Topic
            Properties: 
              TopicName: devops-guru-multi-acc
              Subscription:
                - Endpoint: abc@xyz.com
                  Protocol: email
          
          DevOpsGuruNotification:
            Type: AWS::DevOpsGuru::NotificationChannel
            Properties:
              Config:
                Sns:
                  TopicArn: !Ref DevOpsGuruTopic`
  });
  }
}