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

export class CdkDevopsguruStackOrgUnit extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);    

    const ou_ids = new cdk.CfnParameter(this, 'OrganizationalUnitIds',{
      type: 'List<String>',
      description : 'Organizational Unit Ids to deploy StackSet',
    });

      const region_id = new cdk.CfnParameter(this, 'RegionIds',{
        type: 'List<String>',
        description : 'Region Ids to deploy StackSet',
      });

    new stackset.CfnStackSet(this, 'DevopsGuruStackSet', {
      permissionModel : 'SERVICE_MANAGED',
      stackSetName : 'EnableDevOpsGuruStackSetOrgUni',
      description : 'CDK Stack Instance to Enable DevOpsGuru across Organization Units',
      stackInstancesGroup: [
      {
        regions: region_id.valueAsList,
        deploymentTargets: {
         organizationalUnitIds: ou_ids.valueAsList,
        },
      }],
      operationPreferences: {
        failureToleranceCount: 0,
        maxConcurrentCount: 1
      },
      autoDeployment: {
        enabled: true,
        retainStacksOnAccountRemoval: true,
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
              TopicName: devops-guru-ou
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